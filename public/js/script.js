// Ajustar el margen superior del body según la altura del menú
const header = document.querySelector('header');
if (header) {
    const headerHeight = header.offsetHeight;
    document.body.style.paddingTop = `${headerHeight}px`;
}

let cart = [];
let total = 0;

function addToCart(productName, price) {
    if (!productName || isNaN(price)) return;
    
    let product = cart.find(item => item.name === productName);
    product ? product.quantity++ : cart.push({ name: productName, price, quantity: 1 });
    total += price;
    updateCartUI();
    mostrarNotificacion(`${productName} añadido al carrito`);
}

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.reduce((acc, item) => acc + item.quantity, 0);
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = cart.map((item, index) => `
        <div class='cart-item'>
            <span>${item.name} (x${item.quantity}) - €${(item.price * item.quantity).toFixed(2)}</span>
            <button onclick='removeFromCart(${index})'>Eliminar</button>
        </div>
    `).join('');
    document.getElementById('cart-total').innerText = total.toFixed(2);
}

function removeFromCart(index) {
    let item = cart[index];
    if (item.quantity > 1) {
        item.quantity--;
        total -= item.price;
    } else {
        total -= item.price;
        cart.splice(index, 1);
    }
    updateCartUI();
}

function checkout() {
    if (!cart.length) return alert('Tu carrito está vacío.');
    alert(`Gracias por tu compra. Total a pagar: $${total.toFixed(2)}`);
    cart = [];
    total = 0;
    updateCartUI();
}

// Carrito
const cartSection = document.querySelector(".cart-section");
const toggleCartBtn = document.getElementById("toggle-cart");
const closeCartBtn = document.getElementById("close-cart");
const cartIcon = document.getElementById("cart-icon");

[toggleCartBtn, closeCartBtn, cartIcon].forEach(btn => {
    if (btn) btn.addEventListener("click", () => {
        cartSection.classList.toggle("active");
        toggleCloseCartButton();
    });
});

function toggleCloseCartButton() {
    const closeCartBtn = document.getElementById('close-cart');
    if (cartSection.classList.contains('active')) {
        closeCartBtn.classList.add('visible');
    } else {
        closeCartBtn.classList.remove('visible');
    }
}

// Ofertas
document.querySelectorAll('.offer button').forEach(button => {
    button.addEventListener('click', function () {
        const oferta = this.closest('.offer');
        addToCart(oferta.getAttribute('data-name'), parseFloat(oferta.getAttribute('data-price')));
    });
});

// Atención al cliente - Formulario de contacto
document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    document.getElementById('responseMessage').innerText = `Gracias, ${name}. Tu mensaje ha sido enviado.`;
    this.reset();
});

// Sistema de reseñas
document.getElementById('form-reseña').addEventListener('submit', function(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const calificacion = document.getElementById('calificacion').value;
    const comentario = document.getElementById('comentario').value;
    
    const reseña = document.createElement('div');
    reseña.className = 'reseña';
    reseña.innerHTML = `
        <h4>${nombre} - ${'⭐️'.repeat(calificacion)}</h4>
        <p>${comentario}</p>
    `;
    document.getElementById('lista-reseñas').appendChild(reseña);
    this.reset();
});

// Carousel
let currentIndex = 0;
function moveCarousel(direction) {
    const carouselInner = document.querySelector('.carousel-inner');
    const items = document.querySelectorAll('.carousel-item');
    if (!carouselInner || items.length === 0) return;
    currentIndex = (currentIndex + direction + items.length) % items.length;
    carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
}
setInterval(() => moveCarousel(1), 8000);

document.querySelectorAll('.carousel-item .offer').forEach(item => {
    item.addEventListener('click', function() {
        const name = this.getAttribute('data-name');
        const price = parseFloat(this.getAttribute('data-price'));
        addToCart(name, price);
    });
});

// Notificación
function mostrarNotificacion(mensaje) {
    const notificacion = document.getElementById('notificacion');
    if (!notificacion) return;
    document.getElementById('notificacion-texto').innerText = mensaje;
    notificacion.classList.add('mostrar');
    setTimeout(() => notificacion.classList.remove('mostrar'), 3000);
}
// ----------------------------------------------------------------
function filtrarProductos() {
    const categoria = document.getElementById('categoria').value;
    const precioMaximo = parseFloat(document.getElementById('precio').value) || Infinity;

    const productos = document.querySelectorAll('.product');
    productos.forEach(producto => {
        const precioElement = producto.querySelector('.price');
        if (!precioElement) return;
        const precio = parseFloat(precioElement.innerText.replace('€', ''));
        const categoriaProducto = producto.getAttribute('data-categoria') || 'pollo'; // Categoría por defecto
        producto.style.display = (categoria === 'todos' || categoriaProducto === categoria) && precio <= precioMaximo ? 'block' : 'none';
    });
}
// ----------------------------------------------------------------
function checkout() {
    if (!cart.length) {
        alert('Tu carrito está vacío.');
        return;
    }
    alert(`Gracias por tu compra. Total a pagar: €${total.toFixed(2)}. Redirigiéndote al pago...`);
    window.location.href = 'pago-tarjeta.html'; // Redirigir a la página de pago con tarjeta
}

// ----------------------------------------------------------------
document.getElementById("contactForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Evita que el formulario se envíe

    const nombre = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const mensaje = document.getElementById("message").value;

    // Simulación de envío exitoso
    const responseMessage = document.getElementById("responseMessage");
    responseMessage.textContent = `Gracias, ${nombre}. Tu mensaje ha sido enviado.`;
    responseMessage.style.color = "green";

    // Limpiar el formulario
    document.getElementById("contactForm").reset();
});
// ----------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
});
// ---------------------------------------------------------------
document.getElementById("form-reseña").addEventListener("submit", function (event) {
    event.preventDefault(); // Evita que el formulario se envíe

    const nombre = document.getElementById("nombre").value;
    const calificacion = document.getElementById("calificacion").value;
    const comentario = document.getElementById("comentario").value;

    // Crear la nueva reseña
    const nuevaReseña = document.createElement("div");
    nuevaReseña.classList.add("reseña");

    const reseñaHeader = document.createElement("div");
    reseñaHeader.classList.add("reseña-header");

    const reseñaNombre = document.createElement("span");
    reseñaNombre.classList.add("reseña-nombre");
    reseñaNombre.textContent = nombre;

    const reseñaCalificacion = document.createElement("span");
    reseñaCalificacion.classList.add("reseña-calificacion");
    reseñaCalificacion.textContent = "⭐️".repeat(calificacion);

    const reseñaComentario = document.createElement("p");
    reseñaComentario.classList.add("reseña-comentario");
    reseñaComentario.textContent = comentario;

    const reseñaFecha = document.createElement("span");
    reseñaFecha.classList.add("reseña-fecha");
    reseñaFecha.textContent = `Publicado el ${new Date().toLocaleDateString()}`;

    // Construir la reseña
    reseñaHeader.appendChild(reseñaNombre);
    reseñaHeader.appendChild(reseñaCalificacion);
    nuevaReseña.appendChild(reseñaHeader);
    nuevaReseña.appendChild(reseñaComentario);
    nuevaReseña.appendChild(reseñaFecha);

    // Añadir la reseña al contenedor
    document.querySelector(".reseñas-container").prepend(nuevaReseña);

    // Limpiar el formulario
    document.getElementById("form-reseña").reset();
});
// ----------------------------------------------------------------
window.addEventListener("scroll", function () {
    const filtradoFijo = document.getElementById("filtrado-fijo");
    const headerHeight = document.querySelector("header").offsetHeight;

    if (window.scrollY > headerHeight) {
        filtradoFijo.style.position = "fixed";
        filtradoFijo.style.top = "0";
        filtradoFijo.style.width = "100%";
    } else {
        filtradoFijo.style.position = "sticky";
        filtradoFijo.style.top = `${headerHeight}px`;
    }
});
// ----------------------------------------------------------------
// Cargar ofertas dinámicamente desde productos.json
function loadCarousel() {
    fetch('productos.json')
        .then(response => response.json())
        .then(data => {
            const carouselInner = document.querySelector('.carousel-inner');
            carouselInner.innerHTML = ''; // Limpiar el carrusel antes de cargar

            data.ofertas.forEach((oferta, index) => {
                const carouselItem = document.createElement('div');
                carouselItem.className = 'carousel-item';
                carouselItem.innerHTML = `
                    <img src="${oferta.imagen}" alt="${oferta.nombre}">
                    <div class="carousel-caption">
                        <h3>${oferta.nombre}</h3>
                        <p>${oferta.descripcion || 'Disfruta de esta oferta especial'}</p>
                        <p>
                            <span class="old-price">€${oferta.precioAnterior.toFixed(2)}</span>
                            <span class="price">€${oferta.precio.toFixed(2)}</span>
                        </p>
                        <button onclick="addToCart('${oferta.nombre}', ${oferta.precio})">Añadir al Carrito</button>
                    </div>
                `;
                carouselInner.appendChild(carouselItem);
            });

            // Iniciar el carrusel
            moveCarousel(0);
        })
        .catch(error => console.error('Error cargando las ofertas:', error));
}

// Llamar a la función para cargar el carrusel al iniciar la página
document.addEventListener('DOMContentLoaded', loadCarousel);
// ----------------------------------------------------------------
// Cargar productos dinámicamente desde productos.json
function loadProducts() {
    fetch('productos.json')
        .then(response => response.json())
        .then(data => {
            const productGrid = document.getElementById('product-grid');
            productGrid.innerHTML = ''; // Limpiar la sección antes de cargar

            data.productos.forEach(producto => {
                const productItem = document.createElement('div');
                productItem.className = 'product';
                productItem.setAttribute('data-categoria', producto.categoria);
                productItem.innerHTML = `
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <h3>${producto.nombre}</h3>
                    <p class="price">€${producto.precio.toFixed(2)}</p>
                    <button onclick="addToCart('${producto.nombre}', ${producto.precio})">Añadir al Carrito</button>
                `;
                productGrid.appendChild(productItem);
            });
        })
        .catch(error => console.error('Error cargando los productos:', error));
}

// Llamar a la función para cargar los productos al iniciar la página
document.addEventListener('DOMContentLoaded', loadProducts);
// ----------------------------------------------------------------
// Cargar productos y ofertas dinámicamente desde productos.json
function loadProductsAndOffers() {
    fetch('productos.json')
        .then(response => response.json())
        .then(data => {
            const productGrid = document.getElementById('product-grid');
            productGrid.innerHTML = ''; // Limpiar la sección antes de cargar

            // Cargar productos
            data.productos.forEach(producto => {
                const productItem = document.createElement('div');
                productItem.className = 'product';
                productItem.setAttribute('data-categoria', producto.categoria);
                productItem.innerHTML = `
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <h3>${producto.nombre}</h3>
                    <p class="price">€${producto.precio.toFixed(2)}</p>
                    <button onclick="addToCart('${producto.nombre}', ${producto.precio})">Añadir al Carrito</button>
                `;
                productGrid.appendChild(productItem);
            });

            // Cargar ofertas
            data.ofertas.forEach(oferta => {
                const offerItem = document.createElement('div');
                offerItem.className = 'product';
                offerItem.setAttribute('data-categoria', oferta.categoria);
                offerItem.innerHTML = `
                    <img src="${oferta.imagen}" alt="${oferta.nombre}">
                    <h3>${oferta.nombre}</h3>
                    <p><span class="old-price">€${oferta.precioAnterior.toFixed(2)}</span> <span class="price">€${oferta.precio.toFixed(2)}</span></p>
                    <button onclick="addToCart('${oferta.nombre}', ${oferta.precio})">Añadir al Carrito</button>
                `;
                productGrid.appendChild(offerItem);
            });
        })
        .catch(error => console.error('Error cargando los productos y ofertas:', error));
}

// Llamar a la función para cargar productos y ofertas al iniciar la página
document.addEventListener('DOMContentLoaded', loadProductsAndOffers);
// ----------------------------------------------------------------
function filtrarProductos() {
    const categoria = document.getElementById('categoria').value;
    const precioMaximo = parseFloat(document.getElementById('precio').value) || Infinity;

    const productos = document.querySelectorAll('.product');
    productos.forEach(producto => {
        const precioElement = producto.querySelector('.price');
        if (!precioElement) return;
        const precio = parseFloat(precioElement.innerText.replace('€', ''));
        const categoriaProducto = producto.getAttribute('data-categoria') || 'pollo'; // Categoría por defecto
        producto.style.display = (categoria === 'todos' || categoriaProducto === categoria) && precio <= precioMaximo ? 'block' : 'none';
    });
}
// ----------------------------------------------------------------
// RESEÑAS
// ----------------------------------------------------------------
// Cargar reseñas desde el backend
function loadReseñas() {
    fetch('/reseñas')
        .then(response => response.json())
        .then(data => {
            const reseñasContainer = document.querySelector('.reseñas-container');
            reseñasContainer.innerHTML = ''; // Limpiar el contenedor antes de cargar

            data.reseñas.forEach(reseña => {
                const nuevaReseña = document.createElement('div');
                nuevaReseña.classList.add('reseña');
                nuevaReseña.innerHTML = `
                    <div class="reseña-header">
                        <span class="reseña-nombre">${reseña.nombre}</span>
                        <span class="reseña-calificacion">${'⭐️'.repeat(reseña.calificacion)}</span>
                    </div>
                    <p class="reseña-comentario">${reseña.comentario}</p>
                    <span class="reseña-fecha">Publicado el ${reseña.fecha}</span>
                `;
                reseñasContainer.appendChild(nuevaReseña);
            });
        })
        .catch(error => console.error('Error cargando las reseñas:', error));
}

// Guardar una nueva reseña en el backend
function saveReseña(nombre, calificacion, comentario) {
    const nuevaReseña = {
        nombre: nombre,
        calificacion: calificacion,
        comentario: comentario,
        fecha: new Date().toLocaleDateString()
    };

    fetch('/reseñas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevaReseña)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Reseña guardada:', data);
            loadReseñas(); // Recargar las reseñas después de guardar
        })
        .catch(error => console.error('Error guardando la reseña:', error));
}

// Manejar el envío del formulario de reseñas
document.getElementById('form-reseña').addEventListener('submit', function (event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const calificacion = document.getElementById('calificacion').value;
    const comentario = document.getElementById('comentario').value;

    // Guardar la reseña en el backend
    saveReseña(nombre, calificacion, comentario);

    // Limpiar el formulario
    this.reset();
});

// Cargar las reseñas al iniciar la página
document.addEventListener('DOMContentLoaded', loadReseñas);
// ----------------------------------------------------------------
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public')); // Servir archivos estáticos (HTML, CSS, JS)

// Ruta para obtener las reseñas
app.get('/reseñas', (req, res) => {
    const reseñasPath = path.join(__dirname, 'reseñas.json');
    fs.readFile(reseñasPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error leyendo las reseñas' });
        }
        res.json(JSON.parse(data));
    });
});

// Ruta para guardar una nueva reseña
app.post('/reseñas', (req, res) => {
    const nuevaReseña = req.body;
    const reseñasPath = path.join(__dirname, 'reseñas.json');

    fs.readFile(reseñasPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error leyendo las reseñas' });
        }

        const reseñas = JSON.parse(data);
        reseñas.reseñas.push(nuevaReseña);

        fs.writeFile(reseñasPath, JSON.stringify(reseñas, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error guardando la reseña' });
            }
            res.json({ message: 'Reseña guardada exitosamente' });
        });
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
// ----------------------------------------------------------------
// Cargar reseñas desde el backend
function loadReseñas() {
    fetch('/reseñas')
        .then(response => response.json())
        .then(data => {
            const reseñasContainer = document.querySelector('.reseñas-container');
            reseñasContainer.innerHTML = ''; // Limpiar el contenedor antes de cargar

            data.reseñas.forEach(reseña => {
                const nuevaReseña = document.createElement('div');
                nuevaReseña.classList.add('reseña');
                nuevaReseña.innerHTML = `
                    <div class="reseña-header">
                        <span class="reseña-nombre">${reseña.nombre}</span>
                        <span class="reseña-calificacion">${'⭐️'.repeat(reseña.calificacion)}</span>
                    </div>
                    <p class="reseña-comentario">${reseña.comentario}</p>
                    <span class="reseña-fecha">Publicado el ${reseña.fecha}</span>
                `;
                reseñasContainer.appendChild(nuevaReseña);
            });
        })
        .catch(error => console.error('Error cargando las reseñas:', error));
}

// Guardar una nueva reseña en el backend
function saveReseña(nombre, calificacion, comentario) {
    const nuevaReseña = {
        nombre: nombre,
        calificacion: calificacion,
        comentario: comentario,
        fecha: new Date().toLocaleDateString()
    };

    fetch('/reseñas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevaReseña)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Reseña guardada:', data);
            loadReseñas(); // Recargar las reseñas después de guardar
        })
        .catch(error => console.error('Error guardando la reseña:', error));
}

// Manejar el envío del formulario de reseñas
document.getElementById('form-reseña').addEventListener('submit', function (event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const calificacion = document.getElementById('calificacion').value;
    const comentario = document.getElementById('comentario').value;

    // Guardar la reseña en el backend
    saveReseña(nombre, calificacion, comentario);

    // Limpiar el formulario
    this.reset();
});

// Cargar las reseñas al iniciar la página
document.addEventListener('DOMContentLoaded', loadReseñas);
// ----------------------------------------------------------------

// Cargar productos desde el JSON
function loadProductos() {
    fetch('data/productos.json')
        .then(response => response.json())
        .then(data => {
            const productGrid = document.getElementById('product-grid');
            productGrid.innerHTML = ''; // Limpiar el contenedor antes de cargar

            data.productos.forEach(producto => {
                const productItem = document.createElement('div');
                productItem.className = 'product';
                productItem.setAttribute('data-categoria', producto.categoria);
                productItem.innerHTML = `
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <h3>${producto.nombre}</h3>
                    <p class="price">€${producto.precio.toFixed(2)}</p>
                    <button onclick="addToCart('${producto.nombre}', ${producto.precio})">Añadir al Carrito</button>
                `;
                productGrid.appendChild(productItem);
            });
        })
        .catch(error => console.error('Error cargando los productos:', error));
}

// Cargar productos al iniciar la página
document.addEventListener('DOMContentLoaded', loadProductos);
// ----------------------------------------------------------------
// Función unificada para finalizar compra
function confirmarPedido() {
    if (cart.length === 0) {
        mostrarNotificacion('Tu carrito está vacío.');
        return;
    }
    
    // Crear resumen detallado
    let resumen = 'Resumen de tu pedido:\n\n';
    cart.forEach(item => {
        resumen += `• ${item.name} - ${item.quantity} x €${item.price.toFixed(2)} = €${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    resumen += `\nTotal a pagar: €${total.toFixed(2)}\n\n`;
    resumen += '¿Deseas confirmar el pedido?';
    
    if (confirm(resumen)) {
        // Simular procesamiento de pago
        mostrarNotificacion('Procesando pago...');
        
        setTimeout(() => {
            mostrarNotificacion('¡Pedido confirmado! Gracias por tu compra.');
            cart = [];
            total = 0;
            updateCartUI();
            toggleCart();
        }, 1500);
    }
}

// Función para mostrar/ocultar carrito
function toggleCart() {
    const cartSection = document.getElementById('carrito');
    if (cartSection.style.display === 'block') {
        cartSection.style.display = 'none';
    } else {
        cartSection.style.display = 'block';
    }
}
// ----------------------------------------------------------------
function confirmarPedido() {
    if (cart.length === 0) {
        mostrarNotificacion('Tu carrito está vacío.');
        return;
    }
    
    // Mostrar resumen de compra
    let mensaje = 'Resumen de tu pedido:\n\n';
    cart.forEach(item => {
        mensaje += `${item.name} (x${item.quantity}) - €${(item.price * item.quantity).toFixed(2)}\n`;
    });
    mensaje += `\nTotal: €${total.toFixed(2)}\n\n¿Confirmar compra?`;
    
    if (confirm(mensaje)) {
        // Guardar los datos del carrito en localStorage para usarlos en la página de pago
        localStorage.setItem('cart', JSON.stringify(cart));
        localStorage.setItem('total', total.toFixed(2));
        
        mostrarNotificacion('¡Compra realizada con éxito! Redirigiendo a pago...');
        
        // Redirigir después de 2 segundos (para que se vea la notificación)
        setTimeout(() => {
            window.location.href = 'pago-tarjeta.html';
        }, 2000);
    }
}
// ----------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    // Recuperar datos del carrito
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = localStorage.getItem('total') || '0.00';
    
    // Mostrar resumen en la página de pago
    const resumenElement = document.getElementById('resumen-pedido');
    if (resumenElement) {
        let html = '<h3>Resumen de tu pedido:</h3><ul>';
        cart.forEach(item => {
            html += `<li>${item.name} (x${item.quantity}) - €${(item.price * item.quantity).toFixed(2)}</li>`;
        });
        html += `</ul><p><strong>Total: €${total}</strong></p>`;
        resumenElement.innerHTML = html;
    }
});
// ----------------------------------------------------------------
// Modifica el setTimeout en confirmarPedido() así:
setTimeout(() => {
    // Efecto de desvanecimiento antes de redirigir
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        window.location.href = 'pago-tarjeta.html';
    }, 500);
}, 1500);
// ----------------------------------------------------------------
// Función para navegar con transición
function navegarConTransicion(url) {
    // Aplicar efecto de desvanecimiento
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    // Redirigir después de la animación
    setTimeout(() => {
        window.location.href = url;
    }, 500);
}

// Aplicar a todos los links importantes
document.addEventListener('DOMContentLoaded', function() {
    // Links del menú principal
    document.querySelectorAll('nav a').forEach(link => {
        if (link.href && !link.href.includes('#')) { // Excluye anclas
            link.addEventListener('click', function(e) {
                e.preventDefault();
                navegarConTransicion(this.href);
            });
        }
    });
    
    // Botón de volver al carrito (si estás en pago-tarjeta.html)
    if (document.getElementById('volver-carrito')) {
        document.getElementById('volver-carrito').addEventListener('click', function(e) {
            e.preventDefault();
            navegarConTransicion('index.html');
        });
    }
});

// Efecto de entrada al cargar la página
window.onload = function() {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.5s ease';
    }, 10);
};