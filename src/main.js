const main = document.querySelector('body main');
const navLinks = document.querySelectorAll('body header .nav-links a');
let activeLink = document.querySelector('body header .accueil-nav');

function initCarousel() {

	//CARROUSEL D'IMAGES
	document.querySelectorAll('.card-image-carousel').forEach(carousel => {
		const images = carousel.querySelectorAll('.carousel-images img');
		const leftBtn = carousel.querySelector('.carousel-arrow.left');
		const rightBtn = carousel.querySelector('.carousel-arrow.right');
		let current = 0;
		if (images.length > 0) images[0].classList.add('active');

		function showImage(idx) {
			images.forEach((img, i) => {
				img.classList.toggle('active', i === idx);
			});
		}
		leftBtn.addEventListener('click', e => {
			e.stopPropagation();
			current = (current - 1 + images.length) % images.length;
			showImage(current);
		});
		rightBtn.addEventListener('click', e => {
			e.stopPropagation();
			current = (current + 1) % images.length;
			showImage(current);
		});
	});
}

function showSection(htmlPage) {
	fetch(htmlPage)
		.then(response => response.text())
		.then(responseText => {
			if (main) {
				main.innerHTML = responseText;
				
				//the page is the experience page
				if(activeLink.classList.contains('experiences-nav')) {
					initCarousel();
				}
			}
		})
		
		.catch(error =>
			console.error('Erreur lors du chargement de la page :', error)
		);
	window.history.pushState(null, null, document.location.pathname);
}

// Chargement par défaut
showSection('html/accueil.html');

// TODO: changing the page that appears after recharging the page depending on what navlink is active
// TODO: go back forward on the website

let actualPage = document.querySelector('body header .nav-links .accueil-nav');

//changement de page
navLinks.forEach(link => {
	link.addEventListener('click', event => {
		event.preventDefault();

		actualPage.classList.remove('active-page');
		actualPage = link;
		actualPage.classList.add('active-page');

		const targetPage = link.getAttribute('href');
		if (targetPage) {
			showSection(targetPage);
			activeLink = link;
		}
	});
});
