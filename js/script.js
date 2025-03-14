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
            <span>${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}</span>
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
    if (btn) btn.addEventListener("click", () => cartSection.classList.toggle("active"));
});

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

// Filtrador de productos
function filtrarProductos() {
    const categoria = document.getElementById('categoria').value;
    const precioMaximo = parseFloat(document.getElementById('precio').value) || Infinity;
    const productos = document.querySelectorAll('.product');
    productos.forEach(producto => {
        const precio = parseFloat(producto.querySelector('.price').innerText.replace('€', ''));
        const categoriaProducto = producto.getAttribute('data-categoria');
        producto.style.display = (categoria === 'todos' || categoriaProducto === categoria) && precio <= precioMaximo ? 'block' : 'none';
    });
}
