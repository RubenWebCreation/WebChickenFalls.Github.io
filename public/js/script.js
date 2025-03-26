// Ajustar el margen superior del body según la altura del menú
const header = document.querySelector('header');
if (header) {
    const headerHeight = header.offsetHeight;
    document.body.style.paddingTop = `${headerHeight}px`;
}

// Variables globales del carrito
let cart = [];
let total = 0;

// Funciones del carrito
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

// Funciones de UI del carrito
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

// Funciones de productos
function filtrarProductos() {
    const categoria = document.getElementById('categoria').value;
    const precioMaximo = parseFloat(document.getElementById('precio').value) || Infinity;

    const productos = document.querySelectorAll('.product');
    productos.forEach(producto => {
        const precioElement = producto.querySelector('.price');
        if (!precioElement) return;
        const precio = parseFloat(precioElement.innerText.replace('€', ''));
        const categoriaProducto = producto.getAttribute('data-categoria') || 'pollo';
        producto.style.display = (categoria === 'todos' || categoriaProducto === categoria) && precio <= precioMaximo ? 'block' : 'none';
    });
}

// Funciones de reseñas
function loadReseñas() {
    fetch('/reseñas')
        .then(response => response.json())
        .then(data => {
            const reseñasContainer = document.querySelector('.reseñas-container');
            reseñasContainer.innerHTML = '';
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
            loadReseñas();
        })
        .catch(error => console.error('Error guardando la reseña:', error));
}

// Funciones de pago
function confirmarPedido() {
    if (cart.length === 0) {
        mostrarNotificacion('Tu carrito está vacío.');
        return;
    }
    
    let mensaje = 'Resumen de tu pedido:\n\n';
    cart.forEach(item => {
        mensaje += `${item.name} (x${item.quantity}) - €${(item.price * item.quantity).toFixed(2)}\n`;
    });
    mensaje += `\nTotal: €${total.toFixed(2)}\n\n¿Confirmar compra?`;
    
    if (confirm(mensaje)) {
        localStorage.setItem('cart', JSON.stringify(cart));
        localStorage.setItem('total', total.toFixed(2));
        mostrarNotificacion('¡Compra realizada con éxito! Redirigiendo a pago...');
        setTimeout(() => {
            window.location.href = 'pago-tarjeta.html';
        }, 2000);
    }
}

// Funciones auxiliares
function mostrarNotificacion(mensaje) {
    const notificacion = document.getElementById('notificacion');
    if (!notificacion) return;
    document.getElementById('notificacion-texto').innerText = mensaje;
    notificacion.classList.add('mostrar');
    setTimeout(() => notificacion.classList.remove('mostrar'), 3000);
}

function navegarConTransicion(url) {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        window.location.href = url;
    }, 500);
}

// Carrusel
let currentIndex = 0;
function moveCarousel(direction) {
    const carouselInner = document.querySelector('.carousel-inner');
    const items = document.querySelectorAll('.carousel-item');
    if (!carouselInner || items.length === 0) return;
    currentIndex = (currentIndex + direction + items.length) % items.length;
    carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Menú hamburguesa
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Formulario de contacto
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const name = document.getElementById('name').value;
            document.getElementById('responseMessage').innerText = `Gracias, ${name}. Tu mensaje ha sido enviado.`;
            this.reset();
        });
    }

    // Formulario de reseñas
    const formReseña = document.getElementById('form-reseña');
    if (formReseña) {
        formReseña.addEventListener('submit', function(event) {
            event.preventDefault();
            const nombre = document.getElementById('nombre').value;
            const calificacion = document.getElementById('calificacion').value;
            const comentario = document.getElementById('comentario').value;
            saveReseña(nombre, calificacion, comentario);
            this.reset();
        });
    }

    // Scroll para filtrado fijo
    window.addEventListener("scroll", function() {
        const filtradoFijo = document.getElementById("filtrado-fijo");
        const headerHeight = document.querySelector("header").offsetHeight;
        if (filtradoFijo) {
            if (window.scrollY > headerHeight) {
                filtradoFijo.style.position = "fixed";
                filtradoFijo.style.top = "0";
                filtradoFijo.style.width = "100%";
            } else {
                filtradoFijo.style.position = "sticky";
                filtradoFijo.style.top = `${headerHeight}px`;
            }
        }
    });

    // Cargar productos y ofertas
    loadProductsAndOffers();
    loadCarousel();
    loadReseñas();

    // Efecto de entrada
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.5s ease';
    }, 10);
});

// Funciones de carga de datos
function loadCarousel() {
    fetch('productos.json')
        .then(response => response.json())
        .then(data => {
            const carouselInner = document.querySelector('.carousel-inner');
            if (carouselInner) {
                carouselInner.innerHTML = '';
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
                moveCarousel(0);
            }
        })
        .catch(error => console.error('Error cargando las ofertas:', error));
}

function loadProductsAndOffers() {
    fetch('productos.json')
        .then(response => response.json())
        .then(data => {
            const productGrid = document.getElementById('product-grid');
            if (productGrid) {
                productGrid.innerHTML = '';
                
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
            }
        })
        .catch(error => console.error('Error cargando los productos y ofertas:', error));
}

// Intervalo para el carrusel
setInterval(() => moveCarousel(1), 8000);