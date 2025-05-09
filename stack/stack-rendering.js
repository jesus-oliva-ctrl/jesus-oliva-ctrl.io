// stack/stack-rendering.js
// Funciones para renderizar visualizaciones de Pila - Contenido original

/**
 * Renderiza la visualización de una pila principal de exploración.
 * Limpia el contenedor y dibuja los elementos de abajo hacia arriba, incluyendo la base.
 * @param {Stack} stack - La instancia de la pila a renderizar.
 * @param {HTMLElement} containerElement - El elemento DOM del contenedor (#stack-container).
 */
export function renderStack(stack, containerElement) {
    containerElement.innerHTML = ''; // Limpia el contenido actual

    // Añadir la base de la pila
     const baseEl = document.createElement('div');
     baseEl.className = 'stack-base'; // Usar la clase CSS definida
     baseEl.textContent = 'Base';
     containerElement.appendChild(baseEl);


    if (stack.isEmpty()) {
        // Mostrar mensaje si la pila está vacía
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message'; // Usar clase CSS
        emptyMessage.textContent = 'Pila Vacía';
        containerElement.appendChild(emptyMessage);
    } else {
        // Renderizar elementos de abajo hacia arriba (el último en el array va arriba visualmente)
        // Invertimos el array para dibujar del fondo a la cima
        const itemsToRender = [...stack.items].reverse(); // Copia y revierte

        itemsToRender.forEach(item => {
            const element = document.createElement('div');
            element.className = 'stack-element'; // Usar clase CSS
            element.textContent = item;
            // Insertar elementos ANTES de la base para que aparezcan encima
            containerElement.insertBefore(element, containerElement.querySelector('.stack-base'));
        });
    }
}


/**
 * Renderiza la visualización de una pila dentro del área del desafío de tres pilas.
 * Limpia el contenedor específico de la pila del desafío y dibuja sus elementos.
 * NO adjunta manejadores de clic a elementos o bases, ya que los movimientos se inician desde botones.
 * @param {Stack} stack - La instancia de la pila a renderizar.
 * @param {HTMLElement} containerElement - El elemento DOM del contenedor de la pila del desafío (#stack-challenge-left, etc.).
 * @param {string} stackId - El ID de la pila ('left', 'middle', 'right'). No se usa en el renderizado, pero útil para depuración.
 */
export function renderChallengeStack(stack, containerElement, stackId) {
     // console.log(`Renderizando pila (Botones): ${stackId}. Contenido DS (abajo a arriba):`, [...stack.items]); // Log

     // Limpiar solo los elementos de la pila, manteniendo la base si está en HTML (el HTML actualizado no la tiene estática, la añade JS)
     // Vamos a asegurarnos de añadir la base si no está, o limpiar solo los elementos si sí está.

     // Remover solo los elementos que NO sean la base
     const existingElements = containerElement.querySelectorAll('.stack-element');
     existingElements.forEach(el => el.remove());

     // Asegurarse de que la base exista
     let baseElement = containerElement.querySelector('.stack-base');
     if (!baseElement) {
         baseElement = document.createElement('div');
         baseElement.className = 'stack-base';
         baseElement.textContent = 'Base';
         containerElement.appendChild(baseElement); // Añadir la base al final
     }


    if (!stack.isEmpty()) {
        // Renderizar elementos de abajo hacia arriba (el último en el array va arriba visualmente)
        const itemsToRender = [...stack.items].reverse(); // Copia y revierte

        itemsToRender.forEach(item => {
            // console.log(`  Insertando elemento ${item} en pila ${stackId}`); // Log

            const element = document.createElement('div');
            element.className = 'stack-element'; // Usar clase CSS
            element.textContent = item;

            // Insertar elementos ANTES de la base (que es el último hijo)
            containerElement.insertBefore(element, baseElement);
        });
    }
    // Nota: No necesitamos mostrar mensaje de pila vacía en las pilas del desafío por diseño.
}