if ( typeof StickyImageBlock !== 'function' ) {

	class StickyImageBlock extends HTMLElement {
		constructor(){
			super();
			const imageElements = this.querySelectorAll('.is-sticky');
			imageElements.forEach(image=>{
				const parentContainer = image.parentNode;
				const offsetX = 20;
				const offsetY = 20;
				parentContainer.addEventListener('mousemove', e => {
					const x = e.clientX + offsetX;
					const y = e.clientY + offsetY;
					image.style.left = `${x}px`;
					image.style.top = `${y}px`;
				});
			});
		}
  }

  if (typeof customElements.get("sticky-image-block") == "undefined") {
		customElements.define("sticky-image-block", StickyImageBlock);
	}

}