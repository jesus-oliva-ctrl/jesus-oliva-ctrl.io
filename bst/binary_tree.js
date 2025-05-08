// bst/binary_tree.js
// Controlador principal para la vista del ABB.
// Conecta la UI con la lógica del ABB, renderizado y el gestor de desafíos.

// --- Importaciones ---
import { TreeNode, BinarySearchTree } from './bst-logic.js'; // Lógica del ABB
import { renderTree, animateInsertion, animateTraversal, highlightNode } from './bst-rendering.js'; // Renderizado y animación
import { updateUserSequence } from './bst-challenge-ui.js'; // UI del desafío (secuencia usuario)
import { BSTChallengeManager } from './bst-challenge-manager.js'; // Gestor de la lógica del desafío
// --- Fin Importaciones ---


document.addEventListener('DOMContentLoaded', function() {
    // --- Elementos DOM ---
    // Obtenemos referencias a todos los elementos HTML necesarios para el ABB y su desafío.
    const bstInput = document.getElementById('bst-input');
    const insertButton = document.getElementById('bst-insert');
    const resetButton = document.getElementById('bst-reset');
    const bstSVG = document.getElementById('bst-svg'); // Área de dibujo SVG principal
    const traversalResult = document.getElementById('traversal-result'); // Área de resultados de recorrido (para animación recorrido)
    const inorderButton = document.getElementById('bst-inorder');
    const preorderButton = document.getElementById('bst-preorder');
    const postorderButton = document.getElementById('bst-postorder');
    const startChallengeButton = document.getElementById('bst-start-challenge');
    const bstTraversalType = document.getElementById('bst-traversal-type'); // Elemento UI: Tipo de recorrido desafío
    const bstUserSequence = document.getElementById('bst-user-sequence'); // Elemento UI: Secuencia usuario desafío
    const bstChallengeStatus = document.getElementById('bst-challenge-status'); // Elemento UI: Estado desafío
    // --- Fin Elementos DOM ---


    // --- Instancia DS ---
    const bst = new BinarySearchTree(); // Instancia del ABB
    // --- Fin Instancia DS ---


    // --- Instancia del Gestor de Desafíos ---
    const bstChallenge = new BSTChallengeManager({
        bstInstance: bst, // La instancia del árbol
        svgElement: bstSVG, // El elemento SVG principal
        traversalResultElement: traversalResult, // Elemento para resultados de recorrido (si el gestor los necesita, aunque animateTraversal ya lo usa)
        uiElements: {
            traversalType: bstTraversalType,
            userSequence: bstUserSequence,
            challengeStatus: bstChallengeStatus,
            startButton: startChallengeButton,
        },
        uiUpdateFunctions: {
            updateUserSequence: updateUserSequence, // La función para actualizar UI de secuencia de usuario
        },
        renderingFunctions: {
            renderTree: renderTree, // La función para redibujar el árbol
            highlightNode: highlightNode, // Función para resaltar nodos
            animateTraversal: animateTraversal, // Función para animar recorridos
        }
    });
    // --- Fin Instancia Gestor Desafíos ---


    insertButton.addEventListener('click', function() {
        const value = parseInt(bstInput.value);
        if (!isNaN(value)) {
            bst.insert(value); // Usa instancia local del ABB
            // Renderiza el árbol, pasando el MÉTODO handleNodeClick del gestor como callback para los clics.
            renderTree(bst, bstSVG, bstChallenge.handleNodeClick.bind(bstChallenge)); // <-- Llama a renderTree importada, pasa callback del gestor

            // animateInsertion(value, bst, bstSVG); // Llama a función importada (si implementada)
            bstInput.value = '';
            // Si hay un desafío activo y el árbol cambia, resetea el desafío usando el gestor.
            if (bstChallenge.isActive()) { // Verifica estado via gestor
                bstChallenge.reset(); // Llama método reset del gestor
                 bstChallengeStatus.textContent = 'Árbol modificado. Desafío reiniciado.';
                  bstChallengeStatus.className = 'challenge-status';
            }
        } else {
            alert('Por favor, ingresa un número válido para insertar.');
        }
    });

    resetButton.addEventListener('click', function() {
        bst.clear(); // Usa instancia local del ABB
        // Renderiza el árbol vacío, pasando el callback del gestor (aunque no habrá nodos para clicar).
        renderTree(bst, bstSVG, bstChallenge.handleNodeClick.bind(bstChallenge)); // <-- Llama a renderTree importada

        // Si hay un desafío activo, resetea usando el gestor.
        if (bstChallenge.isActive()) { // Verifica estado via gestor
            bstChallenge.reset(); // Llama método reset del gestor
        }
        bstChallengeStatus.textContent = 'Árbol reiniciado.';
        bstChallengeStatus.className = 'challenge-status';
    });

    // Manejadores botones de Recorrido
    inorderButton.addEventListener('click', function() {
        if (!bst.root) { // Usa instancia local
            traversalResult.textContent = 'Árbol vacío. Inserta nodos primero.';
            return;
        }
        const sequence = bst.inOrderTraversal(); // Usa instancia local
        // Anima el recorrido usando la función importada.
        // El resultado del recorrido ya se actualiza dentro de animateTraversal.
         animateTraversal(sequence, bstSVG, traversalResult); // <-- Llama a función importada con argumentos
    });

    preorderButton.addEventListener('click', function() {
         if (!bst.root) { // Usa instancia local
             traversalResult.textContent = 'Árbol vacío. Inserta nodos primero.';
             return;
         }
        const sequence = bst.preOrderTraversal(); // Usa instancia local
         animateTraversal(sequence, bstSVG, traversalResult); // <-- Llama a función importada con argumentos
    });

    postorderButton.addEventListener('click', function() {
         if (!bst.root) { // Usa instancia local
             traversalResult.textContent = 'Árbol vacío. Inserta nodos primero.';
             return;
         }
        const sequence = bst.postOrderTraversal(); // Usa instancia local
         animateTraversal(sequence, bstSVG, traversalResult); // <-- Llama a función importada con argumentos
    });

    // Manejador botón Iniciar Desafío
    startChallengeButton.addEventListener('click', function() {
        // Llama a los métodos start/reset del gestor de desafío basado en su estado.
         if (bstChallenge.isActive()) { // Verifica estado via gestor
             bstChallenge.reset(); // Llama método reset del gestor
         } else {
            bstChallenge.start(); // Llama método start del gestor
         }
    });


    // --- Inicialización Vista ---
    // Dibuja el árbol inicialmente, pasando el método handleNodeClick del gestor como callback para los clics.
    renderTree(bst, bstSVG, bstChallenge.handleNodeClick.bind(bstChallenge)); // <-- Llama a renderTree importada, pasa callback del gestor

    // Deshabilita clics en nodos por defecto (hasta que inicie desafío).
    bstChallenge.enableNodeClicking(false); // Llama al método del gestor
    // --- Fin Inicialización ---
});