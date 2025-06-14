// Cargar el JSON automáticamente al abrir la página
document.addEventListener('DOMContentLoaded', function() {
    const jsonUrl = 'https://luxuzdev.github.io/luxury-tresor/productos.json'; 
    
    fetch(jsonUrl)
        .then(response => {
            if (!response.ok) throw new Error("No se pudo cargar el JSON");
            return response.json();
        })
        .then(productos => {
            // Filtrar productos disponibles (>0)
            const disponibles = productos.filter(p => p.Disponible > 0);
            renderProductos(disponibles);
        })
        .catch(error => {
            console.error("Error:", error);
            document.body.innerHTML += `<p style="color:red">Error al cargar el catálogo. Verifica que el archivo 'productos.json' exista.</p>`;
        });
});

// La función renderProductos se mantiene igual
function renderProductos(productos) {
    const categorias = {
        "Anillos": document.getElementById("anillos-container"),
        "Collares": document.getElementById("collares-container"),
        "Pulseras": document.getElementById("pulseras-container"),
        "Conjuntos": document.getElementById("conjuntos-container")
    };

    // Limpiar contenedores
    Object.values(categorias).forEach(container => {
        if (container.children.length > 1) {
            container.querySelectorAll('.producto').forEach(el => el.remove());
        }
    });

    // Agregar productos
    productos.forEach(producto => {
        const categoriaContainer = categorias[producto.Categoria];
        if (categoriaContainer) {
            categoriaContainer.innerHTML += `
                <div class="producto">
                    <h3>${producto.Nombre}</h3>
                    <p><strong>Precio:</strong> $${producto.Precio}</p>
                    <p><strong>Disponibles:</strong> ${producto.Disponible}</p>
                    ${producto.Descripcion ? `<p>${producto.Descripcion}</p>` : ''}
                </div>
            `;
        }
    });
}