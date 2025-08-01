if (typeof RotatingImages !== "function") {

	class RotatingImages extends HTMLElement {

		constructor() {
			super()
			const delay = this.dataset.delay * 1000;
			const images = this.querySelectorAll('[data-js-rotating-images-image]');
			let currentIndex = 0;
			const changeImage = () => {
				images[currentIndex].classList.remove('active');
				currentIndex = (currentIndex + 1) % images.length;
				images[currentIndex].classList.add('active');
			}
			setInterval(changeImage, delay);
		}
	}

	if (typeof customElements.get("rotating-images") == "undefined") {
		customElements.define("rotating-images", RotatingImages)
	}
	
}