// stack/three-stack-challenge-manager.js
// Gestiona el Desafío de Reorganización LIFO

// --- Importaciones ---
import { Stack } from './stack-logic.js';
// Importamos solo renderChallengeStack, ya no necesita el callback onElementClick
import { renderChallengeStack } from './stack-rendering.js';
import { displayTargetConfig } from './stack-challenge-ui.js';
// --- Fin Importaciones ---


/**
 * Clase para gestionar el Desafío de Reorganización LIFO de tres pilas.
 */
export class ThreeStackChallengeManager {
    /**
     * @param {object} dependencies - Dependencias.
     * // Se esperan: vizElements, targetElements, challengeStatusEl, startButtonEl, renderingFunctions (solo renderChallengeStack), uiUpdateFunctions (displayTargetConfig)
     * // Ya NO se necesita pasar onElementClick, ni referencias a botones de movimiento (stack.js los maneja)
     */
    constructor(dependencies) {
        // Dependencias
        this.vizElements = dependencies.vizElements;
        this.targetElements = dependencies.targetElements;
        this.challengeStatusEl = dependencies.challengeStatusEl;
        this.startButtonEl = dependencies.startButtonEl;
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
        // Llamar a renderChallengeStack SIN el callback onElementClick
        this.renderViz.renderChallengeStack(this.stacks.left, this.vizElements.leftStackEl, 'left');
        this.renderViz.renderChallengeStack(this.stacks.middle, this.vizElements.middleStackEl, 'middle');
        this.renderViz.renderChallengeStack(this.stacks.right, this.vizElements.rightStackEl, 'right');
        this.updateUI.displayTargetConfig(this.targetConfig, this.targetElements);
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
            name: "Ordenar en Izquierda",
            left: [1, 2, 3, 4, 5],
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
     * Inicia un nuevo desafío.
     * Genera secuencia inicial aleatoria en medio, selecciona objetivo esparcido.
     */
    start() {
         if (this.challengeActive) { this.reset(); }
         console.log("Iniciando Desafío de Reorganización LIFO (Botones)...");

         this.challengeActive = true;
         this.moveCount = 0;
         // Ya NO necesitamos clearSelection() aquí

         // --- 1. Generar Conjunto de Números (1 a N) ---
         const numberOfElements = 5;
         let challengeNumbers = Array.from({ length: numberOfElements }, (_, i) => i + 1);


         // --- 2. Generar Estado Inicial (Solo Medio, Aleatorio) ---
         this.stacks.left = new Stack();
         this.stacks.middle = new Stack();
         this.stacks.right = new Stack();

         const shuffledNumbers = [...challengeNumbers].sort(() => Math.random() - 0.5);
         shuffledNumbers.forEach(num => this.stacks.middle.push(num));


         // --- 3. Seleccionar Configuración Objetivo ---
         this.targetConfig = this.possibleTargets[Math.floor(Math.random() * this.possibleTargets.length)];


         // --- 4. Renderizar estado inicial y objetivo ---
         // Renderizar las pilas del desafío SIN el manejador de clic (los clics son en botones)
         this.renderViz.renderChallengeStack(this.stacks.left, this.vizElements.leftStackEl, 'left');
         this.renderViz.renderChallengeStack(this.stacks.middle, this.vizElements.middleStackEl, 'middle');
         this.renderViz.renderChallengeStack(this.stacks.right, this.vizElements.rightStackEl, 'right');

         this.updateUI.displayTargetConfig(this.targetConfig, this.targetElements);


         // --- 5. Actualizar UI de estado ---
         this.challengeStatusEl.textContent = `Desafío activo. Movimientos: ${this.moveCount}.`;
         this.challengeStatusEl.className = 'challenge-status';

         this.startButtonEl.textContent = 'Reiniciar Desafío';

         // Nota: La lógica para deshabilitar/habilitar botones se maneja en stack.js después de llamar a start()
    }

    /**
     * Reinicia el desafío.
     */
    reset() {
         console.log("Reiniciando Desafío de Reorganización LIFO...");

         this.challengeActive = false;
         this.stacks.left = new Stack();
         this.stacks.middle = new Stack();
         this.stacks.right = new Stack();
         this.targetConfig = null;
         this.moveCount = 0;
         // Ya NO necesitamos clearSelection() aquí

         // Limpiar visualizaciones y objetivo
         // Llamar a renderChallengeStack SIN el callback onElementClick
         this.renderViz.renderChallengeStack(this.stacks.left, this.vizElements.leftStackEl, 'left');
         this.renderViz.renderChallengeStack(this.stacks.middle, this.vizElements.middleStackEl, 'middle');
         this.renderViz.renderChallengeStack(this.stacks.right, this.vizElements.rightStackEl, 'right');
         this.updateUI.displayTargetConfig(this.targetConfig, this.targetElements);

         // Limpiar UI de estado
         this.challengeStatusEl.textContent = '';
         this.challengeStatusEl.className = 'challenge-status';

         this.startButtonEl.textContent = 'Iniciar Desafío';

         // Nota: La lógica para habilitar UI normal (incluyendo botones de movimiento) se maneja en stack.js después de llamar a reset()
    }

    /**
     * Ejecuta un movimiento de elemento de una pila a otra.
     * Es llamada por los manejadores de clic de los botones en stack.js.
     * @param {string} sourceStackId - ID de la pila de origen ('left', 'middle', 'right').
     * @param {string} destinationStackId - ID de la pila de destino ('left', 'middle', 'right').
     */
    performMove(sourceStackId, destinationStackId) {
        if (!this.challengeActive) {
             console.warn("Intento de movimiento cuando el desafío no está activo."); // Log advertencia
             return;
         }
         if (sourceStackId === destinationStackId) {
             console.warn("Intento de mover a la misma pila de origen."); // Log advertencia
             return; // No permitir mover a la misma pila (los botones no deberían permitirlo de todos modos)
         }
         if (this.stacks[sourceStackId].isEmpty()) {
             this.displayFeedback(`La pila de origen (${sourceStackId}) está vacía. No se puede mover.`); // Feedback traducido
             console.log(`Intento de mover desde pila vacía: ${sourceStackId}.`); // Log
             // Nota: stack.js debería deshabilitar el botón si la pila está vacía.
             return; // No se puede mover desde una pila vacía
         }


        // Realizar el movimiento (Pop de origen, Push a destino) en las instancias de Stack.
        const movedValue = this.stacks[sourceStackId].pop();
        if (movedValue !== undefined) { // Pop fue exitoso
            this.stacks[destinationStackId].push(movedValue); // Push al destino

            // Actualizar visualizaciones de las DOS pilas afectadas.
            // Llamar a renderChallengeStack SIN el callback onElementClick
            this.renderViz.renderChallengeStack(this.stacks[sourceStackId], this.vizElements[`${sourceStackId}StackEl`], sourceStackId);
            this.renderViz.renderChallengeStack(this.stacks[destinationStackId], this.vizElements[`${destinationStackId}StackEl`], destinationStackId);


            this.moveCount++; // Incrementar contador.
            this.displayFeedback(`Movimiento ${this.moveCount}: ${movedValue} de ${sourceStackId} a ${destinationStackId}.`);
            console.log(`Movimiento ${this.moveCount}: ${movedValue} de ${sourceStackId} a ${destinationStackId}.`);

            // Verificar condición de victoria después del movimiento.
            this.checkWinCondition();

            // Notificar a stack.js para actualizar el estado de los botones (si es necesario)
            // Podríamos emitir un evento o pasar un callback aquí,
            // pero es más simple que stack.js verifique el estado de las pilas después de cada movimiento.

        } else {
             // Esto no debería ocurrir si la verificación isEmpty fue correcta.
             this.displayFeedback("Error interno al realizar el movimiento."); // Mensaje de error interno traducido
             console.error("Error lógico: Intento de Pop desde pila vacía.");
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
            const currentItems = this.stacks[stackId].items;
            const targetItems = this.targetConfig[stackId];

            if (currentItems.length !== targetItems.length) {
                win = false;
                break;
            }

            for (let i = 0; i < currentItems.length; i++) {
                if (currentItems[i] !== targetItems[i]) {
                    win = false;
                    break;
                }
            }
            if (!win) break;
        }

        if (win) {
            this.endChallenge(true);
        } else {
             // Opcional: Lógica de derrota o puzle bloqueado
        }
    }

    /**
     * Finaliza el desafío (victoria/derrota).
     */
    endChallenge(won) {
        if (!this.challengeActive) return;

        this.challengeActive = false;

        const statusMessage = won
            ? `¡Desafío Completado en ${this.moveCount} movimientos!`
            : 'Desafío fallido.';

        this.displayFeedback(statusMessage, won ? 'challenge-success' : 'challenge-error');

        console.log(statusMessage);

        this.startButtonEl.textContent = 'Iniciar Desafío';
        // Nota: Deshabilitar los botones de movimiento se maneja en stack.js después de llamar a endChallenge()
    }

    /**
     * Muestra feedback en el elemento de estado.
     */
    displayFeedback(message, className = '') {
        this.challengeStatusEl.textContent = message;
        this.challengeStatusEl.className = 'challenge-status';
        if (className) {
            this.challengeStatusEl.classList.add(className);
        }
    }

 
}