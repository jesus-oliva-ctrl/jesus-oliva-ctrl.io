// stack/stack-challenge-ui.js
// Funciones para actualizar la interfaz visual específica del desafío de la Pila. - Contenido original

/**
 * Renderiza el contenido de un array como una secuencia de elementos en un contenedor DOM.
 * Usado para mostrar la configuración objetivo de una pila en el desafío.
 */
function renderSequence(sequenceArray, containerElement) {
    containerElement.innerHTML = ''; // Limpia el contenido actual
    if (sequenceArray && sequenceArray.length > 0) {
         sequenceArray.forEach(item => {
            const element = document.createElement('div');
            element.className = 'sequence-item'; // Clase CSS para los ítems de secuencia
            element.textContent = item;
            containerElement.appendChild(element);
        });
    } else {
         // Mostrar un texto indicando que está vacío si el array está vacío
         const emptyMsg = document.createElement('span'); // Usar span o div pequeño
         emptyMsg.className = 'text-gray-400 italic text-sm'; // Clases de estilo
         emptyMsg.textContent = 'Vacío';
         containerElement.appendChild(emptyMsg);
    }
}

/**
 * Muestra la configuración objetivo de las tres pilas en los elementos DOM correspondientes.
 * @param {object|null} targetConfig - Objeto con las configuraciones objetivo { left: [], middle: [], right: [] }, o null para limpiar.
 * @param {object} targetElements - Objeto con los elementos DOM para mostrar el objetivo { leftTargetEl, middleTargetEl, rightTargetEl }.
 */
export function displayTargetConfig(targetConfig, targetElements) {
    if (!targetConfig) {
        // Limpiar todas las áreas objetivo si targetConfig es null.
        renderSequence([], targetElements.leftTargetEl);
        renderSequence([], targetElements.middleTargetEl);
        renderSequence([], targetElements.rightTargetEl);
        return;
    }

    // Renderizar el objetivo para cada pila
    renderSequence(targetConfig.left, targetElements.leftTargetEl);
    renderSequence(targetConfig.middle, targetElements.middleTargetEl);
    renderSequence(targetConfig.right, targetElements.rightTargetEl);
}