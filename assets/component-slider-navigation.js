if ( typeof CSSSliderNavigation !== 'function' ) {

	class CSSSliderNavigation extends HTMLElement {
		
		constructor(){
      super();
      setTimeout(()=>{
        this.init();
      }, 500);
    }

    init(){

      this.slider = document.getElementById(`slider-${this.dataset.sliderId}`);
      const prevButton = this.querySelector('[data-js-slider-prev]'),
            nextButton = this.querySelector('[data-js-slider-next]'),
            indexElement = this.querySelector('[data-js-slider-index]');
      
      prevButton.addEventListener('click', e=>{
        this.slider.changeSlide('prev');
      });
      nextButton.addEventListener('click', e=>{
        this.slider.changeSlide('next');
      });

      prevButton.classList.add('disabled');
      this.slider.addEventListener('change', ()=>{
        nextButton.classList.remove('disabled');
        prevButton.classList.remove('disabled');
        if ( this.slider.index == 0 ) {
          prevButton.classList.add('disabled');
        } else if ( this.slider.index + 1 == this.slider.length ) { 
          nextButton.classList.add('disabled');
        }
        if ( indexElement ) {
          indexElement.textContent = this.slider.index + 1;
        }
      });
      this.reset();
      this.slider.addEventListener('reset', ()=>{
        this.reset();
      });

    }

    reset(){
      if ( this.slider.length <= 1 ) {
        this.parentElement.classList.add('hide-css-slider-navigation');
      } else {
        this.parentElement.classList.remove('hide-css-slider-navigation');
      }
    }

  }

  if ( typeof customElements.get('css-slider-navigation') == 'undefined' ) {
		customElements.define('css-slider-navigation', CSSSliderNavigation);
	}

}