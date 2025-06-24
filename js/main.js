// Main JavaScript functionality for SAJO Taquería

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeLoading();
    initializeNavbar();
    initializeAnimations();
    initializePromotions();
    initializeSmoothScrolling();
    initializeBackToTop();
    initializeScrollAnimations();
});

// Loading Screen
function initializeLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            // Remove from DOM after animation
            setTimeout(() => {
                if (loadingScreen) {
                    loadingScreen.remove();
                }
            }, 500);
        }, 1500);
    });
}

// Navbar Functionality
function initializeNavbar() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Active link highlighting
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Mobile menu close on link click
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
}

// Animations
function initializeAnimations() {
    // Menu button click handlers with transition effect
    const menuBtn = document.getElementById('menu-btn');
    const heroMenuBtn = document.getElementById('hero-menu-btn');
    
    [menuBtn, heroMenuBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', function(e) {
                if (this.getAttribute('href') === 'menu-principal.html') {
                    e.preventDefault();
                    
                    // Add transition effect
                    document.body.style.opacity = '0.8';
                    document.body.style.transform = 'scale(0.98)';
                    document.body.style.transition = 'all 0.3s ease';
                    
                    setTimeout(() => {
                        window.location.href = 'menu-principal.html';
                    }, 300);
                } else {
                    e.preventDefault();
                    document.getElementById('menu').scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        }
    });
    
    // Button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Button click animations
        btn.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Card hover effects
    const cards = document.querySelectorAll('.menu-preview-card, .featured-dish-card, .social-link-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, delay * 1000);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Back to Top Button
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

// Promotions Slider
function initializePromotions() {
    const promoItems = document.querySelectorAll('.promo-item');
    let currentPromo = 0;
    
    function showNextPromo() {
        promoItems[currentPromo].classList.remove('active');
        currentPromo = (currentPromo + 1) % promoItems.length;
        promoItems[currentPromo].classList.add('active');
    }
    
    // Auto-rotate promotions every 5 seconds
    setInterval(showNextPromo, 5000);
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// External Functions
function openGoogleMaps() {
    const address = "Calle Principal 123, Centro, Tlaxcala";
    const encodedAddress = encodeURIComponent(address);
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    
    // Add click animation
    if (event && event.target) {
        animateButton(event.target);
    }
    
    window.open(url, '_blank');
}

function callRestaurant() {
    const phoneNumber = "2461411327";
    
    // Add click animation
    if (event && event.target) {
        animateButton(event.target);
    }
    
    // Show confirmation dialog
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: '¿Llamar a SAJO Taquería?',
            text: `Se abrirá tu aplicación de teléfono para llamar al ${phoneNumber}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#D32F2F',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Llamar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = `tel:${phoneNumber}`;
            }
        });
    } else {
        // Fallback if SweetAlert is not available
        if (confirm('¿Deseas llamar a SAJO Taquería?')) {
            window.location.href = `tel:${phoneNumber}`;
        }
    }
}

function openWhatsApp() {
    const phoneNumber = "2461411327";
    const message = "¡Hola! Me gustaría hacer un pedido en SAJO Taquería. ¿Podrían ayudarme?";
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/52${phoneNumber}?text=${encodedMessage}`;
    
    // Add click animation
    if (event && event.target) {
        animateButton(event.target);
    }
    
    window.open(url, '_blank');
}

// Utility Functions
function animateButton(button) {
    const originalTransform = button.style.transform;
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = originalTransform || 'scale(1)';
    }, 150);
}

// Add ripple effect CSS
const rippleCSS = `
.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

// Inject ripple CSS
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
    // Scroll-based animations and effects are handled in individual functions
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // Could implement error reporting here
});

// Analytics tracking (placeholder for future implementation)
function trackEvent(category, action, label) {
    // Google Analytics or other tracking service
    console.log(`Event tracked: ${category} - ${action} - ${label}`);
}

// Track interactions
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('social-icon') || e.target.closest('.social-icon')) {
        trackEvent('Social', 'Click', 'Header Social Icon');
    }
    
    if (e.target.classList.contains('social-link-card') || e.target.closest('.social-link-card')) {
        trackEvent('Social', 'Click', 'Footer Social Card');
    }
    
    if (e.target.classList.contains('btn-menu-complete') || e.target.closest('.btn-menu-complete')) {
        trackEvent('Menu', 'Click', 'View Complete Menu');
    }
});

// Preload critical images
function preloadImages() {
    const criticalImages = [
        'imagenes/Imagen de WhatsApp 2024-10-08 a las 23.28.13_419c6576.jpg',
        'imagenes/papas.jpg',
        'imagenes/santito.jpeg',
        'imagenes/santo.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize image preloading
preloadImages();

// Service Worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}

// Lazy loading for images (if needed)
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Initialize lazy loading
initializeLazyLoading();