function renderProductos(productos) {
    const contenedores = {
        "Anillos": document.getElementById("lista-productos"), // Cambiado a lista-productos
        "Collares": document.getElementById("collares-container"),
        "Pulseras": document.getElementById("pulseras-container"),
        "Conjuntos": document.getElementById("conjuntos-container")
    };

    // Limpiar contenedores (versión segura)
    Object.values(contenedores).forEach(container => {
        if (container) { // Verificar que el contenedor existe
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
        }
    });

    // Agregar productos
    productos.forEach(producto => {
        const container = contenedores[producto.Categoria];
        if (!container) {
            console.warn(`Contenedor no encontrado para categoría: ${producto.Categoria}`);
            return;
        }

        const productoHTML = `
            <div class="producto">
                <img src="images/${producto.imagen || 'placeholder.jpg'}" alt="${producto.Nombre}">
                <h3>${producto.Nombre}</h3>
                <p><strong>Precio:</strong> $${producto.Precio}</p>
                <p><strong>Disponibles:</strong> ${producto.Disponible}</p>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', productoHTML);
    });
}