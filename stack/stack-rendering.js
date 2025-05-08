// Funciones para renderizar visualizaciones de Pila
export function renderStack(stack, containerElement) {
    containerElement.innerHTML = ''; // Limpia el contenido actual

    // Añadir la base de la pila (asumimos que ya existe en HTML)
     const baseEl = document.createElement('div');
     baseEl.className = 'stack-base';
     baseEl.textContent = 'Base'; // Texto traducido
     containerElement.appendChild(baseEl);


    if (stack.isEmpty()) {
        // Mostrar mensaje si la pila está vacía
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = 'Pila Vacía'; // Texto traducido
        containerElement.appendChild(emptyMessage);
    } else {
        // Renderizar elementos de abajo hacia arriba
        // stack.items[0] es el fondo, stack.items[length-1] es la cima
        stack.items.forEach(item => {
            const element = document.createElement('div');
            element.className = 'stack-element';
            element.textContent = item;
            // Los estilos CSS para .stack-element manejan el margen y la apariencia
            containerElement.insertBefore(element, containerElement.querySelector('.stack-base')); // Insertar elementos antes de la base
        });
    }
}


/**
 * Renderiza la visualización de una pila dentro del área del desafío de tres pilas (usando botones para mover).
 * Limpia el contenedor específico de la pila del desafío y dibuja sus elementos.
 * Ya NO adjunta manejadores de clic a elementos o bases, ya que los movimientos se inician desde botones.
 * @param {Stack} stack - La instancia de la pila a renderizar.
 * @param {HTMLElement} containerElement - El elemento DOM del contenedor de la pila del desafío (#stack-challenge-left, etc.).
 * @param {string} stackId - El ID de la pila ('left', 'middle', 'right').
 */
export function renderChallengeStack(stack, containerElement, stackId) {
     // console.log(`Renderizando pila (Botones): ${stackId}. Contenido DS (abajo a arriba):`, [...stack.items]); // Log

     // Limpiar solo los elementos de la pila, mantener la base si está en HTML.
    while (containerElement.childElementCount > 1) { // Mientras haya más de un hijo (más que la base)
        containerElement.removeChild(containerElement.firstChild); // Remover el primer hijo (la cima visual)
    }

    if (!stack.isEmpty()) {
        // Renderizar elementos de abajo hacia arriba
        stack.items.forEach(item => {
            // console.log(`  Insertando elemento ${item} en pila ${stackId}`); // Log

            const element = document.createElement('div');
            element.className = 'stack-element';
            element.textContent = item;

            // Ya NO añadimos addEventListener aquí, los clics son en los botones.

            // Insertar elementos antes de la base (que es el último hijo).
            containerElement.insertBefore(element, containerElement.querySelector('.stack-base'));
        });
    }
    // Nota: No necesitamos mostrar mensaje de pila vacía en las pilas del desafío por diseño.

    // La base ya no necesita listener aquí; su clic no inicia un movimiento directo en esta interfaz.
     const baseElement = containerElement.querySelector('.stack-base');
     if (baseElement && baseElement._hasClickListener) {
     }
}