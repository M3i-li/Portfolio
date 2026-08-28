document.addEventListener('DOMContentLoaded', () => {
	//CONFIG
	const PRELOADER_DELAY = 800;
	const ANIMATION_DURATION_BUFFER = 2000;
	const preloader = document.getElementById('preloader');

	// ANIMATION D'ENTRÉE
	function animatePageElements() {
		document.body.classList.add('loaded');

		const contentElements = document.querySelectorAll(
			'main h2, main h3, .presentation-section p, .page-content > *, .minimal-item, .tag-list li, .tool-list li, .flip-card, .hero-image-section, .about-text-section'
		);

		let elementDelay = 0.1;
		contentElements.forEach(element => {
			if (element.matches('.tag-list li, .tool-list li, .flip-card')) {
				elementDelay += 0.05;
			} else if (
				element.matches(
					'h2, .minimal-item, .presentation-section p, .hero-image-section'
				)
			) {
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

	setTimeout(() => {
		if (preloader) {
			preloader.style.opacity = '0';
			preloader.style.pointerEvents = 'none';
			preloader.style.transition = 'opacity 0.5s ease';
		}
		animatePageElements();
	}, PRELOADER_DELAY);

	//MENU BURGER

	//TODO: changing the menu burger for a Single Page APP

	const burger = document.querySelector('.burger');
	const nav = document.querySelector('.minimal-navbar');

	if (burger && nav) {
		burger.addEventListener('click', e => {
			e.stopPropagation();
			nav.classList.toggle('nav-active');
			nav.classList.toggle('toggle');

			if (nav.classList.contains('nav-active')) {
				document.body.style.overflow = 'hidden';
			} else {
				document.body.style.overflow = '';
			}
		});

		document.addEventListener('click', e => {
			if (
				nav.classList.contains('nav-active') &&
				!nav.contains(e.target) &&
				!burger.contains(e.target)
			) {
				nav.classList.remove('nav-active');
				nav.classList.remove('toggle');
				document.body.style.overflow = '';
			}
		});
	}

	//FLIP CARDS

	document.addEventListener('click', e => {
		// Bouton Description
		const descBtn = e.target.closest('.flip-btn-description');
		if (descBtn) {
			e.preventDefault();
			e.stopPropagation();
			const card = descBtn.closest('.flip-card');
			if (card) card.classList.add('flipped');
			return;
		}

		// Bouton Retour
		const returnBtn = e.target.closest('.flip-btn-return');
		if (returnBtn) {
			e.preventDefault();
			e.stopPropagation();
			const card = returnBtn.closest('.flip-card');
			if (card) card.classList.remove('flipped');
		}
	});

});
