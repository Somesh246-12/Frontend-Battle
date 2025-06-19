// ===== THEME TOGGLE FUNCTIONALITY =====
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('.theme-icon');
const body = document.body;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// ===== MOBILE NAVIGATION TOGGLE =====
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// ===== LOADER FUNCTIONALITY =====
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    
    // Add a minimum loading time for better UX
    setTimeout(() => {
        loader.classList.add('hidden');
        
        // Remove loader from DOM after animation completes
        setTimeout(() => {
            loader.remove();
        }, 500);
    }, 1500); // Adjust this value to change minimum loading time
});

// ===== SMOOTH SCROLLING FOR NAVIGATION LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== NAVBAR BACKGROUND ON SCROLL =====
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        
        if (body.getAttribute('data-theme') === 'dark') {
            navbar.style.background = 'rgba(17, 24, 39, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
        }
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
        
        if (body.getAttribute('data-theme') === 'dark') {
            navbar.style.background = 'rgba(17, 24, 39, 0.95)';
        }
    }
    
    lastScrollTop = scrollTop;
});

// ===== SCROLL TRIGGERED ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

// Observe all sections for scroll animations
document.querySelectorAll('section').forEach(section => {
    section.classList.add('scroll-animate');
    observer.observe(section);
});

// Observe individual cards and elements for staggered animations
document.querySelectorAll('.about-card, .gallery-item').forEach((element, index) => {
    element.style.animationDelay = `${index * 0.1}s`;
    element.classList.add('scroll-animate');
    observer.observe(element);
});

// ===== STATISTICS COUNTER ANIMATION =====
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Initialize counter animations when stats section is in view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                animateCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observe stats section
document.addEventListener('DOMContentLoaded', () => {
    const statsSection = document.getElementById('stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});

// ===== GALLERY IMAGE LAZY LOADING =====
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    imageObserver.observe(img);
});

// ===== CONTACT FORM HANDLING =====
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = contactForm.querySelector('input[type="text"]').value;
    const email = contactForm.querySelector('input[type="email"]').value;
    const message = contactForm.querySelector('textarea').value;
    
    // Simple validation
    if (!name || !email || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Simulate form submission
    showNotification('Message sent successfully!', 'success');
    contactForm.reset();
});

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--gradient-primary)' : 'var(--gradient-secondary)'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ===== PARALLAX EFFECT FOR HERO ORBS =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.gradient-orb');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
    });
});

// ===== TYPING EFFECT FOR HERO TITLE =====
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    setTimeout(() => {
        const heroTitle = document.querySelector('.hero-title');
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 80);
    }, 2000);
});

// ===== EASTER EGG: KONAMI CODE =====
let konamiCode = [];
const konamiPattern = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiPattern.length) {
        konamiCode.shift();
    }
    
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiPattern)) {
        // Easter egg activated!
        document.body.style.animation = 'rainbow 2s linear infinite';
        showNotification('🎉 Konami Code activated! You found the easter egg!', 'success');
        
        // Add rainbow animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            document.body.style.animation = '';
            style.remove();
        }, 5000);
        
        konamiCode = [];
    }
});

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce function for scroll events
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

// Apply debouncing to scroll-heavy functions
const debouncedScrollHandler = debounce(() => {
    // Scroll-based animations here
}, 16); // ~60fps

// ===== ACCESSIBILITY ENHANCEMENTS =====
// Skip to main content link
const skipLink = document.createElement('a');
skipLink.href = '#main';
skipLink.textContent = 'Skip to main content';
skipLink.className = 'skip-link';
skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 6px;
    background: var(--primary-color);
    color: white;
    padding: 8px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 10001;
    transition: top 0.3s;
`;

skipLink.addEventListener('focus', () => {
    skipLink.style.top = '6px';
});

skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
});

document.body.insertBefore(skipLink, document.body.firstChild);

// Add main landmark
document.querySelector('main').id = 'main';

// ===== CONSOLE EASTER EGG =====
console.log(`
🚀 Welcome to Frontend Battle!
   
   ╔══════════════════════════════════╗
   ║     Built with ❤️ and Code      ║
   ║                                  ║
   ║  Try the Konami Code: ↑↑↓↓←→←→BA ║
   ╚══════════════════════════════════╝
   
   Built with: HTML5, CSS3, Vanilla JS
   Features: Responsive, Dark Mode, Animations
   
   Good luck in your Frontend Battle! 🎯
`);

// ===== FINAL INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎉 Frontend Battle website loaded successfully!');
    
    // Initialize any remaining features
    if ('serviceWorker' in navigator) {
        // Future PWA support
        console.log('Service Worker support detected');
    }
    
    // Check for WebP support and optimize images accordingly
    const supportsWebP = () => {
        const canvas = document.createElement('canvas');
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    };
    
    if (supportsWebP()) {
        console.log('WebP support detected - images could be optimized');
    }
});