// Menu Interactions JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeMenuInteractions();
    initializeBackToTop();
    initializeMenuAnimations();
});

// Initialize all menu interactions
function initializeMenuInteractions() {
    // Category card hover effects
    const categoryCards = document.querySelectorAll('.menu-category-card');
    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Click animation
        card.addEventListener('click', function(e) {
            if (!e.target.closest('a')) {
                const link = this.querySelector('a');
                if (link) {
                    animateClick(this);
                    setTimeout(() => {
                        window.location.href = link.href;
                    }, 300);
                }
            }
        });
    });

    // Menu item card interactions
    const menuItemCards = document.querySelectorAll('.menu-item-card');
    menuItemCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 12px 35px rgba(0,0,0,0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        });
    });

    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Back to top functionality
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Add bounce animation
            this.style.transform = 'scale(0.8)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }
}

// Menu animations
function initializeMenuAnimations() {
    // Intersection Observer for menu items
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe menu items
    const menuItems = document.querySelectorAll('.menu-item-loading');
    menuItems.forEach(item => {
        observer.observe(item);
    });
}

// Toggle favorite functionality
function toggleFavorite(button) {
    const icon = button.querySelector('i');
    const isActive = button.classList.contains('active');
    
    if (isActive) {
        button.classList.remove('active');
        icon.classList.remove('fas');
        icon.classList.add('far');
        showToast('Eliminado de favoritos', 'info');
    } else {
        button.classList.add('active');
        icon.classList.remove('far');
        icon.classList.add('fas');
        showToast('Agregado a favoritos', 'success');
        
        // Heart animation
        button.style.transform = 'scale(1.3)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 200);
    }
    
    // Save to localStorage
    saveFavorites();
}

// Share item via WhatsApp
function shareItem(itemName, price) {
    const message = `¡Hola! Me interesa ordenar: ${itemName} - ${price} de SAJO Taquería. ¿Podrían ayudarme con mi pedido?`;
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "2461411327";
    const url = `https://wa.me/52${phoneNumber}?text=${encodedMessage}`;
    
    // Animation
    event.target.closest('.action-btn').style.transform = 'scale(1.2)';
    setTimeout(() => {
        event.target.closest('.action-btn').style.transform = 'scale(1)';
    }, 200);
    
    window.open(url, '_blank');
    showToast('Abriendo WhatsApp...', 'success');
}

// Add to cart functionality (placeholder)
function addToCart(itemName, price) {
    // This would integrate with a cart system
    showToast(`${itemName} agregado al carrito`, 'success');
    
    // Animation
    const button = event.target.closest('.btn-cart');
    button.style.transform = 'scale(0.9)';
    button.innerHTML = '<i class="fas fa-check"></i> Agregado';
    
    setTimeout(() => {
        button.style.transform = 'scale(1)';
        button.innerHTML = '<i class="fas fa-plus"></i> Agregar';
    }, 1500);
}

// Click animation
function animateClick(element) {
    element.style.transform = 'scale(0.95)';
    setTimeout(() => {
        element.style.transform = 'translateY(-10px) scale(1.02)';
    }, 150);
}

// Toast notification system
function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast-notification');
    existingToasts.forEach(toast => toast.remove());
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${getToastIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getToastColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-weight: 500;
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

function getToastIcon(type) {
    switch(type) {
        case 'success': return 'check';
        case 'error': return 'times';
        case 'warning': return 'exclamation-triangle';
        default: return 'info';
    }
}

function getToastColor(type) {
    switch(type) {
        case 'success': return '#25D366';
        case 'error': return '#D32F2F';
        case 'warning': return '#FF9800';
        default: return '#2196F3';
    }
}

// Save favorites to localStorage
function saveFavorites() {
    const favorites = [];
    const activeButtons = document.querySelectorAll('.btn-favorite.active');
    
    activeButtons.forEach(button => {
        const card = button.closest('.menu-item-card');
        const itemName = card.querySelector('h4').textContent;
        favorites.push(itemName);
    });
    
    localStorage.setItem('sajo-favorites', JSON.stringify(favorites));
}

// Load favorites from localStorage
function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem('sajo-favorites') || '[]');
    
    favorites.forEach(itemName => {
        const cards = document.querySelectorAll('.menu-item-card');
        cards.forEach(card => {
            const cardItemName = card.querySelector('h4').textContent;
            if (cardItemName === itemName) {
                const button = card.querySelector('.btn-favorite');
                const icon = button.querySelector('i');
                button.classList.add('active');
                icon.classList.remove('far');
                icon.classList.add('fas');
            }
        });
    });
}

// Load favorites when page loads
document.addEventListener('DOMContentLoaded', loadFavorites);

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add ripple effect to buttons
document.addEventListener('click', function(e) {
    if (e.target.matches('.btn, .action-btn, .menu-category-card')) {
        createRipple(e);
    }
});

function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add CSS for ripple animation
const rippleCSS = `
@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

.toast-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.category-navigation {
    margin-top: 4rem;
    padding-top: 2rem;
    border-top: 2px solid #e9ecef;
}

.category-navigation .btn {
    padding: 1rem 2rem;
    font-weight: 600;
    border-radius: 10px;
    transition: all 0.3s ease;
}

.category-navigation .btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll events
const optimizedScrollHandler = debounce(function() {
    // Handle scroll-based animations
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);