/**
 * portfolio-transitions.js
 * Gère le préchargeur (uniquement sur accueil.html),
 * l'animation d'entrée des éléments de contenu (body.loaded)
 * et le fondu de sortie lors de la navigation (body.page-exit).
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Constantes et Variables ---
    const PRELOADER_DELAY = 1200; // Délai raccourci
    const EXIT_DELAY = 300;
    const preloader = document.getElementById('preloader');

    // --- 2. Fonction d'animation d'entrée des éléments de la page ---
    function animatePageElements() {
        document.body.classList.add('loaded');
        const contentElements = document.querySelectorAll(
            'main h2, main h3, .presentation-section p, .page-content > *, .minimal-item, .tag-list li, .tool-list li, .flip-card'
        );
        let elementDelay = 0.1;
        contentElements.forEach(element => {
            if (element.matches('.tag-list li, .tool-list li, .flip-card')) {
                 elementDelay += 0.1;
            } 
            else if (element.matches('h2, .minimal-item, .presentation-section p')) {
                 elementDelay += 0.2;
            }
            else {
                return;
            }
            element.style.transitionDelay = `${elementDelay}s`;
        });
    }

    // --- 3. Gestion du Préchargeur (Index.html uniquement) et Lancement de l'Animation ---
    const isHomePage = window.location.pathname.endsWith('/index.html') || window.location.pathname === '/';

    if (isHomePage && preloader) {
        if (sessionStorage.getItem('page-loaded')) {
            preloader.style.opacity = '0';
            preloader.style.pointerEvents = 'none';
            setTimeout(animatePageElements, 10); 
        } else {
            window.onload = function() {
                sessionStorage.setItem('page-loaded', 'true');
                setTimeout(function() {
                    preloader.classList.add('hidden');
                    animatePageElements(); 
                }, PRELOADER_DELAY);
            };
        }
    } else {
        window.onload = animatePageElements;
    }

    // --- 4. TRANSITION DE SORTIE AU CHANGEMENT DE PAGE (Pour tous les liens internes) ---
    document.querySelectorAll('a').forEach(link => {
        // Correction des chemins relatifs pour tous les liens internes
        if (
            (link.href.startsWith(window.location.origin) || link.getAttribute('href').startsWith('./') || link.getAttribute('href').startsWith('../')) 
            && link.target !== '_blank'
        ) {
            link.addEventListener('click', function(e) {
                const currentFileName = window.location.pathname.split('/').pop();
                const targetFileName = link.getAttribute('href').split('/').pop();
                if (currentFileName === targetFileName) {
                    return;
                }
                e.preventDefault();
                document.body.classList.add('page-exit');
                setTimeout(() => {
                    window.location.href = link.href;
                }, EXIT_DELAY); 
            });
        }
    });
});