document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navegação mobile
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Efeito de scroll na navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Biblioteca AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
        });
    }

    // --- STATUS DA LOJA: ATUALIZAÇÃO AUTOMÁTICA ---
    function atualizarStatusLoja() {
        const statusEl = document.getElementById('status-loja');
        if (!statusEl) return;

        const agora = new Date();
        const diaSemana = agora.getDay();
        const hora = agora.getHours();
        let aberto = false;

        if (diaSemana >= 1 && diaSemana <= 5 && hora >= 8 && hora < 18) {
            aberto = true;
        } else if (diaSemana === 6 && hora >= 8 && hora < 12) {
            aberto = true;
        }

        statusEl.textContent = aberto ? 'Aberto Agora' : 'Fechado Agora';
        statusEl.classList.remove('aberto', 'fechado');
        statusEl.classList.add(aberto ? 'aberto' : 'fechado');
    }

    atualizarStatusLoja();
    setInterval(atualizarStatusLoja, 60000); // Atualiza a cada 1 minuto

    // --- FORMULÁRIO ---
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        const confirmationDiv = document.getElementById('confirmation');
        const confirmationDetails = document.getElementById('confirmation-details');
        const whatsappButton = document.getElementById('whatsapp-button');
        const editButton = document.getElementById('edit-button');
        const phoneInput = document.getElementById('phone');
        const dateInput = document.getElementById('date');

        let lastFormData = {};

        // Formatar telefone
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.substring(0, 11);
            let formattedValue = '';
            if (value.length > 0) { formattedValue = '(' + value.substring(0, 2); }
            if (value.length > 2) { formattedValue += ') ' + value.substring(2, 7); }
            if (value.length > 7) { formattedValue += '-' + value.substring(7, 11); }
            e.target.value = formattedValue;
        });

        // Impedir seleção de domingo
        const today = new Date();
        today.setDate(today.getDate());
        dateInput.min = today.toISOString().split('T')[0];

        dateInput.addEventListener('input', function() {
            const dataSelecionada = new Date(this.value + "T12:00:00Z");
            if (dataSelecionada.getUTCDay() === 0) {
                this.value = '';
                document.getElementById('date-error').textContent = 'Desculpe, não agendamos aos Domingos.';
                this.closest('.form-group').classList.add('error');
            } else {
                document.getElementById('date-error').textContent = '';
                this.closest('.form-group').classList.remove('error');
            }
        });

        // Submissão do formulário (com lógica própria)
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            // Aqui você continua sua lógica de confirmação, validação e WhatsApp
        });

        // Efeito de foco nos campos
        const formInputs = document.querySelectorAll('.form-group input, .form-group select');
        formInputs.forEach(input => {
            if (input.value) { input.closest('.form-group').classList.add('focused'); }
            input.addEventListener('focus', function() {
                this.closest('.form-group').classList.add('focused');
            });
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.closest('.form-group').classList.remove('focused');
                }
            });
        });
    }

    // --- ANIMAÇÃO DE CONTADOR ---
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const counters = document.querySelectorAll('.stat-number');
        if (counters.length > 0) {
            const animateCounters = () => {
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    counter.innerText = '0';
                    const updateCounter = () => {
                        const current = +counter.innerText;
                        const increment = target / 100;
                        if (current < target) {
                            counter.innerText = `${Math.ceil(current + increment)}`;
                            setTimeout(updateCounter, 20);
                        } else {
                            counter.innerText = target + '+';
                        }
                    };
                    updateCounter();
                });
            };

            const heroObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    animateCounters();
                    heroObserver.unobserve(heroSection);
                }
            }, { threshold: 0.4 });
            heroObserver.observe(heroSection);
        }
    }

    // --- EFEITO DE RIPPLE NOS CARDS DE SERVIÇO ---
    const serviceCards = document.querySelectorAll('.service-card');
    if (serviceCards.length > 0) {
        serviceCards.forEach(card => {
            card.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                ripple.classList.add('ripple');
                this.appendChild(ripple);
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - (size / 2);
                const y = e.clientY - rect.top - (size / 2);
                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                setTimeout(() => { ripple.remove(); }, 600);
            });
        });
    }
});
