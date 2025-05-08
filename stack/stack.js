// stack/stack.js
// Controlador principal para la vista de la Pila

// --- Importaciones ---
import { Stack } from './stack-logic.js'; // Lógica de la Pila
import { renderStack } from './stack-rendering.js'; // Renderizado visual
import { updateTargetSequence, updateOutputSequence } from './stack-challenge-ui.js'; // UI del desafío (si se usan)
import { StackChallengeManager } from './stack-challenge-manager.js'; // Gestor de desafío
import { StackTutorialManager } from './stack-tutorial.js'; // Gestor de tutoriales
// --- Fin Importaciones ---


document.addEventListener('DOMContentLoaded', function() {
    // --- Elementos DOM ---
    const stackInput = document.getElementById('stack-input');
    const pushButton = document.getElementById('stack-push');
    const popButton = document.getElementById('stack-pop');
    const resetButton = document.getElementById('stack-reset');
    const stackContainer = document.getElementById('stack-container');
    const startChallengeButton = document.getElementById('stack-start-challenge');
    // Elementos del desafío (ajusta según tu index.html actual)
    // const targetSequence = document.getElementById('stack-target-sequence');
    // const outputSequence = document.getElementById('stack-output-sequence');
    // const stackCheckStateButton = document.getElementById('stack-check-state');
    const challengeStatus = document.getElementById('stack-challenge-status');

    // Elementos del Tutorial
    const startTutorialButton = document.getElementById('stack-start-tutorial');
    const howItWorksElement = document.getElementById('stack-how-it-works');
    // --- Fin Elementos DOM ---


    // --- Instancia DS ---
    const stack = new Stack(); // Instancia de la Pila
    // --- Fin Instancia DS ---


    // --- Instancia Gestor Desafío ---
    // Asegúrate de pasar las dependencias correctas según la clase StackChallengeManager actual.
     const stackChallenge = new StackChallengeManager({
         stackInstance: stack,
         vizContainerElement: stackContainer,
         uiElements: { /* ... elementos UI desafío ... */
             challengeStatus: challengeStatus, // Pasa status
             startButton: startChallengeButton, // Pasa botón iniciar
             dequeueButton: popButton, // Pasa popButton si el gestor lo necesita
             enqueueButton: pushButton, // Pasa pushButton si el gestor lo necesita
         },
         uiUpdateFunctions: { /* ... funciones UI desafío ... */
            // updateTargetSequence: updateTargetSequence, // Si aún se usa
            // updateOutputSequence: updateOutputSequence, // Si aún se usa
         },
         renderingFunctions: { renderStack: renderStack /* ... otras si el gestor las usa ... */ },
         operationalFunctions: { addElement: addElement /* ... otras si el gestor las usa ... */ },
     });
    // --- Fin Instancia Gestor Desafío ---


    // --- Instancia Gestor Tutorial ---
    const stackTutorial = new StackTutorialManager({
        explanationElement: howItWorksElement,
        // Pasar más dependencias del tutorial aquí (stack, botones, input, etc.)
         stackInstance: stack,
         vizContainerElement: stackContainer,
         uiElements: {
             input: stackInput,
             pushButton: pushButton,
             popButton: popButton,
             resetButton: resetButton,
             startChallengeButton: startChallengeButton, // Puede necesitar referencia
             startTutorialButton: startTutorialButton, // Puede necesitar referencia
             challengeStatusElement: challengeStatus, // Para mensajes de estado si el tutorial los usa
         },
         renderingFunctions: { renderStack: renderStack /* ... otras si el tutorial las usa ... */ },
         operationalFunctions: { // Pasar referencias a estas funciones para que el tutorial pueda 'llamarlas' o coordinarlas
            addElement: addElement,
            removeElement: removeElement,
            // Quizás también las funciones de desafío para deshabilitarlas durante el tutorial
            // startChallenge: stackChallenge.start.bind(stackChallenge), // Pasar el método del gestor desafío
            // resetChallenge: stackChallenge.reset.bind(stackChallenge), // Pasar el método del gestor desafío
         },
    });
    // --- Fin Instancia Gestor Tutorial ---


    // --- Variables Desafío (Manejadas por Gestor Desafío) ---
    // --- Fin Variables Desafío ---


    // --- Funciones Operación/Visualización ---

    function addElement(value) {
        // Validación de entrada
        if (value === '' || isNaN(value)) { alert('¡Por favor, ingresa un número válido!'); return; }
        const elementValue = parseInt(value);

        // Crea elemento DOM y anima
        const element = document.createElement('div');
        element.className = 'stack-element'; element.textContent = elementValue;
        element.style.opacity = '0'; element.style.transform = 'translateY(-20px)';
        stackContainer.insertBefore(element, stackContainer.lastElementChild); // Insertar antes de la base
        setTimeout(() => { element.style.opacity = '1'; element.style.transform = 'translateY(0)'; }, 10);

        // Push DS
        stack.push(elementValue);
        stackInput.value = '';

        // Renderiza para actualizar visualización (quitar msg vacío, bordes, etc.)
        renderStack(stack, stackContainer); // Llama a renderStack aquí

        // Habilitar Pop si la pila ya no está vacía.
         if (!stack.isEmpty()) {
             popButton.disabled = false;
         }

         // Nota: La lógica de desafío o tutorial que depende de addElement no está aquí,
         // es llamada por el gestor correspondiente (o addElement es llamada por ellos).
    }

    function removeElement() {
        // Si la pila está vacía, alerta y retorna
        if (stack.isEmpty()) { alert('¡La pila está vacía!'); return null; }
        const elements = stackContainer.querySelectorAll('.stack-element');
        const element = elements[0]; // Elemento superior

        // Pop DS
        const poppedValue = stack.pop();

        // Anima salida y remueve DOM
        element.style.opacity = '0';
        element.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            element.remove();
            renderStack(stack, stackContainer); // Re-renderiza
        }, 300);

        // Deshabilita Pop si cola vacía
        popButton.disabled = stack.isEmpty();

        // Retorna el valor sacado (usado por el manejador de evento o tutorial)
        return poppedValue;
    }
    // --- Fin Funciones Operación/Visualización ---


    // --- Lógica Desafío (Manejada por Gestor Desafío) ---
    // --- Fin Lógica Desafío ---


    // --- Lógica Tutorial (Manejada por Gestor Tutorial) ---
    // --- Fin Lógica Tutorial ---


    // --- Manejadores Eventos ---
    pushButton.addEventListener('click', function() {
        // Si el tutorial está activo, notificar al gestor tutorial.
        if (stackTutorial.isActive && stackTutorial.isActive()) { // Verifica si el objeto y el método existen
             stackTutorial.handleOperation('push', stackInput.value);
         } else if (stackChallenge.isActive && stackChallenge.isActive()) { // Si desafío activo, podría tener lógica aquí
             // Si el desafío tiene lógica para reaccionar al Push (el juego actual de Pila no la tenía)
             // podrías llamar a un método del gestor desafío aquí.
             // stackChallenge.handleOperation('push', stackInput.value);
             // Si no, simplemente ignora el Push manual durante el desafío de Pila (actualmente el juego no lo usa).
             alert("Operación PUSH no permitida durante el desafío actual de Pila."); // Mensaje traducido
         }
         else {
             // Si ni tutorial ni desafío activo, ejecutar lógica normal.
             addElement(stackInput.value);
         }
    });

    popButton.addEventListener('click', function() {
        // Obtener el valor antes de decidir quién lo maneja.
        // Llama a removeElement aquí para que la animación y Pop DS siempre ocurran al hacer clic.
        const poppedValue = removeElement();

        if (poppedValue !== null) { // Solo si se sacó algo realmente
            // Si el tutorial está activo, notificar al gestor tutorial.
            if (stackTutorial.isActive && stackTutorial.isActive()) {
                 stackTutorial.handleOperation('pop', poppedValue);
             } else if (stackChallenge.isActive && stackChallenge.isActive()) { // Si desafío activo, notificar al gestor desafío
                // Notificar al gestor desafío que se hizo Pop.
                // Nota: La lógica recordOutput ya estaba en removeElement antes de modularizar el gestor.
                // Ahora, recordOutput está en el gestor desafío y es llamado DESDE aquí o DESDE removeElement.
                // Decidimos llamarlo desde removeElement original (ahora en este archivo)
                // PERO si el gestor desafío necesita hacer algo *antes* o *en lugar* de removeElement,
                // habría que cambiar esto. En el último código del gestor desafío, recordOutput era llamado DESDE removeElement.
                // Moviendo la llamada aquí:
                stackChallenge.recordOutput(poppedValue); // Llama al método del gestor desafío
             }
             // Si ni tutorial ni desafío activo, Pop ya se hizo arriba y no hay más lógica aquí.
        }
    });

    resetButton.addEventListener('click', function() {
         // Lógica: Siempre limpiar DS y Viz. Si desafío/tutorial activo, resetearlos.
         stack.clear(); // Limpiar la pila
         renderStack(stack, stackContainer); // Renderizar pila limpia

         if (stackChallenge.isActive && stackChallenge.isActive()) { stackChallenge.reset(); }
         if (stackTutorial.isActive && stackTutorial.isActive()) { stackTutorial.reset(); }

         popButton.disabled = stack.isEmpty(); // Deshabilitar Pop si vacía
    });

    stackInput.addEventListener('keyup', function(event) {
         if (event.key === 'Enter') {
             // Simular clic en Push. La lógica de quién maneja el Push (tutorial/desafío/normal)
             // está en el manejador del pushButton.
              pushButton.click();
          }
      });

    startChallengeButton.addEventListener('click', function() {
        // Si tutorial activo, salir del tutorial antes de iniciar desafío.
        if (stackTutorial.isActive && stackTutorial.isActive()) {
             if (confirm("Salir del tutorial para iniciar el desafío?")) {
                 stackTutorial.reset();
                 // Pequeño retardo para asegurar que el tutorial se resetee
                 setTimeout(() => {
                     // Iniciar/resetear desafío normal.
                     if (stackChallenge.isActive()) { stackChallenge.reset(); } else { stackChallenge.start(); }
                 }, 50);
             }
         } else {
             // Si no hay tutorial activo, iniciar/resetear desafío normal.
             if (stackChallenge.isActive()) { stackChallenge.reset(); } else { stackChallenge.start(); }
         }
    });

     // Manejador botón Iniciar Tutorial
     startTutorialButton.addEventListener('click', function() {
         // Si desafío activo, salir del desafío antes de iniciar tutorial.
         if (stackChallenge.isActive && stackChallenge.isActive()) {
             if (confirm("Salir del desafío para iniciar el tutorial?")) {
                 stackChallenge.reset();
                 // Pequeño retardo
                 setTimeout(() => {
                    stackTutorial.startTutorial();
                 }, 50);
             }
         } else {
             // Si no hay desafío activo, iniciar tutorial normal.
             stackTutorial.startTutorial();
         }
     });
    // --- Fin Manejadores Eventos ---


    // --- Inicialización Vista ---
    renderStack(stack, stackContainer); // Renderizado inicial
    popButton.disabled = stack.isEmpty(); // Deshabilita Pop si está vacía al cargar
    // --- Fin Inicialización ---
});