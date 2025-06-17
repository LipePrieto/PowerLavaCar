document.addEventListener('DOMContentLoaded', function() {

    // 1. Funcionalidade do Menu Hamburger (Mobile)
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Fechar o menu ao clicar em um link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // 2. Efeito da Barra de Navegação ao Rolar
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Status de Funcionamento (Aberto/Fechado)
    function verificarStatusLoja() {
        const statusBadge = document.getElementById('status-loja');
        if (!statusBadge) return;

        const agora = new Date();
        const diaSemana = agora.getDay(); // 0 (Domingo) a 6 (Sábado)
        const hora = agora.getHours();
        const minuto = agora.getMinutes();
        const horaAtual = hora + (minuto / 60);

        let aberto = false;

        // Seg a Sex (1 a 5): 08:00 - 18:00
        if (diaSemana >= 1 && diaSemana <= 5) {
            if (horaAtual >= 8 && horaAtual < 18) {
                aberto = true;
            }
        }
        // Sábado (6): 08:00 - 12:00
        else if (diaSemana === 6) {
            if (horaAtual >= 8 && horaAtual < 12) {
                aberto = true;
            }
        }
        // Domingo (0): Fechado

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

    // 4. Animação de Contagem dos Números
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const speed = 200; // Velocidade da animação

        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;

                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 15);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    }

    // Usar Intersection Observer para iniciar a contagem quando visível
    const heroStats = document.querySelector('.hero-stats');
    let hasAnimated = false;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                animateCounters();
                hasAnimated = true; // Garante que a animação ocorra apenas uma vez
                observer.unobserve(entry.target); // Para de observar após animar
            }
        });
    }, { threshold: 0.5 }); // Inicia quando 50% da seção estiver visível

    if (heroStats) {
        observer.observe(heroStats);
    }
    
    // 5. Inicialização da Biblioteca de Animações (AOS)
    AOS.init({
        duration: 1000, // Duração da animação
        once: true,     // Animar apenas uma vez
        offset: 50,     // Começar a animação 50px antes do elemento aparecer
    });

    // Chama a função de status da loja assim que a página carrega
    verificarStatusLoja();
    // E atualiza a cada minuto para o status mudar em tempo real
    setInterval(verificarStatusLoja, 60000); 

});
