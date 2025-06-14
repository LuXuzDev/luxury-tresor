document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 1. Cargar datos (usando URL absoluta para GitHub Pages)
        const response = await fetch('https://luxuzdev.github.io/luxury-tresor/productos.json');
        
        if (!response.ok) {
            throw new Error(`Error al cargar productos: ${response.status}`);
        }
        
        const productos = await response.json();
        console.log('Productos cargados:', productos);
        
        // 2. Renderizar solo productos disponibles
        const disponibles = productos.filter(p => p.Disponible > 0);
        renderProductos(disponibles);
    } catch (error) {
        console.error('Error:', error);
        showError(error);
    }
});

function renderProductos(productos) {
    // Contenedores actualizados para coincidir con tu HTML
    const contenedores = {
        "Anillos": document.getElementById("lista-productos"),
        "Collares": document.getElementById("collares-container"),
        "Pulseras": document.getElementById("pulseras-container"),
        "Conjuntos": document.getElementById("conjuntos-container")
    };
    
    // Limpiar contenedores
    Object.values(contenedores).forEach(container => {
        if (container) container.innerHTML = '';
    });

    // Añadir productos
    productos.forEach(producto => {
        const container = contenedores[producto.Categoria];
        if (!container) return;
        
        container.innerHTML += `
            <div class="producto">
                <img src="images/${producto.imagen || 'placeholder.jpg'}" 
                     alt="${producto.Nombre}" 
                     onerror="this.src='images/placeholder.jpg'">
                <h3>${producto.Nombre}</h3>
                <p><strong>$${producto.Precio}</strong></p>
                <p>${producto.Disponible} disponibles</p>
            </div>
        `;
    });
}

function showError(error) {
    const main = document.querySelector('main');
    if (main) {
        main.innerHTML = `
            <div class="error" style="
                padding: 20px;
                background: #ffebee;
                border-left: 4px solid #f44336;
                margin: 20px;
            ">
                <h3>Error al cargar el catálogo</h3>
                <p>${error.message}</p>
                <small>Por favor intenta recargar la página</small>
            </div>
            ${main.innerHTML}
        `;
    }
}