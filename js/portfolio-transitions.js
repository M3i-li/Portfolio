/**
 * portfolio-transitions.js - VERSION FINALE AVEC BOUTONS
 * Gère : Préchargeur, Transitions, Menu Mobile, et Cartes (Flip via bouton)
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
            if (element.matches('.tag-list li, .tool-list li, .flip-card')) {
                 elementDelay += 0.05; 
            } 
            else if (element.matches('h2, .minimal-item, .presentation-section p, .hero-image-section')) {
                 elementDelay += 0.2;
            }
            element.style.transitionDelay = `${elementDelay}s`;
        });

        setTimeout(() => {
            contentElements.forEach(element => {
                element.style.transitionDelay = ''; 
            });
        }, ANIMATION_DURATION_BUFFER);
    }

    // --- 3. GESTION DU PRÉCHARGEUR ---
    const pathname = window.location.pathname;
    const isHomePage = pathname.endsWith('/index.html') || pathname === '/' || preloader !== null;

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

    // --- 4. GESTION DU MENU MOBILE (BURGER) ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.minimal-navbar');

    if (burger && nav) {
        burger.addEventListener('click', (e) => {
            e.stopPropagation(); 
            nav.classList.toggle('nav-active');
            nav.classList.toggle('toggle');
            
            if (nav.classList.contains('nav-active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        document.addEventListener('click', (e) => {
            if (nav.classList.contains('nav-active') && !nav.contains(e.target) && !burger.contains(e.target)) {
                 nav.classList.remove('nav-active');
                 nav.classList.remove('toggle');
                 document.body.style.overflow = '';
            }
        });
    }

    // --- 5. GESTION DES FLIP CARDS (VIA BOUTONS UNIQUEMENT) ---
    
    // Boutons "Description" (Pour retourner la carte)
    const descButtons = document.querySelectorAll('.flip-btn-description');
    descButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Empêche le comportement par défaut si c'était un lien
            e.stopPropagation(); // Empêche la propagation
            
            // Trouve la carte parente
            const card = btn.closest('.flip-card');
            if (card) {
                card.classList.add('flipped');
            }
        });
    });

    // Boutons "Retour" (Pour revenir à la face avant)
    const returnButtons = document.querySelectorAll('.flip-btn-return');
    returnButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const card = btn.closest('.flip-card');
            if (card) {
                card.classList.remove('flipped');
            }
        });
    });

    // --- 6. TRANSITION DE SORTIE ---
    document.querySelectorAll('a').forEach(link => {
        if (link.hostname === window.location.hostname && !link.getAttribute('href').startsWith('#') && link.target !== '_blank') {
            link.addEventListener('click', function(e) {
                const targetUrl = link.href;
                const currentUrl = window.location.href;

                if (targetUrl === currentUrl || targetUrl.split('#')[0] === currentUrl.split('#')[0]) return;
                if (targetUrl.startsWith('mailto:') || targetUrl.startsWith('tel:')) return;

                e.preventDefault();
                
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