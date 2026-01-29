// ============================================
// SIGNAL-INSPIRED PORTFOLIO
// Complete Effects Implementation
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initLoader();
    initCursor();
    initNavbar();
    initHeroImageTracker();
    initRotatingCircles();
    initScrollAnimations();
    initMarquee();
});

// ============================================
// THEME TOGGLE
// ============================================
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    // Set initial theme
    document.body.setAttribute('data-theme', savedTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
}

// ============================================
// LOADER
// ============================================
function initLoader() {
    const loader = document.querySelector('.loader');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1800);
    });
    
    // Fallback
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 3000);
}

// ============================================
// SMOOTH CUSTOM CURSOR (Fixed - No Lag)
// ============================================
function initCursor() {
    if (window.innerWidth < 769) return;
    
    // Create cursor elements
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    document.body.appendChild(dot);
    
    const outline = document.createElement('div');
    outline.className = 'cursor-outline';
    document.body.appendChild(outline);
    
    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let outlineX = 0, outlineY = 0;
    
    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth animation loop using RAF
    function animateCursor() {
        // Dot follows instantly
        dotX = mouseX;
        dotY = mouseY;
        
        // Outline follows with smooth easing
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        
        dot.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`;
        outline.style.transform = `translate(${outlineX - 20}px, ${outlineY - 20}px)`;
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .project-card, .service-card, .social-icon, .nav-contact');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            dot.classList.add('hover');
            outline.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            dot.classList.remove('hover');
            outline.classList.remove('hover');
        });
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        dot.style.opacity = '0';
        outline.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        dot.style.opacity = '1';
        outline.style.opacity = '1';
    });
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ============================================
// HERO - MOUSE TRACKING BACKGROUND IMAGES
// ============================================
function initHeroImageTracker() {
    const hero = document.querySelector('.hero');
    const bgContainer = document.querySelector('.hero-bg-container');
    if (!hero || !bgContainer) return;
    
    const images = bgContainer.querySelectorAll('.hero-bg-image');
    if (images.length === 0) return;
    
    let currentImageIndex = 0;
    let lastX = 0;
    let lastY = 0;
    let moveThreshold = 150; // Pixels to move before changing background
    let distanceMoved = 0;
    let isFirstMove = true;
    
    // Show first image on load
    setTimeout(() => {
        images[0].classList.add('active');
    }, 500);
    
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // On first mouse move, start cycling
        if (isFirstMove) {
            isFirstMove = false;
            lastX = x;
            lastY = y;
            return;
        }
        
        // Calculate distance moved
        const dx = x - lastX;
        const dy = y - lastY;
        distanceMoved += Math.sqrt(dx * dx + dy * dy);
        
        lastX = x;
        lastY = y;
        
        // Change entire background when threshold reached
        if (distanceMoved > moveThreshold) {
            distanceMoved = 0;
            
            // Hide all images
            images.forEach(img => img.classList.remove('active'));
            
            // Move to next image
            currentImageIndex = (currentImageIndex + 1) % images.length;
            
            // Show new background image
            images[currentImageIndex].classList.add('active');
        }
    });
    
    hero.addEventListener('mouseleave', () => {
        // Keep last image visible when mouse leaves
    });
}

// ============================================
// ROTATING CIRCLES (180° on scroll)
// ============================================
function initRotatingCircles() {
    const section = document.querySelector('.rotating-circles');
    const container = document.querySelector('.circles-container');
    if (!section || !container) return;
    
    window.addEventListener('scroll', () => {
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Calculate visibility progress (0 to 1)
        if (rect.top < windowHeight && rect.bottom > 0) {
            const progress = 1 - (rect.top / windowHeight);
            const clampedProgress = Math.max(0, Math.min(1, progress));
            
            // Rotate from 180deg (upside down) to 0deg (right side up)
            const rotation = 180 - (clampedProgress * 180);
            container.style.transform = `rotate(${rotation}deg)`;
        }
    });
}

// ============================================
// SCROLL-TRIGGERED SLIDE ANIMATIONS
// ============================================
function initScrollAnimations() {
    const slideElements = document.querySelectorAll('.slide-in');
    
    const observerOptions = {
        root: null,
        rootMargin: '-50px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    slideElements.forEach(el => observer.observe(el));
    
    // Also add scroll-based progress for continuous animation feel
    window.addEventListener('scroll', () => {
        slideElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (rect.top < windowHeight * 0.85) {
                el.classList.add('visible');
            }
        });
    });
}

// ============================================
// MARQUEE INFINITE SCROLL
// ============================================
function initMarquee() {
    const marquees = document.querySelectorAll('.marquee-track');
    
    marquees.forEach(track => {
        // Clone content for seamless loop
        const content = track.querySelector('.marquee-content');
        if (content) {
            const clone = content.cloneNode(true);
            track.appendChild(clone);
        }
    });
}

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// PARALLAX ON SCROLL (for specific elements)
// ============================================
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    
    // Parallax for hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
    }
});

// ============================================
// COUNTER ANIMATION FOR STATS
// ============================================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target')) || 0;
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '+';
            }
        };
        
        updateCounter();
    });
}

// Trigger counter animation when stats section is visible
const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    statsObserver.observe(statsSection);
}
