// Lógica para la visualización de la Pila en el DOM

/**
 * Renderiza el estado actual de la pila en el contenedor HTML.
 * @param {Stack} stackInstance 
 * @param {HTMLElement} containerElement 
 */
export function renderStack(stackInstance, containerElement) {
    // Selecciona todos los elementos actuales de la pila excepto la base
    const elements = containerElement.querySelectorAll('.stack-element');
    // Elimina los elementos existentes
    elements.forEach(el => el.remove());

    stackInstance.items.forEach(item => {
        const element = document.createElement('div');
        element.className = 'stack-element';
        element.textContent = item;

        // Inserta el nuevo elemento *antes* del elemento base de la pila
        // El elemento base es el último hijo dentro de stackContainer en el HTML
        containerElement.insertBefore(element, containerElement.lastElementChild);

        // Efecto de animación simple para que aparezca
        // Usamos un pequeño retardo para asegurar que la inserción en el DOM suceda antes
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 10);
    });
}

