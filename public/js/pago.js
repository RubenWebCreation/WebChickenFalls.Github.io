document.addEventListener('DOMContentLoaded', function() {
    // Recuperar datos del carrito y total
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = localStorage.getItem('total') || '0.00';
    
    // Mostrar resumen
    const resumenElement = document.getElementById('resumen-pedido');
    if (resumenElement) {
        let html = '<h3>Resumen de tu pedido:</h3><ul>';
        cart.forEach(item => {
            html += `<li>${item.name} (x${item.quantity}) - €${(item.price * item.quantity).toFixed(2)}</li>`;
        });
        html += `</ul><p><strong>Total: €${total}</strong></p>`;
        resumenElement.innerHTML = html;
    }
    
    // Actualizar total en el botón de pago
    document.getElementById('total-pago').textContent = total;
    
    // Manejar el envío del formulario de pago
    document.getElementById('formulario-pago').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Aquí iría la lógica real de procesamiento de pago
       // Reemplaza el alert en pago.js por esto:
const notification = document.createElement('div');
notification.className = 'pago-exitoso';
notification.innerHTML = `
    <div class="pago-exitoso-content">
        <span class="pago-exitoso-icon">✓</span>
        <h3>¡Pago exitoso!</h3>
        <p>Gracias por tu compra. Serás redirigido a la página principal.</p>
    </div>
`;
document.body.appendChild(notification);

setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
        localStorage.removeItem('cart');
        localStorage.removeItem('total');
        window.location.href = 'index.html';
    }, 500);
}, 3000);
    });
});
// ----------------------------------------------------------------------------
// Añade esto al formulario de pago
document.getElementById('tarjeta').addEventListener('input', function(e) {
    this.value = this.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
});

document.getElementById('vencimiento').addEventListener('input', function(e) {
    this.value = this.value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1/');
});

document.getElementById('cvv').addEventListener('input', function(e) {
    this.value = this.value.replace(/\D/g, '');
});
// ----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    // ... código existente ...
    
    // Añade este evento para el botón de volver
    document.getElementById('volver-carrito').addEventListener('click', function() {
        // Efecto de transición al volver
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500);
    });
    
    // Opcional: Guardar datos del formulario por si el usuario vuelve
    const formInputs = document.querySelectorAll('#formulario-pago input');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            localStorage.setItem('formData-' + this.id, this.value);
        });
        
        // Recuperar datos si existen
        const savedValue = localStorage.getItem('formData-' + this.id);
        if (savedValue) this.value = savedValue;
    });
});
