document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navigation functionality
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active'); // Animate hamburger icon
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Adjust scroll position to account for fixed navbar height
                const offset = navbar.offsetHeight; // Get current navbar height
                window.scrollTo({
                    top: target.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animate elements on scroll using IntersectionObserver (AOS replacement)
    const observerOptions = {
        threshold: 0.1, // Element is 10% visible
        rootMargin: '0px 0px -50px 0px' // Offset bottom margin for better trigger
    };

    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                // Optional: Unobserve after animation to prevent re-triggering
                // observer.unobserve(entry.target);
            } else {
                // Optional: Remove class if element scrolls out of view
                // entry.target.classList.remove('aos-animate');
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });

    // Form handling
    const bookingForm = document.getElementById('booking-form');
    const confirmationDiv = document.getElementById('confirmation');
    const confirmationDetails = document.getElementById('confirmation-details');
    const whatsappButton = document.getElementById('whatsapp-button');
    const editButton = document.getElementById('edit-button');

    // Store form data temporarily for editing
    let lastFormData = {};

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
        let formattedValue = '';

        if (value.length > 0) {
            formattedValue = '(' + value.substring(0, 2);
        }
        if (value.length > 2) {
            formattedValue += ') ' + value.substring(2, 7);
        }
        if (value.length > 7) {
            formattedValue += '-' + value.substring(7, 11);
        }
        e.target.value = formattedValue;
    });

    // Set minimum date to today
    const dateInput = document.getElementById('date');
    const today = new Date();
    today.setDate(today.getDate()); // Ensure it's today's date, not yesterday if run late at night
    dateInput.min = today.toISOString().split('T')[0];

    // Form submission
    bookingForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        document.querySelectorAll('.form-group').forEach(el => el.classList.remove('error'));

        let isValid = true;
        const formData = new FormData(this);
        const data = {
            name: formData.get('name').trim(),
            phone: formData.get('phone').trim(),
            service: formData.get('service').trim(),
            date: formData.get('date').trim(),
            pickup: formData.get('pickup') ? 'Sim' : 'Não'
        };

        if (!data.name) {
            document.getElementById('name-error').textContent = 'Por favor, digite seu nome.';
            document.getElementById('name').closest('.form-group').classList.add('error');
            isValid = false;
        }
        if (!data.phone || !/^\(\d{2}\) \d{5}-\d{4}$/.test(data.phone)) {
            document.getElementById('phone-error').textContent = 'Por favor, digite um telefone válido (Ex: (11) 98765-4321).';
            document.getElementById('phone').closest('.form-group').classList.add('error');
            isValid = false;
        }
        if (!data.service) {
            document.getElementById('service-error').textContent = 'Por favor, selecione um serviço.';
            document.getElementById('service').closest('.form-group').classList.add('error');
            isValid = false;
        }
        if (!data.date) {
            document.getElementById('date-error').textContent = 'Por favor, selecione uma data.';
            document.getElementById('date').closest('.form-group').classList.add('error');
            isValid = false;
        }

        if (!isValid) {
            return; // Stop submission if validation fails
        }

        const submitButton = this.querySelector('.submit-button');
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
        submitButton.disabled = true;

        // Simulate API call or processing time
        await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 seconds delay

        // Store data for potential editing
        lastFormData = data;

        // Format date for display
        const dateObj = new Date(data.date + 'T00:00:00');
        const formattedDate = dateObj.toLocaleDateString('pt-BR');

        showConfirmation(data, formattedDate);

        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
    });

    function showConfirmation(data, formattedDate) {
        // Build confirmation HTML
        const confirmationHTML = `
            <p><strong>Nome:</strong> ${data.name}</p>
            <p><strong>Telefone:</strong> ${data.phone}</p>
            <p><strong>Serviço:</strong> ${data.service}</p>
            <p><strong>Data:</strong> ${formattedDate}</p>
            <p><strong>Leva e Traz:</strong> ${data.pickup}</p>
        `;

        confirmationDetails.innerHTML = confirmationHTML;
        
        bookingForm.style.display = 'none';
        confirmationDiv.style.display = 'block';

        // Set up WhatsApp message
        const pickupText = data.pickup === 'Sim' ? ' (com taxa de R$ 5,00 adicional)' : '';
        const whatsappMessage = `Olá! Gostaria de confirmar meu agendamento na Power Lava-Car:\n\n` +
                                `Nome: ${data.name}\n` +
                                `Telefone: ${data.phone}\n` +
                                `Serviço: ${data.service}\n` +
                                `Data: ${formattedDate}\n` +
                                `Leva e traz: ${data.pickup}${pickupText}\n\n` +
                                `Aguardamos a sua confirmação!`;

        // Replace with your actual WhatsApp number
        const whatsappNumber = '5514988388121'; 
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
        
        whatsappButton.onclick = function() {
            window.open(whatsappUrl, '_blank');
        };

        // Edit button functionality: Pre-fill form with last data
        editButton.onclick = function() {
            bookingForm.style.display = 'block';
            confirmationDiv.style.display = 'none';
            // Populate form fields with stored data
            document.getElementById('name').value = lastFormData.name;
            document.getElementById('phone').value = lastFormData.phone;
            document.getElementById('service').value = lastFormData.service;
            document.getElementById('date').value = lastFormData.date;
            document.getElementById('pickup').checked = lastFormData.pickup === 'Sim';

            // Re-add focused class if fields are populated
            document.querySelectorAll('input, select').forEach(input => {
                if (input.value) {
                    input.closest('.form-group').classList.add('focused');
                } else {
                    input.closest('.form-group').classList.remove('focused');
                }
            });

            bookingForm.scrollIntoView({ behavior: 'smooth' }); // Scroll back to form
        };

        confirmationDiv.scrollIntoView({ behavior: 'smooth' });
    }

    // Add hover effects to service cards (if not already handled by CSS)
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });

        // Add ripple effect on click
        card.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            // Position the ripple where the click occurred
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - (size / 2);
            const y = e.clientY - rect.top - (size / 2);

            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Scroll progress indicator (Assumes an element with class .scroll-progress in HTML/CSS)
    // Add this to your HTML if you want a scroll progress bar: <div class="scroll-progress"></div>
    // And add basic CSS for it:
    // .scroll-progress {
    //     position: fixed;
    //     top: 0;
    //     left: 0;
    //     height: 5px;
    //     background: var(--gradient-purple);
    //     width: 0%;
    //     z-index: 1000;
    // }
    window.addEventListener('scroll', function() {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
        
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) {
            progressBar.style.width = scrollPercentage + '%';
        }
    });

    // Counter animation for stats
    const animateCounters = () => {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // milliseconds
            let start = 0;
            const startTime = performance.now();

            const updateCounter = (timestamp) => {
                const progress = (timestamp - startTime) / duration;
                let current = Math.floor(progress * target);

                if (current < target) {
                    counter.textContent = current;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + '+';
                }
            };
            requestAnimationFrame(updateCounter);
        });
    };

    // Start counter animation when hero section is visible
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    heroObserver.unobserve(entry.target); // Stop observing once animated
                }
            });
        }, { threshold: 0.5 }); // Trigger when 50% of the hero section is visible
        
        heroObserver.observe(heroSection);
    }

    // Add typing effect to hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeSpeed = 100; // milliseconds per character
        
        function typeWriter() {
            if (i < originalText.length) {
                heroTitle.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, typeSpeed);
            }
        }
        
        setTimeout(typeWriter, 500); // Start typing effect after a short delay
    }

    // Form field animations (focused state for label)
    const formInputs = document.querySelectorAll('.form-group input, .form-group select');
    formInputs.forEach(input => {
        // Set focused class if input already has a value on load (e.g., from browser autofill)
        if (input.value) {
            input.closest('.form-group').classList.add('focused');
        }

        input.addEventListener('focus', function() {
            this.closest('.form-group').classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.closest('.form-group').classList.remove('focused');
            }
        });
    });
});

// Utility function for smooth scrolling to sections (called directly from HTML if needed)
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const navbar = document.getElementById('navbar');
        const offsetTop = section.offsetTop - navbar.offsetHeight; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}
