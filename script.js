document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    // Menu de navegação responsivo
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active'); // Anima o ícone do hamburger
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Não remove a classe se o link não for de navegação na página
                if (!link.getAttribute('href').includes('.html')) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            });
        });
    }

    // Efeito de rolagem na barra de navegação
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Rolagem suave para âncoras na mesma página
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Garante que é um link de âncora na mesma página
            if (href.length > 1 && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                const offset = navbar.offsetHeight;
                window.scrollTo({
                    top: target.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animar elementos na rolagem (substituto do AOS)
    if ("IntersectionObserver" in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                    observer.unobserve(entry.target); // Opcional: para a animação acontecer só uma vez
                }
            });
        }, observerOptions);

        document.querySelectorAll('[data-aos]').forEach(el => {
            observer.observe(el);
        });
    }

    // ===================================================================
    // LÓGICA DO FORMULÁRIO - SÓ EXECUTA SE O FORMULÁRIO EXISTIR NA PÁGINA
    // ===================================================================
    const bookingForm = document.getElementById('booking-form');

    if (bookingForm) {
        const confirmationDiv = document.getElementById('confirmation');
        const confirmationDetails = document.getElementById('confirmation-details');
        const whatsappButton = document.getElementById('whatsapp-button');
        const editButton = document.getElementById('edit-button');
        const phoneInput = document.getElementById('phone');
        const dateInput = document.getElementById('date');

        let lastFormData = {}; // Armazena os dados para edição

        // Formatação do número de telefone
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.substring(0, 11); // Limita a 11 dígitos
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

        // Define a data mínima como hoje
        const today = new Date();
        today.setDate(today.getDate());
        dateInput.min = today.toISOString().split('T')[0];

        // Submissão do formulário
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Lógica de validação...
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

            if (!isValid) return;

            const submitButton = this.querySelector('.submit-button');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
            submitButton.disabled = true;

            await new Promise(resolve => setTimeout(resolve, 1000));

            lastFormData = data;
            const dateObj = new Date(data.date + 'T00:00:00');
            const formattedDate = dateObj.toLocaleDateString('pt-BR');

            showConfirmation(data, formattedDate);

            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
            bookingForm.reset();
        });

        function showConfirmation(data, formattedDate) {
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

            const pickupText = data.pickup === 'Sim' ? ' (com taxa de R$ 5,00 adicional)' : '';
            const whatsappMessage = `Olá! Gostaria de confirmar meu agendamento na Power Lava-Car:\n\n` +
                                    `*Nome:* ${data.name}\n` +
                                    `*Telefone:* ${data.phone}\n` +
                                    `*Serviço:* ${data.service}\n` +
                                    `*Data:* ${formattedDate}\n` +
                                    `*Leva e traz:* ${data.pickup}${pickupText}\n\n` +
                                    `Aguardamos a sua confirmação!`;

            const whatsappNumber = '5514988388121';
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
            
            whatsappButton.onclick = () => window.open(whatsappUrl, '_blank');

            editButton.onclick = function() {
                bookingForm.style.display = 'block';
                confirmationDiv.style.display = 'none';
                document.getElementById('name').value = lastFormData.name;
                document.getElementById('phone').value = lastFormData.phone;
                document.getElementById('service').value = lastFormData.service;
                document.getElementById('date').value = lastFormData.date;
                document.getElementById('pickup').checked = lastFormData.pickup === 'Sim';
                bookingForm.scrollIntoView({ behavior: 'smooth' });
            };
            confirmationDiv.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Animação dos campos do formulário
        const formInputs = document.querySelectorAll('.form-group input, .form-group select');
        formInputs.forEach(input => {
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
    } // Fim do if (bookingForm)

    // Efeito Ripple nos cards de serviço
    const serviceCards = document.querySelectorAll('.service-card');
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
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

});
