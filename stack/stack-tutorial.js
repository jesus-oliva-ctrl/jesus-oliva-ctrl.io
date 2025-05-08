// stack/stack-tutorial.js
// Gestiona el tutorial interactivo de la Pila

/**
 * Clase para gestionar el tutorial interactivo de la Pila.
 */
export class StackTutorialManager {
    /**
     * @param {object} dependencies - Dependencias necesarias.
     * // Incluye explanationElement, stackInstance, uiElements (input, buttons, status, etc.), renderingFunctions, operationalFunctions
     */
    constructor(dependencies) {
        // Dependencias
        this.explanationElement = dependencies.explanationElement;
        this.stack = dependencies.stackInstance;
        this.vizContainer = dependencies.vizContainerElement;
        this.ui = dependencies.uiElements; // Contiene input, pushButton, popButton, challengeStatusElement, etc.
        this.renderViz = dependencies.renderingFunctions;
        this.ops = dependencies.operationalFunctions;

        this.currentStep = 0;
        this.tutorialActive = false;

        // Pasos del tutorial con texto, acción esperada, elemento a resaltar y texto de feedback
        this.tutorialSteps = [
            { text: "¡Bienvenido al tutorial interactivo de la Pila! La Pila es una estructura de datos fundamental que sigue una regla simple: LIFO." },
            { text: "LIFO significa 'Last-In, First-Out' (Último en Entrar, Primero en Salir). Imagina una pila de platos: solo puedes añadir o quitar platos de la parte superior." },
            { text: "La operación principal para añadir un elemento a la Pila se llama PUSH. Un PUSH siempre coloca el nuevo elemento en la CIMA de la pila." },
            { text: "La operación para remover un elemento de la Pila se llama POP. Un POP siempre remueve el elemento que está actualmente en la CIMA de la pila." },
            { text: "Debido a la regla LIFO, el último elemento que pusiste en la pila será el primero que puedas sacar con POP." },

            // --- Pasos interactivos ---
            {
                 text: "¡Ahora intentaremos hacer un PUSH! Ingresa un número en el campo de entrada y haz clic en el botón PUSH.",
                 expectedAction: 'push', // Espera la acción 'push' del usuario.
                 highlightElementId: 'stack-input', // Resaltar input
                 feedbackText: 'Ingresa un número en el campo de entrada y haz clic en PUSH.', // Instrucción inicial
            },
             { // Este paso se muestra *después* de un PUSH correcto
                  text: "¡Excelente! Acabas de añadir un elemento a la pila. Observa cómo se colocó en la cima.",
                  // No espera acción Push/Pop, el usuario hace clic en Siguiente.
                  highlightElementId: 'stack-container', // Resaltar la visualización
                  feedbackText: 'Haz clic en "Siguiente" para continuar.', // Instrucción para avanzar
             },
             {
                  text: "Ahora, intentemos otro PUSH para añadir un segundo elemento. Ingresa otro número y haz clic en PUSH.",
                  expectedAction: 'push',
                  highlightElementId: 'stack-input',
                  feedbackText: 'Ingresa otro número y haz clic en PUSH.',
             },
             { // Este paso se muestra *después* del segundo PUSH correcto
                  text: "¡Genial! Ya tienes dos elementos en la pila. Observa que el segundo elemento que pusiste está ahora en la cima.",
                  highlightElementId: 'stack-container',
                  feedbackText: 'Haz clic en "Siguiente" para continuar.',
             },
             {
                  text: "Ahora, vamos a usar POP para remover el elemento de la CIMA de la pila. Haz clic en el botón POP.",
                  expectedAction: 'pop', // Espera la acción 'pop' del usuario.
                  highlightElementId: 'stack-pop', // Resaltar botón POP
                  feedbackText: 'Haz clic en el botón POP para remover el elemento de la cima.', // Instrucción inicial
             },
             { // Este paso se muestra *después* del primer POP correcto
                  text: "¡Bien hecho! El elemento que estaba en la cima (el último que entró) fue el primero en salir.",
                  highlightElementId: 'stack-container',
                  feedbackText: 'Haz clic en "Siguiente" para continuar.',
             },
             {
                  text: "Intentemos otro POP para vaciar la pila. Haz clic en el botón POP de nuevo.",
                  expectedAction: 'pop',
                  highlightElementId: 'stack-pop',
                  feedbackText: 'Haz clic en el botón POP de nuevo.',
             },
             { // Este paso se muestra *después* del segundo POP correcto
                 text: "La pila está vacía de nuevo. ¡Has completado los pasos básicos de PUSH y POP!.",
                 highlightElementId: 'stack-container',
                 // Este es el último paso, el botón "Finalizar Tutorial" se añadirá automáticamente.
             },
        ];

        // Guardar contenido original para restaurar
        this.originalExplanationHTML = this.explanationElement.innerHTML;
        this.originalChallengeStatusHTML = this.ui.challengeStatusElement.innerHTML; // Guardar estado original del mensaje de estado
        this.originalChallengeStatusClass = this.ui.challengeStatusElement.className; // Guardar clases originales
    }

    isActive() {
        return this.tutorialActive;
    }

    startTutorial() {
        if (this.tutorialActive) return;
        console.log("Iniciando tutorial de Pila...");

        this.tutorialActive = true;
        this.currentStep = 0;

        // Ocultar o deshabilitar otros botones/elementos principales durante el tutorial
         this.ui.startChallengeButton.style.display = 'none';
         this.ui.resetButton.disabled = true; // Reset solo funciona vía gestor tutorial.
         this.ui.startTutorialButton.style.display = 'none'; // Ocultar botón iniciar tutorial

        // Limpiar la pila y visualizarla al inicio del tutorial
        this.stack.clear();
        this.renderViz.renderStack(this.stack, this.vizContainer);
        this.ui.popButton.disabled = this.stack.isEmpty(); // Asegurar estado correcto del botón Pop

        this.showStep(this.currentStep);
    }

    showStep(stepIndex) {
        // Limpiar cualquier resaltado y feedback del paso anterior
        this.clearHighlights();
        this.displayFeedback(''); // Limpiar mensaje de feedback

        if (stepIndex < 0 || stepIndex >= this.tutorialSteps.length) {
            this.endTutorial(); // Finalizar si no hay más pasos.
            return;
        }

        const step = this.tutorialSteps[stepIndex];

        // Mostrar texto del paso en el área de explicación
        this.explanationElement.innerHTML = `<h3>Tutorial Pila - Paso ${stepIndex + 1}</h3><p>${step.text}</p>`;

        // Controlar el estado de los botones y input
         this.ui.input.disabled = true;
         this.ui.pushButton.disabled = true;
         this.ui.popButton.disabled = true; // Deshabilitar por defecto, habilitar solo si el paso lo requiere y es posible

        // --- Lógica Interactiva del Paso ---
        if (step.hasOwnProperty('expectedAction')) { // Si el paso espera una acción Push/Pop
             // Habilitar elementos relevantes para la acción esperada
             if (step.expectedAction === 'push') {
                 this.ui.input.disabled = false; // Habilitar input
                 this.ui.pushButton.disabled = false; // Habilitar Push
                 // ui.popButton ya está deshabilitado
             } else if (step.expectedAction === 'pop') {
                 // Habilitar Pop SOLO si la pila REALMENTE no está vacía
                  this.ui.popButton.disabled = this.stack.isEmpty();
                  // Input y Push ya están deshabilitados
             }

             // Resaltar el elemento UI relevante para la acción esperada
             if (step.highlightElementId) {
                 this.highlightUIElement(step.highlightElementId);
             }
             // Mostrar el texto de feedback como instrucción
             if (step.feedbackText) {
                 this.displayFeedback(step.feedbackText);
             }

         } else { // Si el paso NO espera una acción Push/Pop (solo lectura + Siguiente)
             // Asegurarse de que los botones de operación estén deshabilitados
             this.ui.input.disabled = true;
             this.ui.pushButton.disabled = true;
             this.ui.popButton.disabled = true;

             // Resaltar el elemento UI relevante para la observación (si lo hay)
             if (step.highlightElementId) {
                this.highlightUIElement(step.highlightElementId);
             }
             // Mostrar el texto de feedback como instrucción/observación
             if (step.feedbackText) {
                 this.displayFeedback(step.feedbackText);
             }

             // Añadir botón Siguiente si no es el último paso
            if (stepIndex < this.tutorialSteps.length - 1) {
                const nextButton = document.createElement('button');
                nextButton.id = 'tutorial-next-step-btn';
                nextButton.textContent = 'Siguiente';
                nextButton.classList.add('action-btn');
                this.explanationElement.appendChild(nextButton);
                nextButton.addEventListener('click', () => this.nextStep());
            } else { // Si es el último paso no interactivo, añadir botón Finalizar
                const endButton = document.createElement('button');
                endButton.id = 'tutorial-end-btn';
                endButton.textContent = 'Finalizar Tutorial';
                endButton.classList.add('reset-btn');
                this.explanationElement.appendChild(endButton);
                endButton.addEventListener('click', () => this.endTutorial());
            }
         }
        // --- Fin Lógica Interactiva del Paso ---
    }

    nextStep() {
         // Limpiar resaltados y feedback antes de avanzar
         this.clearHighlights();
         this.displayFeedback('');

        // Remover botón Siguiente/Finalizar del paso actual
         const existingButton = this.explanationElement.querySelector('#tutorial-next-step-btn, #tutorial-end-btn');
         if (existingButton) existingButton.remove();

        this.currentStep++;
        this.showStep(this.currentStep); // Mostrar el próximo paso.
    }

    endTutorial() {
        console.log("Tutorial de Pila finalizado.");
        this.tutorialActive = false;
        this.currentStep = 0;

        // Limpiar resaltados y feedback finales
        this.clearHighlights();
        this.displayFeedback('');

        // Restaurar contenido original de la explicación y el estado del mensaje de desafío
        this.explanationElement.innerHTML = this.originalExplanationHTML;
        this.ui.challengeStatusElement.innerHTML = this.originalChallengeStatusHTML;
        this.ui.challengeStatusElement.className = this.originalChallengeStatusClass;


        // Asegurar que elementos ocultos/deshabilitados se restauren a su estado normal
         this.ui.startChallengeButton.style.display = '';
         this.ui.resetButton.disabled = false; // Habilitar Reset general
         this.ui.startTutorialButton.style.display = ''; // Mostrar botón iniciar tutorial


         // Limpiar pila visual y DS al finalizar el tutorial
        this.stack.clear();
        this.renderViz.renderStack(this.stack, this.vizContainer);
        // Asegurar estado correcto de los botones de operación basado en la pila vacía
        this.ui.input.disabled = false;
        this.ui.pushButton.disabled = false;
        this.ui.popButton.disabled = this.stack.isEmpty();
    }

    reset() {
         if (this.tutorialActive) {
             console.log("Reseteando tutorial de Pila.");
             // Limpiar estado intermedio si lo hay
             // this.userDidPushForTutorial = false;

             // Limpiar resaltados y feedback
             this.clearHighlights();
             this.displayFeedback('');

             this.currentStep = 0; // Volver al primer paso.

              // Remover botón Siguiente/Finalizar
             const existingButton = this.explanationElement.querySelector('#tutorial-next-step-btn, #tutorial-end-btn');
             if (existingButton) existingButton.remove();

             // Limpiar la pila y visualizarla
             this.stack.clear();
             this.renderViz.renderStack(this.stack, this.vizContainer);
             this.ui.popButton.disabled = this.stack.isEmpty(); // Asegurar estado Pop

             // Mostrar el primer paso de nuevo y configurar UI
             this.showStep(this.currentStep);

             // Los botones de operación/desafío se gestionan en showStep.
         }
         // Si el tutorial no estaba activo, el reset general (en stack.js) ya maneja todo.
         // Nota: El botón Reset general en stack.js llama a stackTutorial.reset() SI tutorial.isActive().
         // Y siempre limpia la pila visual/DS.
    }

    // Llamado desde stack.js cuando se hace Push/Pop durante el tutorial.
    handleOperation(operationType, value) {
        if (!this.tutorialActive) return;

        console.log(`Operación '${operationType}' detectada en el tutorial con valor: ${value} en el paso ${this.currentStep + 1}.`);

        const currentStep = this.tutorialSteps[this.currentStep];

        // Verificar si el paso espera una acción Y si la realizada coincide.
        if (currentStep.hasOwnProperty('expectedAction') && currentStep.expectedAction === operationType) {
            console.log(`¡Operación correcta para el paso ${this.currentStep + 1}!`);

            // Opcional: Verificar el valor si se espera uno específico.
            // if (currentStep.hasOwnProperty('expectedValue') && value !== currentStep.expectedValue) { ... }

            // Si la operación es correcta, ejecutar la operación real (si es Push, Pop ya se hizo en stack.js)
             if (operationType === 'push') {
                 this.ops.addElement(value); // Llama a la función addElement del controlador (actualiza DS/Viz)
             }
             // Si es Pop, removeElement ya se ejecutó en stack.js antes de llamar a handleOperation.

            // Limpiar feedback de éxito (opcional, se limpia en nextStep)
            // this.displayFeedback('');
            // this.clearHighlights(); // Se limpian en nextStep

            // Avanzar al siguiente paso.
            this.nextStep();

        } else {
            // Operación incorrecta para este paso.
            console.warn(`Operación incorrecta. Esperado: '${currentStep.expectedAction}', Realizado: '${operationType}' en el paso ${this.currentStep + 1}.`);
             // Dar feedback visual al usuario. Usar el feedbackText del paso o un mensaje genérico.
             this.displayFeedback(currentStep.feedbackText || `Operación incorrecta. Esperado: ${currentStep.expectedAction}.`); // Mostrar mensaje de error
             this.ui.challengeStatusElement.classList.add('challenge-error'); // Opcional: añadir clase de error temporalmente
             // El resaltado y el texto del paso actual NO se limpian.
        }
    }

    // Método para añadir una clase de resaltado a un elemento por su ID
     highlightUIElement(elementId, className = 'tutorial-highlight') {
         const element = document.getElementById(elementId);
         if (element) {
             element.classList.add(className);
         } else {
             console.warn(`Elemento con ID ${elementId} no encontrado para resaltar.`);
         }
     }

     // Método para limpiar todos los elementos que tengan la clase de resaltado
     clearHighlights(className = 'tutorial-highlight') {
         // Selecciona todos los elementos que tienen la clase de resaltado en la vista de la Pila
         // Podríamos ser más específicos si es necesario (ej. dentro de visualization-container)
         const highlightedElements = document.querySelectorAll(`.${className}`);
         highlightedElements.forEach(element => {
             element.classList.remove(className);
         });
     }

     // Método para mostrar feedback en el elemento de estado del desafío
     displayFeedback(message, className = '') {
         this.ui.challengeStatusElement.textContent = message;
     }
}