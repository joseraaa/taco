// Main JavaScript functionality for SAJO Taquería

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeLoading();
    initializeNavbar();
    initializeMenuTabs();
    initializeAnimations();
    initializePromotions();
    initializeSmoothScrolling();
});

// Loading Screen
function initializeLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            // Remove from DOM after animation
            setTimeout(() => {
                loadingScreen.remove();
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

// Menu Tabs Functionality
function initializeMenuTabs() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    const menuCategories = document.querySelectorAll('.menu-category');
    const menuBtn = document.getElementById('menu-btn');
    const heroMenuBtn = document.getElementById('hero-menu-btn');
    
    // Tab switching
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetCategory = this.getAttribute('data-category');
            
            // Remove active class from all tabs and categories
            categoryTabs.forEach(t => t.classList.remove('active'));
            menuCategories.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding category
            this.classList.add('active');
            document.getElementById(targetCategory).classList.add('active');
            
            // Add animation effect
            const activeCategory = document.getElementById(targetCategory);
            activeCategory.style.opacity = '0';
            activeCategory.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                activeCategory.style.opacity = '1';
                activeCategory.style.transform = 'translateY(0)';
            }, 100);
        });
    });
    
    // Menu button click handlers
    [menuBtn, heroMenuBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                document.getElementById('menu').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        }
    });
}

// Animations
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.menu-item, .info-item, .social-link');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Menu item hover effects
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Button click animations
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
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
    animateButton(event.target);
    
    window.open(url, '_blank');
}

function callRestaurant() {
    const phoneNumber = "2461411327";
    
    // Add click animation
    animateButton(event.target);
    
    // Show confirmation dialog
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
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
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
    // Scroll-based animations and effects
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // Could implement error reporting here
});

// Service Worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}

// Analytics tracking (placeholder for future implementation)
function trackEvent(category, action, label) {
    // Google Analytics or other tracking service
    console.log(`Event tracked: ${category} - ${action} - ${label}`);
}

// Track menu interactions
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('category-tab')) {
        trackEvent('Menu', 'Category Change', e.target.textContent.trim());
    }
    
    if (e.target.classList.contains('social-link')) {
        trackEvent('Social', 'Click', e.target.querySelector('span').textContent);
    }
});