function renderProductos(productos) {
    try {
        // 1. Definición de contenedores con validación
        const contenedores = {
            "Anillos": document.getElementById("lista-productos"),
            "Collares": document.getElementById("collares-container"),
            "Pulseras": document.getElementById("pulseras-container"),
            "Conjuntos": document.getElementById("conjuntos-container")
        };

        // 2. Verificar contenedores
        for (const [categoria, container] of Object.entries(contenedores)) {
            if (!container) {
                throw new Error(`Contenedor no encontrado para categoría: ${categoria}`);
            }
        }

        // 3. Limpieza segura de contenedores (conserva títulos)
        Object.values(contenedores).forEach(container => {
            const elementosProducto = container.querySelectorAll(':not(h2)');
            elementosProducto.forEach(elemento => elemento.remove());
        });

        // 4. Renderizado de productos con manejo de imágenes
        productos.forEach(producto => {
            const container = contenedores[producto.Categoria];
            if (!container) {
                console.warn(`Categoría no mapeada: ${producto.Categoria}`);
                return;
            }

            const imagenUrl = `images/${producto.imagen || 'placeholder.jpg'}`;
            const imagenFallback = 'images/placeholder.jpg';
            
            container.insertAdjacentHTML('beforeend', `
                <div class="producto" data-categoria="${producto.Categoria}">
                    <div class="imagen-container">
                        <img src="${imagenUrl}" alt="${producto.Nombre}" 
                             onerror="this.src='${imagenFallback}';this.onerror=null;">
                    </div>
                    <div class="info-producto">
                        <h3>${producto.Nombre}</h3>
                        <p class="precio">$${producto.Precio.toLocaleString()}</p>
                        <p class="stock">${producto.Disponible} disponibles</p>
                        ${producto.Descripcion ? `<p class="descripcion">${producto.Descripcion}</p>` : ''}
                        <button class="btn-carrito" data-id="${producto.id}">Añadir al carrito</button>
                    </div>
                </div>
            `);
        });

    } catch (error) {
        console.error("Error en renderProductos:", error);
        document.getElementById("lista-productos").innerHTML = `
            <div class="error">
                <p>Error al cargar los productos. Por favor recarga la página.</p>
                <small>${error.message}</small>
            </div>
        `;
    }
}