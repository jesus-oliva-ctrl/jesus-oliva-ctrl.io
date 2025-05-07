// Controla la vista de la Pila, importa módulos, maneja interacción del DOM y lógica principal

// --- Importaciones de Módulos ---
import { Stack } from './stack-logic.js'; // Importa la clase Stack
import { renderStack } from './stack-rendering.js'; // Importa la función de renderizado
import { updateTargetSequence, updateOutputSequence } from './stack-challenge-ui.js'; // Importa funciones de UI del desafío
import { StackChallengeManager } from './stack-challenge-manager.js'; // Importa la clase gestora del desafío
// --- Fin Importaciones ---


document.addEventListener('DOMContentLoaded', function() {
    // --- Elementos del DOM ---
    const stackInput = document.getElementById('stack-input');
    const pushButton = document.getElementById('stack-push');
    const popButton = document.getElementById('stack-pop');
    const resetButton = document.getElementById('stack-reset');
    const stackContainer = document.getElementById('stack-container');
    const startChallengeButton = document.getElementById('stack-start-challenge');
    const targetSequence = document.getElementById('stack-target-sequence');
    const outputSequence = document.getElementById('stack-output-sequence');
    const challengeStatus = document.getElementById('stack-challenge-status');
    // --- Fin Elementos DOM ---


    // --- Instancia de la Estructura de Datos ---
    const stack = new Stack();
    // --- Fin Instancia DS ---


    // --- Instancia del Gestor de Desafíos ---
    // Instancia el gestor del desafío, pasando las dependencias necesarias
    const stackChallenge = new StackChallengeManager({
        stackInstance: stack,
        vizContainerElement: stackContainer, // Pasa el contenedor de visualización
        uiElements: {
            targetSequence: targetSequence,
            outputSequence: outputSequence,
            challengeStatus: challengeStatus,
            startButton: startChallengeButton,
            popButton: popButton, // Pasa el botón Pop
        },
        uiUpdateFunctions: {
            updateTargetSequence: updateTargetSequence,
            updateOutputSequence: updateOutputSequence,
        },
        renderingFunctions: {
            renderStack: renderStack, // Pasa la función de renderizado de la pila
        }
    });
    // --- Fin Instancia Gestor Desafíos ---


    // --- Funciones de Visualización/Operación ---

    function addElement(value) {
        if (value === '' || isNaN(value)) {
            alert('¡Por favor, ingresa un número válido!');
            return;
        }

        const elementValue = parseInt(value);

        // Crea elemento DOM y anima
        const element = document.createElement('div');
        element.className = 'stack-element';
        element.textContent = elementValue;
        element.style.opacity = '0';
        element.style.transform = 'translateY(-20px)';
        stackContainer.insertBefore(element, stackContainer.lastElementChild);

        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 10);

        // Push a la pila
        stack.push(elementValue);

        stackInput.value = ''; // Limpia input

        // Habilita Pop si pila no está vacía
        if (!stack.isEmpty()) {
             popButton.disabled = false;
        }
    }

    function removeElement() {
        if (stack.isEmpty()) {
            alert('¡La pila está vacía!');
            return null;
        }

        const elements = stackContainer.querySelectorAll('.stack-element');
        const element = elements[0]; // Elemento superior

        // Anima desaparición
        element.style.opacity = '0';
        element.style.transform = 'translateY(-20px)';

        // Pop de la pila
        const poppedValue = stack.pop();

        // Registra salida para desafío via gestor
        stackChallenge.recordOutput(poppedValue);

        // Remueve del DOM después de animación
        setTimeout(() => {
            element.remove();
        }, 300);

        // Después de Pop, deshabilita Pop si pila se vacía
        if (stack.isEmpty()) {
            popButton.disabled = true;
        }

        return poppedValue;
    }
    // --- Fin Funciones de Visualización/Operación ---


    // --- Manejadores de eventos ---
    // Conectan acciones de UI con funciones o métodos de gestor.
    pushButton.addEventListener('click', function() {
        addElement(stackInput.value);
    });

    popButton.addEventListener('click', function() {
        removeElement();
    });

    // Botón Reset llama método reset de gestor
    resetButton.addEventListener('click', function() {
        stackChallenge.reset();
    });

    stackInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            pushButton.click(); // Simula clic
        }
    });

    // Botón Iniciar/Reiniciar llama métodos de gestor basado en estado
    startChallengeButton.addEventListener('click', function() {
        if (stackChallenge.isActive()) { // Verifica estado via gestor
             stackChallenge.reset();
        } else {
             stackChallenge.start();
        }
    });
    // --- Fin Manejadores de eventos ---


    // --- Inicialización de la Vista ---
    renderStack(stack, stackContainer); // Renderizado inicial
    popButton.disabled = stack.isEmpty(); // Deshabilita pop al cargar si está vacía
    // --- Fin Inicialización ---
});