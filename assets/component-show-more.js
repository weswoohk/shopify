if ( typeof ShowMore !== 'function' ) {

	class ShowMore extends HTMLElement {

		constructor(){
			super();
			this.init();	
		}

		init() {

			const toggle = this.querySelector('[data-js-show-more-toggle');	
			const panel = this.querySelector('[data-js-show-more-panel]');
			const panelHeight = panel.scrollHeight;

			this.classList.remove('active', 'disabled');
			toggle.removeEventListener('click', this.onClickHandler);
			
			this.onClickHandler = e=>{
				if ( ! this.classList.contains('active') ) {
					this.classList.add('active');
					panel.removeAttribute('inert');
					e.currentTarget.querySelector('.button__text').innerHTML = KROWN.settings.locales.show_less;
					panel.style.maxHeight = `${panel.scrollHeight}px`;
					setTimeout(()=>{
						panel.style.maxHeight = `initial`;
					}, 510);
				} else {
					this.classList.remove('active');
					panel.setAttribute('inert', '');
					e.currentTarget.querySelector('.button__text').innerHTML = KROWN.settings.locales.show_more;
					panel.style.maxHeight = `${panel.scrollHeight}px`;
					setTimeout(()=>{
						panel.style.maxHeight = `var(--height)`;
					}, 10);
				}
			}

			if ( panelHeight <= parseInt(this.dataset.height)+10 ) {
				this.classList.add('active', 'disabled');
				this.classList.add('show-more--active-not-active', 'disabled');
			} else {
				toggle.addEventListener('click', this.onClickHandler);
				panel.setAttribute('inert', '');
			}

			toggle.classList.add('init');

		}

	}

  if ( typeof customElements.get('show-more') == 'undefined' ) {
    customElements.define('show-more', ShowMore);
	}

}