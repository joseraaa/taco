// Sistema de Carrito Persistente para SAJO Taquería
class CartSystem {
    constructor() {
        this.cart = this.loadCart();
        this.whatsappNumber = "2461411327";
        this.maxUrlLength = 2000; // Límite seguro para URLs de WhatsApp
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
                        <button class="btn-copy-order" onclick="cartSystem.copyOrderToClipboard()" style="display: none;">
                            <i class="fas fa-copy"></i> Copiar Pedido
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

        // Mostrar/ocultar botón de copiar según el tamaño del pedido
        this.updateOrderButtons();
    }

    // Actualizar botones de pedido según el tamaño
    updateOrderButtons() {
        const whatsappBtn = document.querySelector('.btn-whatsapp-order');
        const copyBtn = document.querySelector('.btn-copy-order');
        
        if (!whatsappBtn || !copyBtn) return;

        const message = this.generateOrderMessage();
        const encodedMessage = encodeURIComponent(message);
        const fullUrl = `https://wa.me/52${this.whatsappNumber}?text=${encodedMessage}`;

        if (fullUrl.length > this.maxUrlLength) {
            // Mensaje muy largo - mostrar ambos botones
            whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i> WhatsApp (Resumido)';
            copyBtn.style.display = 'flex';
            this.showNotification('Pedido grande detectado. Usa "Copiar Pedido" para el mensaje completo.', 'info');
        } else {
            // Mensaje normal - solo WhatsApp
            whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Pedir por WhatsApp';
            copyBtn.style.display = 'none';
        }
    }

    // Generar mensaje de pedido
    generateOrderMessage(isShort = false) {
        if (this.cart.length === 0) return '';

        let message = "¡Hola! Quiero hacer un pedido:\n\n";
        
        if (isShort && this.cart.length > 6) {
            // Versión resumida para URLs largas
            const totalItems = this.getCartItemCount();
            message += `📋 Pedido con ${totalItems} productos\n`;
            message += `💰 Total: $${this.getCartTotal().toFixed(0)}\n\n`;
            message += "📝 Detalles completos:\n";
            message += "Por favor, solicita el desglose completo.\n\n";
        } else {
            // Versión completa
            this.cart.forEach(item => {
                const price = parseFloat(item.price.toString().replace('$', ''));
                const subtotal = price * item.quantity;
                message += `${item.quantity} x ${item.name} - $${price} = $${subtotal}\n`;
            });
            message += `\n💰 Total: $${this.getCartTotal().toFixed(0)}\n\n`;
        }
        
        message += "👤 Nombre: [Por favor completa tu nombre]\n";
        message += "📍 Dirección: [Si es para entrega a domicilio]\n";
        message += "📝 Observaciones: [Alguna indicación especial]";
        
        return message;
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

    // Enviar pedido por WhatsApp (optimizado)
    sendWhatsAppOrder() {
        if (this.cart.length === 0) {
            this.showNotification('Tu carrito está vacío', 'warning');
            return;
        }

        const fullMessage = this.generateOrderMessage();
        const encodedMessage = encodeURIComponent(fullMessage);
        const fullUrl = `https://wa.me/52${this.whatsappNumber}?text=${encodedMessage}`;

        let finalUrl;
        
        if (fullUrl.length > this.maxUrlLength) {
            // Usar versión resumida si es muy largo
            const shortMessage = this.generateOrderMessage(true);
            const shortEncodedMessage = encodeURIComponent(shortMessage);
            finalUrl = `https://wa.me/52${this.whatsappNumber}?text=${shortEncodedMessage}`;
            
            this.showNotification('Enviando versión resumida. Usa "Copiar Pedido" para el detalle completo.', 'warning');
        } else {
            finalUrl = fullUrl;
        }
        
        // Intentar abrir WhatsApp
        try {
            window.open(finalUrl, '_blank');
            this.showNotification('Abriendo WhatsApp...', 'success');
        } catch (error) {
            console.error('Error al abrir WhatsApp:', error);
            this.showNotification('Error al abrir WhatsApp. Intenta copiar el pedido manualmente.', 'error');
            this.copyOrderToClipboard();
        }
    }

    // Copiar pedido al portapapeles
    async copyOrderToClipboard() {
        if (this.cart.length === 0) {
            this.showNotification('Tu carrito está vacío', 'warning');
            return;
        }

        const message = this.generateOrderMessage();
        
        try {
            if (navigator.clipboard && window.isSecureContext) {
                // Usar la API moderna del portapapeles
                await navigator.clipboard.writeText(message);
                this.showNotification('Pedido copiado al portapapeles', 'success');
                this.showCopyInstructions();
            } else {
                // Fallback para navegadores más antiguos
                this.fallbackCopyToClipboard(message);
            }
        } catch (error) {
            console.error('Error al copiar:', error);
            this.fallbackCopyToClipboard(message);
        }
    }

    // Método de respaldo para copiar texto
    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showNotification('Pedido copiado al portapapeles', 'success');
            this.showCopyInstructions();
        } catch (error) {
            console.error('Error en fallback copy:', error);
            this.showNotification('No se pudo copiar automáticamente. Selecciona y copia manualmente.', 'error');
            this.showManualCopyModal(text);
        } finally {
            document.body.removeChild(textArea);
        }
    }

    // Mostrar instrucciones después de copiar
    showCopyInstructions() {
        const instructionsModal = document.createElement('div');
        instructionsModal.className = 'copy-instructions-modal';
        instructionsModal.innerHTML = `
            <div class="copy-instructions-overlay" onclick="this.parentElement.remove()"></div>
            <div class="copy-instructions-content">
                <div class="copy-instructions-header">
                    <h4><i class="fas fa-info-circle"></i> Pedido Copiado</h4>
                    <button onclick="this.closest('.copy-instructions-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="copy-instructions-body">
                    <p><strong>¡Perfecto!</strong> Tu pedido ha sido copiado al portapapeles.</p>
                    <div class="instructions-steps">
                        <div class="step">
                            <span class="step-number">1</span>
                            <span>Abre WhatsApp en tu teléfono o computadora</span>
                        </div>
                        <div class="step">
                            <span class="step-number">2</span>
                            <span>Busca el contacto: <strong>246-141-1327</strong></span>
                        </div>
                        <div class="step">
                            <span class="step-number">3</span>
                            <span>Pega el mensaje copiado y envía</span>
                        </div>
                    </div>
                    <div class="quick-actions">
                        <button class="btn-open-whatsapp" onclick="window.open('https://wa.me/52${this.whatsappNumber}', '_blank')">
                            <i class="fab fa-whatsapp"></i> Abrir WhatsApp Web
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(instructionsModal);
        
        // Auto-remover después de 10 segundos
        setTimeout(() => {
            if (instructionsModal.parentElement) {
                instructionsModal.remove();
            }
        }, 10000);
    }

    // Mostrar modal para copia manual
    showManualCopyModal(text) {
        const manualModal = document.createElement('div');
        manualModal.className = 'manual-copy-modal';
        manualModal.innerHTML = `
            <div class="manual-copy-overlay" onclick="this.parentElement.remove()"></div>
            <div class="manual-copy-content">
                <div class="manual-copy-header">
                    <h4><i class="fas fa-copy"></i> Copia Manual</h4>
                    <button onclick="this.closest('.manual-copy-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="manual-copy-body">
                    <p>Selecciona todo el texto y cópialo manualmente:</p>
                    <textarea readonly class="manual-copy-text">${text}</textarea>
                    <div class="manual-copy-actions">
                        <button onclick="this.closest('.manual-copy-modal').remove()">Cerrar</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(manualModal);
        
        // Seleccionar automáticamente el texto
        const textarea = manualModal.querySelector('.manual-copy-text');
        textarea.focus();
        textarea.select();
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
        // Remover notificaciones existentes del mismo tipo
        const existingNotifications = document.querySelectorAll(`.cart-notification-${type}`);
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
        
        // Remover después de tiempo variable según el tipo
        const duration = type === 'warning' || type === 'error' ? 5000 : 3000;
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, duration);
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
                // Cerrar también modales de instrucciones
                const instructionsModal = document.querySelector('.copy-instructions-modal');
                const manualModal = document.querySelector('.manual-copy-modal');
                if (instructionsModal) instructionsModal.remove();
                if (manualModal) manualModal.remove();
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