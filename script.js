import { createClient } from 'supabase';

// Initialize custom cursor
document.addEventListener('DOMContentLoaded', () => {
    // Custom cursor
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 50);
    });
    
    document.addEventListener('mousedown', () => {
        cursor.style.width = '8px';
        cursor.style.height = '8px';
        cursorFollower.style.width = '40px';
        cursorFollower.style.height = '40px';
    });
    
    document.addEventListener('mouseup', () => {
        cursor.style.width = '10px';
        cursor.style.height = '10px';
        cursorFollower.style.width = '30px';
        cursorFollower.style.height = '30px';
    });

    // Interactive elements cursor effect
    const links = document.querySelectorAll('a, button, .filter-btn, .portfolio-item');
    
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.style.width = '0px';
            cursor.style.height = '0px';
            cursorFollower.style.width = '50px';
            cursorFollower.style.height = '50px';
        });
        
        link.addEventListener('mouseleave', () => {
            cursor.style.width = '10px';
            cursor.style.height = '10px';
            cursorFollower.style.width = '30px';
            cursorFollower.style.height = '30px';
        });
    });

    // Header scroll effect
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Portfolio filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 200);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 500);
                }
            });
        });
    });

    // Testimonial slider
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    
    function showSlide(n) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show the current slide and activate corresponding dot
        slides[n].classList.add('active');
        dots[n].classList.add('active');
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }
    
    // Event listeners for slider controls
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
    
    // Auto slide every 5 seconds
    setInterval(nextSlide, 5000);

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        
        if (nav.classList.contains('active')) {
            menuToggle.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });

    // Close mobile menu when clicking menu items
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });

    // Initialize Supabase client (will replace URL and key later)
    const supabaseUrl = 'https://your-supabase-url.supabase.co';
    const supabaseKey = 'your-supabase-api-key';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        formStatus.innerHTML = 'Sending...';
        formStatus.className = 'form-status';
        
        try {
            // This is where we'll use Supabase to store the form data
            const { data, error } = await supabase
                .from('contacts')
                .insert([
                    { name, email, subject, message }
                ]);
                
            if (error) throw error;
            
            formStatus.innerHTML = 'Message sent successfully! I\'ll get back to you soon.';
            formStatus.className = 'form-status success';
            contactForm.reset();
            
            setTimeout(() => {
                formStatus.innerHTML = '';
                formStatus.className = 'form-status';
            }, 5000);
            
        } catch (error) {
            console.error('Error submitting form:', error);
            formStatus.innerHTML = 'Something went wrong. Please try again later.';
            formStatus.className = 'form-status error';
            
            setTimeout(() => {
                formStatus.innerHTML = '';
                formStatus.className = 'form-status';
            }, 5000);
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animation on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.service-card, .portfolio-item, .about-content > div, .stats, .section-header, .certificate-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Initial call to animate elements that are already in view
    animateOnScroll();
    
    // Call the animation function on scroll
    window.addEventListener('scroll', animateOnScroll);

    // Certificate card toggle
    const certificateCards = document.querySelectorAll('.certificate-card');
    
    certificateCards.forEach(card => {
        card.addEventListener('click', () => {
            const isActive = card.classList.contains('active');
            
            // Remove active class from all cards
            certificateCards.forEach(c => c.classList.remove('active'));
            
            // Toggle active class on clicked card
            if (!isActive) {
                card.classList.add('active');
            }
        });
    });

    // Close certificate when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.certificate-card')) {
            certificateCards.forEach(card => card.classList.remove('active'));
        }
    });
});