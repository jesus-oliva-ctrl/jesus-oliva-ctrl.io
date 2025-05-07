// Funciones para actualizar la UI del desafío de la Cola

// Exporta la función para actualizar la lista de elementos que llegan
export function updateArrivingElements(sequenceArray, containerElement) {
    containerElement.innerHTML = '';
    sequenceArray.forEach(item => {
        const element = document.createElement('div');
        element.className = 'sequence-item';
        element.textContent = item;
        containerElement.appendChild(element);
    });
}

// Exporta la función para actualizar la lista de elementos procesados
export function updateProcessedElements(sequenceArray, containerElement) {
    containerElement.innerHTML = '';
    sequenceArray.forEach(item => {
        const element = document.createElement('div');
        element.className = 'sequence-item';
        element.textContent = item;
        containerElement.appendChild(element); 
    });
}
