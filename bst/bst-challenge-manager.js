// --- Importaciones de módulos necesarios ---
// Necesitamos las funciones para actualizar la UI específica del desafío (mostrar secuencia usuario).
import { updateUserSequence } from './bst-challenge-ui.js';
// Necesitamos algunas funciones de renderizado/animación que el gestor utiliza (ej. habilitar clics, animar recorrido correcto - opcional).
import { animateTraversal, highlightNode, renderTree } from './bst-rendering.js'; // renderTree para reset

export class BSTChallengeManager {
    /**
     * @param {object} dependencies - Un objeto con las dependencias necesarias para el gestor.
     * @param {BinarySearchTree} dependencies.bstInstance - La instancia del ABB que se está visualizando.
     * @param {SVGElement} dependencies.svgElement - El elemento SVG principal donde se dibuja el árbol.
     * @param {HTMLElement} dependencies.traversalResultElement - El elemento DOM donde mostrar el resultado del recorrido (usado por animateTraversal, que podría llamarse en el desafío).
     * @param {object} dependencies.uiElements - Referencias a los elementos DOM específicos de la UI del desafío.
     * @param {HTMLElement} dependencies.uiElements.traversalType - Elemento donde mostrar el tipo de recorrido.
     * @param {HTMLElement} dependencies.uiElements.userSequence - Contenedor donde mostrar la secuencia de clics del usuario.
     * @param {HTMLElement} dependencies.uiElements.challengeStatus - Elemento donde mostrar mensajes de estado del desafío.
     * @param {HTMLElement} dependencies.uiElements.startButton - El botón de iniciar/reiniciar desafío.
     * @param {object} dependencies.uiUpdateFunctions - Funciones importadas para actualizar la UI específica del desafío.
     * @param {function(Array<any>, HTMLElement): void} dependencies.uiUpdateFunctions.updateUserSequence - Función para actualizar UI secuencia usuario.
     * @param {object} dependencies.renderingFunctions - Funciones importadas de renderizado/animación que el gestor pueda necesitar.
     * @param {function(BinarySearchTree, SVGElement, function(any):void):void} dependencies.renderingFunctions.renderTree - Función para redibujar el árbol (necesaria para reset y pasar el click handler).
     * @param {function(any, string, SVGElement, number):void} dependencies.renderingFunctions.highlightNode - Función para resaltar nodos.
     * @param {function(Array<any>, SVGElement, HTMLElement):void} dependencies.renderingFunctions.animateTraversal - Función para animar un recorrido.
     */
    constructor(dependencies) {
        // Almacenar dependencias
        this.bst = dependencies.bstInstance;
        this.svgElement = dependencies.svgElement;
        this.traversalResultElement = dependencies.traversalResultElement;
        this.ui = dependencies.uiElements;
        this.updateUI = dependencies.uiUpdateFunctions;
        this.renderViz = dependencies.renderingFunctions; // Contiene renderTree, highlightNode, animateTraversal

        // Estado interno del desafío
        this.challengeActive = false; // Indica si el desafío está en curso.
        this.currentTraversalType = null; // Tipo de recorrido para este desafío.
        this.correctSequence = []; // La secuencia correcta de nodos para el recorrido.
        this.userClickedSequence = []; // La secuencia de valores de nodos clicados por el usuario.

        // Configura el texto inicial del botón
        this.ui.startButton.textContent = 'Iniciar Desafío'; // Texto traducido
    }

    /**
     * Devuelve true si el desafío está actualmente activo, false en caso contrario.
     * Usado por el controlador principal.
     * @returns {boolean}
     */
    isActive() {
        return this.challengeActive;
    }

    /**
     * Habilita o deshabilita la escucha de clics en los nodos SVG.
     * Esta función interactúa directamente con los elementos DOM del SVG que representan los nodos.
     * @param {boolean} enable - Si true, habilita los clics; si false, los deshabilita.
     */
     enableNodeClicking(enable) {
         // Selecciona todos los grupos SVG con la clase 'node' dentro del elemento SVG.
         const nodes = this.svgElement.querySelectorAll('.node');
         nodes.forEach(node => {
             // Controla los eventos de ratón usando el estilo CSS pointer-events.
             node.style.pointerEvents = enable ? 'auto' : 'none';
         });
     }


    /**
     * Inicia un nuevo desafío del Árbol Binario de Búsqueda.
     * Elige un recorrido, calcula la secuencia correcta y prepara la interfaz.
     */
    start() {
         // Si ya hay un desafío activo, primero lo reseteamos.
         if (this.challengeActive) {
             console.warn("Attempted to start challenge while already active. Resetting first.");
             this.reset();
         }

        // 1. Resetear variables del desafío.
        this.userClickedSequence = []; // Limpiar secuencia de clics anterior.
        this.correctSequence = []; // Limpiar secuencia correcta anterior.
        this.challengeActive = true; // Activar la bandera.

        // 2. Elegir un tipo de recorrido aleatorio.
        const types = ['In-order', 'Pre-order', 'Post-order']; // Tipos disponibles
        this.currentTraversalType = types[Math.floor(Math.random() * types.length)]; // Elegir uno al azar

        // 3. Calcular la secuencia correcta para ese recorrido en el árbol actual.
        // Asegurarse de que el árbol no esté vacío. Si lo está, el desafío no tiene sentido.
        if (!this.bst.root) {
            this.ui.challengeStatus.textContent = 'El árbol está vacío. Inserta nodos antes de iniciar un desafío.'; // Texto traducido
            this.ui.challengeStatus.className = 'challenge-status challenge-error'; // Clase de error
            this.challengeActive = false; // Desactiva si el árbol está vacío
            // Asegurar texto del botón (el controlador principal lo maneja al verificar isActive)
            return; // Salir si el árbol está vacío
        }

        // Usar los métodos de recorrido de la instancia del ABB.
        switch (this.currentTraversalType) {
            case 'In-order':
                this.correctSequence = this.bst.inOrderTraversal();
                break;
            case 'Pre-order':
                this.correctSequence = this.bst.preOrderTraversal();
                break;
            case 'Post-order':
                this.correctSequence = this.bst.postOrderTraversal();
                break;
            default:
                 console.error("Tipo de recorrido desconocido:", this.currentTraversalType);
                 this.failChallenge("Error interno: Tipo de recorrido desconocido.");
                 return;
        }

        // Si el árbol tiene 0 nodos, la secuencia correcta estará vacía.
        if (this.correctSequence.length === 0) {
             this.ui.challengeStatus.textContent = 'El árbol está vacío. Inserta nodos antes de iniciar un desafío.'; // Mismo mensaje
             this.ui.challengeStatus.className = 'challenge-status challenge-error';
             this.challengeActive = false;
             return; // Salir si el árbol está vacío
        }


        // 4. Actualizar la interfaz del desafío.
        // Mostrar el tipo de recorrido elegido.
        this.ui.traversalType.textContent = `Tipo de Recorrido: ${this.currentTraversalType}`; // Usa elemento DOM

        // Limpiar y mostrar secuencia usuario (vacía al inicio).
        this.updateUI.updateUserSequence(this.userClickedSequence, this.ui.userSequence); // Usa la función importada

        // Mostrar mensaje de estado inicial.
        this.ui.challengeStatus.textContent = 'Haz clic en los nodos en el orden correcto para el recorrido.'; // Mensaje estado traducido
        this.ui.challengeStatus.className = 'challenge-status'; // Resetea clases de estado

        // Cambiar texto del botón (el controlador principal lo maneja al verificar isActive)
        // this.ui.startButton.textContent = 'Reiniciar Desafío'; // Esto se hace en el controlador.


        // 5. Habilitar clics en nodos para el desafío.
        this.enableNodeClicking(true);

        // Opcional: Animar la secuencia correcta al inicio como pista.
        // this.renderViz.animateTraversal(this.correctSequence, this.svgElement, this.traversalResultElement);

        console.log("Desafío ABB iniciado.", { tipo: this.currentTraversalType, correcta: this.correctSequence }); // Para depuración
    }

    /**
     * Reinicia el desafío del Árbol Binario de Búsqueda a su estado inicial.
     * Limpia el estado, la interfaz y deshabilita los clics.
     */
    reset() {
        // 1. Resetear variables del desafío.
        this.userClickedSequence = [];
        this.correctSequence = [];
        this.challengeActive = false; // Desactivar bandera.
        this.currentTraversalType = null; // Limpiar tipo.

        // 2. Limpiar interfaz del desafío.
        this.ui.traversalType.textContent = ''; // Limpiar tipo mostrado.
        this.updateUI.updateUserSequence(this.userClickedSequence, this.ui.userSequence); // Limpiar y mostrar secuencia usuario (vacía).
        this.ui.challengeStatus.textContent = ''; // Limpiar mensaje de estado.
        this.ui.challengeStatus.className = 'challenge-status'; // Resetea clases de estado.
        // Cambiar texto del botón (el controlador principal lo maneja al verificar isActive).
        // this.ui.startButton.textContent = 'Iniciar Desafío'; // Esto se hace en el controlador.


        // Limpiar resultado de recorrido que podría haberse mostrado con los botones (opcional).
         this.traversalResultElement.textContent = '';


        // 3. Deshabilitar clics en nodos (fuera de desafío).
        this.enableNodeClicking(false);

        console.log("Desafío ABB reiniciado."); // Para depuración
    }

    /**
     * Maneja el clic en un nodo durante el desafío.
     * Registra el nodo clicado, actualiza la UI y verifica el progreso.
     * Este método es pasado como callback a la función de renderizado.
     * @param {any} value - El valor del nodo que fue clicado.
     */
    handleNodeClick(value) {
        // Solo procesa clics si el desafío está activo.
        if (!this.challengeActive) return;

        console.log(`Nodo clicado: ${value} (Desafío Activo: ${this.challengeActive})`); // Para depuración

        // 1. Añade el valor clicado a la secuencia del usuario.
        this.userClickedSequence.push(value);

        // 2. Actualiza la visualización de la secuencia clicada por el usuario.
        this.updateUI.updateUserSequence(this.userClickedSequence, this.ui.userSequence);

        // 3. Verifica si la secuencia es correcta hasta ahora y si se ha completado/fallado.
        this.checkCompletion();
    }

    /**
     * Verifica si el desafío del ABB ha sido completado o si el usuario ha fallado.
     * Compara la secuencia de clics del usuario con la secuencia correcta del recorrido.
     * Actualiza el estado visual del desafío (mensaje y clases) y habilita/deshabilita clics.
     */
    checkCompletion() {
        // Este método solo se llama si el desafío está activo y después de un clic.

        const userLen = this.userClickedSequence.length;
        const correctLen = this.correctSequence.length;

        // 1. Comprobar si el último clic del usuario es correcto.
        // Si la secuencia del usuario ya es más larga que la correcta, o si el último clic no coincide
        // con el elemento esperado en la secuencia correcta en esa posición.
        const lastClickedIndex = userLen - 1;

        // Primero, verificar si el clic actual es incorrecto en su posición.
        if (lastClickedIndex >= correctLen || this.userClickedSequence[lastClickedIndex] !== this.correctSequence[lastClickedIndex]) {
            // ¡Fallo! El usuario hizo clic en el nodo incorrecto para esta posición.
            this.failChallenge('¡Incorrecto! El último clic no fue el esperado. Inténtalo de nuevo.'); // Mensaje traducido
            return; // Termina verificación
        }

        // 2. Si el último clic fue correcto, verificar si la secuencia completa está completada.
        if (userLen === correctLen) {
            // ¡Éxito! La secuencia clicada coincide con la secuencia correcta.
            this.succeedChallenge('¡Desafío completado exitosamente! La secuencia es correcta.'); // Mensaje traducido
        }

        // Si no falló y no ha terminado (userLen < correctLen), el desafío continúa. No se hace nada más aquí.
        console.log("Progreso desafío ABB: Usuario:", this.userClickedSequence, "Correcta:", this.correctSequence); // Para depuración
    }

    /**
     * Marca el desafío como fallido y actualiza la UI de estado.
     * Deshabilita clics en nodos.
     * @param {string} message - Mensaje a mostrar al usuario.
     */
    failChallenge(message) {
        this.challengeActive = false; // Desactiva la bandera.
        this.ui.challengeStatus.textContent = message; // Mostrar mensaje de fallo.
        this.ui.challengeStatus.className = 'challenge-status challenge-error'; // Clase CSS para estado de error.
        this.enableNodeClicking(false); // Deshabilita clics en nodos.
        // Opcional: Deshabilitar otros botones si falló.
    }

     /**
      * Marca el desafío como exitoso y actualiza la UI de estado.
      * Deshabilita clics en nodos.
      * @param {string} message - Mensaje a mostrar al usuario.
      */
    succeedChallenge(message) {
        this.challengeActive = false; // Desactiva la bandera.
        this.ui.challengeStatus.textContent = message; // Mostrar mensaje de éxito.
        this.ui.challengeStatus.className = 'challenge-status challenge-success'; // Clase CSS para estado de éxito.
        this.enableNodeClicking(false); // Deshabilita clics en nodos.
         // Opcional: Deshabilitar otros botones si ganó.
    }
}