// Lógica para la visualización de la Cola

// Exporta la función principal de renderizado
export function renderQueue(queueInstance, containerElement) {
    containerElement.innerHTML = ''; // Limpia el contenedor

    if (queueInstance.isEmpty()) {
        // Mostrar mensaje si está vacía
        const message = document.createElement('div');
        message.className = 'empty-message';
        message.textContent = 'La cola está vacía'; // Texto traducido
        containerElement.appendChild(message);
    } else {
        // Mostrar elementos si no está vacía
        queueInstance.items.forEach((item, index) => {
            const element = document.createElement('div');
            element.className = 'queue-element';
            element.textContent = item;

            // Bordes opcionales para frente/final (configurados en CSS)
             if (index === 0) { element.style.borderLeftWidth = '4px'; }
             if (index === queueInstance.size() - 1) { element.style.borderRightWidth = '4px'; }

            containerElement.appendChild(element);
        });
    }
}
