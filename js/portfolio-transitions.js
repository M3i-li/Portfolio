/**
 * portfolio-transitions.js
 * Gère le préchargeur, l'animation d'entrée en cascade
 * et nettoie les styles pour ne pas gêner les interactions (hover/click).
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Constantes et Variables ---
    const PRELOADER_DELAY = 1200; 
    const EXIT_DELAY = 300;
    const ANIMATION_DURATION_BUFFER = 2000; // Temps de sécurité pour laisser l'anim se finir
    const preloader = document.getElementById('preloader');

    // --- 2. Fonction d'animation d'entrée des éléments ---
    function animatePageElements() {
        document.body.classList.add('loaded');
        
        // Sélection des éléments à animer
        const contentElements = document.querySelectorAll(
            'main h2, main h3, .presentation-section p, .page-content > *, .minimal-item, .tag-list li, .tool-list li, .flip-card, .hero-image-section, .about-text-section'
        );

        let elementDelay = 0.1;
        contentElements.forEach(element => {
            // Calcul du délai en cascade
            if (element.matches('.tag-list li, .tool-list li, .flip-card')) {
                 elementDelay += 0.05; 
            } 
            else if (element.matches('h2, .minimal-item, .presentation-section p, .hero-image-section')) {
                 elementDelay += 0.2;
            }
            
            // On applique le délai pour l'entrée
            element.style.transitionDelay = `${elementDelay}s`;
        });

        // --- NOUVEAU : NETTOYAGE APRES L'ANIMATION ---
        // On attend que toutes les animations d'entrée soient finies (2 secondes)
        // Puis on retire le transition-delay pour que le HOVER soit instantané
        setTimeout(() => {
            contentElements.forEach(element => {
                element.style.transitionDelay = ''; 
                // On retire le style inline pour laisser le CSS gérer les transitions de hover
            });
        }, ANIMATION_DURATION_BUFFER);
    }

    // --- 3. Gestion du Préchargeur et Lancement ---
    const pathname = window.location.pathname;
    // Détection robuste de la page d'accueil
    const isHomePage = pathname.endsWith('/accueil.html') || pathname.endsWith('/index.html') || pathname === '/' || preloader !== null;

    if (isHomePage && preloader) {
        if (sessionStorage.getItem('page-loaded')) {
            // Déjà visité : on cache vite
            preloader.style.opacity = '0';
            preloader.style.pointerEvents = 'none';
            setTimeout(() => {
                preloader.classList.add('hidden');
                animatePageElements(); 
            }, 50); 
        } else {
            // Première visite : on joue le chargement
            window.onload = function() {
                sessionStorage.setItem('page-loaded', 'true');
                setTimeout(function() {
                    preloader.classList.add('hidden');
                    animatePageElements(); 
                }, PRELOADER_DELAY);
            };
        }
    } else {
        // Autres pages
        if (document.readyState === 'complete') {
            animatePageElements();
        } else {
            window.onload = animatePageElements;
        }
    }

    // --- 4. Transition de sortie (Liens internes) ---
    document.querySelectorAll('a').forEach(link => {
        if (link.hostname === window.location.hostname && !link.getAttribute('href').startsWith('#') && link.target !== '_blank') {
            link.addEventListener('click', function(e) {
                const targetUrl = link.href;
                const currentUrl = window.location.href;

                if (targetUrl === currentUrl || targetUrl.split('#')[0] === currentUrl.split('#')[0]) return;
                if (targetUrl.startsWith('mailto:') || targetUrl.startsWith('tel:')) return;

                e.preventDefault();
                document.body.classList.add('page-exit');
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, EXIT_DELAY); 
            });
        }
    });
});