document.addEventListener('DOMContentLoaded', () => {
    const scrollArrow = document.getElementById('scrollArrow');
    const initialScreen = document.querySelector('.initial-screen');
    const mainContent = document.getElementById('mainContent');

    // Função para rolagem suave
    scrollArrow.addEventListener('click', () => {
        initialScreen.classList.add('hidden'); // Inicia a transição para esconder
        setTimeout(() => {
            initialScreen.style.display = 'none'; // Esconde após a transição
            mainContent.classList.add('visible'); // Mostra o conteúdo principal
            window.scrollTo({
                top: 0, // Rolagem para o topo do conteúdo principal
                behavior: 'smooth'
            });
        }, 800); // Tempo da transição CSS
    });

    // Função genérica para carrosséis
    function setupCarousel(carouselId, autoSlide = false, slideInterval = 3000) {
        const carousel = document.getElementById(carouselId);
        if (!carousel) return;

        const track = carousel.querySelector('.carousel-track');
        const items = Array.from(track.children);
        const prevButton = carousel.querySelector('.carousel-button.prev');
        const nextButton = carousel.querySelector('.carousel-button.next');
        let currentIndex = 0;
        let itemsToShow = 1; // Default for propaganda carousel
        let autoSlideTimer;

        const updateCarousel = () => {
            // Recalcula itemsToShow para o carrossel de notícias em cada atualização
            if (carouselId === 'newsCarousel') {
                const carouselWidth = carousel.offsetWidth;
                if (carouselWidth <= 480) { // Mobile
                    itemsToShow = 1;
                } else if (carouselWidth <= 768) { // Tablet
                    itemsToShow = 2;
                } else if (carouselWidth <= 992) { // Médio
                    itemsToShow = 3;
                } else { // Desktop
                    itemsToShow = 3; // Mantemos 3 itens, pois a largura do item mudou para acomodar imagem e texto
                }
            }

            // Garante que o currentIndex não exceda os limites para carrosséis com itens limitados
            if (carouselId !== 'propagandaCarousel' && currentIndex > items.length - itemsToShow) {
                currentIndex = items.length - itemsToShow;
            }
            if (carouselId !== 'propagandaCarousel' && currentIndex < 0) {
                currentIndex = 0;
            }

            // Para o carrossel de propaganda (loop infinito)
            if (carouselId === 'propagandaCarousel' && currentIndex >= items.length) {
                currentIndex = 0; // Volta para o início
            }
            if (carouselId === 'propagandaCarousel' && currentIndex < 0) {
                currentIndex = items.length - 1; // Vai para o último
            }


            // Para o carrossel de propaganda, o cálculo é mais simples (1 item por vez)
            // Para o carrossel de notícias, precisamos do totalItemWidth (item + gap) e do número de itens para calcular o deslocamento
            let transformValue;
            if (carouselId === 'newsCarousel') {
                // Calcula o deslocamento para mostrar o número correto de itens
                // Pega a largura do primeiro item e o gap do track
                const itemWidth = items[0].offsetWidth;
                const gap = parseFloat(getComputedStyle(track).gap) || 0;
                transformValue = `translateX(-${currentIndex * (itemWidth + gap)}px)`;
            } else {
                // Para carrossel de propaganda (1 item por vez)
                transformValue = `translateX(-${currentIndex * items[0].offsetWidth}px)`;
            }

            track.style.transform = transformValue;

            // Desabilita botões apenas para carrosséis não infinitos
            if (carouselId !== 'propagandaCarousel') {
                prevButton.disabled = currentIndex === 0;
                nextButton.disabled = currentIndex >= items.length - itemsToShow;
            } else {
                // Botões sempre habilitados para carrossel infinito de propaganda
                prevButton.disabled = false;
                nextButton.disabled = false;
            }
        };

        const startAutoSlide = () => {
            if (autoSlide) {
                clearInterval(autoSlideTimer); // Limpa qualquer timer anterior
                autoSlideTimer = setInterval(() => {
                    currentIndex++;
                    updateCarousel(); // A lógica de loop infinito já está em updateCarousel para propaganda
                }, slideInterval);
            }
        };

        // Event Listeners para botões
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                clearInterval(autoSlideTimer); // Pausa o auto-slide ao interagir
                currentIndex--;
                updateCarousel();
                startAutoSlide(); // Reinicia o auto-slide
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                clearInterval(autoSlideTimer); // Pausa o auto-slide ao interagir
                currentIndex++;
                updateCarousel();
                startAutoSlide(); // Reinicia o auto-slide
            });
        }

        // Inicializa e ajusta em redimensionamento
        window.addEventListener('resize', () => {
            clearInterval(autoSlideTimer); // Pausa o auto-slide durante o redimensionamento
            currentIndex = 0; // Reseta o índice para evitar problemas de layout no redimensionamento
            updateCarousel();
            startAutoSlide(); // Reinicia o auto-slide após o redimensionamento
        });
        updateCarousel(); // Chama ao carregar para definir o estado inicial
        startAutoSlide(); // Inicia o auto-slide se habilitado
    }

    // Configura os carrosséis
    setupCarousel('propagandaCarousel', true, 5000); // Propaganda com auto-slide a cada 5 segundos
    setupCarousel('newsCarousel', false); // Novidades sem auto-slide, apenas botões

    // Interação para abrir nova aba em "Categorias"
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            const url = item.dataset.url;
            if (url) {
                window.open(url, '_blank');
            }
        });
    });

    // Interação para abrir nova aba em "Novidades" (botão "Ver Detalhes")
    const newsButtons = document.querySelectorAll('.news-button');
    newsButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation(); // Evita que o clique no botão ative o clique no item pai se houver
            const url = button.dataset.url;
            if (url) {
                window.open(url, '_blank');
            }
        });
    });

    // Interação para abrir nova aba em "Mais Vendidos" (botão Comprar)
    const bestsellerButtons = document.querySelectorAll('.bestseller-item button');
    bestsellerButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation(); // Evita que o clique no botão ative o clique no item pai
            const item = button.closest('.bestseller-item');
            const url = item.dataset.url;
            if (url) {
                window.open(url, '_blank');
            }
        });
    });
});