// Sistema de Carrito Persistente para SAJO Taquería
class CartSystem {
    constructor() {
        this.cart = this.loadCart();
        this.whatsappNumber = "2461411327";
        this.init();
    }

    init() {
        this.createCartButton();
        this.createCartModal();
        this.updateCartButton();
        this.bindEvents();
    }

    // Crear botón flotante del carrito
    createCartButton() {
        const cartButton = document.createElement('div');
        cartButton.id = 'cart-float-button';
        cartButton.className = 'cart-float-button';
        cartButton.innerHTML = `
            <i class="fas fa-shopping-cart"></i>
            <span class="cart-count" id="cart-count">0</span>
        `;
        cartButton.onclick = () => this.openCartModal();
        document.body.appendChild(cartButton);
    }

    // Crear modal del carrito
    createCartModal() {
        const modal = document.createElement('div');
        modal.id = 'cart-modal';
        modal.className = 'cart-modal';
        modal.innerHTML = `
            <div class="cart-modal-overlay" onclick="cartSystem.closeCartModal()"></div>
            <div class="cart-modal-content">
                <div class="cart-header">
                    <h3><i class="fas fa-shopping-cart"></i> Tu Pedido</h3>
                    <button class="cart-close" onclick="cartSystem.closeCartModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="cart-body" id="cart-items">
                    <!-- Items del carrito se cargan aquí -->
                </div>
                <div class="cart-footer">
                    <div class="cart-total">
                        <strong>Total: $<span id="cart-total">0</span></strong>
                    </div>
                    <div class="cart-actions">
                        <button class="btn-clear-cart" onclick="cartSystem.clearCart()">
                            <i class="fas fa-trash"></i> Limpiar Carrito
                        </button>
                        <button class="btn-whatsapp-order" onclick="cartSystem.sendWhatsAppOrder()">
                            <i class="fab fa-whatsapp"></i> Pedir por WhatsApp
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Agregar producto al carrito
    addToCart(product) {
        const existingItem = this.cart.find(item => item.name === product.name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                name: product.name,
                price: product.price,
                quantity: 1,
                category: product.category || 'General'
            });
        }
        
        this.saveCart();
        this.updateCartButton();
        this.updateCartModal();
        this.showAddedNotification(product.name);
    }

    // Remover producto del carrito
    removeFromCart(productName) {
        this.cart = this.cart.filter(item => item.name !== productName);
        this.saveCart();
        this.updateCartButton();
        this.updateCartModal();
        this.showNotification('Producto eliminado del carrito', 'info');
    }

    // Actualizar cantidad de producto
    updateQuantity(productName, newQuantity) {
        const item = this.cart.find(item => item.name === productName);
        if (item) {
            if (newQuantity <= 0) {
                this.removeFromCart(productName);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
                this.updateCartButton();
                this.updateCartModal();
            }
        }
    }

    // Limpiar carrito
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartButton();
        this.updateCartModal();
        this.showNotification('Carrito limpiado', 'info');
    }

    // Calcular total del carrito
    getCartTotal() {
        return this.cart.reduce((total, item) => {
            const price = parseFloat(item.price.toString().replace('$', ''));
            return total + (price * item.quantity);
        }, 0);
    }

    // Obtener cantidad total de productos
    getCartItemCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    // Actualizar botón flotante del carrito
    updateCartButton() {
        const cartCount = document.getElementById('cart-count');
        const cartButton = document.getElementById('cart-float-button');
        const itemCount = this.getCartItemCount();
        
        if (cartCount) {
            cartCount.textContent = itemCount;
            cartCount.style.display = itemCount > 0 ? 'flex' : 'none';
        }
        
        if (cartButton) {
            cartButton.style.display = itemCount > 0 ? 'flex' : 'none';
            if (itemCount > 0) {
                cartButton.classList.add('has-items');
            } else {
                cartButton.classList.remove('has-items');
            }
        }
    }

    // Actualizar contenido del modal
    updateCartModal() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        if (!cartItems) return;

        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Tu carrito está vacío</p>
                    <small>Agrega algunos platillos deliciosos</small>
                </div>
            `;
        } else {
            cartItems.innerHTML = this.cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h5>${item.name}</h5>
                        <p class="cart-item-price">$${item.price}</p>
                    </div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="cartSystem.updateQuantity('${item.name}', ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="cartSystem.updateQuantity('${item.name}', ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="remove-btn" onclick="cartSystem.removeFromCart('${item.name}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
        
        if (cartTotal) {
            cartTotal.textContent = this.getCartTotal().toFixed(0);
        }
    }

    // Abrir modal del carrito
    openCartModal() {
        const modal = document.getElementById('cart-modal');
        if (modal) {
            this.updateCartModal();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    // Cerrar modal del carrito
    closeCartModal() {
        const modal = document.getElementById('cart-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Enviar pedido por WhatsApp
    sendWhatsAppOrder() {
        if (this.cart.length === 0) {
            this.showNotification('Tu carrito está vacío', 'warning');
            return;
        }

        let message = "¡Hola! Quiero hacer un pedido:\n\n";
        
        this.cart.forEach(item => {
            const price = parseFloat(item.price.toString().replace('$', ''));
            const subtotal = price * item.quantity;
            message += `${item.quantity} x ${item.name} - $${price} = $${subtotal}\n`;
        });
        
        message += `\nTotal: $${this.getCartTotal().toFixed(0)}\n\n`;
        message += "Nombre: [Por favor completa tu nombre]\n";
        message += "Dirección: [Si es para entrega a domicilio]\n";
        message += "Observaciones: [Alguna indicación especial]";
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/52${this.whatsappNumber}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
        this.showNotification('Abriendo WhatsApp...', 'success');
    }

    // Guardar carrito en localStorage
    saveCart() {
        localStorage.setItem('sajo-cart', JSON.stringify(this.cart));
    }

    // Cargar carrito desde localStorage
    loadCart() {
        const savedCart = localStorage.getItem('sajo-cart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    // Mostrar notificación de producto agregado
    showAddedNotification(productName) {
        this.showNotification(`${productName} agregado al carrito`, 'success');
        
        // Animar el botón del carrito
        const cartButton = document.getElementById('cart-float-button');
        if (cartButton) {
            cartButton.classList.add('bounce');
            setTimeout(() => {
                cartButton.classList.remove('bounce');
            }, 600);
        }
    }

    // Sistema de notificaciones
    showNotification(message, type = 'info') {
        // Remover notificaciones existentes
        const existingNotifications = document.querySelectorAll('.cart-notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `cart-notification cart-notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        switch(type) {
            case 'success': return 'check-circle';
            case 'error': return 'exclamation-circle';
            case 'warning': return 'exclamation-triangle';
            default: return 'info-circle';
        }
    }

    // Vincular eventos
    bindEvents() {
        // Cerrar modal con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeCartModal();
            }
        });

        // Prevenir scroll del body cuando el modal está abierto
        document.addEventListener('wheel', (e) => {
            const modal = document.getElementById('cart-modal');
            if (modal && modal.classList.contains('active')) {
                const modalContent = modal.querySelector('.cart-modal-content');
                if (!modalContent.contains(e.target)) {
                    e.preventDefault();
                }
            }
        }, { passive: false });
    }
}

// Función global para agregar al carrito
function addToCart(name, price, category = '') {
    if (window.cartSystem) {
        window.cartSystem.addToCart({ name, price, category });
        
        // Animar el botón que se presionó
        if (event && event.target) {
            const button = event.target.closest('.btn-cart');
            if (button) {
                const originalText = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i> Agregado';
                button.style.background = '#25D366';
                button.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.style.background = '';
                    button.style.transform = '';
                }, 1500);
            }
        }
    }
}

// Inicializar el sistema de carrito cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    window.cartSystem = new CartSystem();
});