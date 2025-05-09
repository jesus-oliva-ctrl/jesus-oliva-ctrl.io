// stack/stack-logic.js
// Definición de la clase Pila (Stack) - Contenido original

/**
 * Implementación básica de una estructura de datos Pila (Stack).
 * Sigue el principio LIFO (Last-In, First-Out).
 */
export class Stack {
    constructor() {
        // Array para almacenar los elementos de la pila.
        // El fondo de la pila es items[0], la cima es items[items.length - 1].
        this._items = []; // Usar convención _ para propiedad interna
    }

    /**
     * Añade un nuevo elemento a la cima de la pila.
     * @param {any} element - El elemento a añadir.
     */
    push(element) {
        this._items.push(element);
    }

    /**
     * Remueve y retorna el elemento de la cima de la pila.
     * Retorna undefined si la pila está vacía.
     * @returns {any | undefined} El elemento de la cima o undefined.
     */
    pop() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this._items.pop();
    }

    /**
     * Retorna el elemento de la cima de la pila sin removerlo.
     * Retorna undefined si la pila está vacía.
     * @returns {any | undefined} El elemento de la cima o undefined.
     */
    peek() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this._items[this._items.length - 1];
    }

     /**
      * Retorna true si la pila no contiene elementos y false en caso contrario.
      * @returns {boolean} True si la pila está vacía.
      */
    isEmpty() {
        return this._items.length === 0;
    }

    /**
     * Retorna el número de elementos en la pila.
     * @returns {number} El tamaño de la pila.
     */
    size() {
        return this._items.length;
    }

     /**
      * Remueve todos los elementos de la pila.
      */
     clear() {
         this._items = [];
     }

    /**
     * Retorna una representación en string de la pila (útil para depuración).
     * Los elementos se muestran del fondo a la cima.
     * @returns {string} Representación en string de la pila.
     */
    toString() {
        return this._items.toString();
    }

    /**
     * Retorna el array interno de elementos (úsado por funciones de renderizado/gestores).
     * @returns {Array<any>} El array interno de la pila.
     */
    get items() {
        return [...this._items]; // Retornar una copia para evitar modificación externa directa
    }

    // No necesitamos un setter si el array se manipula solo con push/pop/clear
    // set items(newItems) {
    //     this._items = newItems;
    // }
}