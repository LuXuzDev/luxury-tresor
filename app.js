document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 1. Cargar datos del JSON con timestamp para evitar caché
        const response = await fetch('productos.json?' + new Date().getTime());
        
        if (!response.ok) {
            throw new Error(`Error al cargar productos: ${response.status}`);
        }
        
        const productos = await response.json();
        console.log('Productos cargados:', productos);
        
        // 2. Filtrar productos disponibles y renderizar
        const productosDisponibles = productos.filter(p => p.Disponible > 0);
        renderProductos(productosDisponibles);
    } catch (error) {
        console.error('Error al cargar el catálogo:', error);
        mostrarError(error);
    }
});

function renderProductos(productos) {
    // Configuración de rutas base
    const baseUrl = 'https://luxuzdev.github.io/luxury-tresor/';
    const baseImagePath = baseUrl + 'images/';
    
    // Contenedores por categoría (actualizados para tu HTML)
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

    // Renderizar cada producto
    productos.forEach(producto => {
        const container = contenedores[producto.Categoria];
        if (!container) {
            console.warn(`No se encontró contenedor para categoría: ${producto.Categoria}`);
            return;
        }

        const placeholderBase64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNmNWY1ZjUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBhbGlnbm1lbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzk5OSI+SW1hZ2VuIG5vIGRpc3BvbmlibGU8L3RleHQ+PC9zdmc+';
        
        // Manejo seguro de imágenes
        const imagenUrl = producto.imagen 
            ? `${baseImagePath}${producto.imagen}`
            : `${baseUrl}placeholder.jpg`; // Imagen por defecto en raíz

        container.innerHTML += `
            <div class="producto" data-id="${producto.id || ''}">
                <div class="imagen-container">
                    <img src="${imagenUrl}" 
                         alt="${producto.Nombre}"
                         onerror="this.onerror=null;this.src='${baseUrl}placeholder.jpg'">
                </div>
                <div class="info-producto">
                    <h3>${producto.Nombre}</h3>
                    <p class="precio">$${producto.Precio.toLocaleString('es-ES')}</p>
                    <p class="stock">${producto.Disponible} disponibles</p>
                    ${producto.Descripcion ? `<p class="descripcion">${producto.Descripcion}</p>` : ''}
                    <button class="btn-carrito">Añadir al carrito</button>
                </div>
            </div>
        `;
    });
}


function mostrarError(error) {
    const main = document.querySelector('main');
    if (main) {
        main.insertAdjacentHTML('afterbegin', `
            <div class="error-mensaje">
                <h3>⚠️ Error al cargar el catálogo</h3>
                <p>${error.message}</p>
                <small>Por favor recarga la página o intenta más tarde</small>
                <button onclick="window.location.reload()">Recargar Página</button>
            </div>
        `);
    }
}

// Opcional: Inicialización del menú responsive
document.getElementById('menu-toggle')?.addEventListener('click', function() {
    document.getElementById('menu')?.classList.toggle('active');
});