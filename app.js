// app.js
// Controlador principal de la aplicación para la navegación y la inicialización de módulos.

// Importar los módulos principales de cada estructura de datos
// Asegúrate de que estos archivos exporten un objeto o clase principal que tenga un método init().
import { stackModule } from './stack/stack.js';
import { queueModule } from './queue/queue.js';
import { bstModule } from './bst/bst.js'; // Asegúrate de que bst/bst.js exporte bstModule


document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');

    // Objeto principal de la aplicación
    const app = {
        init() {
            console.log("App initialization started.");

            // Inicializar navegación
            navItems.forEach(item => {
                item.addEventListener('click', () => {
                    const sectionName = item.id.replace('-nav', ''); // Obtiene 'stack', 'queue', 'bst'
                    this.showSection(sectionName);
                });
            });

            // Inicializar módulos de cada estructura de datos
            // Cada módulo debe tener un método init()
            // El error "Cannot read properties of undefined (reading 'bind')"
            // podría ocurrir aquí si el archivo importado existe pero la exportación `bstModule`
            // no está correctamente definida (ej. si solo está el placeholder sin export).
            stackModule.init();
            queueModule.init();
            bstModule.init(); // Asegúrate de que bst/bst.js exista y exporte bstModule

            // Mostrar la sección de Pila por defecto al cargar
            this.showSection('stack'); // Cambiado a 'stack' que es la primera visible en HTML

            console.log("App initialization finished.");
        },

        showSection(sectionName) {
            console.log(`Showing section: ${sectionName}`);
            // Ocultar todas las secciones
            sections.forEach(section => {
                section.classList.remove('active');
            });

            // Desactivar todos los ítems de navegación
            navItems.forEach(item => {
                item.classList.remove('active');
            });

            // Mostrar la sección seleccionada y activar el ítem de navegación correspondiente
            const selectedSection = document.getElementById(`${sectionName}-section`);
            if (selectedSection) {
                selectedSection.classList.add('active');
            }

            const selectedNavItem = document.getElementById(`${sectionName}-nav`);
            if (selectedNavItem) {
                selectedNavItem.classList.add('active');
            }

            // Opcional: Resetear o pausar tutoriales/desafíos activos al cambiar de sección
            // Llamar a métodos resetModule() si existen en cada módulo.
            // Asegurarse de que los módulos y sus métodos existan antes de llamar.
             if (stackModule && stackModule.resetModule) {
                  stackModule.resetModule();
             }
             if (queueModule && queueModule.resetModule) {
                  queueModule.resetModule();
             }
             if (bstModule && bstModule.resetModule) { // Llama a resetModule del placeholder por ahora
                  bstModule.resetModule();
             }
        }
    };

    // Inicializar la aplicación cuando el DOM esté listo
    app.init();
});