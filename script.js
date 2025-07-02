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
    function setupCarousel(carouselId) {
        const carousel = document.getElementById(carouselId);
        if (!carousel) return;

        const track = carousel.querySelector('.carousel-track');
        const items = Array.from(track.children);
        const prevButton = carousel.querySelector('.carousel-button.prev');
        const nextButton = carousel.querySelector('.carousel-button.next');
        let currentIndex = 0;
        let itemsToShow = 1; // Default for propaganda carousel, adjusted for news below

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
                    itemsToShow = 4;
                }
            }

            // Garante que o currentIndex não exceda os limites
            if (currentIndex > items.length - itemsToShow) {
                currentIndex = items.length - itemsToShow;
            }
            if (currentIndex < 0) {
                currentIndex = 0;
            }

            const totalItemWidth = items[0].offsetWidth + (parseFloat(getComputedStyle(track).gap) || 0);

            // Para o carrossel de propaganda, o cálculo é mais simples (1 item por vez)
            // Para o carrossel de notícias, precisamos do totalItemWidth e do número de itens para calcular o deslocamento
            let transformValue;
            if (carouselId === 'newsCarousel') {
                 // Calcula o deslocamento para mostrar o número correto de itens
                transformValue = `translateX(-${currentIndex * (totalItemWidth)}px)`;
            } else {
                // Para carrossel de propaganda (1 item por vez)
                transformValue = `translateX(-${currentIndex * items[0].offsetWidth}px)`;
            }

            track.style.transform = transformValue;


            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex >= items.length - itemsToShow;
        };

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                }
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                if (currentIndex < items.length - itemsToShow) {
                    currentIndex++;
                    updateCarousel();
                }
            });
        }

        // Inicializa e ajusta em redimensionamento
        window.addEventListener('resize', updateCarousel);
        updateCarousel(); // Chama ao carregar para definir o estado inicial
    }

    // Configura os carrosséis
    setupCarousel('propagandaCarousel');
    setupCarousel('newsCarousel'); // O itemsToShow será ajustado dentro da função para newsCarousel

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