// Cargar el Excel automáticamente al abrir la página
document.addEventListener('DOMContentLoaded', function() {
    const excelUrl = 'productos.xlsx'; // Ruta relativa al archivo en tu repo
    
    fetch(excelUrl)
        .then(response => {
            if (!response.ok) throw new Error("No se pudo cargar el Excel");
            return response.arrayBuffer();
        })
        .then(data => {
            const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const productos = XLSX.utils.sheet_to_json(firstSheet);
            
            // Filtrar productos disponibles (>0)
            const disponibles = productos.filter(p => p.Disponible > 0);
            renderProductos(disponibles);
        })
        .catch(error => {
            console.error("Error:", error);
            document.body.innerHTML += `<p style="color:red">Error al cargar el catálogo. Verifica que el archivo 'productos.xlsx' exista.</p>`;
        });
});

function renderProductos(productos) {
    const categorias = {
        "Anillos": document.getElementById("anillos-container"),
        "Collares": document.getElementById("collares-container"),
        "Pulseras": document.getElementById("pulseras-container"),
        "Conjuntos": document.getElementById("conjuntos-container")
    };

    // Limpiar contenedores
    Object.values(categorias).forEach(container => {
        if (container.children.length > 1) { // Deja el <h2>
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