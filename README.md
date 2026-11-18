# Electro Hogar

## Descripción
Sitio web de una tienda online (e-commerce) desarrollado como Proyecto Final del curso de Front-End JS de Talento Tech.

## Objetivo
Aplicar HTML, CSS, diseño responsivo con Flexbox, Grid y Media Queries, y sumar interactividad con JavaScript: consumir datos con `fetch`, armar un carrito de compras con `localStorage`, validar el formulario de contacto y aplicar buenas prácticas de SEO y accesibilidad. El proyecto está publicado online en GitHub Pages.

## Secciones
- Inicio
- Productos (cargados desde "productos.json" con `fetch`)
- Carrito (panel lateral)
- Reseñas
- Contacto (formulario validado con JS y enviado con Formspree)

## Formulario de contacto
Se utilizó Formspree para recibir los mensajes sin programar un servidor: creé un formulario en formspree.io y puse su URL en el `action` del `<form>`, con `method="POST"`. Los mensajes llegan directo a mi correo.
El formulario se valida con JS, el nombre debe tener al menos 2 letras, el correo debe tener un formato válido y el mensaje al menos 10 caracteres. Si hay errores, se muestran debajo de cada campo y no se envía.

## Publicación
Sitio publicado con GitHub Pages: https://brannagh7.github.io/proyecto-final-ecommerce-guadalupe-cinalli/