// Lógica para actualizar la interfaz visual del desafío de la Pila

/**
 * @param {Array<any>} sequenceArray - El array que contiene la secuencia objetivo.
 * @param {HTMLElement} containerElement - El elemento DOM donde mostrar la secuencia.
 */
export function updateTargetSequence(sequenceArray, containerElement) {
    containerElement.innerHTML = ''; // Limpia el contenido actual del contenedor
    sequenceArray.forEach(item => {
        const element = document.createElement('div');
        element.className = 'sequence-item'; // Clase CSS para estilizar los ítems de la secuencia
        element.textContent = item;
        containerElement.appendChild(element); // Añade el elemento al contenedor
    });
}

/**
 * @param {Array<any>} sequenceArray - El array que contiene la secuencia de salida del usuario.
 * @param {HTMLElement} containerElement - El elemento DOM donde mostrar la secuencia.
 */
export function updateOutputSequence(sequenceArray, containerElement) {
    containerElement.innerHTML = ''; // Limpia el contenido actual del contenedor
    sequenceArray.forEach(item => {
        const element = document.createElement('div');
        element.className = 'sequence-item'; // Clase CSS para estilizar los ítems de la secuencia
        element.textContent = item;
        containerElement.appendChild(element); // Añade el elemento al contenedor
    });
}

