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
        "Pendientes": document.getElementById("pendientes-container"),
        "Relojes": document.getElementById("relojes-container"),
        "Conjuntos": document.getElementById("conjuntos-container")
    };

    // Limpiar contenedores
    Object.values(contenedores).forEach(container => {
        if (container) container.innerHTML = '';
    });

    // Función para manejar el evento "Ver más"
    const handleVerMas = (e) => {
        e.preventDefault();
        const descripcionElement = e.target.parentElement;
        const descCompleta = decodeURIComponent(e.target.getAttribute('data-desc-completa'));
        descripcionElement.innerHTML = `
            ${descCompleta} 
            <span class="ver-menos">Ver menos</span>
        `;
        descripcionElement.classList.add('expandida');
    };

    // Función para manejar el evento "Ver menos"
    const handleVerMenos = (e) => {
        e.preventDefault();
        const descripcionElement = e.target.parentElement;
        const descCompleta = descripcionElement.textContent.replace('Ver menos', '');
        const descCorta = descCompleta.length > 100 
            ? descCompleta.substring(0, 100) + '...' 
            : descCompleta;
        
        descripcionElement.innerHTML = `
            ${descCorta}
            <span class="ver-mas" data-desc-completa="${encodeURIComponent(descCompleta)}">Ver más</span>
        `;
        descripcionElement.classList.remove('expandida');
        
        // Re-asignar el evento
        const verMasBtn = descripcionElement.querySelector('.ver-mas');
        if (verMasBtn) {
            verMasBtn.addEventListener('click', handleVerMas);
        }
    };

    productos.forEach(producto => {
        const container = contenedores[producto.Categoria];
        if (!container) return;

        const imagenUrl = producto.Imagen 
            ? `${baseImagePath}${producto.Imagen}`
            : `${baseImagePath}placeholder.jpg`;

        // Procesar descripción
        let descripcionHTML = '';
        if (producto.Descripcion && producto.Descripcion.trim() !== '') {
            const mostrarVerMas = producto.Descripcion.length > 100;
            const descripcionCorta = mostrarVerMas 
                ? producto.Descripcion.substring(0, 100) + '...' 
                : producto.Descripcion;
            
            descripcionHTML = `
            <div class="descripcion-container">
            <p class="descripcion">
                ${descripcionCorta}
                ${mostrarVerMas ? `<span class="ver-mas">Ver más</span>` : ''}
            </p>
            </div>
            `;
        }

        const productoHTML = `
            <div class="producto" data-nombre-producto="${producto.Nombre}">
                <div class="imagen-container">
                    <img src="${imagenUrl}" alt="${producto.Nombre}" 
                        onerror="this.src='${baseImagePath}placeholder.jpg'">
                </div>
                <div class="info-producto">
                    <h3>${producto.Nombre}</h3>
                    <p class="precio">$${producto.Precio.toLocaleString('es-ES')} USD</p>
                    <p class="stock">${producto.Disponible} disponibles</p>
                    ${descripcionHTML}
                    <div class="botones-producto">
                        <button class="btn-whatsapp" data-nombre-producto="${producto.Nombre}">
                            Pedir por WhatsApp
                        </button>
                        <button class="btn-carrito" data-nombre-producto="${producto.Nombre}" 
                                ${producto.Disponible <= 0 ? 'disabled' : ''}>
                            ${producto.Disponible <= 0 ? 'Agotado' : 'Agregar al carrito'}
                        </button>
                    </div>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', productoHTML);

        // Asignar eventos
        const productoElement = container.lastElementChild;
        
        // Evento para WhatsApp
        const btnWhatsapp = productoElement.querySelector('.btn-whatsapp');
        if (btnWhatsapp) {
            btnWhatsapp.addEventListener('click', () => pedirProductoWhatsApp(producto));
        }
        
        // Evento para carrito
        const btnCarrito = productoElement.querySelector('.btn-carrito');
        if (btnCarrito) {
            btnCarrito.addEventListener('click', () => {
                if (producto.Disponible > 0) agregarAlCarrito(producto);
            });
        }
        
        // Evento para "Ver más"
        const verMasBtn = productoElement.querySelector('.ver-mas');
        if (verMasBtn) {
            verMasBtn.addEventListener('click', handleVerMas);
        }
    });

    // Delegación de eventos para "Ver menos" (mejor rendimiento)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('ver-menos')) {
            handleVerMenos(e);
        }
    });
}

function agregarAlCarrito(producto) {
    if (producto.Disponible <= 0) return; // No hacer nada si no hay stock
    
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
    actualizarDisponibleEnVista(producto);
}


function actualizarDisponibleEnVista(producto) {
    // Buscar todos los elementos que muestran el disponible de este producto
    const elementosStock = document.querySelectorAll(`.producto[data-nombre-producto="${producto.Nombre}"] .stock`);
    const botonesCarrito = document.querySelectorAll(`.producto[data-nombre-producto="${producto.Nombre}"] .btn-carrito`);
    
    // Actualizar el stock
    elementosStock.forEach(elemento => {
        elemento.textContent = `${producto.Disponible} disponibles`;
        
        if (producto.Disponible <= 0) {
            elemento.style.color = 'red';
        } else {
            elemento.style.color = ''; // Restablecer color si vuelve a haber stock
        }
    });
    
    // Actualizar botones de carrito
    botonesCarrito.forEach(boton => {
        if (producto.Disponible <= 0) {
            boton.disabled = true;
            boton.textContent = 'Agotado';
            boton.style.backgroundColor = '#ccc';
        } else {
            boton.disabled = false;
            boton.textContent = 'Agregar al carrito';
            boton.style.backgroundColor = ''; // Restablecer color
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
                <span>$${item.Precio * item.cantidad} USD</span>
            </div>
        `).join('');
    
    totalElement.textContent = `$${carrito.reduce((sum, item) => sum + (item.Precio * item.cantidad), 0)} USD`;
    
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
    if (producto.Disponible <= 0) return; // No hacer nada si no hay stock

    const mensaje = [
        '¡Hola! Me interesa en este producto:',
        '',
        `*${producto.Nombre}*`,
        '',
        '¿Podrían confirmarme:',
        '1. Disponibilidad',
        '2. Forma de pago',
    ].join('%0A');
    
    window.open(`https://wa.me/${numero}?text=${mensaje}`, '_blank');
}


// Función para pedidos del carrito (versión mejorada)
function enviarPedidoWhatsApp() {
    let mensaje = [
        '¡Hola! Quisiera solicitar estos productos:',
        '',
        ...carrito.map(item => `▸ ${item.Nombre} (Cantidad: ${item.cantidad})`),
        '',
        'Por favor indíquenme:',
        '1. Disponibilidad de los items',
        '2. Total a pagar',
    ].join('%0A'); 
    
    window.open(`https://wa.me/${numero}?text=${mensaje}`, '_blank');
    
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