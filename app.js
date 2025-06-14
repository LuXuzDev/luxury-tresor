// Carrito global
let carrito = [];
var numero = 5353796979;

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
        
        // Inicialización del menú responsive
        document.getElementById('menu-toggle')?.addEventListener('click', function() {
            document.getElementById('menu')?.classList.toggle('active');
        });
        
        // Evento para el icono del carrito
        document.getElementById('btn-carrito').addEventListener('click', mostrarCarrito);
        
    } catch (error) {
        console.error('Error al cargar el catálogo:', error);
        mostrarError(error);
    }
});

function renderProductos(productos) {
    const baseUrl = 'https://raw.githubusercontent.com/LuXuzDev/luxury-tresor/main/';
    const baseImagePath = baseUrl + 'images/';
    
    const contenedores = {
        "Anillos": document.getElementById("lista-productos"),
        "Collares": document.getElementById("collares-container"),
        "Pulseras": document.getElementById("pulseras-container"),
        "Conjuntos": document.getElementById("conjuntos-container")
    };

    Object.values(contenedores).forEach(container => {
        if (container) container.innerHTML = '';
    });

    productos.forEach(producto => {
        const container = contenedores[producto.Categoria];
        if (!container) return;

        const imagenUrl = producto.Imagen 
            ? `${baseImagePath}${producto.Imagen}`
            : `${baseImagePath}placeholder.jpg`;

        const productoHTML = `
            <div class="producto" data-id="${producto.id || ''}">
                <div class="imagen-container">
                    <img src="${imagenUrl}" alt="${producto.Nombre}" 
                         onerror="this.src='${baseImagePath}placeholder.jpg'">
                </div>
                <div class="info-producto">
                    <h3>${producto.Nombre}</h3>
                    <p class="precio">$${producto.Precio.toLocaleString('es-ES')}</p>
                    <p class="stock">${producto.Disponible} disponibles</p>
                    ${producto.Descripcion ? `<p class="descripcion">${producto.Descripcion}</p>` : ''}
                    <div class="botones-producto">
                        <button class="btn-whatsapp" data-id="${producto.id || ''}">
                            Pedir por WhatsApp
                        </button>
                        <button class="btn-carrito" data-id="${producto.id || ''}" 
                                ${producto.Disponible <= 0 ? 'disabled' : ''}>
                            ${producto.Disponible <= 0 ? 'Agotado' : 'Agregar al carrito'}
                        </button>
                    </div>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', productoHTML);

        // Asignar eventos a los botones recién creados
        const productoElement = container.lastElementChild;
        productoElement.querySelector('.btn-whatsapp').addEventListener('click', () => {
            pedirProductoWhatsApp(producto);
        });
        
        productoElement.querySelector('.btn-carrito').addEventListener('click', () => {
            if (producto.Disponible > 0) {
                agregarAlCarrito(producto);
                actualizarStockVisual(producto.id, producto.Disponible - 1);
            }
        });
    });
}


function agregarAlCarrito(producto) {
    const productoExistente = carrito.find(item => item.Nombre === producto.Nombre);
    
    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }
    
    producto.Disponible--;
    actualizarIconoCarrito();
}


function actualizarStockVisual(productoId, nuevoStock) {
    const productoElements = document.querySelectorAll(`.producto[data-id="${productoId}"]`);
    
    productoElements.forEach(element => {
        const stockElement = element.querySelector('.stock');
        const btnCarrito = element.querySelector('.btn-carrito');
        
        if (stockElement) stockElement.textContent = `${nuevoStock} disponibles`;
        if (btnCarrito) {
            btnCarrito.disabled = nuevoStock <= 0;
            btnCarrito.textContent = nuevoStock <= 0 ? 'Agotado' : 'Agregar al carrito';
        }
    });
}


function actualizarIconoCarrito() {
    const iconoCarrito = document.getElementById('contador-carrito');
    if (iconoCarrito) {
        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        iconoCarrito.textContent = totalItems;
    }
}


function mostrarCarrito() {
    const modal = document.getElementById('modal-carrito');
    const modalBody = document.getElementById('modal-body');
    const totalElement = document.getElementById('total-carrito');
    
    modal.style.display = 'flex';
    
    modalBody.innerHTML = carrito.length === 0 
        ? '<p>El carrito está vacío</p>' 
        : carrito.map(item => `
            <div class="item-carrito">
                <span>${item.Nombre} x${item.cantidad}</span>
                <span>$${item.Precio * item.cantidad}</span>
            </div>
        `).join('');
    
    totalElement.textContent = `$${carrito.reduce((sum, item) => sum + (item.Precio * item.cantidad), 0)}`;
    
    // Configurar botón de WhatsApp del modal
    const btnWhatsappModal = document.getElementById('enviar-pedido');
    if (carrito.length > 0) {
        btnWhatsappModal.style.display = 'block';
        btnWhatsappModal.addEventListener('click', enviarPedidoWhatsApp);
    } else {
        btnWhatsappModal.style.display = 'none';
    }
}


function pedirProductoWhatsApp(producto) {
    const mensaje = `¡Hola! Estoy interesado/a en este producto:\n\n` +
                   `*${producto.Nombre}*\n` +
                   `Ref: ${producto.id || 'N/A'}\n\n` +
                   `¿Podrían confirmarme:\n` +
                   `1. Disponibilidad\n` +
                   `2. Forma de pago\n` +
                   `3. Tiempo de entrega`;
    
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, '_blank');
}


// Función para pedidos del carrito (versión mejorada)
function enviarPedidoWhatsApp() {
    let mensaje = `¡Buen día! Quisiera solicitar estos productos:\n\n` +
                 carrito.map(item => `▸ ${item.Nombre} (Cantidad: ${item.cantidad})`).join('\n') +
                 `\n\nPor favor indíquenme:\n` +
                 `1. Disponibilidad de los items\n` +
                 `2. Total a pagar\n` +
                 `3. Opciones de envío`;
    
    const urlWhatsApp = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsApp, '_blank');
    
    // Vaciar carrito
    carrito = [];
    actualizarIconoCarrito();
    document.getElementById('modal-carrito').style.display = 'none';
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

// Cerrar modal al hacer clic en el botón
document.getElementById('cerrar-modal')?.addEventListener('click', () => {
    document.getElementById('modal-carrito').style.display = 'none';
});