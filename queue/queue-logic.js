// queue/queue-logic.js
// Definición de la clase Cola (Queue) - Lógica FIFO

/**
 * Implementación básica de una estructura de datos Cola (Queue).
 * Sigue el principio FIFO (First-In, First-Out).
 */
export class Queue {
    constructor() {
        // Array para almacenar los elementos de la cola.
        // El frente de la cola es _items[0], el final es _items[_items.length - 1].
        this._items = []; // Usar convención _ para propiedad interna
    }

    /**
     * Añade un nuevo elemento al final de la cola (Enqueue).
     * @param {any} element - El elemento a añadir.
     */
    enqueue(element) {
        this._items.push(element);
    }

    /**
     * Remueve y retorna el elemento del frente de la cola (Dequeue).
     * Retorna undefined si la cola está vacía.
     * @returns {any | undefined} El elemento del frente o undefined.
     */
    dequeue() {
        if (this.isEmpty()) {
            return undefined;
        }
        // shift() remueve el primer elemento y mueve los índices
        return this._items.shift();
    }

    /**
     * Retorna el elemento del frente de la cola sin removerlo (Front).
     * Retorna undefined si la cola está vacía.
     * @returns {any | undefined} El elemento del frente o undefined.
     */
    front() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this._items[0];
    }

     /**
      * Retorna true si la cola no contiene elementos y false en caso contrario.
      * @returns {boolean} True si la cola está vacía.
      */
    isEmpty() {
        return this._items.length === 0;
    }

    /**
     * Retorna el número de elementos en la cola.
     * @returns {number} El tamaño de la cola.
     */
    size() {
        return this._items.length;
    }

     /**
      * Remueve todos los elementos de la cola.
      */
     clear() {
         this._items = [];
     }

    /**
     * Retorna una representación en string de la cola (útil para depuración).
     * Los elementos se muestran del frente al final.
     * @returns {string} Representación en string de la cola.
     */
    toString() {
        return this._items.toString();
    }

    /**
     * Retorna el array interno de elementos (usado por funciones de renderizado/gestores).
     * @returns {Array<any>} El array interno de la cola.
     */
    get items() {
        return [...this._items]; // Retornar una copia para evitar modificación externa directa
    }
}