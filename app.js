async function loadAndRenderProducts() {
    try {
        const response = await fetch('productos.json');
        
        if (!response.ok) {
            throw new Error(`Error HTTP! estado: ${response.status}`);
        }
        
        const productos = await response.json();
        console.log('Datos cargados:', productos); // Verifica en consola
        
        if (!productos || !Array.isArray(productos)) {
            throw new Error('Formato de datos inválido');
        }
        
        renderProductos(productos);
    } catch (error) {
        console.error('Error al cargar productos:', error);
        showErrorToUser(error);
    }
}

function renderProductos(productos) {
    console.log('Iniciando renderizado...'); // Depuración
    
    // 1. Definición de contenedores con validación mejorada
    const contenedores = {
        "Anillos": document.querySelector("#anillos-container .productos"),
        "Collares": document.querySelector("#collares-container .productos"),
        "Pulseras": document.querySelector("#pulseras-container .productos"),
        "Conjuntos": document.querySelector("#conjuntos-container .productos")
    };
    
    console.log('Contenedores encontrados:', contenedores); // Depuración

    // 2. Verificar contenedores
    for (const [categoria, container] of Object.entries(contenedores)) {
        if (!container) {
            console.error(`Contenedor no encontrado para: ${categoria}`);
            return;
        }
        container.innerHTML = ''; // Limpiar solo el contenido de productos
    }

    // 3. Validar y filtrar productos
    const productosValidos = productos.filter(p => {
        const valido = p.Categoria && p.Nombre && p.Precio !== undefined;
        if (!valido) {
            console.warn('Producto inválido:', p);
        }
        return valido;
    });
    
    console.log('Productos válidos:', productosValidos); // Depuración

    // 4. Renderizado de productos
    productosValidos.forEach(producto => {
        const container = contenedores[producto.Categoria];
        if (!container) {
            console.warn(`Categoría no mapeada: ${producto.Categoria}`);
            return;
        }

        const imagenUrl = `images/${producto.imagen || 'placeholder.jpg'}`;
        
        container.insertAdjacentHTML('beforeend', `
            <div class="producto" data-id="${producto.id || ''}">
                <div class="imagen-container">
                    <img src="${imagenUrl}" alt="${producto.Nombre}" 
                         onerror="this.src='images/placeholder.jpg';this.onerror=null;">
                </div>
                <div class="info-producto">
                    <h3>${producto.Nombre}</h3>
                    <p class="precio">$${producto.Precio.toLocaleString('es-ES')}</p>
                    <p class="stock">${producto.Disponible || 0} disponibles</p>
                    ${producto.Descripcion ? `<p class="descripcion">${producto.Descripcion}</p>` : ''}
                    <button class="btn-carrito">Añadir al carrito</button>
                </div>
            </div>
        `);
    });
    
    console.log('Renderizado completado'); // Depuración
}

function showErrorToUser(error) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-message';
    errorContainer.innerHTML = `
        <p>⚠️ No se pudieron cargar los productos</p>
        <small>${error.message}</small>
    `;
    document.querySelector('main').prepend(errorContainer);
}

// Iniciar la carga cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', loadAndRenderProducts);