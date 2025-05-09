// queue/queue-minigame.js
// Gestiona la lógica y la UI del mini-juego Procesador de Tareas

// --- Importaciones ---
import { Queue } from './queue-logic.js'; // Necesita la clase Queue
import { renderQueue } from './queue-rendering.js'; // Necesita la función de renderizado de colas
// No necesita importar tutorialManager ya que interactúa con el controlador principal (queue.js)
// --- Fin Importaciones ---


// Helper function to get a random integer between min and max (inclusive)
// Se puede poner en un archivo utils si hay más helpers, por ahora aquí
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/**
 * Clase para gestionar el mini-juego Procesador de Tareas.
 */
export class QueueMinigame {
     /**
      * @param {object} dependencies - Dependencias necesarias.
      * // Incluye uiElements (timerEl, scoreEl, primaryQueueEl, secondaryQueueEl, divertBtn, reinsertBtn, startBtn, resetBtn),
      * // generalUIElements (feedbackElement)
      */
    constructor(dependencies) {
        // Dependencias UI
        this.ui = dependencies.uiElements; // Elementos UI específicos del minijuego
        this.generalUI = dependencies.generalUIElements; // Elementos UI generales (ej: feedback)

        // Instancias de las colas del juego
        this.primaryQueue = new Queue(); // Cola Principal (rápida)
        this.secondaryQueue = new Queue(); // Cola Secundaria (lenta)

        // Estado del juego
        this.gameActive = false;
        this.score = 0;
        this.gameTime = 120; // Segundos
        this.gameTimerInterval = null; // Intervalo para el temporizador y lógica del juego
        this.taskGenerationInterval = null; // Intervalo para generar nuevas tareas
        this.taskIdCounter = 0; // Contador para IDs únicos de tareas

        // Inicializar UI al cargar
        this.updateTimerDisplay();
        this.updateScoreDisplay();
        this.renderGameQueues(); // Renderizar colas vacías al inicio
         this.updateGameButtonStates(); // Asegurar estado inicial de botones


         // Configurar el texto inicial del botón de inicio si es necesario
         this.ui.startBtn.textContent = 'Iniciar Juego';
         this.ui.resetBtn.textContent = 'Reiniciar Juego';

         console.log("Queue minigame manager initialized.");

    }

    isActive() {
        return this.gameActive;
    }


    /**
     * Inicia el mini-juego.
     */
    start() {
        if (this.gameActive) {
            console.log("El juego ya está activo.");
            return; // Evitar iniciar si ya está activo
        }
        console.log("Iniciando mini-juego Procesador de Tareas...");

        this.gameActive = true;
        this.score = 0;
        this.gameTime = 120; // Reiniciar tiempo
        this.primaryQueue.clear(); // Limpiar colas
        this.secondaryQueue.clear();
        this.taskIdCounter = 0; // Reiniciar contador de IDs

        this.updateScoreDisplay();
        this.renderGameQueues(); // Renderizar colas vacías al inicio del juego
        this.updateTimerDisplay(); // Mostrar tiempo inicial
        this.displayFeedback('', ''); // Limpiar feedback general

        this.updateGameButtonStates(); // Asegurar estado inicial de botones (divert/reinsert deshabilitados)

        // Iniciar temporizador principal y lógica del juego
        this.gameTimerInterval = setInterval(() => this.gameTick(), 1000); // Tick cada segundo

        // Iniciar generación de tareas
        this.startTaskGeneration();

         // Actualizar texto del botón de inicio
         this.ui.startBtn.textContent = 'Reiniciar Juego';
         this.ui.resetBtn.disabled = false; // Habilitar botón de reiniciar


        // Nota: La lógica para deshabilitar UI normal (controles básicos, tutorial) se maneja en queue.js
    }


    /**
     * Detiene la generación de tareas.
     */
    stopTaskGeneration() {
         if (this.taskGenerationInterval) {
             clearInterval(this.taskGenerationInterval);
             this.taskGenerationInterval = null;
         }
    }

    /**
     * Inicia la generación periódica de tareas.
     * Genera una tarea cada 3 a 5 segundos con valor entre 2 y 9.
     */
    startTaskGeneration() {
         this.stopTaskGeneration(); // Asegurarse de que no haya intervalos previos
         const generateTask = () => {
            if (!this.gameActive) return; // Dejar de generar si el juego no está activo

            const taskTime = getRandomInt(2, 9); // Valor de tiempo inicial entre 2 y 9
            this.taskIdCounter++;
            const newTask = {
                id: this.taskIdCounter,
                time: taskTime,
                originalTime: taskTime // Guardar valor original para referencia si es necesario
            };
            this.primaryQueue.enqueue(newTask); // Añadir tarea a la cola principal

            console.log(`Tarea ${newTask.id} (${newTask.time}s) generada y añadida a Cola Principal.`);

            // Re-renderizar solo la cola principal después de añadir una tarea
             this.renderGameQueues(); // Renderiza ambas colas para simplificar
             this.updateGameButtonStates(); // Actualizar estado de botones
        };

        // Generar la primera tarea inmediatamente
        generateTask();

        // Configurar intervalo para las siguientes tareas (cada 3 a 5 segundos)
         this.taskGenerationInterval = setInterval(generateTask, getRandomInt(3000, 5000));
    }


    /**
     * Función que se ejecuta cada segundo del juego.
     * Decrementa contadores, checkea tareas completadas, actualiza temporizador.
     */
    gameTick() {
        if (!this.gameActive) return;

        // --- Decrementar contadores de tareas ---
        // Cola Principal (Velocidad normal: -1 por tick)
        if (!this.primaryQueue.isEmpty()) {
            const task = this.primaryQueue.front();
            task.time -= 1;
             console.log(`Tick: Tarea ${task.id} en Principal, tiempo restante: ${task.time}`);
        }

        // Cola Secundaria (Velocidad media: -0.5 por tick)
        if (!this.secondaryQueue.isEmpty()) {
            const task = this.secondaryQueue.front();
            task.time -= 0.5;
             console.log(`Tick: Tarea ${task.id} en Secundaria, tiempo restante: ${task.time}`);
        }

        // --- Checkear Tareas Completadas ---
        // (Una tarea se completa si su tiempo llega a 0 o menos)
        // Cola Principal
        while (!this.primaryQueue.isEmpty() && this.primaryQueue.front().time <= 0) {
            const completedTask = this.primaryQueue.dequeue();
            this.score++; // +1 punto por tarea completada
            console.log(`Tarea ${completedTask.id} completada en Cola Principal! Puntuación: ${this.score}`);
        }

        // Cola Secundaria
        while (!this.secondaryQueue.isEmpty() && this.secondaryQueue.front().time <= 0) {
            const completedTask = this.secondaryQueue.dequeue();
            this.score++; // +1 punto por tarea completada
            console.log(`Tarea ${completedTask.id} completada en Cola Secundaria! Puntuación: ${this.score}`);
        }

        // --- Actualizar UI (Renderizar colas y displays) ---
        this.renderGameQueues();
        this.updateScoreDisplay();
        this.updateTimerDisplay();

        this.updateGameButtonStates(); // Actualizar estado de los botones después de operaciones de colas

        // --- Decrementar tiempo de juego ---
        this.gameTime--;

        // --- Checkear fin del juego ---
        if (this.gameTime <= 0) {
            this.endGame();
        }
    }


    /**
     * Mueve la tarea del frente de la Cola Principal al final de la Cola Secundaria (si es posible).
     */
    divertTask() {
        if (!this.gameActive || this.primaryQueue.isEmpty()) {
            console.warn("No se puede desviar tarea: juego inactivo o cola principal vacía.");
            return false;
        }

        const taskToDivert = this.primaryQueue.dequeue(); // Sacar del frente de Principal
        if (taskToDivert !== undefined) {
            this.secondaryQueue.enqueue(taskToDivert); // Añadir al final de Secundaria

            console.log(`Tarea ${taskToDivert.id} desviada a Cola Secundaria.`);

            this.renderGameQueues(); // Re-renderizar colas afectadas
            this.updateGameButtonStates(); // Actualizar estado de botones
             // Limpiar feedback general
            this.displayFeedback('', '');
            return true;
        }
        return false; // Falla si no se pudo hacer dequeue (debería estar cubierto por la verificación isEmpty)
    }

    /**
     * Mueve la tarea del frente de la Cola Secundaria al frente de la Cola Principal (si es posible).
     */
    reinsertTask() {
         if (!this.gameActive || this.secondaryQueue.isEmpty()) {
             console.warn("No se puede reinsertar tarea: juego inactivo o cola secundaria vacía.");
             return false;
         }

         const taskToReinsert = this.secondaryQueue.dequeue(); // Sacar del frente de Secundaria
         if (taskToReinsert !== undefined) {
             // Usamos unshift para añadir al frente del array subyacente
             // Esto efectivamente lo pone al frente de la Cola Principal
             // Nota: Queue.enqueue() añade al final, Queue.dequeue() saca del frente.
             // Para reinsertar al frente, necesitamos acceder al array interno o simularlo.
             // Modificamos la clase Queue para tener un método para añadir al frente si es necesario,
             // o lo hacemos directamente aquí sabiendo la implementación interna.
             // Opción simple (acceso interno - menos ideal): this.primaryQueue._items.unshift(taskToReinsert);
             // Opción mejor (si agregamos método a Queue): this.primaryQueue.enqueueFront(taskToReinsert);

             // Temporalmente, asumimos que la Queue tiene un método para añadir al frente o lo hacemos así:
             // Si usamos la implementación con array [frente, ..., final], unshift añade al frente.
             this.primaryQueue._items.unshift(taskToReinsert); // Usar acceso a la propiedad privada _items (funciona pero no es la mejor práctica OO)

             console.log(`Tarea ${taskToReinsert.id} reinsertada al frente de Cola Principal.`);

             this.renderGameQueues(); // Re-renderizar colas afectadas
             this.updateGameButtonStates(); // Actualizar estado de botones
              // Limpiar feedback general
             this.displayFeedback('', '');
             return true;
         }
         return false; // Falla si no se pudo hacer dequeue
    }

    /**
     * Renderiza la visualización de ambas colas del juego.
     */
    renderGameQueues() {
        // Re-renderizar la cola principal (#primary-queue) usando renderQueue
        renderQueue(this.primaryQueue, this.ui.primaryQueueEl, 'task-element', true); // Usar 'task-element' y isMiniGame=true

        // Re-renderizar la cola secundaria (#secondary-queue) usando renderQueue
        renderQueue(this.secondaryQueue, this.ui.secondaryQueueEl, 'task-element', true); // Usar 'task-element' y isMiniGame=true
    }

    /**
     * Actualiza la visualización del temporizador.
     */
    updateTimerDisplay() {
        const minutes = Math.floor(this.gameTime / 60);
        const seconds = this.gameTime % 60;
        const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        this.ui.timerEl.textContent = formattedTime;
         // Opcional: Cambiar color del texto del temporizador cuando quedan pocos segundos
         if (this.gameTime <= 10 && this.gameTime > 0) {
              this.ui.timerEl.classList.add('text-red-500', 'font-bold');
         } else {
               this.ui.timerEl.classList.remove('text-red-500', 'font-bold');
         }
    }

    /**
     * Actualiza la visualización de la puntuación.
     */
    updateScoreDisplay() {
        this.ui.scoreEl.textContent = this.score;
    }

    /**
     * Actualiza el estado de los botones de juego (Desviar, Reinsertar, Reiniciar).
     */
    updateGameButtonStates() {
         // Botones Desviar/Reinsertar: Habilitados solo si el juego está activo y la cola de origen no está vacía.
         this.ui.divertBtn.disabled = !this.gameActive || this.primaryQueue.isEmpty();
         this.ui.reinsertBtn.disabled = !this.gameActive || this.secondaryQueue.isEmpty();

         // Botón Reiniciar: Habilitado solo si el juego está activo o acaba de terminar.
         this.ui.resetBtn.disabled = !this.gameActive && this.gameTime > 0; // Deshabilitado al inicio, se habilita al iniciar juego.

         // Botón Iniciar Juego: Deshabilitado si el juego está activo.
         this.ui.startBtn.disabled = this.gameActive;

         // Si el juego terminó, el botón Iniciar Juego vuelve a habilitarse y dice "Jugar de nuevo" o "Iniciar Juego".
         if (!this.gameActive && this.gameTime <= 0) {
             this.ui.startBtn.disabled = false;
             this.ui.startBtn.textContent = 'Jugar de Nuevo';
         } else if (!this.gameActive && this.gameTime > 0) {
             // Estado inicial o después de un reset manual antes de que el tiempo llegue a 0
             this.ui.startBtn.textContent = 'Iniciar Juego';
         }
    }


    /**
     * Finaliza el juego.
     */
    endGame() {
        console.log("Mini-juego finalizado.");
        this.gameActive = false;

        // Detener intervalos
        this.stopTaskGeneration();
        if (this.gameTimerInterval) {
            clearInterval(this.gameTimerInterval);
            this.gameTimerInterval = null;
        }

        // Asegurar visualización final (tiempo 0, puntuación final)
        this.gameTime = 0; // Asegurar que muestre 00:00
        this.updateTimerDisplay();
        this.updateScoreDisplay();
        this.renderGameQueues(); // Re-renderizar colas (estarán vacías si se completaron todas las tareas)


        // Mostrar mensaje final
        this.displayFeedback(`¡Tiempo terminado! Completaste ${this.score} tareas.`, 'success'); // Usar feedback general

        // Actualizar estado de botones
        this.updateGameButtonStates(); // Esto habilitará el botón Jugar de Nuevo
         this.ui.resetBtn.disabled = true; // Deshabilitar Reiniciar al final del juego

        // Opcional: Limpiar colas visuales al final del juego si no se completaron todas las tareas.
        // this.primaryQueue.clear();
        // this.secondaryQueue.clear();
        // this.renderGameQueues();

        // Nota: La UI normal se re-habilita en queue.js después de que el minijuego termina/resetea.
    }

    /**
     * Reinicia el mini-juego sin esperar a que termine el tiempo.
     */
    reset() {
         console.log("Reseteando mini-juego Procesador de Tareas.");
         // Detener intervalos
         this.stopTaskGeneration();
         if (this.gameTimerInterval) {
             clearInterval(this.gameTimerInterval);
             this.gameTimerInterval = null;
         }

         this.gameActive = false; // Desactivar bandera

         // Resetear estado del juego
         this.score = 0;
         this.gameTime = 120;
         this.primaryQueue.clear();
         this.secondaryQueue.clear();
         this.taskIdCounter = 0;

         // Actualizar UI
         this.updateScoreDisplay();
         this.updateTimerDisplay();
         this.renderGameQueues(); // Renderizar colas vacías
         this.displayFeedback('', ''); // Limpiar feedback general

         // Actualizar estado de botones
         this.updateGameButtonStates(); // Esto re-habilitará el botón Iniciar Juego

         // Nota: La UI normal se re-habilita en queue.js después de que el minijuego se resetea.
    }

    // Método para mostrar feedback en el elemento de feedback general de la Cola
     displayFeedback(message, type) {
         const feedbackElement = this.generalUI.feedbackElement; // Usar la referencia pasada en dependencies
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