const seccionProductos = document.getElementById("productos");
const contadorCarrito = document.getElementById("contador-carrito");

let productos = [];

// carrito //

function obtenerCarrito() {
    try {
        return JSON.parse(localStorage.getItem("carrito")) || [];
    } catch (error) {
        return [];
    }
}

function guardarCarrito(carrito) {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function actualizarContador() {
    const carrito = obtenerCarrito();
    const total = carrito.reduce(function (suma, item) {
        return suma + item.cantidad;
    }, 0);
    contadorCarrito.textContent = total;
}

function agregarAlCarrito(id) {
    const carrito = obtenerCarrito();
    const existente = carrito.find(function (item) {
        return item.id === id;
    });

    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({ id: id, cantidad: 1 });
    }

    guardarCarrito(carrito);
    actualizarContador();
}

seccionProductos.addEventListener("click", function (evento) {
    const boton = evento.target.closest("button[data-id]");
    if (!boton) {
        return;
    }
    agregarAlCarrito(Number(boton.dataset.id));
});

// productos //

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
        productos = await respuesta.json();

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
actualizarContador();