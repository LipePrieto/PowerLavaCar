document.addEventListener('DOMContentLoaded', function() {

    // --- ELEMENTOS GLOBAIS E CONFIGURAÇÕES INICIAIS ---
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    // Inicializa a biblioteca de animações AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
        });
    }

    // --- FUNÇÕES GERAIS (PARA TODAS AS PÁGINAS) ---

    // Efeito de rolagem na barra de navegação
    if (navbar) {
        window.addEventListener('scroll', function() {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // Menu de navegação responsivo
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Rolagem suave para âncoras na mesma página
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.length > 1 && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                const offset = navbar ? navbar.offsetHeight : 70;
                window.scrollTo({
                    top: target.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- FUNÇÕES ESPECÍFICAS POR PÁGINA (COM VERIFICAÇÃO DE ELEMENTOS) ---

    // 1. Lógica da Seção HERO (Contador e Título)
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
            // Observer para só animar o contador quando a seção estiver visível
            const heroObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    animateCounters();
                    heroObserver.unobserve(heroSection);
                }
            }, { threshold: 0.4 });
            heroObserver.observe(heroSection);
        }
    }

    // 2. Status de Aberto/Fechado (Seção de Contato)
    const statusEl = document.getElementById('status-loja');
    if (statusEl) {
        const agora = new Date();
        const diaSemana = agora.getDay();
        const hora = agora.getHours();
        let aberto = false;
        if (diaSemana >= 1 && diaSemana <= 5 && hora >= 8 && hora < 18) { // Seg-Sex: 8h às 18h
            aberto = true;
        } else if (diaSemana === 6 && hora >= 8 && hora < 12) { // Sábado: 8h às 12h
            aberto = true;
        }
        statusEl.textContent = aberto ? 'Aberto Agora' : 'Fechado Agora';
        statusEl.classList.add(aberto ? 'aberto' : 'fechado');
    }

    // 3. Lógica do Formulário de Agendamento
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        const dateInput = document.getElementById('date');
        const dateError = document.getElementById('date-error');
        const phoneInput = document.getElementById('phone');
        const confirmationDiv = document.getElementById('confirmation');
        const confirmationDetails = document.getElementById('confirmation-details');
        const whatsappButton = document.getElementById('whatsapp-button');
        const editButton = document.getElementById('edit-button');
        let lastFormData = {};

        // Define data mínima e valida Domingos
        dateInput.min = new Date().toISOString().split("T")[0];
        dateInput.addEventListener('input', function() {
            const dataSelecionada = new Date(this.value + "T12:00:00Z"); // UTC para evitar fuso
            if (dataSelecionada.getUTCDay() === 0) { // 0 = Domingo
                this.value = '';
                dateError.textContent = 'Desculpe, não funcionamos aos Domingos.';
                this.closest('.form-group').classList.add('error');
            } else {
                dateError.textContent = '';
                this.closest('.form-group').classList.remove('error');
            }
        });

        // Formatação do telefone
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '').substring(0, 11);
            let formattedValue = '';
            if (value.length > 0) formattedValue = '(' + value.substring(0, 2);
            if (value.length > 2) formattedValue += ') ' + value.substring(2, 7);
            if (value.length > 7) formattedValue += '-' + value.substring(7, 11);
            e.target.value = formattedValue;
        });

        // Lógica de submissão do formulário
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // ... (incluindo toda a sua lógica original de validação e confirmação)
            const formData = new FormData(this);
            // ... etc ...
            // A sua lógica original de submissão, validação e confirmação vem aqui.
            // Para ser completo, estou reinserindo-a abaixo:
            
            document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
            document.querySelectorAll('.form-group').forEach(el => el.classList.remove('error'));

            let isValid = true;
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
            } else if (new Date(data.date + "T12:00:00Z").getUTCDay() === 0) {
                document.getElementById('date-error').textContent = 'Não agendamos aos Domingos.';
                document.getElementById('date').closest('.form-group').classList.add('error');
                isValid = false;
            }

            if (!isValid) return;

            lastFormData = data;
            const dateObj = new Date(data.date + 'T12:00:00Z');
            const formattedDate = dateObj.toLocaleDateString('pt-BR', { timeZone: 'UTC' });

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

            const pickupText = data.pickup === 'Sim' ? ' (com taxa adicional)' : '';
            const whatsappMessage = `Olá! Gostaria de confirmar meu agendamento na Power Lava-Car:\n\n*Nome:* ${data.name}\n*Telefone:* ${data.phone}\n*Serviço:* ${data.service}\n*Data:* ${formattedDate}\n*Leva e traz:* ${data.pickup}${pickupText}\n\nAguardamos a sua confirmação!`;
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
            };
        });
    }

    // 4. Efeito Ripple nos cards de serviço
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
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

});
