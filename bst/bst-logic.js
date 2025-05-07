// Lógica pura de las estructuras de datos Nodo y Árbol Binario de Búsqueda

export class TreeNode {
    constructor(value) {
        this.value = value; // El valor almacenado en el nodo.
        this.left = null; // Referencia al nodo hijo izquierdo.
        this.right = null; // Referencia al nodo hijo derecho.
    }
}

export class BinarySearchTree {
    constructor() {
        this.root = null; // La raíz del árbol, inicialmente nula.
    }

    /**
     * Inserta un nuevo valor en el árbol.
     * @param {any} value
     * @returns {BinarySearchTree} 
     */
    insert(value) {
        const newNode = new TreeNode(value);

        // Si el árbol está vacío, el nuevo nodo se convierte en la raíz.
        if (this.root === null) {
            this.root = newNode;
            return this;
        }

        // Función auxiliar recursiva para encontrar la posición de inserción.
        const searchTree = (node) => {
            // Si el valor es menor, ir a la izquierda.
            if (value < node.value) {
                // Si no hay hijo izquierdo, insertar aquí.
                if (node.left === null) {
                    node.left = newNode;
                    return this;
                }
                // Si hay hijo izquierdo, seguir buscando recursivamente a la izquierda.
                return searchTree(node.left);
            }
            // Si el valor es mayor, ir a la derecha.
            else if (value > node.value) {
                // Si no hay hijo derecho, insertar aquí.
                if (node.right === null) {
                    node.right = newNode;
                    return this;
                }
                // Si hay hijo derecho, seguir buscando recursivamente a la derecha.
                return searchTree(node.right);
            }
            // Si el valor ya existe (igual), no hacemos nada y retornamos.
            return this;
        };

        // Empezar la búsqueda desde la raíz.
        return searchTree(this.root);
    }

    /**
     * Realiza un recorrido In-order (Izquierda -> Raíz -> Derecha) del árbol.
     * @param {TreeNode} [node=this.root]
     * @param {Array<any>} [result=[]] 
     * @returns {Array<any>} 
     */
    inOrderTraversal(node = this.root, result = []) {
        if (node !== null) {
            this.inOrderTraversal(node.left, result); 
            result.push(node.value); 
            this.inOrderTraversal(node.right, result); 
        }
        return result;
    }

    /**
     * Realiza un recorrido Pre-order (Raíz -> Izquierda -> Derecha) del árbol.
     * @param {TreeNode} [node=this.root] 
     * @param {Array<any>} [result=[]] 
     * @returns {Array<any>} 
     */
    preOrderTraversal(node = this.root, result = []) {
        if (node !== null) {
            result.push(node.value); 
            this.preOrderTraversal(node.left, result);
            this.preOrderTraversal(node.right, result);
        }
        return result;
    }

    /**
     * Realiza un recorrido Post-order (Izquierda -> Derecha -> Raíz) del árbol.
     * @param {TreeNode} [node=this.root] 
     * @param {Array<any>} [result=[]] 
     * @returns {Array<any>} 
     */
    postOrderTraversal(node = this.root, result = []) {
        if (node !== null) {
            this.postOrderTraversal(node.left, result); // Recorre subárbol izquierdo
            this.postOrderTraversal(node.right, result); // Recorre subárbol derecho
            result.push(node.value); // Visita la raíz
        }
        return result;
    }

    /**
     * Limpia el árbol, estableciendo la raíz a nulo.
     */
    clear() {
        this.root = null;
    }

    /**
     * Calcula la altura del árbol (número de nodos en el camino más largo desde la raíz hasta una hoja + 1).
     * @param {TreeNode} [node=this.root] 
     * @returns {number}
     */
    getTreeHeight(node = this.root) {
        if (node === null) {
            return 0; 
        }
        // La altura es 1 (por el nodo actual) más la mayor altura entre el subárbol izquierdo y derecho.
        const leftHeight = this.getTreeHeight(node.left);
        const rightHeight = this.getTreeHeight(node.right);

        return Math.max(leftHeight, rightHeight) + 1;
    }

}