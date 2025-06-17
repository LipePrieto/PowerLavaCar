document.addEventListener('DOMContentLoaded', function() {

    // ===================================================================
    // 1. FUNCIONALIDADES GERAIS DA PÁGINA
    // ===================================================================

    // Menu Hamburger (Mobile)
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Efeito da Barra de Navegação ao Rolar
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Status de Funcionamento (Aberto/Fechado)
    const statusBadge = document.getElementById('status-loja');
    function verificarStatusLoja() {
        if (!statusBadge) return;
        const agora = new Date();
        const diaSemana = agora.getDay(); // 0 (Dom) a 6 (Sáb)
        const hora = agora.getHours();
        const minuto = agora.getMinutes();
        const horaAtual = hora + (minuto / 60);

        let aberto = false;
        if (diaSemana >= 1 && diaSemana <= 5) { // Seg a Sex
            if (horaAtual >= 8 && horaAtual < 18) aberto = true;
        } else if (diaSemana === 6) { // Sábado
            if (horaAtual >= 8 && horaAtual < 12) aberto = true;
        }

        if (aberto) {
            statusBadge.textContent = 'Aberto';
            statusBadge.classList.add('aberto');
            statusBadge.classList.remove('fechado');
        } else {
            statusBadge.textContent = 'Fechado';
            statusBadge.classList.add('fechado');
            statusBadge.classList.remove('aberto');
        }
    }
    verificarStatusLoja();
    setInterval(verificarStatusLoja, 60000);

    // Animação de Contagem dos Números
    const heroStats = document.querySelector('.hero-stats');
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            let count = 0;
            const inc = target / 200; // Animation speed
            const updateCount = () => {
                if (count < target) {
                    count += inc;
                    counter.innerText = Math.ceil(count);
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    }
    if (heroStats) {
        let hasAnimated = false;
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !hasAnimated) {
                animateCounters();
                hasAnimated = true;
                observer.unobserve(heroStats);
            }
        }, { threshold: 0.5 });
        observer.observe(heroStats);
    }
    
    // Inicialização da Biblioteca de Animações (AOS)
    AOS.init({
        duration: 1000,
        once: true,
        offset: 50,
    });

    // ===================================================================
    // 2. LÓGICA DO FORMULÁRIO DE AGENDAMENTO
    // ===================================================================
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        const confirmationDiv = document.getElementById('confirmation');
        const confirmationDetails = document.getElementById('confirmation-details');
        const whatsappButton = document.getElementById('whatsapp-button');
        const editButton = document.getElementById('edit-button');

        // Inputs do formulário
        const nameInput = document.getElementById('name');
        const phoneInput = document.getElementById('phone');
        const serviceInput = document.getElementById('service');
        const dateInput = document.getElementById('date');
        const pickupInput = document.getElementById('pickup');
        
        // --- NOVO: Elemento para exibir o preço total ---
        const totalPriceEl = document.getElementById('total-price');

        // Bloquear datas passadas
        const hoje = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', hoje);

        // Máscara para o telefone
        phoneInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '').substring(0, 11);
            if (value.length > 6) value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
            else if (value.length > 2) value = value.replace(/^(\d{2})(\d{0,5}).*/, '($1) $2');
            else if (value.length > 0) value = value.replace(/^(\d*)/, '($1');
            e.target.value = value;
        });

        // --- NOVO: Função para calcular e atualizar o preço ---
        function updateTotalPrice() {
            let total = 0;
            const selectedOption = serviceInput.options[serviceInput.selectedIndex];
            
            if (selectedOption && selectedOption.value) {
                // Extrai o número do texto da opção (ex: "Lavagem Expressa - R$ 40,00")
                const priceMatch = selectedOption.text.match(/R\$\s*([\d,]+)/);
                if (priceMatch && priceMatch[1]) {
                    // Converte o preço para um número (trocando vírgula por ponto)
                    total += parseFloat(priceMatch[1].replace(',', '.'));
                }
            }

            // Adiciona o valor do serviço Leva e Traz
            if (pickupInput.checked) {
                total += 5;
            }

            // Formata e exibe o total
            totalPriceEl.textContent = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
        
        // --- NOVO: Adiciona os gatilhos para atualizar o preço ---
        serviceInput.addEventListener('change', updateTotalPrice);
        pickupInput.addEventListener('change', updateTotalPrice);


        // Função para validar o formulário
        function validateForm() {
            let isValid = true;
            document.querySelectorAll('.form-group.error').forEach(el => el.classList.remove('error'));

            function setError(inputId, message) {
                const input = document.getElementById(inputId);
                const errorDiv = document.getElementById(`${inputId}-error`);
                input.parentElement.classList.add('error');
                errorDiv.textContent = message;
                isValid = false;
            }

            if (nameInput.value.trim() === '') setError('name', 'Por favor, insira seu nome.');
            const phoneDigits = phoneInput.value.replace(/\D/g, '');
            if (phoneDigits.length !== 11) setError('phone', 'O celular deve ter 11 dígitos (DDD + número).');
            if (serviceInput.value === '') setError('service', 'Por favor, selecione um serviço.');
            if (dateInput.value === '') {
                setError('date', 'Por favor, escolha uma data.');
            } else {
                const selectedDate = new Date(dateInput.value + 'T00:00:00');
                const today = new Date(); today.setHours(0, 0, 0, 0);
                if (selectedDate < today) setError('date', 'Não é possível agendar em uma data passada.');
            }
            return isValid;
        }

        // Evento de submit do formulário
        bookingForm.addEventListener('submit', function(event) {
            event.preventDefault();

            if (validateForm()) {
                const name = nameInput.value;
                const phone = phoneInput.value;
                const service = serviceInput.options[serviceInput.selectedIndex].text;
                const date = new Date(dateInput.value + 'T00:00:00').toLocaleDateString('pt-BR');
                const pickup = pickupInput.checked ? 'Sim' : 'Não';
                const total = totalPriceEl.textContent; // Pega o total já formatado
                
                confirmationDetails.innerHTML = `
                    <p><strong>Nome:</strong> ${name}</p>
                    <p><strong>Telefone:</strong> ${phone}</p>
                    <p><strong>Serviço:</strong> ${service}</p>
                    <p><strong>Data:</strong> ${date}</p>
                    <p><strong>Leva e Traz:</strong> ${pickup}</p>
                    <p><strong>Total Estimado:</strong> ${total}</p>
                `;
                
                const whatsappMessage = `Olá! Gostaria de confirmar meu agendamento:\n\n*Nome:* ${name}\n*Telefone:* ${phone}\n*Serviço:* ${service}\n*Data:* ${date}\n*Leva e Traz:* ${pickup}\n*Total Estimado:* ${total}`;
                const whatsappUrl = `https://wa.me/5514988388121?text=${encodeURIComponent(whatsappMessage)}`;
                whatsappButton.onclick = () => window.open(whatsappUrl, '_blank');

                bookingForm.style.display = 'none';
                confirmationDiv.style.display = 'block';
            }
        });
        
        editButton.addEventListener('click', function() {
            confirmationDiv.style.display = 'none';
            bookingForm.style.display = 'block';
        });
    }

});
