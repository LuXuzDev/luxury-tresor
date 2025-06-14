// Carrito global
let carrito = [];

function renderProductos(productos) {function renderProductos(productos) {
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
            ? `${baseImagePath}${producto.Imagen.replace(/\.(png|jpe?g)$/i, '.JPG')}`
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

// Funciones para los botones
function pedirPorWhatsapp(producto) {
    const mensaje = `Hola, me interesa el producto: ${producto.Nombre} ($${producto.Precio})`;
    const urlWhatsapp = `https://wa.me/+5353796979?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsapp, '_blank');
}

// Función mejorada para agregar al carrito
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
    actualizarStockVisual(producto.id, producto.Disponible);
}

function actualizarStockVisual(productoId, nuevoStock) {
    const stockElements = document.querySelectorAll(`.producto[data-id="${productoId}"] .stock`);
    const botonesCarrito = document.querySelectorAll(`.producto[data-id="${productoId}"] .btn-carrito`);
    
    stockElements.forEach(el => el.textContent = `${nuevoStock} disponibles`);
    botonesCarrito.forEach(btn => {
        btn.disabled = nuevoStock <= 0;
        btn.textContent = nuevoStock <= 0 ? 'Agotado' : 'Añadir al carrito';
    });
}

// Actualiza el ícono del carrito
function actualizarIconoCarrito() {
    const iconoCarrito = document.getElementById('carrito-icono');
    if (iconoCarrito) {
        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        iconoCarrito.setAttribute('data-count', totalItems);
    }
}

// Mostrar modal del carrito
function mostrarCarrito() {
    const modal = document.createElement('div');
    modal.className = 'modal-carrito';
    modal.innerHTML = `
        <div class="modal-contenido">
            <h2>Tu Pedido</h2>
            <div class="items-carrito">
                ${carrito.length === 0 
                    ? '<p>El carrito está vacío</p>' 
                    : carrito.map(item => `
                        <div class="item-carrito">
                            <span>${item.Nombre} x${item.cantidad}</span>
                            <span>$${item.Precio * item.cantidad}</span>
                        </div>
                    `).join('')}
            </div>
            <div class="total-carrito">
                Total: $${carrito.reduce((sum, item) => sum + (item.Precio * item.cantidad), 0)}
            </div>
            <div class="botones-carrito">
                <button class="btn-cerrar">Seguir Comprando</button>
                ${carrito.length > 0 
                    ? '<button class="btn-whatsapp-carrito">Pedir por WhatsApp</button>' 
                    : ''}
            </div>
        </div>
    `;

    // Event listeners para el modal
    modal.querySelector('.btn-cerrar').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    if (carrito.length > 0) {
        modal.querySelector('.btn-whatsapp-carrito').addEventListener('click', enviarPedidoWhatsApp);
    }

    document.body.appendChild(modal);
}

// Enviar pedido por WhatsApp
function enviarPedidoWhatsApp() {
    const numeroWhatsApp = '549TU_NUMERO'; // Reemplaza con tu número
    let mensaje = '¡Hola! Quiero hacer este pedido:\n\n';
    
    carrito.forEach(item => {
        mensaje += `- ${item.Nombre} x${item.cantidad} | $${item.Precio * item.cantidad}\n`;
    });
    
    mensaje += `\nTotal: $${carrito.reduce((sum, item) => sum + (item.Precio * item.cantidad), 0)}`;
    
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsApp, '_blank');
    
    // Vaciar carrito después de enviar
    carrito = [];
    actualizarIconoCarrito();
    document.querySelector('.modal-carrito').remove();
}

// Inicialización del carrito
document.addEventListener('DOMContentLoaded', () => {
    // ... (tu código existente de carga de productos)
    
    // Evento para el icono del carrito
    document.getElementById('carrito-icono').addEventListener('click', mostrarCarrito);
});

// Opcional: Inicialización del menú responsive
document.getElementById('menu-toggle')?.addEventListener('click', function() {
    document.getElementById('menu')?.classList.toggle('active');
});
}