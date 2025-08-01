if ( typeof VerticalSlider !== 'function' ) {

	class VerticalSlider extends HTMLElement {

		constructor(){
			super();
      this.init();
    }

    init(){

      this.slides = [];
      this.slide = 0;
      this.querySelectorAll('.slide').forEach(elm=>{
        this.slides.push({
          parent: elm,
          children: elm.querySelector('.card'),
          media: elm.querySelectorAll('.js-parallax-media'),
          text: elm.querySelector('.card__text')
        })
      });

      this.zoom = this.hasAttribute('data-zoom') ? true : false;
      this.prlx = this.hasAttribute('data-prlx') ? true : false;

      this.siteHeader = document.querySelector('.mount-header');

      this.slideRaf = true;

      this.onScrollHandler = (()=>{
        if ( this.slideRaf ) {
          this.slideRaf = false;
          requestAnimationFrame(this.slideAnimation.bind(this));
        }
      }).bind(this);
      window.addEventListener('scroll', this.onScrollHandler, {passive:true});
      window.addEventListener('resize', this.onScrollHandler, {passive:true});
      this.onScrollHandler();

    }

    slideAnimation(e){
      
      const sliderOffset = this.parentElement.getBoundingClientRect().y+window.scrollY,
            scrollTop = window.scrollY,
            sliderHeight = Math.min(this.slides[0].children.offsetHeight, window.innerHeight + (!this.classList.contains('vertical-slider--no-padding') ? (KROWN.settings.grid_padding * 2) : 0) - (document.body.classList.contains('header-is-sticky') ? this.siteHeader.offsetHeight : 0));
            
      this.slides.forEach((item, i)=>{

        let slideY = (scrollTop - sliderOffset + (window.innerHeight - sliderHeight)) - ( sliderHeight * i ),
            slideYXZ = slideY - (window.innerHeight - sliderHeight);

        if ( item.media[0] && item.parent.getBoundingClientRect().y < window.innerHeight && item.parent.getBoundingClientRect().y > -window.innerHeight ) {
          if ( scrollTop <= sliderOffset ) {
            if ( i == 0 || (item.parent.getBoundingClientRect().y + item.parent.offsetHeight <= window.innerHeight)) {
              item.media.forEach(elm=>{
                elm.style.transform = `${this.zoom ? `scale(1)` : ''} ${this.prlx ? `translateY(0)` : ''}`;
              });
              item.children.style.transform = `scale(1)`;
            } else {
              item.media.forEach(elm=>{
                const mediaScale = (100 - (slideY * 100 / sliderHeight) / 12);
                elm.style.transform = `${this.zoom ? `scale(${Math.max(100, mediaScale)}%)` : ''} ${this.prlx ? `translateY(${mediaScale <= 100 ? 0 : slideY/2}px)` : ''}`;
              });
              item.children.style.transform = `${this.zoom ? `scale(1)` : ''}`;
            }
          } else if ( slideY < 0 ) {
            item.media.forEach(elm=>{
              elm.style.transform = `${this.zoom ? `scale(${(100 - (slideY * 100 / sliderHeight) / 12)}%)` : ''} ${this.prlx ? `translateY(${slideY/2}px)` : ''}`;
            });
          } else if ( slideY >= 0 && slideYXZ <= 0 ) {
            item.media.forEach(elm=>{
              elm.style.transform = `${this.zoom ? `scale(1)` : ''} ${this.prlx ? `translateY(0)` : ''}`;
            });
            item.children.style.transform = `${this.zoom ? `scale(1)` : ''}`;
          } else if ( slideYXZ > 0 && i != this.slides.length - 1 ) {
            item.media.forEach(elm=>{
              elm.style.transform = `${this.prlx ? `translateY(${-slideYXZ/4}px)` : ''}`;
            });
            item.children.style.transform = `${this.zoom ? `scale(${(100 - (slideYXZ * 100 / sliderHeight) / 12)}%)` : ''}`;
          } 
        }
      });

      this.slideRaf = true;

    }

  }

  if ( typeof customElements.get('vertical-slider') == 'undefined' ) {
		customElements.define('vertical-slider', VerticalSlider);
	}

}