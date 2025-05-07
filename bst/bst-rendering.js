// Lógica para renderizar (dibujar) el ABB en SVG y sus animaciones.

// Constantes de visualización
const nodeRadius = 20; // Radio de los círculos/nodos
const levelHeight = 80; // Espacio vertical entre niveles del árbol

/**
 * Dibuja todo el Árbol Binario de Búsqueda en el elemento SVG.
 * @param {BinarySearchTree} bstInstance - La instancia del ABB a dibujar.
 * @param {SVGElement} svgElement - El elemento SVG donde dibujar.
 * @param {function(any): void} [nodeClickCallback=() => {}] - Función a llamar cuando se haga clic en un nodo.
 */
export function renderTree(bstInstance, svgElement, nodeClickCallback = () => {}) {
    svgElement.innerHTML = ''; // Limpia el SVG antes de redibujar.
    if (!bstInstance.root) return; // No dibujar si el árbol está vacío.

    // Calcula posición inicial de la raíz.
    const svgWidth = svgElement.clientWidth;
    const startX = svgWidth / 2; // Centrado horizontalmente
    const startY = 30; // Pequeño margen superior

    // Inicia el proceso de dibujo recursivo desde la raíz.
    // Pasa el elemento SVG, las constantes y la función de callback de clic.
    drawNode(bstInstance.root, startX, startY, svgWidth / 4, svgElement, nodeClickCallback);
}

/**
 * Dibuja un nodo y sus hijos recursivamente en el SVG.
 * Esta es una función auxiliar interna, no exportada.
 * @param {TreeNode} node - El nodo actual a dibujar.
 * @param {number} x - Posición horizontal del nodo.
 * @param {number} y - Posición vertical del nodo.
 * @param {number} horizontalOffset - Desplazamiento horizontal para los hijos.
 * @param {SVGElement} svgElement - El elemento SVG donde dibujar.
 * @param {number} nodeClickCallback - Función a llamar cuando se haga clic en el nodo.
 */
function drawNode(node, x, y, horizontalOffset, svgElement, nodeClickCallback) {
    if (!node) return;

    // Calcula posición de los hijos.
    const leftChildX = x - horizontalOffset;
    const rightChildX = x + horizontalOffset;
    const childY = y + levelHeight;

    // Dibuja línea al hijo izquierdo si existe y luego llama recursivamente.
    if (node.left) {
        drawLine(x, y + nodeRadius, leftChildX, childY - nodeRadius, svgElement);
        drawNode(node.left, leftChildX, childY, horizontalOffset / 2, svgElement, nodeClickCallback); // Dibuja hijo izquierdo
    }

    // Dibuja línea al hijo derecho si existe y luego llama recursivamente.
    if (node.right) {
        drawLine(x, y + nodeRadius, rightChildX, childY - nodeRadius, svgElement);
        drawNode(node.right, rightChildX, childY, horizontalOffset / 2, svgElement, nodeClickCallback); // Dibuja hijo derecho
    }

    // Dibuja el nodo actual (círculo y texto) y añade el manejador de clic.
    drawCircle(x, y, nodeRadius, node.value, node, svgElement, nodeClickCallback);
}

/**
 * Dibuja una línea SVG entre dos puntos.
 * Función auxiliar interna.
 * @param {number} x1 - Coordenada X inicio.
 * @param {number} y1 - Coordenada Y inicio.
 * @param {number} x2 - Coordenada X fin.
 * @param {number} y2 - Coordenada Y fin.
 * @param {SVGElement} svgElement - El elemento SVG donde añadir la línea.
 */
function drawLine(x1, y1, x2, y2, svgElement) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', '#95a5a6'); // Color línea
    line.setAttribute('stroke-width', 2);
    line.setAttribute('class', 'link'); // Clase CSS para estilos
    svgElement.appendChild(line);
}

/**
 * Dibuja un nodo SVG (círculo con texto) y añade manejador de clic.
 * Función auxiliar interna.
 * @param {number} cx - Coordenada X del centro del círculo.
 * @param {number} cy - Coordenada Y del centro del círculo.
 * @param {number} r - Radio del círculo.
 * @param {any} text - Texto a mostrar dentro del círculo (valor del nodo).
 * @param {TreeNode} nodeData - El objeto nodo de la estructura de datos asociado.
 * @param {SVGElement} svgElement - El elemento SVG donde añadir el círculo/texto.
 * @param {function(any): void} onClickCallback - Función a llamar al hacer clic en este nodo, pasando su valor.
 */
function drawCircle(cx, cy, r, text, nodeData, svgElement, onClickCallback) {
    // Crea un grupo SVG para contener el círculo y el texto.
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('transform', `translate(${cx},${cy})`);
    group.setAttribute('class', 'node'); // Clase CSS para estilos
    group.dataset.value = nodeData.value; // Almacena el valor del nodo como atributo de datos.

    // Crea el círculo SVG.
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('r', r);
    circle.setAttribute('cx', 0); // Centro en (0,0) relativo al grupo.
    circle.setAttribute('cy', 0);
    circle.setAttribute('fill', '#3498db'); // Color relleno
    circle.setAttribute('stroke', '#2980b9'); // Color borde
    circle.setAttribute('stroke-width', 2);

    // Crea el texto SVG.
    const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textElement.setAttribute('x', 0);
    textElement.setAttribute('y', 5); // Ajuste vertical.
    textElement.setAttribute('text-anchor', 'middle'); // Centrado horizontal.
    textElement.setAttribute('fill', 'white'); // Color texto.
    textElement.textContent = text; // El valor del nodo.

    // Añade elementos al grupo.
    group.appendChild(circle);
    group.appendChild(textElement);

    // Añade el grupo al SVG principal.
    svgElement.appendChild(group);

    // Añade el manejador de evento de clic usando el callback proporcionado.
    if (onClickCallback) { // Asegurarse de que se proporcionó un callback.
        group.addEventListener('click', () => onClickCallback(nodeData.value));
        // La lógica para habilitar/deshabilitar clics (pointer-events) se manejará fuera de aquí,
        // probablemente por el gestor de desafíos.
    }
}

/**
 * Anima la inserción de un valor en el árbol (resaltando el camino).
 * NOTA: Esta función requiere lógica para trazar el camino SIN modificar el árbol,
 * o para visualizar la inserción paso a paso. No completamente implementada aquí,
 * es un placeholder para la lógica de animación compleja de inserción.
 * @param {any} value - El valor que se está insertando.
 * @param {BinarySearchTree} bstInstance - La instancia del ABB.
 * @param {SVGElement} svgElement - El elemento SVG.
 */
export function animateInsertion(value, bstInstance, svgElement) {
     console.log(`Animar inserción de ${value}`);
     // Implementación de animación de inserción real iría aquí.
     // Podría usar highlightNode para resaltar nodos en el camino de búsqueda.
}

/**
 * Resalta visualmente un nodo en el SVG (cambia color temporalmente).
 * Usado para animar recorridos o inserciones.
 * @param {any} nodeValue - El valor del nodo a resaltar.
 * @param {string} color - El color de resaltado (ej. '#f39c12').
 * @param {SVGElement} svgElement - El elemento SVG donde encontrar el nodo.
 * @param {number} [duration=500] - Duración del resaltado en milisegundos.
 */
export function highlightNode(nodeValue, color, svgElement, duration = 500) {
    // Encuentra el círculo del nodo por su atributo de datos.
    const nodeElement = svgElement.querySelector(`.node[data-value="${nodeValue}"] circle`);
    if (nodeElement) {
        const originalFill = nodeElement.getAttribute('fill');
        // Inicia transición CSS si está definida para la propiedad fill.
        nodeElement.style.fill = color; // Cambia color.

        // Restaura el color original después de la duración.
        setTimeout(() => {
            nodeElement.style.fill = originalFill; // Vuelve al color original.
        }, duration);
    }
}

/**
 * Anima un recorrido del árbol (resaltando nodos en la secuencia).
 * Muestra la secuencia de valores en un elemento de resultado.
 * @param {Array<any>} sequence - La secuencia de valores del recorrido (ej. [10, 5, 15]).
 * @param {SVGElement} svgElement - El elemento SVG donde están los nodos.
 * @param {HTMLElement} traversalResultElement - El elemento DOM donde mostrar el resultado del recorrido.
 */
export function animateTraversal(sequence, svgElement, traversalResultElement) {
    const duration = 600; // Duración de la animación por nodo en ms.
    let delay = 0; // Retardo inicial.

    // Limpia el resultado de recorrido anterior.
    traversalResultElement.textContent = '';

    // Recorre la secuencia y anima cada nodo con un retardo creciente.
    sequence.forEach((value, index) => {
        setTimeout(() => {
            // Resalta el nodo actual.
            highlightNode(value, '#f39c12', svgElement, duration - 100); // Color naranja.

            // Añade el valor al resultado visual.
            traversalResultElement.textContent += value + (index === sequence.length - 1 ? '' : ' → ');

            // Acciones al finalizar el recorrido (último nodo).
            if (index === sequence.length - 1) {
                 // console.log("Animación de recorrido terminada.");
            }
        }, delay);
        delay += duration; // Incrementa el retardo para el próximo nodo.
    });
}