if ( typeof ImageHotspots !== 'function' ) {

  class ImageHotspots extends HTMLElement {

    constructor() {

      super();

      // desktop

      this.querySelectorAll('[data-js-hotspot-index]').forEach(elm => {
        elm.addEventListener('click', e=>{

          this.querySelectorAll('.active').forEach(elm => {
            elm.classList.remove('active');
          });
          e.currentTarget.classList.add('active');

          // desktop detail
          const detail = this.querySelector(`[data-js-hotspot-detail][data-id="${e.currentTarget.id}"]`);
          detail.classList.add('active'); 
          if ( detail.getBoundingClientRect().top < 0 || detail.getBoundingClientRect().bottom > window.innerHeight ) {
            detail.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
          }

          // mobile detail
          const mobileDetail = this.querySelector(`[data-js-hotspot-detail-mobile][data-id="${e.currentTarget.id}"]`);
          mobileDetail.classList.add('active');

        });
      });

      this.querySelectorAll('[data-js-hotspot-detail]').forEach(elm => {
        elm.addEventListener('click', e=>{
          this.querySelectorAll('.active').forEach(elm => {
            elm.classList.remove('active');
          });
          e.currentTarget.classList.add('active');
          const hotspot = this.querySelector(`#${e.currentTarget.getAttribute('data-id')}`);
          hotspot.classList.add('active');
          if ( hotspot.getBoundingClientRect().top < 0 || hotspot.getBoundingClientRect().bottom > window.innerHeight ) {
            hotspot.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
          }
        });
      });

      // mobile
      
      const mobileHS = this.querySelector('.hotspots__details').cloneNode(true);
      mobileHS.querySelectorAll('.hotspots__details-item').forEach(elm => {
        elm.classList.add('hotspots__details-item--mobile');
        elm.removeAttribute('data-js-hotspot-detail');
        elm.setAttribute('data-js-hotspot-detail-mobile', '');
        const elmClose = document.createElement('button');
        elmClose.classList = 'hotspots__details-item-close';
        elmClose.innerHTML = KROWN.settings.symbols.close;
        elmClose.addEventListener('click', ()=>{
          elm.classList.remove('active');
          this.querySelector(`#${elm.getAttribute('data-id')}`).classList.remove('active');
        })
        elm.append(elmClose);
        this.querySelector('.hotspots').append(elm);
      });
      const mobileDetails = this.querySelectorAll('[data-js-hotspot-detail-mobile]');

      this.RESIZE_MobileHotspots = debounce(()=>{
        mobileDetails.forEach(elm => {
          elm.style.marginLeft = 0;
          if ( elm.getBoundingClientRect().left < 20 ) {
            elm.style.marginLeft = `calc(${elm.getBoundingClientRect().left * -1}px + 20px)`;
          } else if ( elm.getBoundingClientRect().left + elm.offsetWidth > window.innerWidth - 20 ) {
            elm.style.marginLeft = `calc(${( window.innerWidth - 20 - ( elm.getBoundingClientRect().left + elm.offsetWidth ) )}px)`;
          }
        })
      }, 200);
      this.RESIZE_MobileHotspots();
      window.addEventListener('resize', this.RESIZE_MobileHotspots);

    }   
  
  }

  if ( typeof customElements.get('image-hotspots') == 'undefined' ) {
    customElements.define('image-hotspots', ImageHotspots);
  }

}