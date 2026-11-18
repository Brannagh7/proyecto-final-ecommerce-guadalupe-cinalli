const seccionProductos = document.getElementById("productos");

function crearCard(producto) {
    const precio = producto.precio.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS"
    });

    return `
        <article class="producto">
            <div class="producto-img">
                <img src="${producto.imagen}" alt="${producto.titulo}, vista frontal">
                <img class="img-hover" src="${producto.imagenHover}" alt="${producto.titulo}, vista detalle">
            </div>
            <h3>${producto.titulo}</h3>
            <p>${producto.descripcion}</p>
            <p class="precio">${precio}</p>
            <button type="button" data-id="${producto.id}">Agregar al carrito</button>
        </article>
    `;
}

async function cargarProductos() {
    try {
        const respuesta = await fetch("productos.json");
        if (!respuesta.ok) {
            throw new Error("Error " + respuesta.status);
        }
        const productos = await respuesta.json();

        productos.forEach(function (producto) {
            seccionProductos.insertAdjacentHTML("beforeend", crearCard(producto));
        });
    } catch (error) {
        console.error(error);
        seccionProductos.insertAdjacentHTML(
            "beforeend",
            "<p>No pudimos cargar los productos. Intentá de nuevo más tarde.</p>"
        );
    }
}

cargarProductos();