document.addEventListener('DOMContentLoaded', function() {
    // Navegacion de Documentos
    const navButtons = document.querySelectorAll('.nav-btn');
    const views = document.querySelectorAll('.view');
    const exploreButtons = document.querySelectorAll('.explore-btn');
    
    // Cambiar Vistas
    function switchView(viewId) {
        // Esconder vistas
        views.forEach(view => {
            view.classList.remove('active');
        });
        
        // Desactivar los botones de navegacion
        navButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Seleccionar la seccion de navegacion
        const selectedView = document.getElementById(`${viewId}-view`);
        if (selectedView) {
            selectedView.classList.add('active');
        }
        
        // Activar el boton de navegacion seleccionado
        const selectedBtn = document.getElementById(`${viewId}-btn`);
        if (selectedBtn) {
            selectedBtn.classList.add('active');
        }
    }
    
    // Colocalos los botones de navegacion
    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const viewId = this.id.replace('-btn', '');
            switchView(viewId);
        });
    });
    
    // Colocamos los botones de exploracion
    exploreButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            switchView(target);
        });
    });
    
    // Iniciar la app con la vista de inicio
    switchView('home');
    
});