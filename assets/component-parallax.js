window.prlxElements = [];
window.prlxRaf = true;

if ( ! document.body.classList.contains('grid-animation--scroll-disable-parallax') ) {
  window.prlxObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, i) => {
      if ( entry.isIntersecting && entry.intersectionRatio >= 0.2 ) {
        if ( ! entry.target.classList.contains('prlx--on') ) {
          entry.target.classList.add('prlx--on');
        }
      } else if ( ! entry.isIntersecting && entry.boundingClientRect.y > 0 ){
        entry.target.classList.remove('prlx--on');
      }
    })
  }, {rootMargin: '0px 0px 0px 0px', threshold: [0, 0.3]});
}

window.addEventListener('scroll', ()=>{
  if ( window.prlxRaf ) {
    window.prlxRaf = false;
    requestAnimationFrame(window.prlxAnimation);
  }
}, {passive: true});
window.addEventListener('resize', ()=>{
  window.prlxAnimation();
}, {passive: true});

window.prlxAnimation = () => {
  window.prlxElements.forEach(item=>{
    window.prlxAnimationItem(item)
  });
  window.prlxRaf = true;
}

window.prlxAnimationItem = (item, onlyMedia = false) => {

  let elementYMOD = 0,
      elementY = item.parent ? item.parent.getBoundingClientRect().y/2 : 0;

  if ( item.media[0] ) {
    elementYMOD = window.innerHeight - item.media[0].getBoundingClientRect().y - item.media[0].offsetHeight;
  } else {
    elementYMOD = window.innerHeight - elementY - item.parent.offsetHeight
  }

  let prlxY = (Math.abs(elementYMOD) * 100 / window.innerHeight / 5);

  if ( onlyMedia ) {
    
    if ( elementYMOD <= 0 ) {
      item.media[0].style.transform = `scale(${100 + prlxY}%)`;
    } else {
      item.media[0].style.transform = `scale(100%) translateY(0%)`;
    }

  } else if ( item.parent ) {

    let prlxOffset = item.inverse ? -1 : 1;

    if ( elementY <= window.innerHeight && elementY >= item.parent.offsetHeight * -1 ) {
      if ( elementYMOD <= 0 ) {
        item.children.style.transform = `scale(${100 - prlxY*prlxOffset}%) translateY(${prlxY*prlxOffset}%)`;
        if ( item.media[0] ) {
          item.media.forEach(elm=>{
            elm.style.transform = `scale(${100 + prlxY}%)`;
          });
        }
      } else {
        item.children.style.transform = `scale(100%) translateY(0%)`;
        if ( item.media[0] ) {
          item.media.forEach(elm=>{
            elm.style.transform = `scale(100%) translateY(0%)`;
          });
        }
      }
    }

  }

}

window.prlxPush = section => {
  section.forEach(elm=>{
    if ( window.prlxObserver ) {
      if ( elm.getBoundingClientRect().y <= window.innerHeight ) {
        elm.classList.add('prlx--on');
      }
      window.prlxObserver.observe(elm);
    }
    const item = {
      parent: elm,
      children: elm.querySelector('[data-js-prlx-children]'),
      media: document.body.classList.contains('grid-animation--scroll-disable-zoom') ? null : elm.querySelectorAll('[data-js-prlx-media]')
    };
    window.prlxElements.push(item);
    window.prlxAnimationItem(item);
  });
}