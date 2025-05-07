// Lógica pura de la estructura de datos Cola

export class Queue {
    constructor() {
        this.items = [];
    }

    enqueue(element) {
        this.items.push(element);
        return element;
    }

    dequeue() {
        if (this.isEmpty()) {
            // Considerar lanzar un error o retornar undefined/null
             console.warn("Dequeue called on empty queue");
            return null; // Manteniendo consistencia con el código original
        }
        return this.items.shift(); // shift() quita del inicio del array
    }

    front() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[0]; // El primer elemento es el frente
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }

    clear() {
        this.items = [];
    }
}