// stack/stack-tutorial.js
// Gestiona el tutorial interactivo de la Pila - Contenido original (con adaptaciones para nueva UI)

import { renderStack } from './stack-rendering.js'; // Necesita la función de renderizado
// No necesita importar Stack porque recibe la instancia.
// No necesita importar ThreeStackChallengeManager ni UI porque interactúa con el controlador principal (stack.js)

/**
 * Clase para gestionar el tutorial interactivo de la Pila.
 */
export class StackTutorialManager {
    /**
     * @param {object} dependencies - Dependencias necesarias.
     * // Incluye explanationElement, stackInstance, vizContainerElement, uiElements (input, buttons, status, etc.), renderingFunctions, operationalFunctions
     */
    constructor(dependencies) {
        // Dependencias
        this.explanationElement = dependencies.explanationElement; // Contenedor para el texto del tutorial (#stack-tutorial-container)
        this.tutorialTitleElement = dependencies.tutorialTitleElement; // Elemento para el título (#stack-tutorial-title)
        this.tutorialContentElement = dependencies.tutorialContentElement; // Elemento para el contenido (#stack-tutorial-content)
        this.tutorialButtonsContainer = dependencies.tutorialButtonsContainer; // Contenedor para botones tutorial (.tutorial-buttons)

        this.stack = dependencies.stackInstance; // Instancia de la pila principal
        this.vizContainer = dependencies.vizContainerElement; // Contenedor visualización principal (#stack-container)

        // Elementos UI relevantes para interactuar o des/habilitar
        this.ui = dependencies.uiElements; // Contiene input, pushButton, popButton, resetButton, startChallengeButton, startTutorialButton, challengeStatusElement, feedbackElement, etc.

        this.renderViz = dependencies.renderingFunctions; // Contiene renderStack
        this.ops = dependencies.operationalFunctions; // Contiene referencias a addElement, removeElement (métodos del controlador stack.js)

        this.currentStep = 0;
        this.tutorialActive = false;

        // Botones de navegación del tutorial (los crearemos y adjuntaremos)
        this.prevButton = null;
        this.nextButton = null; // Este botón cambiará a "Siguiente" o "Finalizar"

        // Pasos del tutorial con texto, acción esperada, elemento a resaltar y texto de feedback
        // Adaptado para usar los IDs del nuevo HTML y la estructura original de interactividad
        this.tutorialSteps = [
            {
                 title: "¡Bienvenido al tutorial interactivo de la Pila!",
                 text: "La Pila es una estructura de datos fundamental que sigue una regla simple: LIFO.",
                 highlightElementId: null, expectedAction: null
            },
            {
                 title: "Principio LIFO",
                 text: "LIFO significa 'Last-In, First-Out' (Último en Entrar, Primero en Salir). Imagina una pila de platos: solo puedes añadir o quitar platos de la parte superior.",
                 highlightElementId: 'stack-container', expectedAction: null
            },
            {
                 title: "Operación PUSH",
                 text: "La operación principal para añadir un elemento a la Pila se llama PUSH. Un PUSH siempre coloca el nuevo elemento en la CIMA de la pila.",
                 highlightElementId: 'stack-input', expectedAction: 'push', feedbackText: 'Ingresa un número en el campo de entrada y haz clic en el botón PUSH.'
            },
             { // Este paso se muestra *después* de un PUSH correcto (se llega aquí llamando nextStep desde handleOperation)
                  title: "PUSH Exitoso",
                  text: "¡Excelente! Acabas de añadir un elemento a la pila. Observa cómo se colocó en la cima.",
                  highlightElementId: 'stack-container', expectedAction: null, feedbackText: 'Haz clic en "Siguiente" para continuar.'
             },
             {
                  title: "Otro PUSH",
                  text: "Ahora, intentemos otro PUSH para añadir un segundo elemento. Ingresa otro número y haz clic en PUSH.",
                  highlightElementId: 'stack-input', expectedAction: 'push', feedbackText: 'Ingresa otro número y haz clic en PUSH.'
             },
             { // Este paso se muestra *después* del segundo PUSH correcto
                  title: "Dos Elementos",
                  text: "¡Genial! Ya tienes dos elementos en la pila. Observa que el segundo elemento que pusiste está ahora en la cima.",
                  highlightElementId: 'stack-container', expectedAction: null, feedbackText: 'Haz clic en "Siguiente" para continuar.'
             },
             {
                  title: "Operación POP",
                  text: "Ahora, vamos a usar POP para remover el elemento de la CIMA de la pila. Haz clic en el botón POP.",
                  highlightElementId: 'stack-pop', expectedAction: 'pop', feedbackText: 'Haz clic en el botón POP para remover el elemento de la cima.'
             },
             { // Este paso se muestra *después* del primer POP correcto
                  title: "POP Exitoso",
                  text: "¡Bien hecho! El elemento que estaba en la cima (el último que entró) fue el primero en salir.",
                  highlightElementId: 'stack-container', expectedAction: null, feedbackText: 'Haz clic en "Siguiente" para continuar.'
             },
             {
                  title: "Último POP",
                  text: "Intentemos otro POP para vaciar la pila. Haz clic en el botón POP de nuevo.",
                  highlightElementId: 'stack-pop', expectedAction: 'pop', feedbackText: 'Haz clic en el botón POP de nuevo.'
             },
             { // Este paso se muestra *después* del segundo POP correcto
                 title: "Tutorial Completado",
                 text: "La pila está vacía de nuevo. ¡Has completado los pasos básicos de PUSH y POP!.",
                 highlightElementId: 'stack-container', expectedAction: null
                 // Este es el último paso.
             },
        ];

        // Guardar estado original de los elementos para restaurar al finalizar.
        this.originalExplanationHTML = this.explanationElement.innerHTML; // Aunque ahora gestionamos contenido dinámico, guardamos la estructura base.
        this.originalChallengeStatusHTML = this.ui.challengeStatusElement.innerHTML; // Guardar estado original del mensaje de estado del desafío
        this.originalChallengeStatusClass = this.ui.challengeStatusElement.className; // Guardar clases originales
        this.originalFeedbackHTML = this.ui.feedbackElement.innerHTML; // Guardar feedback original
        this.originalFeedbackClass = this.ui.feedbackElement.className; // Guardar clases feedback
    }

    isActive() {
        return this.tutorialActive;
    }

    startTutorial() {
        if (this.tutorialActive) return;
        console.log("Iniciando tutorial de Pila...");

        this.tutorialActive = true;
        this.currentStep = 0;

        // Limpiar la pila y visualizarla al inicio del tutorial
        this.stack.clear();
        this.renderViz.renderStack(this.stack, this.vizContainer); // Renderizar pila principal

        // Ocultar o deshabilitar otros botones/elementos principales durante el tutorial
         this.ui.startChallengeButton.style.display = 'none'; // Ocultar botón inicio desafío
         // El resetButton general debería ser manejado por el controlador principal, no aquí directamente
         // this.ui.resetButton.disabled = true;
         this.ui.startTutorialButton.style.display = 'none'; // Ocultar botón iniciar tutorial

         // Limpiar feedback general al inicio del tutorial
         this.displayFeedback('', '');


        // Configurar botones de navegación del tutorial (Crear si no existen)
        this.setupTutorialButtons();

        this.showStep(this.currentStep); // Mostrar el primer paso.
    }

    setupTutorialButtons() {
         // Remover botones existentes si hay (de una ejecución previa)
         const existingPrev = this.tutorialButtonsContainer.querySelector('#stack-tutorial-prev');
         const existingNext = this.tutorialButtonsContainer.querySelector('#stack-tutorial-next');

         if (!existingPrev) {
             this.prevButton = document.createElement('button');
             this.prevButton.id = 'stack-tutorial-prev';
             this.prevButton.classList.add('btn', 'btn-outline');
             this.prevButton.innerHTML = '<i class="fas fa-arrow-left"></i> Anterior';
             this.tutorialButtonsContainer.appendChild(this.prevButton);
             this.prevButton.addEventListener('click', () => this.prevStep());
         } else {
             this.prevButton = existingPrev;
         }

         if (!existingNext) {
            this.nextButton = document.createElement('button');
            this.nextButton.id = 'stack-tutorial-next';
            this.nextButton.classList.add('btn', 'btn-primary');
            this.nextButton.innerHTML = 'Siguiente <i class="fas fa-arrow-right"></i>';
            this.tutorialButtonsContainer.appendChild(this.nextButton);
            this.nextButton.addEventListener('click', () => this.nextStep());
         } else {
             this.nextButton = existingNext;
         }
    }


    showStep(stepIndex) {
        // Limpiar cualquier resaltado y feedback del paso anterior
        this.clearHighlights();
        this.displayFeedback('', ''); // Limpiar mensaje de feedback del tutorial

        if (stepIndex < 0 || stepIndex >= this.tutorialSteps.length) {
            this.endTutorial(); // Finalizar si no hay más pasos.
            return;
        }

        const step = this.tutorialSteps[stepIndex];

        // Mostrar título y texto del paso
        this.tutorialTitleElement.textContent = `Tutorial Pila - Paso ${stepIndex + 1}`;
        this.tutorialContentElement.textContent = step.text;

        // Controlar el estado de los botones y input de OPERACIÓN (Push/Pop)
         // Deshabilitar por defecto, habilitar solo si el paso espera una acción Push/Pop
         this.ui.input.disabled = true;
         this.ui.pushButton.disabled = true;
         this.ui.popButton.disabled = true; // Deshabilita Pop por defecto

        // --- Lógica Interactiva del Paso ---
        if (step.hasOwnProperty('expectedAction') && step.expectedAction !== null) { // Si el paso espera una acción Push/Pop
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
                 this.displayFeedback(step.feedbackText, ''); // Mostrar en el área de feedback del tutorial
             }

             // Ocultar los botones de navegación del tutorial mientras se espera una acción
             this.prevButton.style.display = 'none';
             this.nextButton.style.display = 'none';

         } else { // Si el paso NO espera una acción Push/Pop (solo lectura + Siguiente/Finalizar)
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
                 this.displayFeedback(step.feedbackText, '');
             }

             // Mostrar los botones de navegación del tutorial
             this.prevButton.style.display = '';
             this.nextButton.style.display = '';

             // Ajustar el texto del botón 'nextButton' a 'Finalizar' si es el último paso
            if (stepIndex === this.tutorialSteps.length - 1) {
                this.nextButton.textContent = 'Finalizar Tutorial';
                this.nextButton.classList.remove('btn-primary');
                this.nextButton.classList.add('btn-outline'); // Usar estilo outline para finalizar
                 // El botón 'Anterior' aún debe ser visible si no es el primer paso
            } else {
                 this.nextButton.textContent = 'Siguiente';
                 this.nextButton.classList.remove('btn-outline');
                 this.nextButton.classList.add('btn-primary');
            }
         }

         // Actualizar estado del botón 'Anterior' siempre
         this.prevButton.disabled = this.currentStep === 0;

    }

    nextStep() {
         // Limpiar resaltados y feedback antes de avanzar
         this.clearHighlights();
         this.displayFeedback('', ''); // Limpiar mensaje de feedback

         // No necesitamos remover los botones, solo los ocultamos/mostramos y cambiamos texto.

        this.currentStep++;
        this.showStep(this.currentStep); // Mostrar el próximo paso.
    }

    prevStep() {
        // Limpiar resaltados y feedback antes de retroceder
        this.clearHighlights();
        this.displayFeedback('', '');

        this.currentStep--;
        this.showStep(this.currentStep); // Mostrar el paso anterior.
    }


    endTutorial() {
        console.log("Tutorial de Pila finalizado.");
        this.tutorialActive = false;
        this.currentStep = 0;

        // Limpiar resaltados y feedback finales
        this.clearHighlights();
        this.displayFeedback('', '');

        // Restaurar contenido original de la explicación y el estado del mensaje de desafío
        // Nota: La explicación ahora es gestionada dinámicamente, quizás solo queremos limpiar o mostrar un mensaje final.
        this.tutorialTitleElement.textContent = 'Tutorial Pila Finalizado'; // Título final
        this.tutorialContentElement.textContent = 'Puedes explorar las operaciones básicas o intentar el desafío.'; // Contenido final

        // Ocultar botones de navegación del tutorial al finalizar
        if (this.prevButton) this.prevButton.style.display = 'none';
        if (this.nextButton) this.nextButton.style.display = 'none';


        // Restaurar elementos UI que fueron ocultados/deshabilitados
         this.ui.startChallengeButton.style.display = ''; // Mostrar botón inicio desafío
         // this.ui.resetButton.disabled = false; // El Reset general se maneja en stack.js
         this.ui.startTutorialButton.style.display = ''; // Mostrar botón iniciar tutorial


         // Limpiar pila visual y DS al finalizar el tutorial
        this.stack.clear();
        this.renderViz.renderStack(this.stack, this.vizContainer);
        // Asegurar estado correcto de los botones de operación basado en la pila vacía
        this.ui.input.disabled = false;
        this.ui.pushButton.disabled = false;
        this.ui.popButton.disabled = this.stack.isEmpty();

        // Limpiar cualquier mensaje de estado del desafío que el tutorial haya usado temporalmente
        this.ui.challengeStatusElement.innerHTML = this.originalChallengeStatusHTML;
        this.ui.challengeStatusElement.className = this.originalChallengeStatusClass;
         // Limpiar feedback general
        this.ui.feedbackElement.innerHTML = this.originalFeedbackHTML;
        this.ui.feedbackElement.className = this.originalFeedbackClass;

    }

    reset() {
         if (this.tutorialActive) {
             console.log("Reseteando tutorial de Pila.");
             // Limpiar estado intermedio si lo hay

             // Limpiar resaltados y feedback
             this.clearHighlights();
             this.displayFeedback('', '');

             this.currentStep = 0; // Volver al primer paso.

             // Ocultar botones de navegación del tutorial temporalmente hasta que se muestre el paso
             if (this.prevButton) this.prevButton.style.display = 'none';
             if (this.nextButton) this.nextButton.style.display = 'none';

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
         // Y siempre limpia la pila visual/DS y restaura la UI general.
    }

    // Llamado desde stack.js cuando se hace Push/Pop durante el tutorial.
    handleOperation(operationType, value) {
        if (!this.tutorialActive) return false; // No hacer nada si el tutorial no está activo

        console.log(`Operación '${operationType}' detectada en el tutorial con valor: ${value} en el paso ${this.currentStep + 1}.`);

        const currentStep = this.tutorialSteps[this.currentStep];

        // Verificar si el paso espera una acción Y si la realizada coincide.
        if (currentStep.hasOwnProperty('expectedAction') && currentStep.expectedAction === operationType) {
            console.log(`¡Operación correcta para el paso ${this.currentStep + 1}!`);

            // Opcional: Verificar el valor si se espera uno específico.
            // if (currentStep.hasOwnProperty('expectedValue') && value !== currentStep.expectedValue) { ... }

            // Si la operación es correcta, avanzar al siguiente paso después de un pequeño retraso
            // para permitir que la visualización de la operación se complete si es animada.
            setTimeout(() => {
                 this.nextStep();
            }, 300); // Ajustar el retraso según la duración de las animaciones

            return true; // Indica que la operación fue manejada por el tutorial

        } else {
            // Operación incorrecta para este paso.
            console.warn(`Operación incorrecta. Esperado: '${currentStep.expectedAction}', Realizado: '${operationType}' en el paso ${this.currentStep + 1}.`);
             // Dar feedback visual al usuario. Usar el feedbackText del paso como pista o un mensaje genérico de error.
             const feedbackMsg = currentStep.feedbackText || `Operación incorrecta. Esperado: ${currentStep.expectedAction}.`;
             this.displayFeedback(`Tutorial: ${feedbackMsg}`, 'error'); // Mostrar mensaje de error

             // El resaltado y el texto del paso actual NO se limpian.
             return false; // Indica que la operación NO fue la esperada por el tutorial
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
         // Selecciona todos los elementos que tienen la clase de resaltado dentro de la sección de pila
         const stackSection = document.getElementById('stack-section'); // Limitar la búsqueda a la sección actual
         if (stackSection) {
            const highlightedElements = stackSection.querySelectorAll(`.${className}`);
            highlightedElements.forEach(element => {
                element.classList.remove(className);
            });
         }
     }

     // Método para mostrar feedback en el elemento de feedback general de la Pila
     displayFeedback(message, type) {
         const feedbackElement = this.ui.feedbackElement; // Usar la referencia pasada en dependencies
         feedbackElement.textContent = message;
         feedbackElement.className = 'feedback'; // Resetear clases
         if (type) {
             feedbackElement.classList.add(type); // Añadir clase de tipo (success, error)
         }
          // Mostrar el elemento si hay mensaje
         if (message) {
             feedbackElement.style.display = 'block';
         } else {
              feedbackElement.style.display = 'none';
         }

          // Ocultar automáticamente feedback de error/éxito después de unos segundos
          if (type === 'error' || type === 'success') {
              setTimeout(() => {
                  this.displayFeedback('', ''); // Limpiar el feedback
              }, 5000); // Ocultar después de 5 segundos
          }
     }
}