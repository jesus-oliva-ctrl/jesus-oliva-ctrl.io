// queue/queue.js
// Controlador principal para la vista de la Cola

// --- Importaciones ---
import { Queue } from './queue-logic.js'; // Clase Cola
import { renderQueue } from './queue-rendering.js'; // Renderizado visual
import { updateArrivingElements, updateProcessedElements } from './queue-challenge-ui.js'; // UI del desafío
import { QueueChallengeManager } from './queue-challenge-manager.js'; // Gestor de desafío
// --- Fin Importaciones ---


document.addEventListener('DOMContentLoaded', function() {
    // --- Elementos DOM ---
    const queueInput = document.getElementById('queue-input');
    const enqueueButton = document.getElementById('queue-enqueue');
    const dequeueButton = document.getElementById('queue-dequeue');
    const resetButton = document.getElementById('queue-reset');
    const queueContainer = document.getElementById('queue-container');
    const startChallengeButton = document.getElementById('queue-start-challenge');
    const arrivingElements = document.getElementById('queue-arriving-elements');
    const processedElements = document.getElementById('queue-processed-elements');
    const challengeStatus = document.getElementById('queue-challenge-status');
    // --- Fin Elementos DOM ---


    // --- Instancia DS ---
    const queue = new Queue(); // Instancia de la Cola
    // --- Fin Instancia DS ---


    // --- Instancia Gestor Desafío ---
    const queueChallenge = new QueueChallengeManager({
        queueInstance: queue,
        vizContainerElement: queueContainer,
        uiElements: {
            arrivingElements: arrivingElements,
            processedElements: processedElements,
            challengeStatus: challengeStatus,
            startButton: startChallengeButton,
            dequeueButton: dequeueButton,
            enqueueButton: enqueueButton,
        },
        uiUpdateFunctions: {
            updateArrivingElements: updateArrivingElements,
            updateProcessedElements: updateProcessedElements,
        },
        renderingFunctions: {
            renderQueue: renderQueue,
        },
        operationalFunctions: {
             addElement: addElement, // Pasa addElement para llegada automática
        }
    });
    // --- Fin Instancia Gestor Desafío ---


    // --- Variables Desafío (Manejadas por Gestor) ---
    // --- Fin Variables Desafío ---


    // --- Funciones Operación/Visualización ---

    function addElement(value) {
        if (value === '' || isNaN(value)) {
            alert('¡Por favor, ingresa un número válido!');
            return;
        }
        const elementValue = parseInt(value);

        // Crea elemento DOM y anima
        const element = document.createElement('div');
        element.className = 'queue-element'; element.textContent = elementValue;
        element.style.opacity = '0'; element.style.transform = 'translateX(20px)';
        queueContainer.appendChild(element);
        setTimeout(() => { element.style.opacity = '1'; element.style.transform = 'translateX(0)'; }, 10);

        // Enqueue DS
        queue.enqueue(elementValue);
        queueInput.value = '';

        // Renderiza de nuevo para actualizar visualización (quita msg vacío, etc.)
        renderQueue(queue, queueContainer); // <-- Llama a renderQueue aquí

        // Desafío: Habilita Dequeue si frente coincide con esperado (vía gestor)
         if (queueChallenge.isActive() && queue.front() === queueChallenge.expectedNextItem) {
              dequeueButton.disabled = false;
         }
    }

    function removeElement() {
        if (queue.isEmpty()) { alert('¡La cola está vacía!'); return null; }
        const elements = queueContainer.querySelectorAll('.queue-element');
        const element = elements[0];

        // Dequeue DS
        const dequeuedValue = queue.dequeue();

        // Anima salida y remueve DOM
        element.style.opacity = '0';
        element.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            element.remove();
            renderQueue(queue, queueContainer); // Re-renderiza
        }, 300);

        // Desafío: Registra output (vía gestor)
        queueChallenge.recordOutput(dequeuedValue);

        // Deshabilita Dequeue si cola vacía
        dequeueButton.disabled = queue.isEmpty();

        return dequeuedValue;
    }
    // --- Fin Funciones Operación/Visualización ---


    // --- Lógica Desafío (Manejada por Gestor) ---
    // --- Fin Lógica Desafío ---


    // --- Manejadores Eventos ---
    enqueueButton.addEventListener('click', function() { addElement(queueInput.value); });
    dequeueButton.addEventListener('click', function() { removeElement(); });
    resetButton.addEventListener('click', function() { queueChallenge.reset(); });
    queueInput.addEventListener('keyup', function(event) { if (event.key === 'Enter') enqueueButton.click(); });
    startChallengeButton.addEventListener('click', function() {
        if (queueChallenge.isActive()) { queueChallenge.reset(); } else { queueChallenge.start(); }
    });
    // --- Fin Manejadores Eventos ---


    // --- Inicialización Vista ---
    renderQueue(queue, queueContainer); // Renderizado inicial
    dequeueButton.disabled = queue.isEmpty();
    // --- Fin Inicialización ---
});