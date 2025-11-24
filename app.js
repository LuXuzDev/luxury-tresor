const numeroWhatsApp = "5353796979";

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch("productos.json?" + Date.now());
        const productos = await response.json();

        renderProductos(productos);
    } catch (error) {
        console.error("Error cargando productos:", error);
    }
});

function renderProductos(productos) {
    const container = document.getElementById("lista-productos");
    container.innerHTML = "";

    const baseUrl = "https://raw.githubusercontent.com/LuXuzDev/luxury-tresor/main/images/";

    productos.forEach(prod => {
        const imagen = prod.Imagen ? baseUrl + prod.Imagen : baseUrl + "placeholder.png";

        const html = `
            <div class="producto luxury-card">
                <div class="producto-imagen">
                    <img src="${imagen}" alt="producto">
                </div>

                <div class="producto-info">
                    <p class="precio">$${prod.Precio} USD</p>

                    <button class="btn-whatsapp" onclick="pedirWhatsApp('${prod.Nombre}')">
                        Pedir por WhatsApp
                    </button>
                </div>
            </div>
        `;

        container.insertAdjacentHTML("beforeend", html);
    });
}

function pedirWhatsApp(nombre) {
    const mensaje = encodeURIComponent(
        `¡Hola! Me interesa el producto:\n\n*${nombre}*\n\n¿Está disponible?`
    );

    window.open(`https://wa.me/${numeroWhatsApp}?text=${mensaje}`, "_blank");
}
