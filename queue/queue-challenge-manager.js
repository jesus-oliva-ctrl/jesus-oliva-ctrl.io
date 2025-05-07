// queue/queue-challenge-manager.js
// Gestiona la lógica y el estado del desafío de la Cola.

// --- Importaciones ---
import { updateArrivingElements, updateProcessedElements } from './queue-challenge-ui.js'; // UI del desafío
import { renderQueue } from './queue-rendering.js'; // Renderizado visual
// --- Fin Importaciones ---


/**
 * Clase para gestionar el estado y la lógica del desafío de la Cola.
 */
export class QueueChallengeManager {
    constructor(dependencies) {
        // Dependencias
        this.queue = dependencies.queueInstance;
        this.vizContainer = dependencies.vizContainerElement;
        this.ui = dependencies.uiElements;
        this.ops = dependencies.operationalFunctions; // Funciones operacionales como addElement
        this.updateUI = dependencies.uiUpdateFunctions;
        this.renderViz = dependencies.renderingFunctions;

        // Estado
        this.arrivingArray = []; // Secuencia de elementos que "llegan" (objetivo).
        this.processedArray = []; // Secuencia de elementos sacados por el usuario.
        this.challengeActive = false; // Desafío activo.
        this.challengeInterval = null; // Temporizador de llegada.
        this.expectedNextItem = null; // Valor esperado a sacar.

        this.ui.startButton.textContent = 'Iniciar Desafío'; // Texto botón
    }

    isActive() {
        return this.challengeActive;
    }

    start() {
         if (this.challengeActive) { this.reset(); }

        // Reset estado y variables
        this.arrivingArray = []; this.processedArray = []; this.expectedNextItem = null;
        this.challengeActive = true;

        // Reset DS y Viz
        this.queue.clear();
        this.renderViz.renderQueue(this.queue, this.vizContainer);

        // Generar secuencia llegada
        for (let i = 0; i < 8; i++) {
            this.arrivingArray.push(Math.floor(Math.random() * 99) + 1);
        }

        // Actualizar UI desafío
        this.updateUI.updateArrivingElements(this.arrivingArray, this.ui.arrivingElements);
        this.updateUI.updateProcessedElements(this.processedArray, this.ui.processedElements); // Limpiar UI
        this.ui.challengeStatus.textContent = '¡Desafío en curso! Procesa elementos en el orden en que llegan.'; // Mensaje estado
        this.ui.challengeStatus.className = 'challenge-status';
        this.ui.startButton.textContent = 'Reiniciar Desafío'; // Texto botón

        // Ajustar estado botones
        this.ui.dequeueButton.disabled = this.queue.isEmpty();
        this.ui.enqueueButton.disabled = true; // Deshabilita Enqueue manual

        // Iniciar llegada automática
        let index = 0;
        this.challengeInterval = setInterval(() => {
            if (index < this.arrivingArray.length) {
                const nextValue = this.arrivingArray[index];
                this.ops.addElement(nextValue); // Llama a addElement (en queue.js)

                if (index === 0) { // Primer elemento llegado
                    this.expectedNextItem = nextValue;
                }
                 // Habilitar Dequeue si el frente de la cola coincide con el esperado (solo si es el primer elemento que llega Y no hay otros ya en cola)
                 // Esta lógica se maneja mejor verificando el frente después de cada addElement
                 // (la lógica en addElement de queue.js ya hace esto).

                index++;
            } else {
                clearInterval(this.challengeInterval);
                this.challengeInterval = null;
            }
        }, 2000);
    }

    reset() {
        if (this.challengeInterval) clearInterval(this.challengeInterval);
        this.challengeInterval = null;

        // Reset estado
        this.arrivingArray = []; this.processedArray = []; this.expectedNextItem = null;
        this.challengeActive = false;

        // Reset DS y Viz
        this.queue.clear();
        this.renderViz.renderQueue(this.queue, this.vizContainer);

        // Limpiar UI desafío
        this.updateUI.updateArrivingElements(this.arrivingArray, this.ui.arrivingElements);
        this.updateUI.updateProcessedElements(this.processedArray, this.ui.processedElements);
        this.ui.challengeStatus.textContent = '';
        this.ui.challengeStatus.className = 'challenge-status';
        this.ui.startButton.textContent = 'Iniciar Desafío';

        // Ajustar estado botones
        this.ui.dequeueButton.disabled = this.queue.isEmpty();
        this.ui.enqueueButton.disabled = false; // Habilita Enqueue manual
    }

    // Llamado desde removeElement en queue.js
    recordOutput(value) {
        if (!this.challengeActive) return;
        this.processedArray.push(value); // Registrar elemento sacado
        this.checkProgress(); // Verificar progreso
    }

    checkProgress() {
        if (!this.challengeActive || this.processedArray.length === 0) return;

        // Actualiza UI de procesados
        this.updateUI.updateProcessedElements(this.processedArray, this.ui.processedElements);

        const currentLength = this.processedArray.length;
        const arrivingLength = this.arrivingArray.length;

        // Verificar si la secuencia procesada hasta ahora coincide
        let failed = false;
        for(let i = 0; i < currentLength; i++){
            if (i >= arrivingLength || this.processedArray[i] !== this.arrivingArray[i]) {
                failed = true; break;
            }
        }

        if (failed) {
            this.failChallenge('¡Ups! Elementos procesados fuera de orden. ¡Inténtalo de nuevo!');
            return;
        }

        // Si no falló y completó la secuencia
        if (currentLength === arrivingLength) {
            this.succeedChallenge('¡Desafío completado exitosamente!');
        }

        // Actualiza el próximo esperado si aún no se ha completado y no falló
        if (this.challengeActive && currentLength < arrivingLength) {
             this.expectedNextItem = this.arrivingArray[currentLength];
        }
        // Nota: La lógica para habilitar/deshabilitar Dequeue basada en el frente de la cola vs expectedNextItem
        // está actualmente en addElement y removeElement en queue.js. Podría centralizarse aquí.
    }

    failChallenge(message) {
        this.challengeActive = false;
        this.ui.challengeStatus.textContent = message;
        this.ui.challengeStatus.className = 'challenge-status challenge-error';
        if (this.challengeInterval) clearInterval(this.challengeInterval); this.challengeInterval = null;
        // Opcional: this.ui.enqueueButton.disabled = true; this.ui.dequeueButton.disabled = true;
    }

    succeedChallenge(message) {
        this.challengeActive = false;
        this.ui.challengeStatus.textContent = message;
        this.ui.challengeStatus.className = 'challenge-status challenge-success';
         if (this.challengeInterval) clearInterval(this.challengeInterval); this.challengeInterval = null;
         // Opcional: this.ui.enqueueButton.disabled = true; this.ui.dequeueButton.disabled = true;
    }
}