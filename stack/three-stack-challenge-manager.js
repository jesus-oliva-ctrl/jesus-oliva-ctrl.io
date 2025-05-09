// stack/three-stack-challenge-manager.js
// Gestiona el Desafío de Reorganización LIFO de tres pilas. - Contenido original (con adaptaciones para nueva UI)

// --- Importaciones ---
import { Stack } from './stack-logic.js'; // Necesita la clase Stack
// Importamos renderChallengeStack desde el renderizado general
import { renderChallengeStack } from './stack-rendering.js';
import { displayTargetConfig } from './stack-challenge-ui.js'; // Necesita la función para mostrar el objetivo
// --- Fin Importaciones ---


/**
 * Clase para gestionar el Desafío de Reorganización LIFO de tres pilas.
 */
export class ThreeStackChallengeManager {
    /**
     * @param {object} dependencies - Dependencias.
     * // Se esperan: vizContainer, vizElements, targetElements, challengeStatusEl, startButtonEl, renderingFunctions (solo renderChallengeStack), uiUpdateFunctions (displayTargetConfig), uiElements (para feedback)
     */
    constructor(dependencies) {
        // Dependencias
        this.vizContainer = dependencies.vizContainer; // El contenedor padre de las 3 pilas (#stack-challenge-three-stacks)
        this.vizElements = dependencies.vizElements; // Contenedores visuales de las 3 pilas { leftStackEl, middleStackEl, rightStackEl }
        this.targetElements = dependencies.targetElements; // Elementos DOM para mostrar el objetivo { leftTargetEl, middleTargetEl, rightTargetEl }
        this.challengeStatusEl = dependencies.challengeStatusEl; // Elemento para mostrar el estado del desafío
        this.startButtonEl = dependencies.startButtonEl; // Botón Iniciar/Reiniciar desafío
        this.uiElements = dependencies.uiElements; // Elementos UI generales (para usar feedback)

        this.renderViz = dependencies.renderingFunctions; // Contiene renderChallengeStack
        this.updateUI = dependencies.uiUpdateFunctions; // Contiene displayTargetConfig

        // Estado del juego
        this.challengeActive = false;
        this.stacks = { left: new Stack(), middle: new Stack(), right: new Stack() };
        this.targetConfig = null;
        this.moveCount = 0;
        // Ya NO necesitamos: this.selectedElement, this.selectedStackId, this.getTopElementDOM

        // Configura el texto inicial del botón
        this.startButtonEl.textContent = 'Iniciar Desafío'; // Texto traducido

        // Inicializar visualizaciones (vacías) y objetivo (vacío)
        // Llamar a renderChallengeStack para dibujar la estructura inicial vacía
        // Asegurarse de que el HTML para las 3 pilas y sus contenedores visuales esté listo ANTES de llamar a init
        this.renderChallengeVisualizations();
        this.updateUI.displayTargetConfig(null, this.targetElements); // Limpiar objetivo visual al inicio
        this.displayFeedback(''); // Limpiar estado

        // Nota: Los manejadores de clics para los botones de movimiento se adjuntan en stack.js
    }

    isActive() {
        return this.challengeActive;
    }

    /**
     * Define posibles configuraciones objetivo para los desafíos.
     * Usa números 1 a N por simplicidad inicial.
     */
    possibleTargets = [
        {
            name: "Ordenar en Derecha", // Cambiado a Derecha para variar
            left: [],
            middle: [],
            right: [1, 2, 3, 4, 5],
        },
         {
            name: "Ordenar Invertido en Izquierda",
            left: [5, 4, 3, 2, 1],
            middle: [],
            right: [],
        },
        {
            name: "Alternar Izq/Der",
            left: [1, 3, 5],
            middle: [],
            right: [2, 4],
        },
         {
            name: "Alternar Der/Izq",
            left: [2, 4],
            middle: [],
            right: [1, 3, 5],
        },
        {
            name: "Bajos Izq, Altos Der",
            left: [1, 2],
            middle: [],
            right: [3, 4, 5],
        },
         {
             name: "Centro y Laterales",
             left: [1, 5],
             middle: [3],
             right: [2, 4],
         }
    ];


    /**
     * Renderiza la estructura visual de las 3 pilas dentro de su contenedor padre.
     * Esto incluye los contenedores visuales para cada pila y sus bases.
     * Esto se hace una vez al inicio del manager.
     */
    renderChallengeVisualizations() {
        // Limpiar el contenedor padre
        this.vizContainer.innerHTML = '';

        const stackIds = ['left', 'middle', 'right'];

        stackIds.forEach((stackId, index) => {
            const stackColumn = document.createElement('div');
            stackColumn.className = 'flex flex-col items-center'; // Clases de estilo

            // Título de la pila
            const title = document.createElement('div');
            title.className = 'font-semibold mb-2 text-gray-900'; // Clases de estilo
            title.textContent = `Pila ${index + 1}`; // Nombre basado en el índice

            // Contenedor visual de la pila (donde irán los elementos)
            const stackVizEl = document.createElement('div');
            stackVizEl.id = `stack-challenge-${stackId}`; // IDs como en el HTML original/nuevo
            stackVizEl.className = 'stack-challenge-viz w-full border border-gray-300 rounded-lg p-2 flex flex-col-reverse items-center overflow-hidden min-h-[150px] bg-white shadow-inner'; // Clases de estilo
            // Guardar referencia a este elemento en vizElements si no está ya.
             this.vizElements[`${stackId}StackEl`] = stackVizEl;


            // Añadir la base de la pila
            const baseEl = document.createElement('div');
            baseEl.className = 'stack-base w-full text-center p-2 bg-gray-400 text-white font-bold rounded-b-lg'; // Clases de estilo
            baseEl.textContent = 'Base';

            stackVizEl.appendChild(baseEl); // Añadir la base dentro del contenedor visual

            stackColumn.appendChild(title);
            stackColumn.appendChild(stackVizEl);

            // Contenedor para los botones de movimiento
            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'move-buttons flex flex-col gap-2 mt-2 w-full'; // Clases de estilo

            // Añadir botones de movimiento (solo mover *desde* esta pila)
            const otherStackIds = stackIds.filter(id => id !== stackId);
            otherStackIds.forEach(targetStackId => {
                const button = document.createElement('button');
                 button.id = `move-${stackId}-${targetStackId}`; // ID del botón (ej: move-left-middle)
                button.classList.add('btn', 'btn-primary', 'move-btn', 'py-1', 'px-3', 'text-sm', 'w-full'); // Clases de estilo
                button.textContent = `Mover a ${targetStackId.charAt(0).toUpperCase() + targetStackId.slice(1)}`; // Texto del botón

                // Los manejadores de clic se adjuntan en stack.js, no aquí.
                // button.addEventListener('click', () => this.performMove(stackId, targetStackId)); // NO adjuntar aquí

                buttonsContainer.appendChild(button);
            });

            stackColumn.appendChild(buttonsContainer);

            // Añadir la columna de la pila al contenedor principal
            this.vizContainer.appendChild(stackColumn);
        });
    }


    /**
     * Inicia un nuevo desafío.
     * Genera secuencia inicial aleatoria en medio, selecciona objetivo esparcido.
     */
    start() {
         if (this.challengeActive) { this.reset(); }
         console.log("Iniciando Desafío de Reorganización LIFO (Botones)...");

         this.challengeActive = true;
         this.moveCount = 0;

         // --- 1. Generar Conjunto de Números (1 a N) ---
         const numberOfElements = 5; // Número fijo de elementos para empezar
         let challengeNumbers = Array.from({ length: numberOfElements }, (_, i) => i + 1);


         // --- 2. Generar Estado Inicial (Solo Medio, Aleatorio) ---
         this.stacks.left.clear();
         this.stacks.middle.clear();
         this.stacks.right.clear();

         const shuffledNumbers = [...challengeNumbers].sort(() => Math.random() - 0.5);
         shuffledNumbers.forEach(num => this.stacks.middle.push(num));


         // --- 3. Seleccionar Configuración Objetivo ---
         this.targetConfig = this.possibleTargets[Math.floor(Math.random() * this.possibleTargets.length)];

         // Asegurarse de que el objetivo no sea el mismo que el estado inicial (poco probable con aleatoriedad)
         // Opcional: Podríamos añadir lógica para re-seleccionar si el targetConfig es igual al estado inicial.


         // --- 4. Renderizar estado inicial y objetivo ---
         // Renderizar las pilas del desafío
         this.render();

         this.updateUI.displayTargetConfig(this.targetConfig, this.targetElements);


         // --- 5. Actualizar UI de estado ---
         this.displayFeedback(`Desafío activo. Movimientos: ${this.moveCount}.`, ''); // Mostrar estado inicial

         this.startButtonEl.textContent = 'Reiniciar Desafío'; // Cambiar texto del botón

         // Nota: La lógica para deshabilitar/habilitar botones de movimiento se maneja en stack.js después de llamar a start()
    }

    /**
     * Reinicia el desafío.
     */
    reset() {
         console.log("Reiniciando Desafío de Reorganización LIFO...");

         this.challengeActive = false;
         this.stacks.left.clear();
         this.stacks.middle.clear();
         this.stacks.right.clear();
         this.targetConfig = null;
         this.moveCount = 0;

         // Limpiar visualizaciones y objetivo
         this.render(); // Renderizar pilas vacías
         this.updateUI.displayTargetConfig(null, this.targetElements); // Limpiar objetivo visual

         // Limpiar UI de estado
         this.displayFeedback('', ''); // Limpiar estado

         this.startButtonEl.textContent = 'Iniciar Desafío'; // Cambiar texto del botón

         // Nota: La lógica para habilitar UI normal (incluyendo botones de movimiento) se maneja en stack.js después de llamar a reset()
    }

    /**
     * Renderiza el estado actual de las tres pilas del desafío.
     */
    render() {
        this.renderViz.renderChallengeStack(this.stacks.left, this.vizElements.leftStackEl, 'left');
        this.renderViz.renderChallengeStack(this.stacks.middle, this.vizElements.middleStackEl, 'middle');
        this.renderViz.renderChallengeStack(this.stacks.right, this.vizElements.rightStackEl, 'right');
    }


    /**
     * Ejecuta un movimiento de elemento de una pila a otra.
     * Es llamada por los manejadores de clic de los botones en stack.js.
     * @param {string} sourceStackId - ID de la pila de origen ('left', 'middle', 'right').
     * @param {string} destinationStackId - ID de la pila de destino ('left', 'middle', 'right').
     * @returns {boolean} True si el movimiento fue exitoso, false si no.
     */
    performMove(sourceStackId, destinationStackId) {
        if (!this.challengeActive) {
             console.warn("Intento de movimiento cuando el desafío no está activo.");
             return false;
         }
         if (sourceStackId === destinationStackId) {
             console.warn("Intento de mover a la misma pila de origen.");
             return false;
         }
         if (this.stacks[sourceStackId].isEmpty()) {
             this.displayFeedback(`La pila de origen (${sourceStackId}) está vacía. No se puede mover.`, 'error');
             console.log(`Intento de mover desde pila vacía: ${sourceStackId}.`);
             return false; // No se puede mover desde una pila vacía
         }

         // Opcional: Implementar la regla de Torres de Hanoi (disco grande sobre pequeño)
         // if (!this.stacks[destinationStackId].isEmpty()) {
         //     const topDest = this.stacks[destinationStackId].peek();
         //     const topSource = this.stacks[sourceStackId].peek();
         //     if (topSource > topDest) {
         //         this.displayFeedback(`No puedes colocar un disco más grande (${topSource}) sobre uno más pequeño (${topDest}).`, 'error');
         //         return false; // Regla de Torres de Hanoi violada
         //     }
         // }


        // Realizar el movimiento (Pop de origen, Push a destino) en las instancias de Stack.
        const movedValue = this.stacks[sourceStackId].pop();
        if (movedValue !== undefined) { // Pop fue exitoso
            this.stacks[destinationStackId].push(movedValue); // Push al destino

            // Actualizar visualizaciones de las DOS pilas afectadas.
            this.render(); // Re-renderiza todas las pilas para simplificar

            this.moveCount++; // Incrementar contador.
            this.displayFeedback(`Movimiento ${this.moveCount}: ${movedValue} de ${sourceStackId} a ${destinationStackId}.`, '');
            console.log(`Movimiento ${this.moveCount}: ${movedValue} de ${sourceStackId} a ${destinationStackId}.`);

            // Verificar condición de victoria después del movimiento.
            this.checkWinCondition();

            return true; // Movimiento exitoso

        } else {
             // Esto no debería ocurrir si la verificación isEmpty fue correcta.
             this.displayFeedback("Error interno al realizar el movimiento.", 'error');
             console.error("Error lógico: Intento de Pop desde pila vacía.");
             return false; // Movimiento fallido
        }
    }


    /**
     * Compara el estado actual con el objetivo.
     */
    checkWinCondition() {
        if (!this.challengeActive || !this.targetConfig) return;

        let win = true;
        const stackIds = ['left', 'middle', 'right'];

        for (const stackId of stackIds) {
            const currentItems = this.stacks[stackId].items; // Usar el getter .items
            const targetItems = this.targetConfig[stackId];

            // Comprobar si los arrays de elementos son idénticos en orden y contenido
            if (currentItems.length !== targetItems.length) {
                win = false;
                break;
            }

            // Recorrer de abajo hacia arriba (como están almacenados en el array .items)
            // o de arriba hacia abajo visualmente (que es el final del array)
            // El targetConfig está definido como de abajo hacia arriba, igual que items.
            for (let i = 0; i < currentItems.length; i++) {
                if (currentItems[i] !== targetItems[i]) {
                    win = false;
                    break;
                }
            }
            if (!win) break; // Si una pila no coincide, el desafío no está completo
        }

        if (win) {
            this.endChallenge(true);
        } else {
             // Si no hay victoria, el desafío continúa.
             // Opcional: Lógica para detectar puzles bloqueados si se implementan reglas de Hanoi.
        }
    }

    /**
     * Finaliza el desafío (victoria/derrota).
     * @param {boolean} won - True si el usuario ganó, false si perdió.
     */
    endChallenge(won) {
        if (!this.challengeActive) return;

        this.challengeActive = false;

        const statusMessage = won
            ? `¡Desafío Completado en ${this.moveCount} movimientos!`
            : 'Desafío fallido.';

        this.displayFeedback(statusMessage, won ? 'success' : 'error'); // Usar clases de feedback general

        console.log(statusMessage);

        this.startButtonEl.textContent = 'Iniciar Desafío';
        // Nota: Deshabilitar los botones de movimiento se maneja en stack.js después de llamar a endChallenge()
        // La UI general se re-habilita en stack.js también.
    }

    /**
     * Muestra feedback en el elemento de estado del desafío.
     * Opcionalmente usa el elemento de feedback general.
     */
    displayFeedback(message, type = '') {
         const feedbackEl = this.challengeStatusEl; // Usar el elemento de estado del desafío por defecto
        // O si se prefiere usar el elemento de feedback general:
        // const feedbackEl = this.uiElements.feedbackElement;

         feedbackEl.textContent = message;
         // Limpiar clases de estado anteriores (success/error)
         feedbackEl.classList.remove('challenge-success', 'challenge-error', 'feedback-error', 'feedback-success');
         feedbackEl.className = 'challenge-status'; // Asegurar la clase base

         if (type === 'success') {
             feedbackEl.classList.add('challenge-success'); // O feedbacek-success si se usa el otro elemento
         } else if (type === 'error') {
             feedbackEl.classList.add('challenge-error'); // O feedback-error
         }

         // Ocultar el elemento si el mensaje está vacío
         if (message) {
             feedbackEl.style.display = 'block';
         } else {
              feedbackEl.style.display = 'none';
         }
    }
}