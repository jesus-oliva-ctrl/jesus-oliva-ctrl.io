// stack/stack.js
// Controlador principal para la vista de la Pila

// --- Importaciones ---
import { Stack } from './stack-logic.js'; // Lógica de la Pila
// renderChallengeStack ya NO necesita el callback onElementClick
import { renderStack, renderChallengeStack } from './stack-rendering.js'; // Renderizado (general y desafío)
import { displayTargetConfig } from './stack-challenge-ui.js'; // UI del desafío (mostrar objetivo)
// El viejo StackChallengeManager ya no se usa para el desafío.
// import { StackChallengeManager } from './stack-challenge-manager.js';
import { ThreeStackChallengeManager } from './three-stack-challenge-manager.js'; // Gestor de desafío de tres pilas
import { StackTutorialManager } from './stack-tutorial.js'; // Gestor de tutoriales
// --- Fin Importaciones ---


document.addEventListener('DOMContentLoaded', function() {
    // --- Elementos DOM (Generales y Tutorial) ---
    const stackInput = document.getElementById('stack-input');
    const pushButton = document.getElementById('stack-push');
    const popButton = document.getElementById('stack-pop');
    const resetButton = document.getElementById('stack-reset'); // Botón Reiniciar general
    const stackContainer = document.getElementById('stack-container'); // Contenedor visualización principal
    const startTutorialButton = document.getElementById('stack-start-tutorial');
    const howItWorksElement = document.getElementById('stack-how-it-works');
    // --- Fin Elementos DOM (Generales y Tutorial) ---


    // --- Elementos DOM del Desafío (NUEVOS para el juego de tres pilas) ---
    const startChallengeButton = document.getElementById('stack-start-challenge'); // Botón Iniciar Desafío
    const challengeStatus = document.getElementById('stack-challenge-status'); // Área mensaje estado desafío
    const threeStacksContainer = document.querySelector('.three-stacks-container'); // Contenedor padre de las 3 pilas del desafío

    // Contenedores visuales para cada pila del desafío
    const leftStackVizEl = document.getElementById('stack-challenge-left');
    const middleStackVizEl = document.getElementById('stack-challenge-middle');
    const rightStackVizEl = document.getElementById('stack-challenge-right');

    // Elementos para mostrar el objetivo de cada pila en la UI
    const leftTargetEl = document.getElementById('stack-target-left');
    const middleTargetEl = document.getElementById('stack-target-middle');
    const rightTargetEl = document.getElementById('stack-target-right');

    // Botones de movimiento (NUEVOS) - Obtener referencias
    const moveLeftMiddleBtn = document.getElementById('move-left-middle');
    const moveMiddleLeftBtn = document.getElementById('move-middle-left');
    const moveMiddleRightBtn = document.getElementById('move-middle-right');
    const moveRightMiddleBtn = document.getElementById('move-right-middle');
    // --- Fin Elementos DOM del Desafío ---


    // --- Instancia DS (Pila principal para exploración/tutorial) ---
    const stack = new Stack();
    // --- Fin Instancia DS ---


    // --- Instancia Gestor Tutorial ---
    const stackTutorial = new StackTutorialManager({
        explanationElement: howItWorksElement,
        stackInstance: stack, // Pasa la instancia de la pila principal
        vizContainerElement: stackContainer, // Pasa el contenedor de visualización principal
        uiElements: { // Pasa los elementos UI relevantes para el tutorial
            input: stackInput,
            pushButton: pushButton,
            popButton: popButton,
            resetButton: resetButton,
            startChallengeButton: startChallengeButton,
            startTutorialButton: startTutorialButton,
            challengeStatusElement: challengeStatus,
        },
        renderingFunctions: { renderStack: renderStack }, // Pasa la función de renderizado general
        operationalFunctions: { // Pasa referencias a las funciones de operación (Push/Pop)
            addElement: addElement,
            removeElement: removeElement,
        },
    });
    // --- Fin Instancia Gestor Tutorial ---


    // --- Instancia Gestor Desafío (NUEVO: Tres Pilas) ---
    const threeStackChallenge = new ThreeStackChallengeManager({
        vizElements: { // Pasa los contenedores visuales de las 3 pilas del desafío
            leftStackEl: leftStackVizEl,
            middleStackEl: middleStackVizEl,
            rightStackEl: rightStackVizEl,
        },
        targetElements: { // Pasa los elementos DOM para mostrar el objetivo
            leftTargetEl: leftTargetEl,
            middleTargetEl: middleTargetEl,
            rightTargetEl: rightTargetEl,
        },
        challengeStatusEl: challengeStatus, // Pasa el elemento de estado
        startButtonEl: startChallengeButton, // Pasa el botón de inicio/reiniciar desafío
        renderingFunctions: { renderChallengeStack: renderChallengeStack }, // Pasa la función de renderizado para pilas de desafío
        uiUpdateFunctions: { displayTargetConfig: displayTargetConfig }, // Pasa la función para mostrar el objetivo
    });
    // --- Fin Instancia Gestor Desafío ---


    // --- Funciones para controlar el estado de los botones ---

    // Habilita la UI normal (input, push, pop, tutorial, reset principal)
    function enableNormalUI() {
         stackInput.disabled = false;
         pushButton.disabled = false;
         // PopButton depende del estado de la pila principal (stack), se maneja al final de operaciones.
         resetButton.disabled = false; // El Reset general está siempre habilitado (o lo gestiona quien esté activo)
         startTutorialButton.style.display = ''; // Mostrar botón tutorial

         // Deshabilitar todos los botones de movimiento del desafío.
         disableMoveButtons();
    }

    // Deshabilita la UI normal durante tutorial o desafío.
    function disableNormalUI() {
        stackInput.disabled = true;
        pushButton.disabled = true;
        popButton.disabled = true;
        resetButton.disabled = true; // Deshabilitar Reset general durante tutorial/desafío
        startTutorialButton.style.display = 'none'; // Ocultar botón tutorial

         // Deshabilitar todos los botones de movimiento del desafío.
         disableMoveButtons(); // Asegurarse de que también se deshabilitan.
    }

    // Deshabilita todos los botones de movimiento del desafío.
    function disableMoveButtons() {
        moveLeftMiddleBtn.disabled = true;
        moveMiddleLeftBtn.disabled = true;
        moveMiddleRightBtn.disabled = true;
        moveRightMiddleBtn.disabled = true;
    }

    // Actualiza el estado de los botones de movimiento del desafío
    // en función de si el desafío está activo y si la pila de origen no está vacía.
    function updateMoveButtonStates() {
        // Si el desafío no está activo, todos los botones deben estar deshabilitados.
        if (!threeStackChallenge.isActive()) {
             disableMoveButtons();
             return;
        }

        // Si el desafío está activo, habilitar botones solo si la pila de origen NO está vacía.
        moveLeftMiddleBtn.disabled = threeStackChallenge.stacks.left.isEmpty();
        moveMiddleLeftBtn.disabled = threeStackChallenge.stacks.middle.isEmpty();
        moveMiddleRightBtn.disabled = threeStackChallenge.stacks.middle.isEmpty();
        moveRightMiddleBtn.disabled = threeStackChallenge.stacks.right.isEmpty();
    }
    // --- Fin Funciones de Control UI ---


    // --- Funciones Operación/Visualización (para vista principal/tutorial) ---
    // Estas funciones Push/Pop son usadas por la vista de exploración normal y el tutorial.
    // El nuevo juego de desafío NO las usa.
    function addElement(value) {
        if (value === '' || isNaN(value)) { alert('¡Por favor, ingresa un número válido!'); return; }
        const elementValue = parseInt(value);

        // Crea elemento DOM y anima (en la pila principal)
        const element = document.createElement('div');
        element.className = 'stack-element'; element.textContent = elementValue;
        stackContainer.insertBefore(element, stackContainer.querySelector('.stack-base'));
        element.style.opacity = '0'; setTimeout(() => { element.style.opacity = '1'; }, 10);

        // Push DS (pila principal)
        stack.push(elementValue);
        stackInput.value = '';

        // Renderiza para actualizar visualización (si se necesita limpiar mensaje vacío etc.)
        renderStack(stack, stackContainer); // Llama a renderStack general

         // Habilitar Pop si la pila ya no está vacía.
         if (!stack.isEmpty()) {
             popButton.disabled = false;
         }
    }

    function removeElement() {
        if (stack.isEmpty()) { alert('¡La pila está vacía!'); return null; }
        const elements = stackContainer.querySelectorAll('.stack-element');
        if (elements.length === 0) return null;

        const element = elements[0]; // Elemento superior visual

        // Pop DS (pila principal)
        const poppedValue = stack.pop();

        // Anima salida y remueve DOM
        element.style.opacity = '0';
        element.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            element.remove();
            renderStack(stack, stackContainer); // Re-renderiza pila principal
        }, 300);

        // Deshabilita Pop si pila principal vacía
        popButton.disabled = stack.isEmpty();

        return poppedValue;
    }
    // --- Fin Funciones Operación/Visualización ---


    // --- Manejadores Eventos ---

    // Manejador para la Pila principal (Input, Push, Pop, Reset general)
    pushButton.addEventListener('click', function() {
        if (stackTutorial.isActive()) {
             stackTutorial.handleOperation('push', stackInput.value);
         } else if (threeStackChallenge.isActive()) {
              // Botón Push deshabilitado durante desafío
         } else {
             addElement(stackInput.value);
         }
    });

    popButton.addEventListener('click', function() {
        if (stackTutorial.isActive()) {
            const poppedValue = removeElement();
            if (poppedValue !== null) {
                 stackTutorial.handleOperation('pop', poppedValue);
            }
         } else if (threeStackChallenge.isActive()) {
              // Botón Pop deshabilitado durante desafío
         } else {
             removeElement();
         }
    });

    // El botón Reiniciar general (resetButton) ahora debe resetear lo que esté activo.
    resetButton.addEventListener('click', function() {
         if (stackTutorial.isActive()) {
             stackTutorial.reset();
         } else if (threeStackChallenge.isActive()) {
             threeStackChallenge.reset();
         }
         // Si nada está activo, o después de resetear tutorial/desafío, limpiar la pila principal y su UI.
         stack.clear();
         renderStack(stack, stackContainer);
         popButton.disabled = stack.isEmpty();
         enableNormalUI(); // Re-habilitar UI normal (incl. deshabilitar botones movimiento)
         updateMoveButtonStates(); // Asegurar estado inicial de botones de movimiento
    });

    stackInput.addEventListener('keyup', function(event) {
         if (event.key === 'Enter') {
               pushButton.click();
           }
       });


    // Manejador botón Iniciar Desafío
    startChallengeButton.addEventListener('click', function() {
        if (threeStackChallenge.isActive()) {
            threeStackChallenge.reset();
            enableNormalUI(); // Re-habilitar UI normal
             updateMoveButtonStates(); // Asegurar botones de movimiento deshabilitados
        } else {
             if (stackTutorial.isActive()) {
                 if (confirm("Salir del tutorial para iniciar el desafío?")) {
                     stackTutorial.reset();
                      // enableNormalUI() ya se llama al resetear tutorial.
                     setTimeout(() => {
                         threeStackChallenge.start();
                         disableNormalUI(); // Deshabilitar UI normal
                          updateMoveButtonStates(); // Habilitar botones de movimiento según estado inicial
                     }, 50);
                 }
             } else {
                 threeStackChallenge.start();
                 disableNormalUI(); // Deshabilitar UI normal
                 updateMoveButtonStates(); // Habilitar botones de movimiento según estado inicial
             }
        }
    });

     // Manejador botón Iniciar Tutorial
     startTutorialButton.addEventListener('click', function() {
         if (threeStackChallenge.isActive()) {
             if (confirm("Salir del desafío para iniciar el tutorial?")) {
                 threeStackChallenge.reset();
                  // enableNormalUI() ya se llama al resetear desafío.
                 setTimeout(() => {
                    stackTutorial.startTutorial();
                    disableNormalUI(); // Deshabilitar UI normal
                     // updateMoveButtonStates() ya se llama en disableNormalUI
                 }, 50);
             }
         } else {
             stackTutorial.startTutorial();
             disableNormalUI(); // Deshabilitar UI normal
             // updateMoveButtonStates() ya se llama en disableNormalUI
         }
     });

    // --- Manejadores de Eventos para los NUEVOS Botones de Movimiento del Desafío ---
    // Eliminamos el manejador de eventos por delegación en threeStacksContainer.
    // Ahora cada botón llama directamente al método performMove del gestor.

    if (moveLeftMiddleBtn) { // Asegurarse de que el botón existe
        moveLeftMiddleBtn.addEventListener('click', function() {
            threeStackChallenge.performMove('left', 'middle');
             updateMoveButtonStates(); // Actualizar estado botones después del movimiento
        });
    }
    if (moveMiddleLeftBtn) {
         moveMiddleLeftBtn.addEventListener('click', function() {
             threeStackChallenge.performMove('middle', 'left');
             updateMoveButtonStates();
         });
    }
    if (moveMiddleRightBtn) {
         moveMiddleRightBtn.addEventListener('click', function() {
             threeStackChallenge.performMove('middle', 'right');
             updateMoveButtonStates();
         });
    }
    if (moveRightMiddleBtn) {
         moveRightMiddleBtn.addEventListener('click', function() {
             threeStackChallenge.performMove('right', 'middle');
             updateMoveButtonStates();
         });
    }
    // --- Fin Manejadores de Eventos Botones de Movimiento ---


    // --- Inicialización Vista (Pila principal) ---
    renderStack(stack, stackContainer); // Renderizado inicial de la pila principal
    popButton.disabled = stack.isEmpty(); // Deshabilita Pop si vacía al cargar
    enableNormalUI(); // Asegurar que la UI normal esté habilitada inicialmente.
    updateMoveButtonStates(); // Asegurar que los botones de movimiento estén deshabilitados inicialmente.
    // --- Fin Inicialización ---
});
