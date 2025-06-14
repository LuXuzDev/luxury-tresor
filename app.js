function renderProductos(productos) {
    // Usa la ruta RAW de GitHub y asegura mayúsculas en extensiones
    const baseUrl = 'https://raw.githubusercontent.com/LuXuzDev/luxury-tresor/main/';
    const baseImagePath = baseUrl + 'images/';
    
    // Contenedores por categoría
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

        // Manejo robusto de imágenes
        let imagenUrl;
        if (producto.imagen) {
            // Normaliza el nombre de la imagen
            const nombreImagen = producto.imagen
                .trim()
                .replace(/\.jpe?g$/i, '.JPG') // Fuerza extensión .JPG
                .replace(/\s+/g, '_'); // Reemplaza espacios por guiones bajos
            
            imagenUrl = `${baseImagePath}${nombreImagen}`;
        } else {
            // Usa el placeholder desde la carpeta images
            imagenUrl = `${baseImagePath}placeholder.jpg`;
        }

        // HTML del producto
        container.innerHTML += `
            <div class="producto" data-id="${producto.id || ''}">
                <div class="imagen-container">
                    <img src="${imagenUrl}" 
                         alt="${producto.Nombre}"
                         onerror="this.onerror=null;this.src='${baseImagePath}placeholder.jpg'">
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