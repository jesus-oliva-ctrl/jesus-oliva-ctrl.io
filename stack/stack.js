// stack/stack.js
// Controlador principal para la vista de la Pila - Fusion de original y generado por IA

// --- Importaciones ---
import { Stack } from './stack-logic.js'; // Lógica de la Pila
// Funciones de renderizado (general y desafío)
import { renderStack, renderChallengeStack } from './stack-rendering.js';
// UI del desafío (mostrar objetivo)
import { displayTargetConfig } from './stack-challenge-ui.js';
// Gestor de desafío de tres pilas
import { ThreeStackChallengeManager } from './three-stack-challenge-manager.js';
// Gestor de tutoriales
import { StackTutorialManager } from './stack-tutorial.js';
// --- Fin Importaciones ---


// Exportar un objeto que contenga el método init para que app.js pueda llamarlo
export const stackModule = {
    // --- Elementos DOM (Generales y Tutorial) ---
    stackInput: null,
    pushButton: null,
    popButton: null,
    resetButton: null, // Botón Reiniciar general
    stackContainer: null, // Contenedor visualización principal
    startTutorialButton: null, // Botón Iniciar Tutorial
    startChallengeButton: null, // Botón Iniciar Desafío
    challengeStatusElement: null, // Área mensaje estado desafío del desafío
    feedbackElement: null, // Área de feedback general (.feedback)
    tutorialContainer: null, // Contenedor del tutorial (#stack-tutorial-container)
    tutorialTitleElement: null, // Elemento del título del tutorial (#stack-tutorial-title)
    tutorialContentElement: null, // Elemento del contenido del tutorial (#stack-tutorial-content)
    tutorialButtonsContainer: null, // Contenedor de los botones del tutorial (.tutorial-buttons)


    // --- Elementos DOM del Desafío (NUEVOS para el juego de tres pilas) ---
    threeStacksContainer: null, // Contenedor padre de las 3 pilas del desafío (#stack-challenge-three-stacks)
    // Contenedores visuales para cada pila del desafío (se añadirán dinámicamente y guardarán aquí)
    leftStackVizEl: null,
    middleStackVizEl: null,
    rightStackVizEl: null,
    // Elementos para mostrar el objetivo de cada pila en la UI
    leftTargetEl: null,
    middleTargetEl: null,
    rightTargetEl: null,
    // Botones de movimiento (se añadirán dinámicamente y guardarán aquí)
    moveLeftMiddleBtn: null,
    moveMiddleLeftBtn: null,
    moveMiddleRightBtn: null,
    moveRightMiddleBtn: null,
    // --- Fin Elementos DOM del Desafío ---


    // --- Instancia DS (Pila principal para exploración/tutorial) ---
    stack: null,
    // --- Fin Instancia DS ---


    // --- Instancia Gestor Tutorial ---
    stackTutorial: null,
    // --- Fin Instancia Gestor Tutorial ---


    // --- Instancia Gestor Desafío (NUEVO: Tres Pilas) ---
    threeStackChallenge: null,
    // --- Fin Instancia Gestor Desafío ---


    init() {
        console.log("Stack module initialization started.");
        // --- Obtener Elementos DOM ---
        this.stackInput = document.getElementById('stack-input');
        this.pushButton = document.getElementById('stack-push');
        this.popButton = document.getElementById('stack-pop');
        this.resetButton = document.getElementById('stack-reset'); // Botón Reiniciar general
        this.stackContainer = document.getElementById('stack-container'); // Contenedor visualización principal
        this.startTutorialButton = document.getElementById('stack-start-tutorial'); // Botón Iniciar Tutorial
        this.startChallengeButton = document.getElementById('stack-start-challenge'); // Botón Iniciar Desafío
        this.challengeStatusElement = document.getElementById('stack-challenge-status'); // Área mensaje estado desafío del desafío
        this.feedbackElement = document.getElementById('stack-feedback'); // Área de feedback general (.feedback)

        this.tutorialContainer = document.getElementById('stack-tutorial-container');
        // Los elementos de título, contenido y botones del tutorial están DENTRO del tutorialContainer y se buscan desde ahí
        this.tutorialTitleElement = this.tutorialContainer.querySelector('#stack-tutorial-title');
        this.tutorialContentElement = this.tutorialContainer.querySelector('#stack-tutorial-content');
        this.tutorialButtonsContainer = this.tutorialContainer.querySelector('.tutorial-buttons');


        // Elementos DOM del Desafío - Contenedores de visualización y objetivo
        this.threeStacksContainer = document.getElementById('stack-challenge-three-stacks'); // Contenedor padre

        // Nota: Los contenedores visuales específicos de cada pila del desafío (left, middle, right)
        // y sus botones de movimiento se crean dinámicamente por el threeStackChallengeManager
        // al inicializarse y se adjuntan a this.threeStacksContainer. Guardaremos referencias a ellos después
        // de inicializar el gestor del desafío.

        this.leftTargetEl = document.getElementById('stack-target-left');
        this.middleTargetEl = document.getElementById('stack-target-middle');
        this.rightTargetEl = document.getElementById('stack-target-right');
        // --- Fin Obtener Elementos DOM ---


        // --- Instancia DS (Pila principal para exploración/tutorial) ---
        this.stack = new Stack();
        // --- Fin Instancia DS ---


        // --- Instancia Gestor Tutorial ---
        this.stackTutorial = new StackTutorialManager({
            explanationElement: this.tutorialContainer, // Pasar el contenedor padre del tutorial
            tutorialTitleElement: this.tutorialTitleElement,
            tutorialContentElement: this.tutorialContentElement,
            tutorialButtonsContainer: this.tutorialButtonsContainer, // Pasar el contenedor de botones del tutorial

            stackInstance: this.stack, // Pasa la instancia de la pila principal
            vizContainerElement: this.stackContainer, // Pasa el contenedor de visualización principal
            uiElements: { // Pasa los elementos UI relevantes para el tutorial y control de estado
                input: this.stackInput,
                pushButton: this.pushButton,
                popButton: this.popButton,
                resetButton: this.resetButton, // Pasar también el resetButton general
                startChallengeButton: this.startChallengeButton,
                startTutorialButton: this.startTutorialButton, // Pasar botón de inicio tutorial
                challengeStatusElement: this.challengeStatusElement, // Pasar elemento estado desafío (tutorial lo usa para feedback)
                feedbackElement: this.feedbackElement, // Pasar elemento feedback general
            },
            renderingFunctions: { renderStack: renderStack }, // Pasa la función de renderizado general
            operationalFunctions: { // Pasa referencias a las funciones de operación (Push/Pop) del controlador
                addElement: this.addElement.bind(this), // Usar .bind(this) para mantener el contexto
                removeElement: this.removeElement.bind(this),
            },
        });
        // --- Fin Instancia Gestor Tutorial ---


        // --- Instancia Gestor Desafío (NUEVO: Tres Pilas) ---
         // Nota: Pasamos referencias a los contenedores visuales del desafío. El manager los usará
         // para crear los elementos internos (las visualizaciones de pila y los botones).
        this.threeStackChallenge = new ThreeStackChallengeManager({
            vizContainer: this.threeStacksContainer, // Contenedor padre donde el manager renderizará las 3 pilas

            // Pasar un objeto vacío inicialmente para vizElements y targetElements
            // El manager renderChallengeVisualizations lo llenará y usará.
            vizElements: {}, // Se llenará dinámicamente
            targetElements: { // Elementos para mostrar el objetivo
                leftTargetEl: this.leftTargetEl,
                middleTargetEl: this.middleTargetEl,
                rightTargetEl: this.rightTargetEl,
            },
            challengeStatusEl: this.challengeStatusElement, // Pasa el elemento de estado
            startButtonEl: this.startChallengeButton, // Pasa el botón de inicio/reiniciar desafío
             uiElements: { feedbackElement: this.feedbackElement }, // Pasar elemento feedback general

            renderingFunctions: { renderChallengeStack: renderChallengeStack }, // Pasa la función de renderizado para pilas de desafío
            uiUpdateFunctions: { displayTargetConfig: displayTargetConfig }, // Pasa la función para mostrar el objetivo
        });
        // --- Fin Instancia Gestor Desafío ---

        // Ahora que el threeStackChallengeManager se inicializó y renderizó la estructura,
        // obtener las referencias a los contenedores visuales de cada pila y sus botones de movimiento
         this.leftStackVizEl = document.getElementById('stack-challenge-left');
         this.middleStackVizEl = document.getElementById('stack-challenge-middle');
         this.rightStackVizEl = document.getElementById('stack-challenge-right');

         this.moveLeftMiddleBtn = document.getElementById('move-left-middle');
         this.moveMiddleLeftBtn = document.getElementById('move-middle-left');
         this.moveMiddleRightBtn = document.getElementById('move-middle-right');
         this.moveRightMiddleBtn = document.getElementById('move-right-middle');

         // Ahora que tenemos las referencias, pasárselas al gestor del desafío
         this.threeStackChallenge.vizElements = { // Actualizar la propiedad vizElements en la instancia del manager
             leftStackEl: this.leftStackVizEl,
             middleStackEl: this.middleStackVizEl,
             rightStackEl: this.rightStackVizEl,
         };


        // --- Funciones para controlar el estado de los botones ---
        // Estas funciones son clave para la gestión de estado (exploración vs tutorial vs desafío)

        // Habilita la UI normal (input, push, pop, tutorial, reset principal)
        this.enableNormalUI = function() {
             this.stackInput.disabled = false;
             this.pushButton.disabled = false;
             // PopButton depende del estado de la pila principal (stack), se maneja en updateUI.
             this.resetButton.disabled = false; // El Reset general está siempre habilitado (o lo gestiona quien esté activo)
             this.startTutorialButton.style.display = ''; // Mostrar botón tutorial
             this.startChallengeButton.style.display = ''; // Mostrar botón desafío

             // Deshabilitar todos los botones de movimiento del desafío.
             this.disableMoveButtons();

              // Asegurar que el área de estado del desafío y feedback general estén visibles/limpias si nada está activo
              // El estado del desafío se maneja por el gestor, pero asegurarse de que esté visible
              this.challengeStatusElement.style.display = ''; // Ocultar si no hay mensaje?
              this.feedbackElement.style.display = 'none'; // Ocultar feedback general por defecto en modo normal

              // Restaurar texto del botón de desafío si no está activo
              if (!this.threeStackChallenge.isActive()) {
                  this.startChallengeButton.textContent = 'Iniciar Desafío';
              }
              // Restaurar texto del botón de tutorial si no está activo
               if (!this.stackTutorial.isActive()) {
                    this.startTutorialButton.textContent = 'Iniciar Tutorial Interactivo';
               }
        }.bind(this); // Usar .bind(this) para mantener el contexto

        // Deshabilita la UI normal durante tutorial o desafío.
        this.disableNormalUI = function() {
            this.stackInput.disabled = true;
            this.pushButton.disabled = true;
            this.popButton.disabled = true; // Deshabilita Pop
            this.resetButton.disabled = true; // Deshabilitar Reset general durante tutorial/desafío

            // Ocultar botones que inician otros modos
            this.startTutorialButton.style.display = 'none';
            this.startChallengeButton.style.display = 'none';

             // Deshabilitar todos los botones de movimiento del desafío.
             this.disableMoveButtons(); // Asegurarse de que también se deshabilitan.

             // Asegurar que el área de estado del desafío y feedback general estén visibles
             this.challengeStatusElement.style.display = 'block';
             this.feedbackElement.style.display = 'block'; // Mostrar área de feedback para mensajes del tutorial/desafío

        }.bind(this); // Usar .bind(this) para mantener el contexto


        // Habilita los botones de movimiento del desafío.
        this.enableMoveButtons = function() {
             if (this.moveLeftMiddleBtn) this.moveLeftMiddleBtn.disabled = false;
             if (this.moveMiddleLeftBtn) this.moveMiddleLeftBtn.disabled = false;
             if (this.moveMiddleRightBtn) this.moveMiddleRightBtn.disabled = false;
             if (this.moveRightMiddleBtn) this.moveRightMiddleBtn.disabled = false;
        }.bind(this); // Usar .bind(this) para mantener el contexto

        // Deshabilita todos los botones de movimiento del desafío.
        this.disableMoveButtons = function() {
            if (this.moveLeftMiddleBtn) this.moveLeftMiddleBtn.disabled = true;
            if (this.moveMiddleLeftBtn) this.moveMiddleLeftBtn.disabled = true;
            if (this.moveMiddleRightBtn) this.moveMiddleRightBtn.disabled = true;
            if (this.moveRightMiddleBtn) this.moveRightMiddleBtn.disabled = true;
        }.bind(this); // Usar .bind(this) para mantener el contexto

        // Actualiza el estado de los botones de movimiento del desafío
        // en función de si el desafío está activo y si la pila de origen no está vacía.
        this.updateMoveButtonStates = function() {
            // Si el desafío no está activo, todos los botones deben estar deshabilitados.
            if (!this.threeStackChallenge.isActive()) {
                 this.disableMoveButtons();
                 return;
            }

            // Si el desafío está activo, habilitar botones solo si la pila de origen NO está vacía.
            // Y asegurarse de que los elementos DOM existan antes de acceder a ellos
            if (this.moveLeftMiddleBtn) this.moveLeftMiddleBtn.disabled = this.threeStackChallenge.stacks.left.isEmpty();
            if (this.moveMiddleLeftBtn) this.moveMiddleLeftBtn.disabled = this.threeStackChallenge.stacks.middle.isEmpty();
            if (this.moveMiddleRightBtn) this.moveMiddleRightBtn.disabled = this.threeStackChallenge.stacks.middle.isEmpty(); // Movimiento desde medio a derecha
            if (this.moveRightMiddleBtn) this.moveRightMiddleBtn.disabled = this.threeStackChallenge.stacks.right.isEmpty();
        }.bind(this); // Usar .bind(this) para mantener el contexto

         // Función para mostrar feedback general (usada por operaciones básicas)
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


        // --- Funciones Operación/Visualización (para vista principal/tutorial) ---
        // Estas funciones Push/Pop son usadas por la vista de exploración normal y el tutorial.
        // El juego de desafío NO las usa.
        this.addElement = function(value) {
            if (value === '' || isNaN(value)) { this.showFeedback('¡Por favor, ingresa un número válido!', 'error'); return false; }
            const elementValue = parseInt(value, 10); // Asegurarse de parsear a entero

            // Push DS (pila principal)
            this.stack.push(elementValue);
            this.stackInput.value = ''; // Limpiar input

            // Renderiza para actualizar visualización
            renderStack(this.stack, this.stackContainer); // Llama a renderStack general

             // Habilitar Pop si la pila ya no está vacía.
             this.popButton.disabled = this.stack.isEmpty();

             return true; // Operación exitosa
        }.bind(this); // Usar .bind(this)

        this.removeElement = function() {
            if (this.stack.isEmpty()) { this.showFeedback('¡La pila está vacía!', 'error'); return null; }

            // Pop DS (pila principal)
            const poppedValue = this.stack.pop();

            // Anima salida y remueve DOM - Esto debería estar en stack-rendering.js idealmente
            // Por ahora, re-renderizamos simplemente
            renderStack(this.stack, this.stackContainer); // Re-renderiza pila principal


            // Deshabilita Pop si pila principal vacía
            this.popButton.disabled = this.stack.isEmpty();

            return poppedValue; // Retorna el valor sacado
        }.bind(this); // Usar .bind(this)
        // --- Fin Funciones Operación/Visualización ---


        // --- Manejadores Eventos ---

        // Manejador para la Pila principal (Input, Push, Pop, Reset general)
        this.pushButton.addEventListener('click', () => {
            const value = this.stackInput.value.trim(); // Obtener valor del input

            // Si el tutorial está activo, pasar la operación al gestor del tutorial
            if (this.stackTutorial.isActive()) {
                 const handledByTutorial = this.stackTutorial.handleOperation('push', value);
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
             } else if (this.threeStackChallenge.isActive()) {
                  // Botón Push deshabilitado durante desafío - No debería llegar aquí si está deshabilitado
             } else {
                 // Modo de exploración normal
                 const success = this.addElement(value); // Realizar la operación normal
                 if (success) {
                      this.showFeedback(`Elemento ${value} agregado a la pila`, 'success');
                 }
             }
        });

        this.popButton.addEventListener('click', () => {
            // Si el tutorial está activo, pasar la operación al gestor del tutorial
            if (this.stackTutorial.isActive()) {
                 // Primero, realizar la operación Pop "visualmente" y en la DS principal.
                 // El tutorial.handleOperation verificará si esta fue la acción correcta para el paso actual.
                 const poppedValue = this.removeElement(); // Realizar el pop visual y DS

                 if (poppedValue !== null) { // Si se sacó un elemento
                     const handledByTutorial = this.stackTutorial.handleOperation('pop', poppedValue);
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
                      // No se pudo hacer Pop (pila vacía). removeElement ya mostró feedback general.
                      // El tutorial.handleOperation no se llama si no se pudo hacer Pop.
                 }

             } else if (this.threeStackChallenge.isActive()) {
                  // Botón Pop deshabilitado durante desafío
             } else {
                 // Modo de exploración normal
                 const poppedValue = this.removeElement(); // Realizar la operación normal
                  if (poppedValue !== null) {
                      this.showFeedback(`Elemento ${poppedValue} eliminado de la pila`, 'success');
                  }
             }
        });

        // El botón Reiniciar general (resetButton) ahora debe resetear lo que esté activo.
        this.resetButton.addEventListener('click', () => {
             // Primero, verificar si algún modo (tutorial o desafío) está activo.
             if (this.stackTutorial.isActive()) {
                 // Si el tutorial está activo, resetear el tutorial.
                 this.stackTutorial.reset();
                 // El reset del tutorial ya limpia la pila DS/visual y gestiona la UI.
                 // Asegurar que la UI normal se re-habilite al finalizar el reset del tutorial.
                 this.enableNormalUI(); // Re-habilitar UI normal (incl. deshabilitar botones movimiento desafío)
                 this.updateMoveButtonStates(); // Asegurar estado inicial de botones de movimiento
                 console.log("Resetting active tutorial.");
             } else if (this.threeStackChallenge.isActive()) {
                 // Si el desafío está activo, resetear el desafío.
                 this.threeStackChallenge.reset();
                 // El reset del desafío limpia sus pilas DS/visualización y gestiona su UI.
                 // Asegurar que la UI normal se re-habilite al finalizar el reset del desafío.
                 this.enableNormalUI(); // Re-habilitar UI normal
                  this.updateMoveButtonStates(); // Asegurar botones de movimiento deshabilitados
                  console.log("Resetting active challenge.");
             } else {
                 // Si nada está activo, simplemente limpiar la pila principal y su UI.
                 this.stack.clear();
                 renderStack(this.stack, this.stackContainer); // Re-renderizar pila principal
                 this.popButton.disabled = this.stack.isEmpty(); // Deshabilita Pop si vacía
                 this.hideFeedback(); // Limpiar feedback general si estaba visible
                 this.enableNormalUI(); // Asegurar estado UI normal
                 this.updateMoveButtonStates(); // Asegurar botones de movimiento deshabilitados
                 console.log("Resetting main stack.");
             }
        });

        // Permitir Push al presionar Enter en el input
        this.stackInput.addEventListener('keyup', (event) => {
             if (event.key === 'Enter') {
                   this.pushButton.click();
               }
           });


        // Manejador botón Iniciar Desafío
        this.startChallengeButton.addEventListener('click', () => {
             // Si el desafío ya está activo, este botón funciona como "Reiniciar Desafío"
            if (this.threeStackChallenge.isActive()) {
                 console.log("Clicked Reiniciar Desafío button.");
                this.threeStackChallenge.reset(); // Resetear el desafío
                this.enableNormalUI(); // Re-habilitar UI normal después del reset
                 this.updateMoveButtonStates(); // Asegurar estado inicial (deshabilitados)
            } else {
                 console.log("Clicked Iniciar Desafío button.");
                 // Si un tutorial está activo, preguntar antes de iniciar el desafío
                 if (this.stackTutorial.isActive()) {
                     if (confirm("Salir del tutorial para iniciar el desafío?")) {
                         this.stackTutorial.endTutorial(); // Usar endTutorial para restaurar UI

                          // Esperar un poco para asegurar que la UI se restaure antes de iniciar el desafío
                         setTimeout(() => {
                             this.threeStackChallenge.start(); // Iniciar el desafío
                             this.disableNormalUI(); // Deshabilitar UI normal durante desafío
                              this.updateMoveButtonStates(); // Habilitar/Deshabilitar botones de movimiento según estado inicial
                             this.hideFeedback(); // Ocultar feedback general
                             console.log("Starting challenge after exiting tutorial.");
                         }, 50);
                     }
                 } else {
                     // Si no hay tutorial activo, iniciar el desafío directamente
                     this.threeStackChallenge.start(); // Iniciar el desafío
                     this.disableNormalUI(); // Deshabilitar UI normal durante desafío
                     this.updateMoveButtonStates(); // Habilitar/Deshabilitar botones de movimiento según estado inicial
                     this.hideFeedback(); // Ocultar feedback general
                     console.log("Starting challenge directly.");
                 }
            }
        });

        // Manejador botón Iniciar Tutorial
        this.startTutorialButton.addEventListener('click', () => {
             // Si hay un desafío activo, preguntar antes de iniciar el tutorial
             if (this.threeStackChallenge.isActive()) {
                 if (confirm("Salir del desafío para iniciar el tutorial?")) {
                     this.threeStackChallenge.reset(); // Resetear el desafío
                      // enableNormalUI() ya se llama al resetear desafío.

                     // Esperar un poco para asegurar que la UI se restaure antes de iniciar el tutorial
                     setTimeout(() => {
                        this.stackTutorial.startTutorial(); // Iniciar el tutorial
                        this.disableNormalUI(); // Deshabilitar UI normal durante tutorial
                         // updateMoveButtonStates() ya se llama en disableNormalUI
                        this.hideFeedback(); // Ocultar feedback general
                        console.log("Starting tutorial after exiting challenge.");
                     }, 50);
                 }
             } else if (this.stackTutorial.isActive()) {
                  // Si el tutorial ya está activo, este botón no debería ser visible,
                  // o podría usarse para resetear el tutorial actual si se prefiere.
                  // Según la lógica disableNormalUI, este botón está oculto cuando el tutorial está activo.
                   console.log("Tutorial is already active.");
             }
              else {
                 // Si no hay desafío activo, iniciar el tutorial directamente
                 this.stackTutorial.startTutorial(); // Iniciar el tutorial
                 this.disableNormalUI(); // Deshabilitar UI normal durante tutorial
                 // updateMoveButtonStates() ya se llama en disableNormalUI
                 this.hideFeedback(); // Ocultar feedback general
                 console.log("Starting tutorial directly.");
             }
        });

        // --- Manejadores de Eventos para los Botones de Movimiento del Desafío ---
        // Adjuntar manejadores a los botones de movimiento dinámicamente creados
        // Nota: Las referencias a los botones se obtienen después de inicializar threeStackChallengeManager

        // Usar un pequeño retraso para asegurar que los botones existan en el DOM
         setTimeout(() => {
             if (this.moveLeftMiddleBtn) {
                 this.moveLeftMiddleBtn.addEventListener('click', () => {
                     console.log("Clicked move-left-middle");
                     if (this.threeStackChallenge.performMove('left', 'middle')) {
                         this.updateMoveButtonStates(); // Actualizar estado botones después del movimiento exitoso
                     }
                 });
             }
             if (this.moveMiddleLeftBtn) {
                  this.moveMiddleLeftBtn.addEventListener('click', () => {
                      console.log("Clicked move-middle-left");
                      if (this.threeStackChallenge.performMove('middle', 'left')) {
                         this.updateMoveButtonStates();
                      }
                  });
             }
             if (this.moveMiddleRightBtn) {
                  this.moveMiddleRightBtn.addEventListener('click', () => {
                       console.log("Clicked move-middle-right");
                       if (this.threeStackChallenge.performMove('middle', 'right')) {
                          this.updateMoveButtonStates();
                       }
                  });
             }
             if (this.moveRightMiddleBtn) {
                  this.moveRightMiddleBtn.addEventListener('click', () => {
                       console.log("Clicked move-right-middle");
                       if (this.threeStackChallenge.performMove('right', 'middle')) {
                           this.updateMoveButtonStates();
                       }
                  });
             }
         }, 100); // Retraso mínimo para asegurar que los elementos están en el DOM


        // --- Inicialización Vista (Pila principal) ---
        this.stack.clear(); // Asegurar que la pila principal esté vacía al iniciar el módulo
        renderStack(this.stack, this.stackContainer); // Renderizado inicial de la pila principal
        this.popButton.disabled = this.stack.isEmpty(); // Deshabilita Pop si vacía al cargar
        this.enableNormalUI(); // Asegurar que la UI normal esté habilitada inicialmente.
        this.updateMoveButtonStates(); // Asegurar que los botones de movimiento estén deshabilitados inicialmente.
        this.hideFeedback(); // Asegurar que el feedback general esté oculto inicialmente.
         this.challengeStatusElement.style.display = ''; // Asegurar que el estado del desafío esté visible

        console.log("Stack module initialization finished.");
    },

     // Función de actualización general de la UI de la Pila (modo exploración)
     // Llamada después de operaciones Push/Pop en modo normal
     updateUI() {
         renderStack(this.stack, this.stackContainer);
         this.popButton.disabled = this.stack.isEmpty(); // Actualizar estado del botón Pop
     },

     // Método para ser llamado desde app.js si necesitamos resetear la pila al cambiar de vista
     resetModule() {
         console.log("Resetting Stack module.");
          // Resetear cualquier modo activo
         if (this.stackTutorial.isActive()) {
             this.stackTutorial.endTutorial(); // Finaliza el tutorial correctamente
         }
         if (this.threeStackChallenge.isActive()) {
             this.threeStackChallenge.reset(); // Resetea el desafío
         }
         // Limpiar la pila principal
         this.stack.clear();
         renderStack(this.stack, this.stackContainer);
         this.popButton.disabled = this.stack.isEmpty();
         this.enableNormalUI(); // Asegurar UI normal
         this.updateMoveButtonStates(); // Asegurar botones de movimiento deshabilitados
         this.hideFeedback(); // Limpiar feedback
         this.challengeStatusElement.style.display = ''; // Asegurar visibilidad del estado del desafío

         // También resetear el contenido del tutorial y desafío a su estado inicial pasivo si es necesario
         this.stackTutorial.showStep(0); // Mostrar el primer paso del tutorial (texto intro)
         this.threeStackChallenge.displayFeedback('', ''); // Limpiar estado del desafío

     }
};