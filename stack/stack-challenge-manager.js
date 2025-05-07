// Gestiona la lógica y el estado del desafío de la Pila

// Importaciones de módulos necesarios
import { updateTargetSequence, updateOutputSequence } from './stack-challenge-ui.js';
import { renderStack } from './stack-rendering.js';



export class StackChallengeManager {
    /**
     * @param {object} dependencies 
     * @param {Stack} dependencies.stackInstance 
     * @param {HTMLElement} dependencies.vizContainerElement 
     * @param {object} dependencies.uiElements 
     * @param {HTMLElement} dependencies.uiElements.targetSequence 
     * @param {HTMLElement} dependencies.uiElements.outputSequence 
     * @param {HTMLElement} dependencies.uiElements.challengeStatus 
     * @param {HTMLElement} dependencies.uiElements.startButton 
     * @param {HTMLElement} dependencies.uiElements.popButton
     * @param {object} dependencies.uiUpdateFunctions 
     * @param {function(Array<any>, HTMLElement): void} dependencies.uiUpdateFunctions.updateTargetSequence 
     * @param {function(Array<any>, HTMLElement): void} dependencies.uiUpdateFunctions.updateOutputSequence 
     * @param {object} dependencies.renderingFunctions 
     * @param {function(Stack, HTMLElement): void} dependencies.renderingFunctions.renderStack 
     */
    constructor(dependencies) {
        // Almacenar dependencias
        this.stack = dependencies.stackInstance;
        this.vizContainer = dependencies.vizContainerElement;
        this.ui = dependencies.uiElements;
        this.updateUI = dependencies.uiUpdateFunctions;
        this.renderViz = dependencies.renderingFunctions;

        // Estado interno del desafío
        this.targetArray = []; // Secuencia objetivo para este desafío.
        this.outputArray = []; // Secuencia de elementos sacados (Pop) por el usuario.
        this.challengeActive = false; // Bandera si el desafío está en curso.

        
        this.ui.startButton.textContent = 'Iniciar Desafío'; 
    }

    /**
     * @returns {boolean}
     */
    isActive() {
        return this.challengeActive;
    }

    
    start() {
        // Asegurarse de que no haya un desafío activo antes de iniciar uno nuevo (aunque el controlador principal ya verifica).
        if (this.challengeActive) {
            console.warn("Attempted to start challenge while already active. Resetting first.");
            this.reset();
        }

        // 1. Reiniciar el estado interno del desafío.
        this.targetArray = [];
        this.outputArray = [];
        this.challengeActive = true; // Activar la bandera.

        // 2. Reiniciar la pila real y su visualización.
        this.stack.clear();
        // Usar la función de renderizado importada para dibujar la pila limpia.
        this.renderViz.renderStack(this.stack, this.vizContainer);

        // 3. Generar la secuencia objetivo para este desafío.
        for (let i = 0; i < 5; i++) { // Genera 5 elementos objetivo (ajustable)
            this.targetArray.push(Math.floor(Math.random() * 99) + 1); // Números aleatorios entre 1 y 99
        }

        // 4. Actualizar la interfaz visual del desafío.
        // Mostrar la secuencia objetivo.
        this.updateUI.updateTargetSequence(this.targetArray, this.ui.targetSequence);
        // Limpiar la secuencia de salida del usuario en la UI.
        this.updateUI.updateOutputSequence(this.outputArray, this.ui.outputSequence);
        // Mostrar mensaje de estado inicial.
        this.ui.challengeStatus.textContent = '¡Desafío en curso! Usa PUSH y POP para igualar la secuencia objetivo.'; 
        this.ui.challengeStatus.className = 'challenge-status'; // Resetea clases de estado (éxito/error)
        // Cambiar el texto del botón a "Reiniciar".
        this.ui.startButton.textContent = 'Reiniciar Desafío'; 

        // Ajustar el estado de los botones (deshabilitar Pop si la pila está vacía).
        this.ui.popButton.disabled = this.stack.isEmpty();
        
    }

    reset() {
        // 1. Reiniciar el estado interno del desafío.
        this.targetArray = [];
        this.outputArray = [];
        this.challengeActive = false; // Desactivar la bandera.

        // 2. Limpiar la pila real y su visualización.
        this.stack.clear();
        // Usar la función de renderizado importada para dibujar la pila limpia.
        this.renderViz.renderStack(this.stack, this.vizContainer);

        // 3. Limpiar la interfaz visual del desafío.
        this.updateUI.updateTargetSequence(this.targetArray, this.ui.targetSequence); 
        this.updateUI.updateOutputSequence(this.outputArray, this.ui.outputSequence); 
        this.ui.challengeStatus.textContent = ''; 
        this.ui.challengeStatus.className = 'challenge-status'; 
        // Cambiar el texto del botón de vuelta a "Iniciar".
        this.ui.startButton.textContent = 'Iniciar Desafío'; 

        // 4. Ajustar el estado de los botones (deshabilitar Pop si la pila está vacía).
        this.ui.popButton.disabled = this.stack.isEmpty();

    }

    /**
     * @param {any} value - El valor del elemento sacado de la pila.
     */
    recordOutput(value) {
        // Verificar si el desafío está activo. Si no, no hacemos nada.
        if (!this.challengeActive) {
            // console.warn("recordOutput called but challenge is not active."); // Para depuración
            return;
        }

        // 1. Registrar el valor sacado en la secuencia de salida del usuario.
        this.outputArray.push(value);

        // 2. Actualizar la interfaz visual para mostrar el nuevo elemento en la secuencia de salida.
        this.updateUI.updateOutputSequence(this.outputArray, this.ui.outputSequence);

        // 3. Verificar el estado de completación del desafío después de este Pop.
        this.checkCompletion();
    }

    
    checkCompletion() {
        // Este método solo se llama si el desafío está activo y después de un Pop (desde recordOutput).

        const currentLength = this.outputArray.length;
        const targetLength = this.targetArray.length;

        // Comparar el último elemento sacado con el elemento correspondiente en la secuencia objetivo.
        // Si no coincide, el usuario ha fallado la secuencia en este paso.
        const lastPoppedValue = this.outputArray[currentLength - 1];
        const expectedValue = this.targetArray[currentLength - 1]; // El valor esperado en esta posición de la secuencia

        if (lastPoppedValue !== expectedValue) {
            this.failChallenge('¡Ups! El último elemento sacado (' + lastPoppedValue + ') no es el esperado (' + expectedValue + '). La secuencia es incorrecta. ¡Inténtalo de nuevo!'); // Mensaje traducido y detallado
            return; // Termina la verificación aquí, ya falló.
        }

        // Si el último elemento coincidió, verificar si la secuencia completa ya ha sido completada.
        if (currentLength === targetLength) {
            this.succeedChallenge('¡Desafío completado exitosamente!'); // Mensaje de éxito traducido
        }

        // Si no falló y la longitud aún no coincide, el desafío continúa. No se hace nada más aquí.
    }

    /**
     * Marca el desafío como fallido y actualiza la UI.
     * @param {string} message - Mensaje a mostrar al usuario.
     */
    failChallenge(message) {
        this.challengeActive = false; // Desactiva la bandera del desafío.
        this.ui.challengeStatus.textContent = message; // Mostrar mensaje de fallo.
        this.ui.challengeStatus.className = 'challenge-status challenge-error'; // Clase CSS para estado de error.
    
    }

     /**
      * Marca el desafío como exitoso y actualiza la UI.
      * @param {string} message - Mensaje a mostrar al usuario.
      */
    succeedChallenge(message) {
        this.challengeActive = false; // Desactiva la bandera del desafío.
        this.ui.challengeStatus.textContent = message; // Mostrar mensaje de éxito.
        this.ui.challengeStatus.className = 'challenge-status challenge-success'; // Clase CSS para estado de éxito.
    }

}