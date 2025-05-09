// queue/queue-tutorial.js
// Gestiona el tutorial interactivo de la Cola

// --- Importaciones ---
import { renderQueue, highlightFront, highlightRear, clearQueueHighlights } from './queue-rendering.js'; // Necesita funciones de renderizado y resaltado
// No necesita importar Queue porque recibe la instancia.
// No necesita importar MiniGameManager porque interactúa con el controlador principal (queue.js)
// --- Fin Importaciones ---

/**
 * Clase para gestionar el tutorial interactivo de la Cola.
 */
export class QueueTutorialManager {
    /**
     * @param {object} dependencies - Dependencias necesarias.
     * // Incluye explanationElement, tutorialTitleElement, tutorialContentElement, tutorialButtonsContainer,
     * // queueInstance, vizContainerElement, uiElements (input, buttons, status, etc.),
     * // renderingFunctions, operationalFunctions
     */
    constructor(dependencies) {
        // Dependencias
        this.explanationElement = dependencies.explanationElement; // Contenedor padre del tutorial (#queue-tutorial-container)
        this.tutorialTitleElement = dependencies.tutorialTitleElement; // Elemento título (#queue-tutorial-title)
        this.tutorialContentElement = dependencies.tutorialContentElement; // Elemento contenido (#queue-tutorial-content)
        this.tutorialButtonsContainer = dependencies.tutorialButtonsContainer; // Contenedor de botones (.tutorial-buttons)

        this.queue = dependencies.queueInstance; // Instancia de la cola principal
        this.vizContainer = dependencies.vizContainerElement; // Contenedor visualización principal (#queue-container)

        // Elementos UI relevantes para interactuar o des/habilitar
        this.ui = dependencies.uiElements; // Contiene input, enqueueButton, dequeueButton, resetButton, startMinigameButton, startTutorialButton, feedbackElement

        this.renderViz = dependencies.renderingFunctions; // Contiene renderQueue
        // Contiene highlightFront, highlightRear, clearQueueHighlights
        this.highlightViz = dependencies.highlightingFunctions;

        this.ops = dependencies.operationalFunctions; // Contiene referencias a addElement, removeElement (métodos del controlador queue.js)

        this.currentStep = 0;
        this.tutorialActive = false;

         // Botones de navegación del tutorial (Crearemos y adjuntaremos referencias)
        this.prevButton = null;
        this.nextButton = null;


        // Pasos del tutorial con texto, acción esperada, elemento a resaltar y texto de feedback
        // Adaptado para ser interactivo, similar al tutorial de Pila.
        this.tutorialSteps = [
            {
                 title: "¡Bienvenido al tutorial interactivo de la Cola!",
                 text: "La Cola es una estructura de datos que sigue una regla simple: FIFO.",
                 highlightElementId: null, expectedAction: null
            },
            {
                 title: "Principio FIFO",
                 text: "FIFO significa 'First-In, First-Out' (Primero en Entrar, Primero en Salir). Imagina una fila en un supermercado: la primera persona en la fila es la primera en ser atendida.",
                 highlightElementId: 'queue-container', expectedAction: null
            },
            {
                 title: "Operación ENQUEUE",
                 text: "La operación para añadir un elemento a la Cola se llama ENQUEUE. Un ENQUEUE siempre añade el nuevo elemento al FINAL de la cola.",
                 highlightElementId: 'queue-input', expectedAction: 'enqueue', feedbackText: 'Ingresa un número en el campo de entrada y haz clic en el botón ENQUEUE.'
            },
            { // Este paso se muestra *después* de un ENQUEUE correcto
                 title: "ENQUEUE Exitoso",
                 text: "¡Muy bien! Acabas de añadir un elemento al final de la cola. Observa su posición.",
                 highlightElementId: 'queue-container', expectedAction: null, feedbackText: 'Haz clic en "Siguiente" para continuar.'
            },
             {
                  title: "Otro ENQUEUE",
                  text: "Añadamos otro elemento. Ingresa un número diferente y haz clic en ENQUEUE de nuevo.",
                  highlightElementId: 'queue-input', expectedAction: 'enqueue', feedbackText: 'Ingresa otro número y haz clic en ENQUEUE.'
             },
             { // Este paso se muestra *después* del segundo ENQUEUE correcto
                  title: "Dos Elementos",
                  text: "Excelente. El segundo elemento también se añadió al final. El primer elemento que añadiste sigue estando en el frente.",
                  highlightElementId: 'queue-container', expectedAction: null, feedbackText: 'Haz clic en "Siguiente" para continuar.'
             },
             {
                  title: "Operación DEQUEUE",
                  text: "Ahora, vamos a usar DEQUEUE para remover el elemento del FRENTE de la cola. Haz clic en el botón DEQUEUE.",
                  highlightElementId: 'queue-dequeue', expectedAction: 'dequeue', feedbackText: 'Haz clic en el botón DEQUEUE para remover el elemento del frente.'
             },
             { // Este paso se muestra *después* del primer DEQUEUE correcto
                  title: "DEQUEUE Exitoso",
                  text: "¡Correcto! El elemento que estaba en el frente (el primero que entró) fue el primero en salir.",
                  highlightElementId: 'queue-container', expectedAction: null, feedbackText: 'Haz clic en "Siguiente" para continuar.'
             },
             {
                  title: "Último DEQUEUE",
                  text: "Intentemos otro DEQUEUE. Haz clic en el botón DEQUEUE de nuevo.",
                  highlightElementId: 'queue-dequeue', expectedAction: 'dequeue', feedbackText: 'Haz clic en el botón DEQUEUE de nuevo.'
             },
             { // Este paso se muestra *después* del segundo DEQUEUE correcto
                 title: "Tutorial Completado",
                 text: "La cola está vacía de nuevo. ¡Has completado los pasos básicos de ENQUEUE y DEQUEUE!.",
                 highlightElementId: 'queue-container', expectedAction: null
                 // Este es el último paso.
             },
        ];

         // Guardar estado original de elementos para restaurar al finalizar (similar a Stack)
         // Aunque ahora gestionamos contenido dinámico en el tutorialContainer,
         // necesitamos referencias a los elementos UI que controlamos (botones op, etc)
         // y al estado de feedback/status fuera del tutorial.
         this.originalFeedbackHTML = this.ui.feedbackElement.innerHTML;
         this.originalFeedbackClass = this.ui.feedbackElement.className;
         // Nota: La sección de cola no tiene challengeStatusElement por diseño (tiene minijuego).
         // Usaremos el feedbackElement general para mensajes de tutorial.
    }

    isActive() {
        return this.tutorialActive;
    }

    startTutorial() {
        if (this.tutorialActive) return;
        console.log("Iniciando tutorial de Cola...");

        this.tutorialActive = true;
        this.currentStep = 0;

        // Limpiar la cola y visualizarla al inicio del tutorial
        this.queue.clear();
        this.renderViz.renderQueue(this.queue, this.vizContainer, 'queue-element'); // Renderizar cola principal

        // Ocultar o deshabilitar otros botones/elementos principales durante el tutorial
         this.ui.startMinigameButton.style.display = 'none'; // Ocultar botón inicio minijuego
         // this.ui.resetButton.disabled = true; // El reset general lo gestiona queue.js
         this.ui.startTutorialButton.style.display = 'none'; // Ocultar botón iniciar tutorial

         // Limpiar feedback general al inicio del tutorial
         this.displayFeedback('', '');

        // Configurar botones de navegación del tutorial (Crear si no existen)
        this.setupTutorialButtons();


        this.showStep(this.currentStep); // Mostrar el primer paso.
    }

     setupTutorialButtons() {
          // Remover botones existentes si hay (de una ejecución previa)
          const existingPrev = this.tutorialButtonsContainer.querySelector('#queue-tutorial-prev');
          const existingNext = this.tutorialButtonsContainer.querySelector('#queue-tutorial-next');

          if (!existingPrev) {
              this.prevButton = document.createElement('button');
              this.prevButton.id = 'queue-tutorial-prev';
              this.prevButton.classList.add('btn', 'btn-outline');
              this.prevButton.innerHTML = '<i class="fas fa-arrow-left"></i> Anterior';
              this.tutorialButtonsContainer.appendChild(this.prevButton);
              this.prevButton.addEventListener('click', () => this.prevStep());
          } else {
              this.prevButton = existingPrev;
          }

          if (!existingNext) {
             this.nextButton = document.createElement('button');
             this.nextButton.id = 'queue-tutorial-next';
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
        this.tutorialTitleElement.textContent = `Tutorial Cola - Paso ${stepIndex + 1}`;
        this.tutorialContentElement.textContent = step.text;

         // Controlar el estado de los botones y input de OPERACIÓN (Enqueue/Dequeue)
         // Deshabilitar por defecto, habilitar solo si el paso espera una acción
         this.ui.input.disabled = true;
         this.ui.enqueueButton.disabled = true;
         this.ui.dequeueButton.disabled = true;

        // --- Lógica Interactiva del Paso ---
        if (step.hasOwnProperty('expectedAction') && step.expectedAction !== null) { // Si el paso espera una acción
             // Habilitar elementos relevantes para la acción esperada
             if (step.expectedAction === 'enqueue') {
                 this.ui.input.disabled = false; // Habilitar input
                 this.ui.enqueueButton.disabled = false; // Habilitar Enqueue
                 // ui.dequeueButton ya está deshabilitado
             } else if (step.expectedAction === 'dequeue') {
                  // Habilitar Dequeue SOLO si la cola REALMENTE no está vacía
                  this.ui.dequeueButton.disabled = this.queue.isEmpty();
                  // Input y Enqueue ya están deshabilitados
             }

             // Resaltar el elemento UI relevante para la acción esperada
             if (step.highlightElementId) {
                 this.highlightUIElement(step.highlightElementId);
             }
             // Mostrar el texto de feedback como instrucción
             if (step.feedbackText) {
                 this.displayFeedback(`Tutorial: ${step.feedbackText}`, ''); // Mostrar en el área de feedback general
             }

             // Ocultar los botones de navegación del tutorial mientras se espera una acción
             this.prevButton.style.display = 'none';
             this.nextButton.style.display = 'none';

         } else { // Si el paso NO espera una acción (solo lectura + Siguiente/Finalizar)
             // Asegurarse de que los botones de operación estén deshabilitados
             this.ui.input.disabled = true;
             this.ui.enqueueButton.disabled = true;
             this.ui.dequeueButton.disabled = true;

             // Resaltar el elemento UI relevante para la observación (si lo hay)
             if (step.highlightElementId) {
                this.highlightUIElement(step.highlightElementId);
             }
             // Mostrar el texto de feedback como instrucción/observación
             if (step.feedbackText) {
                 this.displayFeedback(`Tutorial: ${step.feedbackText}`, '');
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
         this.displayFeedback('', '');

        this.currentStep++;
        this.showStep(this.currentStep);
    }

    prevStep() {
        // Limpiar resaltados y feedback antes de retroceder
        this.clearHighlights();
        this.displayFeedback('', '');

        this.currentStep--;
        this.showStep(this.currentStep);
    }


    endTutorial() {
        console.log("Tutorial de Cola finalizado.");
        this.tutorialActive = false;
        this.currentStep = 0;

        // Limpiar resaltados y feedback finales
        this.clearHighlights();
        this.displayFeedback('', '');

        // Restaurar contenido original de la explicación/título del tutorial
        this.tutorialTitleElement.textContent = 'Tutorial Cola Finalizado'; // Título final
        this.tutorialContentElement.textContent = 'Puedes explorar las operaciones básicas o intentar el mini-juego.'; // Contenido final

        // Ocultar botones de navegación del tutorial al finalizar
        if (this.prevButton) this.prevButton.style.display = 'none';
        if (this.nextButton) this.nextButton.style.display = 'none';


        // Restaurar elementos UI que fueron ocultados/deshabilitados
         this.ui.startMinigameButton.style.display = ''; // Mostrar botón inicio mini-juego
         // this.ui.resetButton.disabled = false; // El Reset general se maneja en queue.js
         this.ui.startTutorialButton.style.display = ''; // Mostrar botón iniciar tutorial


         // Limpiar cola visual y DS al finalizar el tutorial
        this.queue.clear();
        this.renderViz.renderQueue(this.queue, this.vizContainer, 'queue-element'); // Renderizar cola principal
        // Asegurar estado correcto de los botones de operación basado en la cola vacía
        this.ui.input.disabled = false;
        this.ui.enqueueButton.disabled = false;
        this.ui.dequeueButton.disabled = this.queue.isEmpty();

         // Limpiar feedback general
        this.ui.feedbackElement.innerHTML = this.originalFeedbackHTML;
        this.ui.feedbackElement.className = this.originalFeedbackClass;

    }

    reset() {
         if (this.tutorialActive) {
             console.log("Reseteando tutorial de Cola.");
             // Limpiar estado intermedio si lo hay

             // Limpiar resaltados y feedback
             this.clearHighlights();
             this.displayFeedback('', '');

             this.currentStep = 0; // Volver al primer paso.

             // Ocultar botones de navegación del tutorial temporalmente hasta que se muestre el paso
             if (this.prevButton) this.prevButton.style.display = 'none';
             if (this.nextButton) this.nextButton.style.display = 'none';

             // Limpiar la cola y visualizarla
             this.queue.clear();
             this.renderViz.renderQueue(this.queue, this.vizContainer, 'queue-element');
             this.ui.dequeueButton.disabled = this.queue.isEmpty(); // Asegurar estado Dequeue

             // Mostrar el primer paso de nuevo y configurar UI
             this.showStep(this.currentStep);

             // Los botones de operación/minijuego se gestionan en showStep.
         }
         // Si el tutorial no estaba activo, el reset general (en queue.js) ya maneja todo.
    }

    // Llamado desde queue.js cuando se hace Enqueue/Dequeue durante el tutorial.
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

     // Método para limpiar todos los elementos que tengan la clase de resaltado dentro de la sección de cola
     clearHighlights(className = 'tutorial-highlight') {
         const queueSection = document.getElementById('queue-section'); // Limitar la búsqueda a la sección actual
         if (queueSection) {
            const highlightedElements = queueSection.querySelectorAll(`.${className}`);
            highlightedElements.forEach(element => {
                element.classList.remove(className);
            });
         }
         // También limpiar resaltados específicos de visualización (frente/final) si fueron aplicados
         this.highlightViz.clearQueueHighlights(this.vizContainer, className);
     }

     // Método para mostrar feedback en el elemento de feedback general de la Cola
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