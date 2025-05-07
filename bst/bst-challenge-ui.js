// bst/bst-challenge-ui.js
// Funciones para actualizar la UI del desafío del ABB

/**
 * Renderiza la secuencia de nodos clicados por el usuario en el contenedor DOM del desafío.
 * @param {Array<any>} sequenceArray - El array con los valores de los nodos clicados.
 * @param {HTMLElement} containerElement - El elemento DOM donde mostrar la secuencia (#bst-user-sequence).
 */
export function updateUserSequence(sequenceArray, containerElement) {
    containerElement.innerHTML = ''; // Limpia el contenido actual
    sequenceArray.forEach(item => {
        const element = document.createElement('div');
        element.className = 'sequence-item'; // Usa la misma clase CSS para estilizar
        element.textContent = item;
        containerElement.appendChild(element); // Añade el elemento al contenedor
    });
}