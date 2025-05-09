// queue/queue-rendering.js
// Funciones para renderizar visualizaciones de Cola

/**
 * Renderiza la visualización de una cola en su contenedor.
 * Limpia el contenedor y dibuja los elementos de frente a final.
 * Puede usarse para la cola principal o las colas del minijuego.
 * @param {Queue} queue - La instancia de la cola a renderizar.
 * @param {HTMLElement} containerElement - El elemento DOM del contenedor (#queue-container o #primary-queue, #secondary-queue).
 * @param {string} elementTypeClass - Clase CSS para los elementos individuales (e.g., 'queue-element', 'task-element').
 * @param {boolean} isMiniGame - Opcional. True si es para el minijuego (los elementos necesitan mostrar el tiempo).
 */
export function renderQueue(queue, containerElement, elementTypeClass = 'queue-element', isMiniGame = false) {
    containerElement.innerHTML = ''; // Limpia el contenido actual

    if (queue.isEmpty()) {
        // Mostrar mensaje si la cola está vacía
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message'; // Usar clase CSS
        emptyMessage.textContent = 'Cola Vacía'; // O un mensaje diferente para el minijuego si es necesario
        // Asegurar que el mensaje ocupe el espacio para centrarlo si el contenedor es flex
        emptyMessage.style.width = '100%';
        emptyMessage.style.textAlign = 'center';
        containerElement.appendChild(emptyMessage);
    } else {
        // Renderizar elementos del frente al final (el primer elemento en el array va al inicio visualmente)
        // No necesitamos invertir el array para renderizar.
        queue.items.forEach(item => {
            const element = document.createElement('div');
            // Usar la clase CSS proporcionada (queue-element o task-element)
            element.className = elementTypeClass;
            element.dataset.value = isMiniGame ? item.id : item; // Guardar ID si es minijuego, valor si no

            if (isMiniGame) {
                // Si es para el minijuego, el item es un objeto { id, time, originalTime }
                // Mostrar el tiempo restante y quizás el tiempo original
                element.innerHTML = `<div class="task-timer">${Math.max(0, Math.ceil(item.time))}</div>`; // Mostrar tiempo entero, mínimo 0
                // Podrías añadir una etiqueta si quieres
                // element.innerHTML += `<div class="task-label">(${item.originalTime})</div>`;
                // Opcional: añadir barra de progreso visual basada en item.time / item.originalTime
            } else {
                // Si no es minijuego, es un elemento simple
                element.textContent = item;
            }

            // Los estilos CSS para .queue-element o .task-element manejan el margen y la apariencia.
            containerElement.appendChild(element); // Añadir elementos en orden (FIFO)
        });
    }
    // Nota: La animación de movimiento al añadir/eliminar podría requerir una implementación más avanzada
    // que re-renderizar todo (ej: animaciones CSS transition + JS para mover elementos específicos).
    // Por ahora, la re-renderización es suficiente para mostrar el estado correcto.
}

// Métodos de resaltado específicos para Cola (si son necesarios para tutorial/minijuego)
// Por ejemplo, resaltar el frente o el final.

/**
 * Resalta el elemento en el frente de la cola.
 * @param {HTMLElement} containerElement - El contenedor de la cola.
 * @param {string} highlightClass - Clase CSS para aplicar el resaltado.
 */
export function highlightFront(containerElement, highlightClass = 'tutorial-highlight') {
    // El frente es el primer elemento VISIBLE después del mensaje vacío (si existe)
    // Seleccionamos el primer hijo que tenga la clase de elemento de cola/tarea
     const firstElement = containerElement.querySelector('.queue-element, .task-element');
     if (firstElement) {
         firstElement.classList.add(highlightClass);
     }
}

/**
 * Resalta el elemento en el final de la cola.
 * @param {HTMLElement} containerElement - El contenedor de la cola.
 * @param {string} highlightClass - Clase CSS para aplicar el resaltado.
 */
export function highlightRear(containerElement, highlightClass = 'tutorial-highlight') {
    // El final es el último elemento VISIBLE.
    // Seleccionamos el último hijo que tenga la clase de elemento de cola/tarea
    // Asegurarse de no seleccionar el mensaje de vacío si está presente.
     const elements = containerElement.querySelectorAll('.queue-element, .task-element');
     if (elements.length > 0) {
         const lastElement = elements[elements.length - 1];
         lastElement.classList.add(highlightClass);
     }
}

// Método para limpiar todos los resaltados dentro de un contenedor de cola
export function clearQueueHighlights(containerElement, highlightClass = 'tutorial-highlight') {
     const highlightedElements = containerElement.querySelectorAll(`.${highlightClass}`);
     highlightedElements.forEach(element => {
         element.classList.remove(highlightClass);
     });
}