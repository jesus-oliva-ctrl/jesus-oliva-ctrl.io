// queue/queue.js
// Controlador principal para la vista de la Cola

// --- Importaciones ---
import { Queue } from './queue-logic.js'; // Lógica de la Cola
// Funciones de renderizado y resaltado
import { renderQueue, highlightFront, highlightRear, clearQueueHighlights } from './queue-rendering.js';
// Gestor de tutoriales
import { QueueTutorialManager } from './queue-tutorial.js';
// Gestor de mini-juego
import { QueueMinigame } from './queue-minigame.js';
// --- Fin Importaciones ---

// Exportar un objeto que contenga el método init para que app.js pueda llamarlo
export const queueModule = {
    // --- Elementos DOM (Generales y Tutorial) ---
    queueInput: null,
    enqueueButton: null,
    dequeueButton: null,
    resetButton: null, // Botón Reiniciar general
    queueContainer: null, // Contenedor visualización principal (exploración/tutorial)
    startTutorialButton: null, // Botón Iniciar Tutorial
    startMinigameButton: null, // Botón Iniciar Mini-juego (en lugar de desafío)
    feedbackElement: null, // Área de feedback general (.feedback)
    tutorialContainer: null, // Contenedor del tutorial (#queue-tutorial-container)
    tutorialTitleElement: null, // Elemento del título del tutorial (#queue-tutorial-title)
    tutorialContentElement: null, // Elemento del contenido del tutorial (#queue-tutorial-content)
    tutorialButtonsContainer: null, // Contenedor de los botones del tutorial (.tutorial-buttons)

    // --- Elementos DOM del Mini-juego (NUEVOS) ---
    minigameContainer: null, // Contenedor principal del mini-juego (#queue-game-container)
    gameTimerEl: null, // Elemento visual del temporizador (#queue-game-timer)
    gameScoreEl: null, // Elemento visual de la puntuación (#queue-game-score)
    primaryQueueEl: null, // Contenedor visual de la Cola Principal del juego (#primary-queue)
    secondaryQueueEl: null, // Contenedor visual de la Cola Secundaria del juego (#secondary-queue)
    divertButton: null, // Botón Desviar (#divert-task)
    reinsertButton: null, // Botón Reinsertar (#reinsert-task)
    startGameButton: null, // Botón Iniciar Juego (#start-game)
    resetGameButton: null, // Botón Reiniciar Juego (#reset-game)
    // --- Fin Elementos DOM del Mini-juego ---


    // --- Instancia DS (Cola principal para exploración/tutorial) ---
    queue: null,
    // --- Fin Instancia DS ---


    // --- Instancia Gestor Tutorial ---
    queueTutorial: null,
    // --- Fin Instancia Gestor Tutorial ---

    // --- Instancia Gestor Mini-juego ---
    queueMinigame: null,
    // --- Fin Instancia Gestor Mini-juego ---


    init() {
        console.log("Queue module initialization started.");

        // --- Obtener Elementos DOM ---
        this.queueInput = document.getElementById('queue-input');
        this.enqueueButton = document.getElementById('queue-enqueue');
        this.dequeueButton = document.getElementById('queue-dequeue');
        this.resetButton = document.getElementById('queue-reset'); // Botón Reiniciar general
        this.queueContainer = document.getElementById('queue-container'); // Contenedor visualización principal
        this.startTutorialButton = document.getElementById('queue-start-tutorial'); // Botón Iniciar Tutorial
        this.startMinigameButton = document.getElementById('queue-start-minigame'); // Botón Iniciar Mini-juego
        this.feedbackElement = document.getElementById('queue-feedback'); // Área de feedback general (.feedback)

        this.tutorialContainer = document.getElementById('queue-tutorial-container');
         // Los elementos de título, contenido y botones del tutorial están DENTRO del tutorialContainer
        this.tutorialTitleElement = this.tutorialContainer.querySelector('#queue-tutorial-title');
        this.tutorialContentElement = this.tutorialContainer.querySelector('#queue-tutorial-content');
        this.tutorialButtonsContainer = this.tutorialContainer.querySelector('.tutorial-buttons');


        // Elementos DOM del Mini-juego
        this.minigameContainer = document.getElementById('queue-game-container');
        this.gameTimerEl = document.getElementById('queue-game-timer');
        this.gameScoreEl = document.getElementById('queue-game-score');
        this.primaryQueueEl = document.getElementById('primary-queue');
        this.secondaryQueueEl = document.getElementById('secondary-queue');
        this.divertButton = document.getElementById('divert-task');
        this.reinsertButton = document.getElementById('reinsert-task');
        this.startGameButton = document.getElementById('start-game');
        this.resetGameButton = document.getElementById('reset-game');
        // --- Fin Obtener Elementos DOM ---


        // --- Instancia DS (Cola principal para exploración/tutorial) ---
        this.queue = new Queue();
        // --- Fin Instancia DS ---


        // --- Instancia Gestor Tutorial ---
        this.queueTutorial = new QueueTutorialManager({
            explanationElement: this.tutorialContainer,
            tutorialTitleElement: this.tutorialTitleElement,
            tutorialContentElement: this.tutorialContentElement,
            tutorialButtonsContainer: this.tutorialButtonsContainer,

            queueInstance: this.queue, // Pasa la instancia de la cola principal
            vizContainerElement: this.queueContainer, // Pasa el contenedor de visualización principal
            uiElements: { // Pasa los elementos UI relevantes para el tutorial y control de estado
                input: this.queueInput,
                enqueueButton: this.enqueueButton,
                dequeueButton: this.dequeueButton,
                resetButton: this.resetButton, // Pasar resetButton general
                startMinigameButton: this.startMinigameButton, // Pasar botón mini-juego
                startTutorialButton: this.startTutorialButton, // Pasar botón de inicio tutorial
                feedbackElement: this.feedbackElement, // Pasar elemento feedback general
            },
            renderingFunctions: { renderQueue: renderQueue }, // Pasa la función de renderizado general
            highlightingFunctions: { // Pasa las funciones de resaltado específicas de cola
                highlightFront: highlightFront,
                highlightRear: highlightRear,
                clearQueueHighlights: clearQueueHighlights
            },
            operationalFunctions: { // Pasa referencias a las funciones de operación (Enqueue/Dequeue) del controlador
                addElement: this.addElement.bind(this), // Usar .bind(this) para mantener el contexto
                removeElement: this.removeElement.bind(this),
            },
        });
        // --- Fin Instancia Gestor Tutorial ---

        // --- Instancia Gestor Mini-juego ---
        this.queueMinigame = new QueueMinigame({
            uiElements: { // Elementos UI específicos del minijuego
                timerEl: this.gameTimerEl,
                scoreEl: this.gameScoreEl,
                primaryQueueEl: this.primaryQueueEl,
                secondaryQueueEl: this.secondaryQueueEl,
                divertBtn: this.divertButton,
                reinsertBtn: this.reinsertButton,
                startBtn: this.startGameButton,
                resetBtn: this.resetGameButton,
            },
            generalUIElements: { feedbackElement: this.feedbackElement }, // Elementos UI generales
            // renderQueue ya se importa globalmente en este archivo y se usa en el manager
        });
        // --- Fin Instancia Gestor Mini-juego ---


        // --- Funciones para controlar el estado de los botones ---
        // Estas funciones son clave para la gestión de estado (exploración vs tutorial vs minijuego)

         // Habilita la UI normal (input, enqueue, dequeue, tutorial, reset principal)
        this.enableNormalUI = function() {
             this.queueInput.disabled = false;
             this.enqueueButton.disabled = false;
             // DequeueButton depende del estado de la cola principal (queue), se maneja en updateUI.
             this.resetButton.disabled = false; // El Reset general está siempre habilitado (o lo gestiona quien esté activo)
             this.startTutorialButton.style.display = ''; // Mostrar botón tutorial
             this.startMinigameButton.style.display = ''; // Mostrar botón mini-juego

             // Deshabilitar todos los botones y UI del mini-juego.
             this.minigameContainer.style.display = 'none'; // Ocultar contenedor del mini-juego
             this.queueMinigame.updateGameButtonStates(); // Asegurar que los botones del minijuego estén deshabilitados

             // Asegurar que el área de feedback general esté visible/limpia si nada está activo
              this.feedbackElement.style.display = 'none'; // Ocultar feedback general por defecto en modo normal

              // Restaurar texto del botón de mini-juego si no está activo
              if (!this.queueMinigame.isActive()) {
                  this.startMinigameButton.textContent = 'Iniciar Mini-juego';
              }
               // Restaurar texto del botón de tutorial si no está activo
               if (!this.queueTutorial.isActive()) {
                    this.startTutorialButton.textContent = 'Iniciar Tutorial Interactivo';
               }

        }.bind(this);

        // Deshabilita la UI normal durante tutorial o minijuego.
        this.disableNormalUI = function() {
            this.queueInput.disabled = true;
            this.enqueueButton.disabled = true;
            this.dequeueButton.disabled = true; // Deshabilita Dequeue
            this.resetButton.disabled = true; // Deshabilitar Reset general durante tutorial/minijuego

            // Ocultar botones que inician otros modos
            this.startTutorialButton.style.display = 'none';
            this.startMinigameButton.style.display = 'none';

             // Asegurar que el área de feedback general esté visible
             this.feedbackElement.style.display = 'block'; // Mostrar área de feedback para mensajes del tutorial/minijuego

        }.bind(this);


        // --- Funciones Operación/Visualización (para vista principal/tutorial) ---
        // Estas funciones Enqueue/Dequeue son usadas por la vista de exploración normal y el tutorial.
        // El mini-juego NO las usa.
        this.addElement = function(value) {
            if (value === '' || isNaN(value)) { this.showFeedback('¡Por favor, ingresa un número válido!', 'error'); return false; }
            const elementValue = parseInt(value, 10); // Asegurarse de parsear a entero

            // Enqueue DS (cola principal)
            this.queue.enqueue(elementValue);
            this.queueInput.value = ''; // Limpiar input

            // Renderiza para actualizar visualización
            renderQueue(this.queue, this.queueContainer, 'queue-element'); // Llama a renderQueue general

             // Habilitar Dequeue si la cola ya no está vacía.
             this.dequeueButton.disabled = this.queue.isEmpty();

             return true; // Operación exitosa
        }.bind(this);

        this.removeElement = function() {
            if (this.queue.isEmpty()) { this.showFeedback('¡La cola está vacía!', 'error'); return null; }

            // Dequeue DS (cola principal)
            const dequeuedValue = this.queue.dequeue();

            // Re-renderiza para actualizar visualización
            renderQueue(this.queue, this.queueContainer, 'queue-element'); // Re-renderiza cola principal


            // Deshabilita Dequeue si cola principal vacía
            this.dequeueButton.disabled = this.queue.isEmpty();

            return dequeuedValue; // Retorna el valor sacado
        }.bind(this);
        // --- Fin Funciones Operación/Visualización ---

         // Función para mostrar feedback general (usada por operaciones básicas y por gestores)
         this.showFeedback = function(message, type) {
             const feedbackElement = this.feedbackElement;
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
                      this.hideFeedback();
                  }, 5000); // Ocultar después de 5 segundos
              }
         }.bind(this); // Usar .bind(this)

         // Función para ocultar feedback general
         this.hideFeedback = function() {
             const feedbackElement = this.feedbackElement;
             feedbackElement.textContent = '';
             feedbackElement.className = 'feedback';
             feedbackElement.style.display = 'none';
         }.bind(this); // Usar .bind(this)


        // --- Manejadores Eventos ---

        // Manejador para la Cola principal (Input, Enqueue, Dequeue, Reset general)
        this.enqueueButton.addEventListener('click', () => {
            const value = this.queueInput.value.trim(); // Obtener valor del input

            // Si el tutorial está activo, pasar la operación al gestor del tutorial
            if (this.queueTutorial.isActive()) {
                 const handledByTutorial = this.queueTutorial.handleOperation('enqueue', value);
                 if (handledByTutorial) {
                      // Si el tutorial manejó la operación, el tutorial mismo actualizará la UI y el estado.
                       // Limpiar feedback general si el tutorial tuvo éxito
                       if (this.feedbackElement.classList.contains('success')) {
                           this.hideFeedback();
                       }
                 } else {
                      // Si el tutorial NO manejó la operación (porque fue incorrecta),
                      // el tutorial.handleOperation ya mostró feedback de error.
                      // No hacer la operación real aquí.
                 }
             } else if (this.queueMinigame.isActive()) {
                  // Botón Enqueue deshabilitado durante mini-juego
             } else {
                 // Modo de exploración normal
                 const success = this.addElement(value); // Realizar la operación normal
                 if (success) {
                      this.showFeedback(`Elemento ${value} agregado a la cola`, 'success');
                 }
             }
        });

        this.dequeueButton.addEventListener('click', () => {
             // Si el tutorial está activo, pasar la operación al gestor del tutorial
            if (this.queueTutorial.isActive()) {
                 // Primero, realizar la operación Dequeue "visualmente" y en la DS principal.
                 // El tutorial.handleOperation verificará si esta fue la acción correcta para el paso actual.
                 const dequeuedValue = this.removeElement(); // Realizar el dequeue visual y DS

                 if (dequeuedValue !== null) { // Si se sacó un elemento
                     const handledByTutorial = this.queueTutorial.handleOperation('dequeue', dequeuedValue);
                      if (handledByTutorial) {
                           // Tutorial manejó la operación.
                           // Limpiar feedback general si el tutorial tuvo éxito
                           if (this.feedbackElement.classList.contains('success')) {
                               this.hideFeedback();
                           }
                      } else {
                           // Tutorial NO manejó la operación (incorrecta). Ya mostró feedback de error.
                      }
                 } else {
                      // No se pudo hacer Dequeue (cola vacía). removeElement ya mostró feedback general.
                      // El tutorial.handleOperation no se llama si no se pudo hacer Dequeue.
                 }

             } else if (this.queueMinigame.isActive()) {
                  // Botón Dequeue deshabilitado durante mini-juego
             } else {
                 // Modo de exploración normal
                 const dequeuedValue = this.removeElement(); // Realizar la operación normal
                  if (dequeuedValue !== null) {
                      this.showFeedback(`Elemento ${dequeuedValue} eliminado de la cola`, 'success');
                  }
             }
        });


        // El botón Reiniciar general (resetButton) ahora debe resetear lo que esté activo.
        this.resetButton.addEventListener('click', () => {
             // Primero, verificar si algún modo (tutorial o minijuego) está activo.
             if (this.queueTutorial.isActive()) {
                 // Si el tutorial está activo, resetear el tutorial.
                 this.queueTutorial.reset();
                 // El reset del tutorial ya limpia la cola DS/visual y gestiona la UI.
                 // Asegurar que la UI normal se re-habilite al finalizar el reset del tutorial.
                 this.enableNormalUI(); // Re-habilitar UI normal
                 console.log("Resetting active tutorial.");
             } else if (this.queueMinigame.isActive()) {
                 // Si el mini-juego está activo, resetear el mini-juego.
                 this.queueMinigame.reset();
                 // El reset del mini-juego limpia sus colas DS/visualización y gestiona su UI.
                 // Asegurar que la UI normal se re-habilite al finalizar el reset del mini-juego.
                 this.enableNormalUI(); // Re-habilitar UI normal
                  console.log("Resetting active minigame.");
             } else {
                 // Si nada está activo, simplemente limpiar la cola principal y su UI.
                 this.queue.clear();
                 renderQueue(this.queue, this.queueContainer, 'queue-element'); // Re-renderizar cola principal
                 this.dequeueButton.disabled = this.queue.isEmpty(); // Deshabilita Dequeue si vacía
                 this.hideFeedback(); // Limpiar feedback general si estaba visible
                 this.enableNormalUI(); // Asegurar estado UI normal
                 console.log("Resetting main queue.");
             }
        });

        // Permitir Enqueue al presionar Enter en el input
        this.queueInput.addEventListener('keyup', (event) => {
             if (event.key === 'Enter') {
                   this.enqueueButton.click();
               }
           });


        // --- Manejadores de Eventos para el Mini-juego ---

        // Botón Iniciar Juego
        this.startGameButton.addEventListener('click', () => {
             // Si el juego ya está activo, este botón funciona como "Reiniciar Juego" (aunque Reset también existe)
             if (this.queueMinigame.isActive()) {
                 console.log("Clicked Iniciar Juego button (game active).");
                 // Si ya está activo, quizás no debería hacer nada o preguntar para reiniciar?
                 // La lógica del updateGameButtonStates debería deshabilitarlo si está activo.
                 // Sin embargo, si el botón dice "Jugar de Nuevo" (después de fin de juego), sí debe iniciar.
                 if (this.startGameButton.textContent === 'Jugar de Nuevo') {
                      this.queueMinigame.start(); // Iniciar de nuevo si terminó
                      this.disableNormalUI(); // Deshabilitar UI normal
                      this.minigameContainer.style.display = 'block'; // Mostrar contenedor del mini-juego
                       this.hideFeedback(); // Ocultar feedback general
                       console.log("Starting new game.");
                 } else {
                     console.log("Game is already active, button is likely disabled.");
                 }

             } else { // Juego no está activo
                  console.log("Clicked Iniciar Juego button (game inactive).");
                  // Si un tutorial está activo, preguntar antes de iniciar el juego
                  if (this.queueTutorial.isActive()) {
                     if (confirm("Salir del tutorial para iniciar el mini-juego?")) {
                         this.queueTutorial.endTutorial(); // Usar endTutorial para restaurar UI

                         // Esperar un poco para asegurar que la UI se restaure antes de iniciar el mini-juego
                         setTimeout(() => {
                             this.queueMinigame.start(); // Iniciar el mini-juego
                             this.disableNormalUI(); // Deshabilitar UI normal durante mini-juego
                              this.minigameContainer.style.display = 'block'; // Mostrar contenedor del mini-juego
                              this.hideFeedback(); // Ocultar feedback general
                             console.log("Starting minigame after exiting tutorial.");
                         }, 50);
                     }
                 } else {
                     // Si no hay tutorial activo, iniciar el mini-juego directamente
                     this.queueMinigame.start(); // Iniciar el mini-juego
                     this.disableNormalUI(); // Deshabilitar UI normal durante mini-juego
                      this.minigameContainer.style.display = 'block'; // Mostrar contenedor del mini-juego
                     this.hideFeedback(); // Ocultar feedback general
                     console.log("Starting minigame directly.");
                 }
            }
        });

        // Botón Reiniciar Juego (siempre resetea el juego si está activo o terminado)
        this.resetGameButton.addEventListener('click', () => {
             if (this.queueMinigame.isActive() || this.queueMinigame.gameTime <= 0) { // Si juego activo o terminado
                 console.log("Clicked Reiniciar Juego button.");
                 this.queueMinigame.reset(); // Resetear el mini-juego
                 this.enableNormalUI(); // Re-habilitar UI normal después del reset
                 this.minigameContainer.style.display = 'none'; // Ocultar contenedor del mini-juego
                 this.hideFeedback(); // Limpiar feedback general
             } else {
                  console.log("Reset Game button clicked, but game was not active or finished.");
                  // Si el botón está habilitado incorrectamente en otro estado, deshabilitarlo.
                  this.queueMinigame.updateGameButtonStates();
             }
        });


        // Botón Desviar Tarea (Mini-juego)
        this.divertButton.addEventListener('click', () => {
             console.log("Clicked Divert Task button.");
             if (this.queueMinigame.divertTask()) { // Intentar desviar
                 // Tarea desviada, updateGameButtonStates ya se llamó en divertTask
                 // renderGameQueues ya se llamó en divertTask
                 // feedback ya se llamó en divertTask
             } else {
                  console.log("Divert failed (likely primary queue empty).");
             }
        });

        // Botón Reinsertar Tarea (Mini-juego)
        this.reinsertButton.addEventListener('click', () => {
             console.log("Clicked Reinsert Task button.");
             if (this.queueMinigame.reinsertTask()) { // Intentar reinsertar
                 // Tarea reinsertada, updateGameButtonStates ya se llamó en reinsertTask
                 // renderGameQueues ya se llamó en reinsertTask
                 // feedback ya se llamó en reinsertTask
             } else {
                 console.log("Reinsert failed (likely secondary queue empty).");
             }
        });


        // Manejador botón Iniciar Tutorial
        this.startTutorialButton.addEventListener('click', () => {
             // Si hay un mini-juego activo, preguntar antes de iniciar el tutorial
             if (this.queueMinigame.isActive()) {
                 if (confirm("Salir del mini-juego para iniciar el tutorial?")) {
                     this.queueMinigame.reset(); // Resetear el mini-juego
                      // enableNormalUI() ya se llama al resetear minijuego.
                      this.minigameContainer.style.display = 'none'; // Ocultar contenedor del mini-juego

                     // Esperar un poco para asegurar que la UI se restaure antes de iniciar el tutorial
                     setTimeout(() => {
                        this.queueTutorial.startTutorial(); // Iniciar el tutorial
                        this.disableNormalUI(); // Deshabilitar UI normal durante tutorial
                        this.hideFeedback(); // Ocultar feedback general
                        console.log("Starting tutorial after exiting minigame.");
                     }, 50);
                 }
             } else if (this.queueTutorial.isActive()) {
                  // Si el tutorial ya está activo, este botón no debería ser visible,
                  // o podría usarse para resetear el tutorial actual si se prefiere.
                   console.log("Tutorial is already active.");
             }
              else {
                 // Si no hay mini-juego activo, iniciar el tutorial directamente
                 this.queueTutorial.startTutorial(); // Iniciar el tutorial
                 this.disableNormalUI(); // Deshabilitar UI normal durante tutorial
                 this.hideFeedback(); // Ocultar feedback general
                 console.log("Starting tutorial directly.");
             }
        });


        // --- Inicialización Vista (Cola principal) ---
        this.queue.clear(); // Asegurar que la cola principal esté vacía al iniciar el módulo
        renderQueue(this.queue, this.queueContainer, 'queue-element'); // Renderizado inicial de la cola principal
        this.dequeueButton.disabled = this.queue.isEmpty(); // Deshabilita Dequeue si vacía al cargar

        this.enableNormalUI(); // Asegurar que la UI normal esté habilitada inicialmente (oculta mini-juego, muestra tutorial/minijuego buttons).
        this.hideFeedback(); // Asegurar que el feedback general esté oculto inicialmente.


        console.log("Queue module initialization finished.");
    },

     // Método para ser llamado desde app.js si necesitamos resetear la cola al cambiar de vista
     resetModule() {
         console.log("Resetting Queue module.");
          // Resetear cualquier modo activo
         if (this.queueTutorial.isActive()) {
             this.queueTutorial.endTutorial(); // Finaliza el tutorial correctamente
         }
         if (this.queueMinigame.isActive()) {
             this.queueMinigame.reset(); // Resetea el mini-juego
         }
         // Limpiar la cola principal
         this.queue.clear();
         renderQueue(this.queue, this.queueContainer, 'queue-element');
         this.dequeueButton.disabled = this.queue.isEmpty();
         this.enableNormalUI(); // Asegurar UI normal
         this.minigameContainer.style.display = 'none'; // Asegurar que el mini-juego esté oculto
         this.hideFeedback(); // Limpiar feedback

         // También resetear el contenido del tutorial a su estado inicial pasivo si es necesario
         this.queueTutorial.showStep(0); // Mostrar el primer paso del tutorial (texto intro)
         this.queueMinigame.displayFeedback('', ''); // Limpiar feedback del mini-juego (que usa feedback general)
     }

};