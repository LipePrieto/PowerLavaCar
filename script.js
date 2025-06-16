document.addEventListener('DOMContentLoaded', function() {
    
    // --- ELEMENTOS GLOBAIS ---
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    // --- FUNÇÕES GERAIS (EXECUTADAS EM TODAS AS PÁGINAS) ---

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
    
    // Animar elementos na rolagem (AOS) - Usando a biblioteca externa
    // Verifique se o script da biblioteca AOS está no seu HTML
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
        });
    }


    // --- FUNÇÕES ESPECÍFICAS DA PÁGINA (COM VERIFICAÇÃO DE EXISTÊNCIA) ---

    // 1. Lógica do Contador de Estatísticas e Título da Seção Hero
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const counters = document.querySelectorAll('.stat-number');
        
        const animateCounters = () => {
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                counter.innerText = '0'; // Inicia em 0

                const updateCounter = () => {
                    const current = +counter.innerText;
                    const increment = target / 100; // Velocidade da animação

                    if (current < target) {
                        counter.innerText = `${Math.ceil(current + increment)}`;
                        setTimeout(updateCounter, 20);
                    } else {
                        counter.innerText = target + '+'; // Adiciona o '+' no final
                    }
                };
                updateCounter();
            });
        };

        // Observer para só animar quando a seção estiver visível
        const heroObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateCounters();
                heroObserver.unobserve(heroSection); // Anima apenas uma vez
            }
        }, { threshold: 0.4 });

        heroObserver.observe(heroSection);
    }
    
    // 2. Status de Aberto/Fechado
    const statusEl = document.getElementById('status-loja');
    if (statusEl) {
        const agora = new Date();
        const diaSemana = agora.getDay(); // 0 = Domingo, 1 = Segunda...
        const hora = agora.getHours();
        let aberto = false;

        if (diaSemana >= 1 && diaSemana <= 5 && hora >= 8 && hora < 18) { // Seg-Sex
            aberto = true;
        } else if (diaSemana === 6 && hora >= 8 && hora < 12) { // Sábado
            aberto = true;
        }

        if (aberto) {
            statusEl.textContent = 'Aberto Agora';
            statusEl.classList.add('aberto');
        } else {
            statusEl.textContent = 'Fechado Agora';
            statusEl.classList.add('fechado');
        }
    }

    // 3. Lógica do Formulário de Agendamento
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        const dateInput = document.getElementById('date');
        const dateError = document.getElementById('date-error');
        const phoneInput = document.getElementById('phone');

        // Define data mínima como hoje
        dateInput.min = new Date().toISOString().split("T")[0];

        // Validação para não permitir Domingos
        dateInput.addEventListener('input', function() {
            const dataSelecionada = new Date(this.value + "T12:00:00Z");
            if (dataSelecionada.getUTCDay() === 0) {
                this.value = '';
                dateError.textContent = 'Desculpe, não agendamos aos Domingos.';
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

        // Adicione o resto da lógica do formulário (submit, etc.) aqui...
        // (Vou omitir para não repetir o código que você já tem, mas ele deve vir aqui dentro deste "if")
    }
});
