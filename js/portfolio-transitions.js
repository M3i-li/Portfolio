/**
 * portfolio-transitions.js
 * Gère le préchargeur, l'animation d'entrée,
 * le nettoyage des transitions (hover fix) et le MENU MOBILE.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Constantes et Variables ---
    const PRELOADER_DELAY = 1200; 
    const EXIT_DELAY = 300;
    const ANIMATION_DURATION_BUFFER = 2000; 
    const preloader = document.getElementById('preloader');

    // --- 2. Fonction d'animation d'entrée des éléments ---
    function animatePageElements() {
        document.body.classList.add('loaded');
        
        const contentElements = document.querySelectorAll(
            'main h2, main h3, .presentation-section p, .page-content > *, .minimal-item, .tag-list li, .tool-list li, .flip-card, .hero-image-section, .about-text-section'
        );

        let elementDelay = 0.1;
        contentElements.forEach(element => {
            if (element.matches('.tag-list li, .tool-list li, .flip-card')) {
                 elementDelay += 0.05; 
            } 
            else if (element.matches('h2, .minimal-item, .presentation-section p, .hero-image-section')) {
                 elementDelay += 0.2;
            }
            element.style.transitionDelay = `${elementDelay}s`;
        });

        // Nettoyage pour permettre le hover instantané après l'intro
        setTimeout(() => {
            contentElements.forEach(element => {
                element.style.transitionDelay = ''; 
            });
        }, ANIMATION_DURATION_BUFFER);
    }

    // --- 3. Gestion du Préchargeur ---
    const pathname = window.location.pathname;
    const isHomePage = pathname.endsWith('/accueil.html') || pathname.endsWith('/index.html') || pathname === '/' || preloader !== null;

    if (isHomePage && preloader) {
        if (sessionStorage.getItem('page-loaded')) {
            preloader.style.opacity = '0';
            preloader.style.pointerEvents = 'none';
            setTimeout(() => {
                preloader.classList.add('hidden');
                animatePageElements(); 
            }, 50); 
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
        if (document.readyState === 'complete') {
            animatePageElements();
        } else {
            window.onload = animatePageElements;
        }
    }

    // --- 4. GESTION DU BURGER MENU (NOUVEAU) ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.minimal-navbar');
    // On cible le conteneur des liens ou la navbar elle-même si pas de conteneur
    // Note: Dans le CSS on utilise .nav-active sur .minimal-navbar pour cibler .nav-links
    
    if (burger) {
        burger.addEventListener('click', () => {
            // Basculer la classe pour montrer/cacher le menu
            nav.classList.toggle('nav-active');
            // Basculer la classe pour animer le burger (croix)
            nav.classList.toggle('toggle');
            
            // Empêcher le scroll du body quand le menu est ouvert (optionnel mais recommandé)
            document.body.style.overflow = nav.classList.contains('nav-active') ? 'hidden' : '';
        });
    }
    
    // Fermer le menu si on clique sur un lien
    const navLinks = document.querySelectorAll('.minimal-navbar a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                nav.classList.remove('toggle');
                document.body.style.overflow = '';
            }
        });
    });


    // --- 5. Transition de sortie (Liens internes) ---
    document.querySelectorAll('a').forEach(link => {
        if (link.hostname === window.location.hostname && !link.getAttribute('href').startsWith('#') && link.target !== '_blank') {
            link.addEventListener('click', function(e) {
                const targetUrl = link.href;
                const currentUrl = window.location.href;

                if (targetUrl === currentUrl || targetUrl.split('#')[0] === currentUrl.split('#')[0]) return;
                if (targetUrl.startsWith('mailto:') || targetUrl.startsWith('tel:')) return;

                e.preventDefault();
                
                // Si c'est un lien du menu mobile, on attend un peu moins
                document.body.classList.add('page-exit');
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, EXIT_DELAY); 
            });
        }
    });
});