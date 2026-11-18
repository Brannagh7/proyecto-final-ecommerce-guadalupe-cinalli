const seccionProductos = document.getElementById("productos");
const contadorCarrito = document.getElementById("contador-carrito");
const btnAbrir = document.getElementById("abrir-carrito");
const btnCerrar = document.getElementById("cerrar-carrito");
const panel = document.getElementById("panel-carrito");
const overlay = document.getElementById("overlay");
const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total-carrito");
const btnFinalizar = document.getElementById("finalizar-compra");
const btnVaciar = document.getElementById("vaciar-carrito");
const aviso = document.getElementById("aviso");
let temporizadorAviso;

let productos = [];

function formatearPrecio(valor) {
    return valor.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS"
    });
}

function mostrarAviso(mensaje) {
    aviso.textContent = mensaje;
    aviso.classList.add("visible");

    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(function () {
        aviso.classList.remove("visible");
    }, 2500);
}

// datos del carrito (localStorage //

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
    actualizarTodo();
}

function cambiarCantidad(id, cambio) {
    let carrito = obtenerCarrito();
    const item = carrito.find(function (i) {
        return i.id === id;
    });
    if (!item) {
        return;
    }

    item.cantidad += cambio;
    if (item.cantidad <= 0) {
        carrito = carrito.filter(function (i) {
            return i.id !== id;
        });
    }

    guardarCarrito(carrito);
    actualizarTodo();
}

function eliminarDelCarrito(id) {
    const carrito = obtenerCarrito().filter(function (i) {
        return i.id !== id;
    });
    guardarCarrito(carrito);
    actualizarTodo();
}

function vaciarCarrito() {
    guardarCarrito([]);
    actualizarTodo();
}

// mostrar carrito //

function actualizarContador() {
    const total = obtenerCarrito().reduce(function (suma, item) {
        return suma + item.cantidad;
    }, 0);
    contadorCarrito.textContent = total;
}

function renderizarCarrito() {
    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        listaCarrito.innerHTML = "<p>Tu carrito está vacío.</p>";
        totalCarrito.textContent = formatearPrecio(0);
        return;
    }

    let total = 0;
    let html = "";

    carrito.forEach(function (item) {
        const producto = productos.find(function (p) {
            return p.id === item.id;
        });
        if (!producto) {
            return;
        }

        const subtotal = producto.precio * item.cantidad;
        total += subtotal;

        html += `
            <div class="item-carrito">
                <img src="${producto.imagen}" alt="${producto.titulo}">
                <div class="item-info">
                    <h3>${producto.titulo}</h3>
                    <p>${formatearPrecio(producto.precio)} c/u</p>
                    <div class="item-controles">
                        <button type="button" data-accion="restar" data-id="${producto.id}" aria-label="Restar una unidad">−</button>
                        <span>${item.cantidad}</span>
                        <button type="button" data-accion="sumar" data-id="${producto.id}" aria-label="Sumar una unidad">+</button>
                        <button type="button" class="btn-eliminar" data-accion="eliminar" data-id="${producto.id}">Eliminar</button>
                    </div>
                    <p>Subtotal: ${formatearPrecio(subtotal)}</p>
                </div>
            </div>
        `;
    });

    listaCarrito.innerHTML = html;
    totalCarrito.textContent = formatearPrecio(total);
}

function actualizarTodo() {
    actualizarContador();
    renderizarCarrito();
}

// abrir y cerrar panel //

function abrirCarrito() {
    panel.classList.add("abierto");
    overlay.classList.add("abierto");
    panel.setAttribute("aria-hidden", "false");
    btnCerrar.focus();
}

function cerrarCarrito() {
    panel.classList.remove("abierto");
    overlay.classList.remove("abierto");
    panel.setAttribute("aria-hidden", "true");
    formCompra.classList.add("oculto");
    listaCarrito.classList.remove("oculto");
    panelFooter.classList.remove("oculto");
    btnAbrir.focus();
}

btnAbrir.addEventListener("click", abrirCarrito);
btnCerrar.addEventListener("click", cerrarCarrito);
overlay.addEventListener("click", cerrarCarrito);

document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape" && panel.classList.contains("abierto")) {
        cerrarCarrito();
    }
});

// evento de botones//

seccionProductos.addEventListener("click", function (evento) {
    const boton = evento.target.closest("button[data-id]");
    if (!boton) {
        return;
    }

    const id = Number(boton.dataset.id);
    agregarAlCarrito(id);

    const producto = productos.find(function (p) {
        return p.id === id;
    });
    if (producto) {
        mostrarAviso("Agregaste " + producto.titulo + " al carrito");
    }
});

listaCarrito.addEventListener("click", function (evento) {
    const boton = evento.target.closest("button[data-accion]");
    if (!boton) {
        return;
    }
    const id = Number(boton.dataset.id);
    const accion = boton.dataset.accion;

    if (accion === "sumar") {
        cambiarCantidad(id, 1);
    } else if (accion === "restar") {
        cambiarCantidad(id, -1);
    } else if (accion === "eliminar") {
        eliminarDelCarrito(id);
    }
});

btnVaciar.addEventListener("click", vaciarCarrito);

// finalizar compra //

const formCompra = document.getElementById("form-compra");
const panelFooter = document.querySelector(".panel-footer");
const btnVolver = document.getElementById("volver-carrito");

function mostrarVistaCompra(mostrar) {
    formCompra.classList.toggle("oculto", !mostrar);
    listaCarrito.classList.toggle("oculto", mostrar);
    panelFooter.classList.toggle("oculto", mostrar);
}

function validarCompra() {
    const nombre = document.getElementById("compra-nombre");
    const email = document.getElementById("compra-email");
    const direccion = document.getElementById("compra-direccion");
    const metodo = document.getElementById("compra-metodo");
    const formato = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let ok = true;

    if (nombre.value.trim().length < 2) {
        mostrarError(nombre, "Ingresá tu nombre y apellido.");
        ok = false;
    } else {
        mostrarError(nombre, "");
    }

    if (!formato.test(email.value.trim())) {
        mostrarError(email, "Ingresá un correo válido (ej: nombre@correo.com).");
        ok = false;
    } else {
        mostrarError(email, "");
    }

    if (direccion.value.trim().length < 5) {
        mostrarError(direccion, "Ingresá una dirección de entrega.");
        ok = false;
    } else {
        mostrarError(direccion, "");
    }

    if (metodo.value === "") {
        mostrarError(metodo, "Elegí un método de pago.");
        ok = false;
    } else {
        mostrarError(metodo, "");
    }

    return ok;
}

btnFinalizar.addEventListener("click", function () {
    if (obtenerCarrito().length === 0) {
        mostrarAviso("Tu carrito está vacío");
        return;
    }
    mostrarVistaCompra(true);
});

btnVolver.addEventListener("click", function () {
    mostrarVistaCompra(false);
});

formCompra.addEventListener("submit", function (evento) {
    evento.preventDefault();

    if (!validarCompra()) {
        return;
    }

    const nombre = document.getElementById("compra-nombre").value.trim();
    const metodo = document.getElementById("compra-metodo").value;

    let total = 0;
    let filas = "";

    obtenerCarrito().forEach(function (item) {
        const producto = productos.find(function (p) {
            return p.id === item.id;
        });
        if (!producto) {
            return;
        }
        const subtotal = producto.precio * item.cantidad;
        total += subtotal;
        filas += `<li>${item.cantidad} × ${producto.titulo} — ${formatearPrecio(subtotal)}</li>`;
    });

    guardarCarrito([]);
    actualizarContador();
    formCompra.reset();
    mostrarVistaCompra(false);

    listaCarrito.innerHTML = `
        <h3 id="gracias"></h3>
        <ul>${filas}</ul>
        <p><strong>Total: ${formatearPrecio(total)}</strong></p>
        <p>Pago: ${metodo}</p>
        <p>Es una simulación.</p>
    `;
    document.getElementById("gracias").textContent = "¡Gracias por tu compra, " + nombre + "!";
    totalCarrito.textContent = formatearPrecio(0);
});

//productos//

function crearCard(producto) {
    return `
        <article class="producto">
            <div class="producto-img">
                <img src="${producto.imagen}" alt="${producto.titulo}, vista frontal">
                <img class="img-hover" src="${producto.imagenHover}" alt="${producto.titulo}, vista detalle">
            </div>
            <h3>${producto.titulo}</h3>
            <p>${producto.descripcion}</p>
            <p class="precio">${formatearPrecio(producto.precio)}</p>
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

        renderizarCarrito();
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

// formulario de contacto //

const formContacto = document.getElementById("form-contacto");
const estadoForm = document.getElementById("estado-form");

function mostrarError(campo, mensaje) {
    const error = document.getElementById("error-" + campo.id);
    error.textContent = mensaje;
    campo.classList.toggle("invalido", mensaje !== "");
    campo.setAttribute("aria-invalid", mensaje !== "" ? "true" : "false");
}

function validarNombre() {
    const campo = document.getElementById("nombre");
    if (campo.value.trim().length < 2) {
        mostrarError(campo, "Ingresá tu nombre (mínimo 2 letras).");
        return false;
    }
    mostrarError(campo, "");
    return true;
}

function validarEmail() {
    const campo = document.getElementById("email");
    const formato = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (campo.value.trim() === "") {
        mostrarError(campo, "Ingresá tu correo electrónico.");
        return false;
    }
    if (!formato.test(campo.value.trim())) {
        mostrarError(campo, "El correo no tiene un formato válido (ej: nombre@correo.com).");
        return false;
    }
    mostrarError(campo, "");
    return true;
}

function validarMensaje() {
    const campo = document.getElementById("mensaje");
    if (campo.value.trim().length < 10) {
        mostrarError(campo, "El mensaje debe tener al menos 10 caracteres.");
        return false;
    }
    mostrarError(campo, "");
    return true;
}

formContacto.addEventListener("submit", function (evento) {
    const nombreOk = validarNombre();
    const emailOk = validarEmail();
    const mensajeOk = validarMensaje();

    if (!(nombreOk && emailOk && mensajeOk)) {
        evento.preventDefault();
        estadoForm.textContent = "Revisá los campos marcados.";
    }
});
