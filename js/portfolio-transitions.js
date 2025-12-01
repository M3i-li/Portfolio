/**
 * portfolio-transitions.js
 * Gère le préchargeur (uniquement sur index.html),
 * l'animation d'entrée des éléments de contenu (body.loaded)
 * et le fondu de sortie lors de la navigation (body.page-exit).
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Constantes et Variables ---
    const PRELOADER_DELAY = 3500; 
    const EXIT_DELAY = 300;
    const preloader = document.getElementById('preloader');


    // --- 2. Fonction d'animation d'entrée des éléments de la page ---
    function animatePageElements() {
        // Ajout de la classe 'loaded' pour déclencher les transitions CSS (transitions.css)
        document.body.classList.add('loaded');

        // Ciblage de tous les conteneurs et éléments principaux des pages
        // Ceci inclut les titres, paragraphes, minimal-item, tag-list, tool-list, et flip-card.
        const contentElements = document.querySelectorAll(
            'main h2, main h3, .presentation-section p, .page-content > *, .minimal-item, .tag-list li, .tool-list li, .flip-card'
        );
        
        let elementDelay = 0.1; // Délai de départ pour l'étagement

        contentElements.forEach(element => {
            // Logique pour éviter d'animer plusieurs fois les enfants des mêmes blocs
            // On cible principalement les sections, les blocs, et les items de liste séparément.
            
            // Si c'est un élément de liste ou une carte, on lui donne un délai séquentiel
            if (element.matches('.tag-list li, .tool-list li, .flip-card')) {
                 elementDelay += 0.1;
            } 
            // Si c'est un titre de section ou un bloc principal (minimal-item, p)
            else if (element.matches('h2, .minimal-item, .presentation-section p')) {
                 elementDelay += 0.2;
            }
            // Les autres éléments sont ignorés ou reçoivent un petit incrément
            else {
                return; // Ne pas appliquer de délai à cet élément (il sera animé par son parent ou sa règle CSS par défaut)
            }
            
            element.style.transitionDelay = `${elementDelay}s`;
        });
        
        // Délai spécifique pour le glass-card sur la page d'accueil
        const glassCard = document.querySelector('.hero-image-section .glass-card');
        if (glassCard) {
            // Le glass-card doit apparaître juste après le préchargeur, ou immédiatement.
            // Le délai CSS de 0.5s est utilisé ici, pas besoin de le forcer en JS
        }
    }


    // --- 3. Gestion du Préchargeur (Index.html uniquement) et Lancement de l'Animation ---
    const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';

    if (isHomePage && preloader) {
        // Logique pour la page d'accueil
        if (sessionStorage.getItem('page-loaded')) {
            // Navigation interne : masquer immédiatement et lancer l'animation
            preloader.style.opacity = '0';
            preloader.style.pointerEvents = 'none';
            setTimeout(animatePageElements, 10); 
        } else {
            // Première visite : Afficher le préchargeur puis lancer l'animation
            window.onload = function() {
                sessionStorage.setItem('page-loaded', 'true');
                
                setTimeout(function() {
                    preloader.classList.add('hidden');
                    animatePageElements(); 
                }, PRELOADER_DELAY);
            };
        }
    } else {
        // Logique pour les autres pages (pas de préchargeur)
        window.onload = animatePageElements;
    }


    // --- 4. TRANSITION DE SORTIE AU CHANGEMENT DE PAGE (Pour tous les liens internes) ---
    document.querySelectorAll('a').forEach(link => {
        // Vérifie que c'est un lien interne et non une ouverture dans un nouvel onglet
        if (link.href.startsWith(window.location.origin) && link.target !== '_blank') {
            link.addEventListener('click', function(e) {
                // Ignore les clics vers la page courante
                const currentFileName = window.location.pathname.split('/').pop();
                const targetFileName = link.getAttribute('href').split('/').pop();
                if (currentFileName === targetFileName) {
                    return;
                }

                e.preventDefault();
                // Déclenche le fondu de sortie
                document.body.classList.add('page-exit');

                // Navigue après la fin de l'animation CSS
                setTimeout(() => {
                    window.location.href = link.href;
                }, EXIT_DELAY); 
            });
        }
    });
});