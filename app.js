document.addEventListener('DOMContentLoaded', function() {
    const jsonUrl = 'https://luxuzdev.github.io/luxury-tresor/productos.json'; 
    
    fetch(jsonUrl)
        .then(response => {
            if (!response.ok) throw new Error("No se pudo cargar el JSON");
            return response.json();
        })
        .then(productos => {
            const disponibles = productos.filter(p => p.Disponible > 0);
            renderProductos(disponibles);
        })
        .catch(error => {
            console.error("Error:", error);
            document.body.innerHTML += `<p style="color:red">Error al cargar el catálogo: ${error.message}</p>`;
        });
});

function renderProductos(productos) {
    const baseImagePath = 'https://luxuzdev.github.io/luxury-tresor/images/';
    const categorias = {
        "Anillos": document.getElementById("anillos-container"),
        "Collares": document.getElementById("collares-container"),
        "Pulseras": document.getElementById("pulseras-container"),
        "Conjuntos": document.getElementById("conjuntos-container")
    };

    // Limpiar contenedores (conservando el título h2)
    Object.values(categorias).forEach(container => {
        const children = Array.from(container.children);
        children.forEach(child => {
            if (child.tagName !== 'H2') child.remove();
        });
    });

    // Agregar productos con imágenes
    productos.forEach(producto => {
        const categoriaContainer = categorias[producto.Categoria];
        if (categoriaContainer) {
            const imagenUrl = producto.imagen ? `${baseImagePath}${producto.imagen}` : 'placeholder.jpg';
            
            categoriaContainer.innerHTML += `
                <div class="producto">
                    <div class="producto-imagen">
                        <img src="${imagenUrl}" alt="${producto.Nombre}" loading="lazy">
                    </div>
                    <div class="producto-info">
                        <h3>${producto.Nombre}</h3>
                        <p><strong>Precio:</strong> $${producto.Precio}</p>
                        <p><strong>Disponibles:</strong> ${producto.Disponible}</p>
                        ${producto.Descripcion ? `<p class="descripcion">${producto.Descripcion}</p>` : ''}
                    </div>
                </div>
            `;
        }
    });
}