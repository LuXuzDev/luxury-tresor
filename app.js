document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 1. Cargar datos
        const response = await fetch('productos.json');
        
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        
        const productos = await response.json();
        console.log('Productos cargados:', productos);
        
        // 2. Filtrar y renderizar
        renderProductos(productos.filter(p => p.Disponible > 0));
    } catch (error) {
        console.error('Error:', error);
        showError(error);
    }
});

function renderProductos(productos) {
    // Contenedores actualizados para MATCHEAR TU HTML
    const contenedores = {
        "Anillos": document.getElementById("lista-productos"),
        "Collares": document.querySelector("#collares .productos"),
        "Pulseras": document.querySelector("#pulseras .productos"),
        "Conjuntos": document.querySelector("#conjuntos .productos")
    };
    
    // Crear contenedores si no existen
    Object.entries(contenedores).forEach(([categoria, container]) => {
        if (!container) {
            const section = document.getElementById(categoria.toLowerCase());
            if (section) {
                section.innerHTML += `<div class="productos"></div>`;
                contenedores[categoria] = section.querySelector('.productos');
            }
        }
    });

    // Limpiar y renderizar
    Object.values(contenedores).forEach(c => c && (c.innerHTML = ''));
    
    productos.forEach(producto => {
        const container = contenedores[producto.Categoria];
        if (!container) {
            console.warn(`Categoría sin contenedor: ${producto.Categoria}`);
            return;
        }
        
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
    const errorHtml = `
        <div class="error">
            <h3>⚠️ Error al cargar productos</h3>
            <p>${error.message}</p>
            <button onclick="location.reload()">Recargar</button>
        </div>
    `;
    
    document.querySelector('main').insertAdjacentHTML('afterbegin', errorHtml);
}