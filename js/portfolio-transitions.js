/**
 * portfolio-transitions.js - VERSION FINALE RESPONSIVE
 * Gère : Préchargeur, Transitions, Menu Mobile, et Cartes Tactiles
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. CONFIGURATION ---
    const PRELOADER_DELAY = 1200; 
    const EXIT_DELAY = 300;
    const ANIMATION_DURATION_BUFFER = 2000; 
    const preloader = document.getElementById('preloader');

    // --- 2. FONCTION D'ANIMATION D'ENTRÉE ---
    function animatePageElements() {
        document.body.classList.add('loaded');
        
        const contentElements = document.querySelectorAll(
            'main h2, main h3, .presentation-section p, .page-content > *, .minimal-item, .tag-list li, .tool-list li, .flip-card, .hero-image-section, .about-text-section'
        );

        let elementDelay = 0.1;
        contentElements.forEach(element => {
            // Délais différents selon le type d'élément pour un effet "cascade"
            if (element.matches('.tag-list li, .tool-list li, .flip-card')) {
                 elementDelay += 0.05; 
            } 
            else if (element.matches('h2, .minimal-item, .presentation-section p, .hero-image-section')) {
                 elementDelay += 0.2;
            }
            element.style.transitionDelay = `${elementDelay}s`;
        });

        // Nettoyage des délais après l'animation pour ne pas gêner le hover CSS
        setTimeout(() => {
            contentElements.forEach(element => {
                element.style.transitionDelay = ''; 
            });
        }, ANIMATION_DURATION_BUFFER);
    }

    // --- 3. GESTION DU PRÉCHARGEUR (Logic) ---
    const pathname = window.location.pathname;
    const isHomePage = pathname.endsWith('/index.html') || pathname === '/' || preloader !== null;

    if (isHomePage && preloader) {
        // Si c'est l'accueil et qu'on l'a déjà vu (SessionStorage)
        if (sessionStorage.getItem('page-loaded')) {
            preloader.style.opacity = '0';
            preloader.style.pointerEvents = 'none';
            setTimeout(() => {
                preloader.classList.add('hidden');
                animatePageElements(); 
            }, 50); 
        } else {
            // Première visite
            window.onload = function() {
                sessionStorage.setItem('page-loaded', 'true');
                setTimeout(function() {
                    preloader.classList.add('hidden');
                    animatePageElements(); 
                }, PRELOADER_DELAY);
            };
        }
    } else {
        // Autres pages (pas de preloader, animation directe)
        if (document.readyState === 'complete') {
            animatePageElements();
        } else {
            window.onload = animatePageElements;
        }
    }

    // --- 4. GESTION DU MENU MOBILE (BURGER) ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.minimal-navbar');
    const navLinks = document.querySelector('.nav-links'); // Ciblage direct

    if (burger && nav) {
        burger.addEventListener('click', (e) => {
            e.stopPropagation(); // Empêche le clic de se propager
            nav.classList.toggle('nav-active');
            nav.classList.toggle('toggle');
            
            // Empêche le scroll du site quand le menu est ouvert
            if (nav.classList.contains('nav-active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Fermer le menu si on clique ailleurs sur l'écran
        document.addEventListener('click', (e) => {
            if (nav.classList.contains('nav-active') && !nav.contains(e.target) && !burger.contains(e.target)) {
                 nav.classList.remove('nav-active');
                 nav.classList.remove('toggle');
                 document.body.style.overflow = '';
            }
        });
    }

    // --- 5. GESTION DES FLIP CARDS (TACTILE MOBILE) ---
    // Permet de retourner les cartes au clic sur mobile/tablette
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => {
        card.addEventListener('click', function() {
            // Enlève la classe .flipped de toutes les autres cartes (optionnel, pour n'en avoir qu'une ouverte à la fois)
            // flipCards.forEach(c => { if(c !== card) c.classList.remove('flipped'); });
            
            this.classList.toggle('flipped');
        });
    });

    // --- 6. TRANSITION DE SORTIE (LIENS INTERNES) ---
    document.querySelectorAll('a').forEach(link => {
        // Vérifie si c'est un lien interne et pas un target_blank
        if (link.hostname === window.location.hostname && !link.getAttribute('href').startsWith('#') && link.target !== '_blank') {
            link.addEventListener('click', function(e) {
                const targetUrl = link.href;
                const currentUrl = window.location.href;

                // Ignore si c'est la même page ou un lien mailto/tel
                if (targetUrl === currentUrl || targetUrl.split('#')[0] === currentUrl.split('#')[0]) return;
                if (targetUrl.startsWith('mailto:') || targetUrl.startsWith('tel:')) return;

                e.preventDefault();
                
                // Si le menu mobile est ouvert, on le ferme d'abord proprement
                if (nav && nav.classList.contains('nav-active')) {
                    document.body.style.overflow = '';
                }

                document.body.classList.add('page-exit');
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, EXIT_DELAY); 
            });
        }
    });
});