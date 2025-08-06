// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Neural Network Canvas Animation
class NeuralNetwork {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.animationId = null;

        this.resize();
        this.createNodes();
        this.createConnections();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createNodes() {
        const nodeCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        this.nodes = [];

        for (let i = 0; i < nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 3 + 1,
                opacity: Math.random() * 0.8 + 0.2,
                pulsePhase: Math.random() * Math.PI * 2,
                isActive: Math.random() > 0.7
            });
        }
    }

    createConnections() {
        this.connections = [];
        const maxDistance = 150;

        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const dx = this.nodes[i].x - this.nodes[j].x;
                const dy = this.nodes[i].y - this.nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    this.connections.push({
                        nodeA: i,
                        nodeB: j,
                        distance: distance,
                        maxDistance: maxDistance,
                        opacity: 1 - (distance / maxDistance),
                        dataFlow: Math.random(),
                        flowSpeed: Math.random() * 0.02 + 0.01
                    });
                }
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw connections
        this.connections.forEach(conn => {
            const nodeA = this.nodes[conn.nodeA];
            const nodeB = this.nodes[conn.nodeB];

            // Update data flow
            conn.dataFlow += conn.flowSpeed;
            if (conn.dataFlow > 1) conn.dataFlow = 0;

            // Draw connection line
            this.ctx.beginPath();
            this.ctx.moveTo(nodeA.x, nodeA.y);
            this.ctx.lineTo(nodeB.x, nodeB.y);
            this.ctx.strokeStyle = `rgba(82, 194, 255, ${conn.opacity * 0.3})`;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();

            // Draw data flow
            const flowX = nodeA.x + (nodeB.x - nodeA.x) * conn.dataFlow;
            const flowY = nodeA.y + (nodeB.y - nodeA.y) * conn.dataFlow;

            this.ctx.beginPath();
            this.ctx.arc(flowX, flowY, 2, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 254, 207, ${conn.opacity * 0.8})`;
            this.ctx.fill();
        });

        // Update and draw nodes
        this.nodes.forEach(node => {
            // Update position
            node.x += node.vx;
            node.y += node.vy;

            // Bounce off edges
            if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;

            // Update pulse
            node.pulsePhase += 0.02;
            const pulse = Math.sin(node.pulsePhase) * 0.3 + 0.7;

            // Draw node
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius * pulse, 0, Math.PI * 2);

            if (node.isActive) {
                // Active nodes glow
                const gradient = this.ctx.createRadialGradient(
                    node.x, node.y, 0,
                    node.x, node.y, node.radius * pulse * 3
                );
                gradient.addColorStop(0, `rgba(82, 194, 255, ${node.opacity})`);
                gradient.addColorStop(0.5, `rgba(82, 194, 255, ${node.opacity * 0.3})`);
                gradient.addColorStop(1, 'rgba(82, 194, 255, 0)');
                this.ctx.fillStyle = gradient;
            } else {
                this.ctx.fillStyle = `rgba(82, 194, 255, ${node.opacity * 0.6})`;
            }

            this.ctx.fill();

            // Draw inner core
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius * 0.3, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${node.opacity * 0.8})`;
            this.ctx.fill();
        });

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize Neural Network
const canvas = document.getElementById('neural-network');
if (canvas) {
    const neuralNet = new NeuralNetwork(canvas);

    // Add mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    canvas.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Activate nearby nodes
        neuralNet.nodes.forEach(node => {
            const dx = node.x - mouseX;
            const dy = node.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                node.isActive = true;
                node.opacity = Math.min(1, node.opacity + 0.1);
            } else if (distance > 150) {
                node.isActive = Math.random() > 0.7;
                node.opacity = Math.max(0.2, node.opacity - 0.05);
            }
        });
    });
}

// Hero animations
gsap.timeline()
    .from('.hero-title .title-line', {
        duration: 1.2,
        y: 100,
        opacity: 0,
        ease: 'power3.out'
    })
    .from('.hero-title .title-subtitle', {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power3.out'
    }, '-=0.8')
    .from('.hero-description', {
        duration: 1,
        y: 30,
        opacity: 0,
        ease: 'power3.out'
    }, '-=0.6')
    .from('.hero-cta .btn-primary', {
        duration: 0.8,
        y: 30,
        opacity: 0,
        ease: 'power3.out'
    }, '-=0.4')
    .from('.hero-cta .btn-secondary', {
        duration: 0.8,
        y: 30,
        opacity: 0,
        ease: 'power3.out'
    }, '-=0.6')
    .from('.hero-social .social-link', {
        duration: 0.6,
        y: 30,
        opacity: 0,
        stagger: 0.1,
        ease: 'power3.out'
    }, '-=0.4')
    .from('.scroll-indicator', {
        duration: 0.8,
        opacity: 0,
        ease: 'power3.out'
    }, '-=0.2');

// Smooth scrolling for navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            gsap.to(window, {
                duration: 1,
                scrollTo: {
                    y: targetSection,
                    offsetY: 80
                },
                ease: 'power3.inOut'
            });
        }
    });
});

// Section reveal animations
gsap.utils.toArray('.section-title').forEach(title => {
    gsap.from(title, {
        scrollTrigger: {
            trigger: title,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power3.out'
    });
});

gsap.utils.toArray('.section-line').forEach(line => {
    gsap.from(line, {
        scrollTrigger: {
            trigger: line,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        duration: 1,
        scaleX: 0,
        ease: 'power3.out'
    });
});

// Glass card animations
gsap.utils.toArray('.glass-card').forEach(card => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power3.out'
    });
});

// Timeline animations
gsap.utils.toArray('.timeline-item').forEach((item, index) => {
    gsap.from(item, {
        scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        duration: 0.8,
        x: -50,
        opacity: 0,
        delay: index * 0.2,
        ease: 'power3.out'
    });
});

// Button hover effects
document.querySelectorAll('.btn-primary, .btn-secondary, .btn-download').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
            duration: 0.3,
            scale: 1.05,
            ease: 'power2.out'
        });
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            duration: 0.3,
            scale: 1,
            ease: 'power2.out'
        });
    });
});

// Social link hover effects
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
        gsap.to(link, {
            duration: 0.3,
            scale: 1.1,
            rotation: 5,
            ease: 'power2.out'
        });
    });

    link.addEventListener('mouseleave', () => {
        gsap.to(link, {
            duration: 0.3,
            scale: 1,
            rotation: 0,
            ease: 'power2.out'
        });
    });
});

// Navbar background on scroll
ScrollTrigger.create({
    start: 'top -80',
    end: 99999,
    toggleClass: {
        className: 'scrolled',
        targets: '.nav'
    }
});

// Add scrolled class styles
const style = document.createElement('style');
style.textContent = `
    .nav.scrolled {
        background: rgba(14, 15, 19, 0.95);
        backdrop-filter: blur(20px);
        border-bottom: 1px solid rgba(82, 194, 255, 0.2);
    }
`;
document.head.appendChild(style);

// Mobile menu toggle (basic implementation)
const mobileToggle = document.querySelector('.nav-mobile');
const navLinks = document.querySelector('.nav-links');

if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Add mobile menu styles
const mobileStyle = document.createElement('style');
mobileStyle.textContent = `
    @media (max-width: 768px) {
        .nav-links {
            position: fixed;
            top: 80px;
            left: 0;
            right: 0;
            background: rgba(14, 15, 19, 0.95);
            backdrop-filter: blur(20px);
            flex-direction: column;
            padding: 2rem;
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .nav-links.active {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }
        
        .hamburger {
            display: block;
            width: 25px;
            height: 3px;
            background: var(--accent-cyan);
            position: relative;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .hamburger::before,
        .hamburger::after {
            content: '';
            position: absolute;
            width: 25px;
            height: 3px;
            background: var(--accent-cyan);
            transition: all 0.3s ease;
        }
        
        .hamburger::before {
            top: -8px;
        }
        
        .hamburger::after {
            bottom: -8px;
        }
    }
`;
document.head.appendChild(mobileStyle);

// Cursor follow effect (optional enhancement)
const cursor = document.createElement('div');
cursor.className = 'cursor';
cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    background: radial-gradient(circle, rgba(82, 194, 255, 0.8) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    mix-blend-mode: screen;
    transition: transform 0.1s ease;
`;
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        duration: 0.1,
        x: e.clientX - 10,
        y: e.clientY - 10,
        ease: 'power2.out'
    });
});

// Hide cursor on mobile
if (window.innerWidth <= 768) {
    cursor.style.display = 'none';
}

console.log('🚀 Portfolio loaded successfully!');

// Project filtering functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        projectCards.forEach(card => {
            if (filterValue === 'all') {
                gsap.to(card, {
                    duration: 0.5,
                    opacity: 1,
                    scale: 1,
                    display: 'block',
                    ease: 'power2.out'
                });
            } else {
                const cardCategories = card.getAttribute('data-category');
                if (cardCategories && cardCategories.includes(filterValue)) {
                    gsap.to(card, {
                        duration: 0.5,
                        opacity: 1,
                        scale: 1,
                        display: 'block',
                        ease: 'power2.out'
                    });
                } else {
                    gsap.to(card, {
                        duration: 0.3,
                        opacity: 0,
                        scale: 0.8,
                        ease: 'power2.out',
                        onComplete: () => {
                            card.style.display = 'none';
                        }
                    });
                }
            }
        });
    });
});

// Project card animations
gsap.utils.toArray('.project-card').forEach((card, index) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        duration: 0.8,
        y: 50,
        opacity: 0,
        delay: index * 0.1,
        ease: 'power3.out'
    });
});

// Blog card animations
gsap.utils.toArray('.blog-card').forEach((card, index) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        duration: 0.8,
        y: 50,
        opacity: 0,
        delay: index * 0.1,
        ease: 'power3.out'
    });
});

// Contact form animations
gsap.from('.contact-info', {
    scrollTrigger: {
        trigger: '.contact-info',
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
    },
    duration: 1,
    x: -50,
    opacity: 0,
    ease: 'power3.out'
});

gsap.from('.contact-form', {
    scrollTrigger: {
        trigger: '.contact-form',
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
    },
    duration: 1,
    x: 50,
    opacity: 0,
    ease: 'power3.out'
});

// Form submission handling
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;

        // Show loading state
        submitButton.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="loading">
                <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
            </svg>
            Sending...
        `;
        submitButton.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            submitButton.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
                </svg>
                Message Sent!
            `;

            // Reset form
            contactForm.reset();

            // Reset button after 3 seconds
            setTimeout(() => {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }, 3000);
        }, 2000);
    });
}

// Enhanced scroll animations for form inputs
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
formInputs.forEach((input, index) => {
    gsap.from(input.parentElement, {
        scrollTrigger: {
            trigger: input.parentElement,
            start: 'top 90%',
            end: 'bottom 10%',
            toggleActions: 'play none none reverse'
        },
        duration: 0.6,
        y: 30,
        opacity: 0,
        delay: index * 0.1,
        ease: 'power3.out'
    });
});

// Footer animations
gsap.from('.footer-content > *', {
    scrollTrigger: {
        trigger: '.footer',
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
    },
    duration: 0.8,
    y: 30,
    opacity: 0,
    stagger: 0.2,
    ease: 'power3.out'
});

// Enhanced button interactions
document.querySelectorAll('.project-link, .blog-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
        gsap.to(link, {
            duration: 0.3,
            scale: 1.05,
            ease: 'power2.out'
        });
    });

    link.addEventListener('mouseleave', () => {
        gsap.to(link, {
            duration: 0.3,
            scale: 1,
            ease: 'power2.out'
        });
    });
});

// Filter button animations
filterButtons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        if (!button.classList.contains('active')) {
            gsap.to(button, {
                duration: 0.3,
                scale: 1.05,
                ease: 'power2.out'
            });
        }
    });

    button.addEventListener('mouseleave', () => {
        if (!button.classList.contains('active')) {
            gsap.to(button, {
                duration: 0.3,
                scale: 1,
                ease: 'power2.out'
            });
        }
    });
});

// Parallax effect for project cards
gsap.utils.toArray('.project-card').forEach(card => {
    gsap.to(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
        },
        y: -50,
        ease: 'none'
    });
});

// Blog card hover effects
document.querySelectorAll('.blog-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card.querySelector('.blog-title'), {
            duration: 0.3,
            color: '#52C2FF',
            ease: 'power2.out'
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card.querySelector('.blog-title'), {
            duration: 0.3,
            color: '#F4F4F5',
            ease: 'power2.out'
        });
    });
});

// Contact method hover effects
document.querySelectorAll('.contact-method').forEach(method => {
    method.addEventListener('mouseenter', () => {
        gsap.to(method.querySelector('.contact-icon'), {
            duration: 0.3,
            scale: 1.1,
            rotation: 5,
            ease: 'power2.out'
        });
    });

    method.addEventListener('mouseleave', () => {
        gsap.to(method.querySelector('.contact-icon'), {
            duration: 0.3,
            scale: 1,
            rotation: 0,
            ease: 'power2.out'
        });
    });
});

// Form input focus animations
formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        gsap.to(input, {
            duration: 0.3,
            scale: 1.02,
            ease: 'power2.out'
        });
    });

    input.addEventListener('blur', () => {
        gsap.to(input, {
            duration: 0.3,
            scale: 1,
            ease: 'power2.out'
        });
    });
});

// Tech badge animations
gsap.utils.toArray('.badge').forEach((badge, index) => {
    gsap.from(badge, {
        scrollTrigger: {
            trigger: badge,
            start: 'top 90%',
            end: 'bottom 10%',
            toggleActions: 'play none none reverse'
        },
        duration: 0.6,
        scale: 0.8,
        opacity: 0,
        delay: index * 0.1,
        ease: 'back.out(1.7)'
    });
});

// Enhanced mobile menu functionality
const hamburger = document.querySelector('.hamburger');
if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');

        if (hamburger.classList.contains('active')) {
            gsap.to(hamburger, {
                duration: 0.3,
                rotation: 45,
                ease: 'power2.out'
            });
        } else {
            gsap.to(hamburger, {
                duration: 0.3,
                rotation: 0,
                ease: 'power2.out'
            });
        }
    });
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for fade-in animation
document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
    observer.observe(el);
});

// Typing effect for hero subtitle (optional enhancement)
const subtitle = document.querySelector('.title-subtitle');
if (subtitle) {
    const text = subtitle.textContent;
    subtitle.textContent = '';

    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            subtitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };

    // Start typing effect after hero animation
    setTimeout(typeWriter, 2000);
}

// Performance optimization: Reduce animations on mobile
if (window.innerWidth <= 768) {
    // Disable some heavy animations on mobile
    ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.scrub) {
            trigger.kill();
        }
    });
}

// Console easter egg
console.log(`
🚀 Welcome to Ashish Kumar Singh's Portfolio!
🔗 Built with: HTML5, CSS3, JavaScript, GSAP
🎨 Inspired by: Modern Design Systems
💫 Features: Glassmorphism, Particle Effects, Smooth Animations

🌟 Interested in collaborating? Let's build something amazing together!
📧 Contact: ashish@example.com
`);

console.log('✨ All animations and interactions loaded successfully!');

// Advanced AI Effects

// AI Binary Rain Effect
function createAIBinaryRain() {
    const rainContainer = document.createElement('div');
    rainContainer.className = 'digital-rain';
    document.querySelector('.ai-background').appendChild(rainContainer);

    // AI-focused characters and symbols
    const binaryChars = '01';
    const aiSymbols = ['λ', 'Σ', 'Δ', 'Ω', 'α', 'β', 'γ', 'θ', 'π', 'μ', '∞', '∑', '∏', '∫', '∂', '∇'];
    const aiTerms = ['AI', 'ML', 'NN', 'DL', 'NLP', 'GPT', 'LLM', 'API', 'CPU', 'GPU', 'RAM', 'SSD'];
    const techSymbols = ['<>', '{}', '[]', '()', '/>', '<=', '=>', '!=', '==', '&&', '||', '++', '--'];

    const columns = Math.floor(window.innerWidth / 25);

    for (let i = 0; i < columns; i++) {
        if (Math.random() > 0.75) { // Only some columns have rain
            const column = document.createElement('div');
            column.className = 'rain-column';
            column.style.left = i * 25 + 'px';
            column.style.animationDuration = (Math.random() * 4 + 3) + 's';
            column.style.animationDelay = Math.random() * 3 + 's';
            column.style.fontSize = (Math.random() * 4 + 10) + 'px';

            // Generate mixed content
            let text = '';
            for (let j = 0; j < 15; j++) {
                const rand = Math.random();
                let char;

                if (rand < 0.6) {
                    // 60% binary
                    char = binaryChars[Math.floor(Math.random() * binaryChars.length)];
                } else if (rand < 0.75) {
                    // 15% AI symbols
                    char = aiSymbols[Math.floor(Math.random() * aiSymbols.length)];
                } else if (rand < 0.9) {
                    // 15% AI terms
                    char = aiTerms[Math.floor(Math.random() * aiTerms.length)];
                } else {
                    // 10% tech symbols
                    char = techSymbols[Math.floor(Math.random() * techSymbols.length)];
                }

                text += char + '<br>';
            }
            column.innerHTML = text;

            rainContainer.appendChild(column);
        }
    }
}

// AI Processing Status Updates
function updateProcessingStatus() {
    const indicators = document.querySelectorAll('.indicator span');
    const statuses = [
        ['Neural Processing', 'Pattern Recognition', 'Deep Learning', 'Feature Extraction'],
        ['AI Training', 'Model Validation', 'Hyperparameter Tuning', 'Cross Validation'],
        ['Model Optimization', 'Performance Tuning', 'Resource Allocation', 'Inference Speed']
    ];

    indicators.forEach((indicator, index) => {
        setInterval(() => {
            const currentStatuses = statuses[index];
            const randomStatus = currentStatuses[Math.floor(Math.random() * currentStatuses.length)];
            indicator.textContent = randomStatus;
        }, 3000 + (index * 1000));
    });
}

// Typing Effect for Code Snippets
function animateCodeSnippets() {
    const codeSnippets = document.querySelectorAll('.code-snippet');
    const codeTexts = [
        'AI.prompt("optimize")',
        'model.predict(input)',
        'neural.forward()',
        'gradient.descent()',
        'transformer.encode()',
        'attention.mechanism()',
        'embedding.vector()',
        'loss.minimize()'
    ];

    codeSnippets.forEach((snippet, index) => {
        setInterval(() => {
            const newText = codeTexts[Math.floor(Math.random() * codeTexts.length)];

            // Typing effect
            snippet.textContent = '';
            let i = 0;
            const typeInterval = setInterval(() => {
                snippet.textContent += newText[i];
                i++;
                if (i >= newText.length) {
                    clearInterval(typeInterval);
                }
            }, 50);
        }, 8000 + (index * 2000));
    });
}

// Enhanced Mouse Interaction
function enhanceMouseInteraction() {
    const hero = document.querySelector('.hero');
    let mouseTrail = [];

    hero.addEventListener('mousemove', (e) => {
        // Create mouse trail effect
        const trail = document.createElement('div');
        trail.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: radial-gradient(circle, rgba(82, 194, 255, 0.8) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10;
            left: ${e.clientX - 2}px;
            top: ${e.clientY - 2}px;
            animation: trailFade 1s ease-out forwards;
        `;

        document.body.appendChild(trail);

        // Clean up trail
        setTimeout(() => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
        }, 1000);

        // Limit trail elements
        mouseTrail.push(trail);
        if (mouseTrail.length > 10) {
            const oldTrail = mouseTrail.shift();
            if (oldTrail.parentNode) {
                oldTrail.parentNode.removeChild(oldTrail);
            }
        }
    });
}

// Add trail fade animation
const trailStyle = document.createElement('style');
trailStyle.textContent = `
    @keyframes trailFade {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0.1);
        }
    }
`;
document.head.appendChild(trailStyle);

// Initialize AI Effects
document.addEventListener('DOMContentLoaded', () => {
    // Add delay to ensure DOM is ready
    setTimeout(() => {
        createAIBinaryRain();
        createAIDataPackets();
        updateProcessingStatus();
        animateCodeSnippets();
        enhanceMouseInteraction();
    }, 1000);
});

// Performance monitoring
let frameCount = 0;
let lastTime = performance.now();

function monitorPerformance() {
    frameCount++;
    const currentTime = performance.now();

    if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));

        // Reduce effects if performance is poor
        if (fps < 30) {
            document.querySelectorAll('.rain-column').forEach(column => {
                column.style.display = 'none';
            });
            document.querySelector('.ai-background::after')?.remove();
        }

        frameCount = 0;
        lastTime = currentTime;
    }

    requestAnimationFrame(monitorPerformance);
}

// Start performance monitoring
monitorPerformance();

console.log('🤖 Advanced AI effects loaded successfully!');

// AI Data Packets Effect
function createAIDataPackets() {
    const packetsContainer = document.createElement('div');
    packetsContainer.className = 'ai-data-packets';
    packetsContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 2;
    `;
    document.querySelector('.ai-background').appendChild(packetsContainer);

    const packetData = [
        'TRAINING_DATA.json',
        'model_weights.pkl',
        'neural_network.py',
        'transformer.config',
        'embeddings.vec',
        'attention_heads.dat',
        'gradient_flow.log',
        'inference_engine.exe',
        'prompt_template.txt',
        'ai_response.json'
    ];

    function createPacket() {
        const packet = document.createElement('div');
        const data = packetData[Math.floor(Math.random() * packetData.length)];

        packet.innerHTML = `
            <div style="
                padding: 4px 8px;
                background: rgba(26, 27, 35, 0.9);
                border: 1px solid rgba(82, 194, 255, 0.5);
                border-radius: 4px;
                color: var(--accent-cyan);
                font-family: 'Courier New', monospace;
                font-size: 10px;
                white-space: nowrap;
                box-shadow: 0 0 10px rgba(82, 194, 255, 0.3);
                backdrop-filter: blur(5px);
            ">
                📦 ${data}
            </div>
        `;

        packet.style.cssText = `
            position: absolute;
            top: ${Math.random() * 80 + 10}%;
            left: -200px;
            animation: packetFlow ${Math.random() * 8 + 12}s linear forwards;
            opacity: 0.8;
        `;

        packetsContainer.appendChild(packet);

        // Remove packet after animation
        setTimeout(() => {
            if (packet.parentNode) {
                packet.parentNode.removeChild(packet);
            }
        }, 20000);
    }

    // Create packets at intervals
    setInterval(createPacket, Math.random() * 3000 + 2000);

    // Create initial packets
    for (let i = 0; i < 3; i++) {
        setTimeout(createPacket, i * 1000);
    }
}

// Add packet flow animation
const packetStyle = document.createElement('style');
packetStyle.textContent = `
    @keyframes packetFlow {
        0% {
            left: -200px;
            opacity: 0;
        }
        10% {
            opacity: 0.8;
        }
        90% {
            opacity: 0.8;
        }
        100% {
            left: calc(100vw + 200px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(packetStyle);

// Advanced Futuristic AI Effects

// AI Terminal Commands
function initializeAITerminal() {
    const commands = [
        'initializing neural networks...',
        'loading AI models...',
        'optimizing parameters...',
        'training deep learning models...',
        'processing natural language...',
        'generating embeddings...',
        'fine-tuning transformers...',
        'deploying inference engine...',
        'monitoring system performance...',
        'AI system ready for deployment'
    ];
    
    const commandElement = document.getElementById('terminal-command');
    let currentCommandIndex = 0;
    
    function typeCommand() {
        const command = commands[currentCommandIndex];
        let charIndex = 0;
        
        commandElement.textContent = '';
        
        const typeInterval = setInterval(() => {
            commandElement.textContent += command[charIndex];
            charIndex++;
            
            if (charIndex >= command.length) {
                clearInterval(typeInterval);
                setTimeout(() => {
                    currentCommandIndex = (currentCommandIndex + 1) % commands.length;
                    setTimeout(typeCommand, 1000);
                }, 3000);
            }
        }, 80);
    }
    
    setTimeout(typeCommand, 2000);
}

// Brain Wave Canvas Animation
function initializeBrainWaves() {
    const canvas = document.getElementById('brain-wave-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 100;
    
    let time = 0;
    const waves = [
        { frequency: 0.02, amplitude: 15, phase: 0, color: 'rgba(82, 194, 255, 0.8)' },
        { frequency: 0.03, amplitude: 10, phase: Math.PI / 3, color: 'rgba(131, 90, 253, 0.6)' },
        { frequency: 0.025, amplitude: 12, phase: Math.PI / 2, color: 'rgba(0, 254, 207, 0.7)' }
    ];
    
    function drawWaves() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        waves.forEach(wave => {
            ctx.beginPath();
            ctx.strokeStyle = wave.color;
            ctx.lineWidth = 2;
            
            for (let x = 0; x < canvas.width; x++) {
                const y = canvas.height / 2 + 
                    Math.sin(x * wave.frequency + time + wave.phase) * wave.amplitude;
                
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.stroke();
        });
        
        time += 0.1;
        requestAnimationFrame(drawWaves);
    }
    
    drawWaves();
}

// Quantum Particle Interactions
function enhanceQuantumParticles() {
    const particles = document.querySelectorAll('.quantum-particle');
    
    particles.forEach((particle, index) => {
        particle.addEventListener('mouseenter', () => {
            particle.style.transform = 'scale(2)';
            particle.style.boxShadow = '0 0 40px var(--accent-mint)';
            particle.style.zIndex = '10';
            
            // Create quantum entanglement effect with other particles
            particles.forEach((otherParticle, otherIndex) => {
                if (index !== otherIndex) {
                    otherParticle.style.opacity = '0.3';
                    otherParticle.style.filter = 'blur(1px)';
                }
            });
        });
        
        particle.addEventListener('mouseleave', () => {
            particle.style.transform = '';
            particle.style.boxShadow = '';
            particle.style.zIndex = '';
            
            particles.forEach(otherParticle => {
                otherParticle.style.opacity = '';
                otherParticle.style.filter = '';
            });
        });
    });
}

// AI Voice Visualization Interaction
function enhanceVoiceVisualization() {
    const voiceBars = document.querySelectorAll('.voice-bar');
    let isActive = false;
    
    // Simulate voice activity
    setInterval(() => {
        isActive = !isActive;
        
        voiceBars.forEach((bar, index) => {
            if (isActive) {
                const randomHeight = Math.random() * 40 + 10;
                bar.style.height = randomHeight + 'px';
                bar.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
            } else {
                bar.style.height = '5px';
                bar.style.animationDuration = '1.5s';
            }
        });
    }, 4000);
}

// Holographic Text Effect Enhancement
function enhanceHolographicText() {
    const titleLine = document.querySelector('.title-line');
    if (!titleLine) return;
    
    // Add data attribute for glitch effect
    titleLine.setAttribute('data-text', titleLine.textContent);
    
    // Random glitch activation
    setInterval(() => {
        if (Math.random() > 0.7) {
            titleLine.style.animation = 'none';
            titleLine.offsetHeight; // Trigger reflow
            titleLine.style.animation = 'glitchShift 0.3s ease-out';
        }
    }, 8000);
}

// Real-Time AI System Status Monitoring
function createRealTimeAIStatusMonitor() {
    const statusContainer = document.createElement('div');
    statusContainer.className = 'ai-status-monitor';
    statusContainer.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(14, 15, 19, 0.95);
        border: 1px solid rgba(82, 194, 255, 0.4);
        border-radius: 8px;
        padding: 12px;
        backdrop-filter: blur(20px);
        font-family: 'Courier New', monospace;
        font-size: 9px;
        color: var(--text-primary);
        z-index: 4;
        min-width: 200px;
        max-width: 220px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        cursor: move;
        user-select: none;
        transition: all 0.3s ease;
    `;
    
    // Add drag functionality
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    
    statusContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragOffset.x = e.clientX - statusContainer.offsetLeft;
        dragOffset.y = e.clientY - statusContainer.offsetTop;
        statusContainer.style.cursor = 'grabbing';
        statusContainer.style.opacity = '0.8';
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const newX = e.clientX - dragOffset.x;
            const newY = e.clientY - dragOffset.y;
            
            // Keep within viewport bounds
            const maxX = window.innerWidth - statusContainer.offsetWidth;
            const maxY = window.innerHeight - statusContainer.offsetHeight;
            
            statusContainer.style.left = Math.max(0, Math.min(newX, maxX)) + 'px';
            statusContainer.style.top = Math.max(0, Math.min(newY, maxY)) + 'px';
            statusContainer.style.right = 'auto';
        }
    });
    
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            statusContainer.style.cursor = 'move';
            statusContainer.style.opacity = '1';
        }
    });
    
    // Add minimize/maximize functionality
    let isMinimized = false;
    const toggleButton = document.createElement('div');
    toggleButton.innerHTML = '−';
    toggleButton.style.cssText = `
        position: absolute;
        top: 4px;
        right: 6px;
        width: 16px;
        height: 16px;
        background: rgba(82, 194, 255, 0.2);
        border: 1px solid rgba(82, 194, 255, 0.4);
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 12px;
        font-weight: bold;
        color: var(--accent-cyan);
        transition: all 0.2s ease;
    `;
    
    toggleButton.addEventListener('click', (e) => {
        e.stopPropagation();
        isMinimized = !isMinimized;
        
        if (isMinimized) {
            statusContainer.style.height = '30px';
            statusContainer.style.overflow = 'hidden';
            toggleButton.innerHTML = '+';
        } else {
            statusContainer.style.height = 'auto';
            statusContainer.style.overflow = 'visible';
            toggleButton.innerHTML = '−';
        }
    });
    
    statusContainer.appendChild(toggleButton);
    
    // Real-time system metrics
    let systemMetrics = {
        memory: { used: 0, total: 0, percentage: 0 },
        performance: { fps: 60, loadTime: 0 },
        network: { speed: 0, latency: 0 },
        battery: { level: 100, charging: false },
        connection: { type: 'unknown', downlink: 0 },
        timing: { domLoad: 0, pageLoad: 0 }
    };
    
    // Get real system information
    async function getRealSystemMetrics() {
        try {
            // Memory API (if available)
            if ('memory' in performance) {
                const memInfo = performance.memory;
                systemMetrics.memory.used = memInfo.usedJSHeapSize / (1024 * 1024); // MB
                systemMetrics.memory.total = memInfo.totalJSHeapSize / (1024 * 1024); // MB
                systemMetrics.memory.percentage = (systemMetrics.memory.used / systemMetrics.memory.total) * 100;
            }
            
            // Network Information API
            if ('connection' in navigator) {
                const conn = navigator.connection;
                systemMetrics.connection.type = conn.effectiveType || 'unknown';
                systemMetrics.connection.downlink = conn.downlink || 0;
                systemMetrics.network.speed = conn.downlink || Math.random() * 100;
            }
            
            // Battery API
            if ('getBattery' in navigator) {
                const battery = await navigator.getBattery();
                systemMetrics.battery.level = Math.round(battery.level * 100);
                systemMetrics.battery.charging = battery.charging;
            }
            
            // Performance timing
            if ('timing' in performance) {
                const timing = performance.timing;
                systemMetrics.timing.domLoad = timing.domContentLoadedEventEnd - timing.navigationStart;
                systemMetrics.timing.pageLoad = timing.loadEventEnd - timing.navigationStart;
            }
            
            // Calculate FPS
            let lastTime = performance.now();
            let frameCount = 0;
            
            function calculateFPS() {
                frameCount++;
                const currentTime = performance.now();
                if (currentTime - lastTime >= 1000) {
                    systemMetrics.performance.fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                    frameCount = 0;
                    lastTime = currentTime;
                }
                requestAnimationFrame(calculateFPS);
            }
            calculateFPS();
            
        } catch (error) {
            console.log('Some system APIs not available:', error.message);
        }
    }
    
    function updateRealTimeMetrics() {
        const currentTime = new Date();
        const uptime = Math.floor((performance.now()) / 1000);
        
        const content = `
            <div style="color: var(--accent-cyan); font-weight: bold; margin-bottom: 8px; text-align: center; font-size: 10px; padding-right: 20px;">
                🤖 AI SYSTEM STATUS
            </div>
            
            <div style="margin-bottom: 6px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span style="color: var(--accent-mint); font-size: 8px;">💾 Memory</span>
                    <span style="font-size: 8px;">${systemMetrics.memory.used.toFixed(0)}MB</span>
                </div>
                <div style="width: 100%; height: 3px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden;">
                    <div style="width: ${Math.min(systemMetrics.memory.percentage, 100)}%; height: 100%; background: ${systemMetrics.memory.percentage > 80 ? '#ff5f57' : systemMetrics.memory.percentage > 60 ? '#ffbd2e' : '#28ca42'}; transition: width 0.5s ease;"></div>
                </div>
            </div>
            
            <div style="margin-bottom: 6px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span style="color: var(--accent-purple); font-size: 8px;">⚡ FPS</span>
                    <span style="font-size: 8px;">${systemMetrics.performance.fps}</span>
                </div>
                <div style="width: 100%; height: 3px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden;">
                    <div style="width: ${(systemMetrics.performance.fps / 60) * 100}%; height: 100%; background: ${systemMetrics.performance.fps < 30 ? '#ff5f57' : systemMetrics.performance.fps < 50 ? '#ffbd2e' : '#28ca42'}; transition: width 0.5s ease;"></div>
                </div>
            </div>
            
            <div style="margin-bottom: 6px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span style="color: var(--accent-cyan); font-size: 8px;">🌐 Network</span>
                    <span style="font-size: 8px;">${systemMetrics.network.speed.toFixed(0)}Mbps</span>
                </div>
                <div style="width: 100%; height: 3px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden;">
                    <div style="width: ${Math.min((systemMetrics.network.speed / 100) * 100, 100)}%; height: 100%; background: linear-gradient(90deg, #28ca42, #52C2FF); transition: width 0.5s ease;"></div>
                </div>
            </div>
            
            <div style="margin-bottom: 8px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span style="color: var(--accent-mint); font-size: 8px;">🔋 Battery</span>
                    <span style="font-size: 8px;">${systemMetrics.battery.level}%${systemMetrics.battery.charging ? '⚡' : ''}</span>
                </div>
                <div style="width: 100%; height: 3px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden;">
                    <div style="width: ${systemMetrics.battery.level}%; height: 100%; background: ${systemMetrics.battery.level < 20 ? '#ff5f57' : systemMetrics.battery.level < 50 ? '#ffbd2e' : '#28ca42'}; transition: width 0.5s ease;"></div>
                </div>
            </div>
            
            <div style="border-top: 1px solid rgba(82, 194, 255, 0.2); padding-top: 6px; margin-top: 6px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 7px;">
                    <div style="color: var(--text-secondary);">Connection: <span style="color: var(--accent-cyan);">${systemMetrics.connection.type.toUpperCase()}</span></div>
                    <div style="color: var(--text-secondary);">Uptime: <span style="color: var(--accent-purple);">${Math.floor(uptime / 60)}m</span></div>
                    <div style="color: var(--text-secondary);">Load: <span style="color: var(--accent-mint);">${(systemMetrics.timing.pageLoad / 1000).toFixed(1)}s</span></div>
                    <div style="color: var(--text-secondary);">Status: <span style="color: #28ca42;">● ON</span></div>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 6px; font-size: 7px; color: var(--text-muted);">
                ${currentTime.toLocaleTimeString()}
            </div>
        `;
        
        if (!isMinimized) {
            statusContainer.innerHTML = content;
            statusContainer.appendChild(toggleButton);
        } else {
            statusContainer.innerHTML = `
                <div style="color: var(--accent-cyan); font-weight: bold; font-size: 10px; padding-right: 20px;">
                    🤖 AI STATUS: <span style="color: #28ca42;">ONLINE</span>
                </div>
            `;
            statusContainer.appendChild(toggleButton);
        }
    }
    
    // Initialize real system metrics
    getRealSystemMetrics();
    
    document.querySelector('.ai-background').appendChild(statusContainer);
    updateRealTimeMetrics();
    
    // Update every second for real-time feel
    setInterval(updateRealTimeMetrics, 1000);
}

// Add Loading Bars
function createLoadingBars() {
    const loadingContainer = document.createElement('div');
    loadingContainer.className = 'ai-loading-bars';
    loadingContainer.innerHTML = `
        <div class="loading-bar"></div>
        <div class="loading-bar"></div>
        <div class="loading-bar"></div>
    `;
    document.querySelector('.ai-background').appendChild(loadingContainer);
}

// Matrix-style Code Rain (Alternative to binary rain)
function createMatrixCodeRain() {
    const matrixContainer = document.createElement('div');
    matrixContainer.className = 'matrix-code-rain';
    matrixContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        overflow: hidden;
    `;
    
    const codeSnippets = [
        'function AI()',
        'neural.train()',
        'model.predict()',
        'if (intelligence)',
        'while (learning)',
        'return success;',
        'async/await',
        'Promise.resolve',
        'const brain =',
        'let wisdom ='
    ];
    
    function createCodeDrop() {
        const drop = document.createElement('div');
        const code = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        
        drop.textContent = code;
        drop.style.cssText = `
            position: absolute;
            top: -50px;
            left: ${Math.random() * 100}%;
            color: var(--accent-cyan);
            font-family: 'Courier New', monospace;
            font-size: ${Math.random() * 8 + 10}px;
            opacity: 0.7;
            animation: matrixFall ${Math.random() * 3 + 4}s linear forwards;
            text-shadow: 0 0 5px currentColor;
        `;
        
        matrixContainer.appendChild(drop);
        
        setTimeout(() => {
            if (drop.parentNode) {
                drop.parentNode.removeChild(drop);
            }
        }, 7000);
    }
    
    // Add matrix fall animation
    const matrixStyle = document.createElement('style');
    matrixStyle.textContent = `
        @keyframes matrixFall {
            0% {
                top: -50px;
                opacity: 0;
            }
            10% {
                opacity: 0.7;
            }
            90% {
                opacity: 0.7;
            }
            100% {
                top: 100vh;
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(matrixStyle);
    
    document.querySelector('.ai-background').appendChild(matrixContainer);
    
    // Create drops at intervals
    setInterval(createCodeDrop, 800);
}

// Initialize all advanced effects
function initializeAdvancedAIEffects() {
    initializeAITerminal();
    initializeBrainWaves();
    enhanceQuantumParticles();
    enhanceVoiceVisualization();
    enhanceHolographicText();
    createRealTimeAIStatusMonitor();
    createLoadingBars();
    createMatrixCodeRain();
}

// Add to main initialization
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        createAIBinaryRain();
        createAIDataPackets();
        updateProcessingStatus();
        animateCodeSnippets();
        enhanceMouseInteraction();
        initializeAdvancedAIEffects();
    }, 1000);
});

console.log('🚀 Advanced futuristic AI effects initialized!');