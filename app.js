function renderProductos(productos) {
    const baseImagePath = 'https://luxuzdev.github.io/luxury-tresor/images/';
    const categorias = {
        "Anillos": "anillos-container",
        "Collares": "collares-container",
        "Pulseras": "pulseras-container",
        "Conjuntos": "conjuntos-container"
    };

    // Limpiar contenedores (con validación)
    Object.entries(categorias).forEach(([categoria, id]) => {
        const container = document.getElementById(id);
        
        if (!container) {
            console.error(`¡Contenedor no encontrado! ID: ${id}`);
            return;
        }

        // Conservar solo el título <h2>
        const children = Array.from(container.children);
        children.forEach(child => {
            if (!child.classList.contains('titulo-categoria')) {  // Añade esta clase a tus <h2>
                child.remove();
            }
        });
    });

    // Agregar productos
    productos.forEach(producto => {
        const containerId = categorias[producto.Categoria];
        if (!containerId) {
            console.warn(`Categoría no definida: ${producto.Categoria}`);
            return;
        }

        const container = document.getElementById(containerId);
        if (!container) return;

        const imagenUrl = producto.imagen ? `${baseImagePath}${producto.imagen}` : 'placeholder.jpg';
        
        container.innerHTML += `
            <div class="producto">
                <img src="${imagenUrl}" alt="${producto.Nombre}">
                <h3>${producto.Nombre}</h3>
                <p><strong>Precio:</strong> $${producto.Precio}</p>
                <p><strong>Disponibles:</strong> ${producto.Disponible}</p>
            </div>
        `;
    });
}