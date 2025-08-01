// SHOPIFY EVENTS

document.addEventListener('shopify:section:load', e=>{

	const section = e.target;

	if ( window.prlxElements ) {
		window.prlxPush(section.querySelectorAll('[data-js-prlx-parent]'));
	}
	
	if ( section.classList.contains('mount-css-slider') && section.querySelector('css-slider') ) {
		setTimeout(()=>{
			section.querySelector('css-slider').resetSlider();
			section.querySelector('css-slider').checkSlide();
		}, 50);
  }

	if ( section.classList.contains('mount-header') ) {
    section.querySelector('main-header')?.mount();
		setTimeout(()=>{
			section.querySelector('main-header')?._adjustNavLayout();
		}, 250);
	}

	if ( section.classList.contains('mount-drawer') ) {
		section.querySelector('sidebar-drawer').show();
	}

	if ( section.classList.contains('mount-vertical-slider') ) {
		section.querySelector('vertical-slider').init();
	}

	if ( section.classList.contains('mount-product-page') ) {
		const sectionId = JSON.parse(section.dataset.shopifyEditorSection).id;
		document.getElementById(`add-to-cart-${sectionId}`)?.querySelector('form').append(document.getElementById(`add-to-cart-${sectionId}`).querySelector('template').content.cloneNode(true));
		if ( section.querySelector('[data-js-variant-quantity]') && section.querySelector('product-variants') ) {
			setTimeout(()=>{
				section.querySelector('product-variants').productStock = section.querySelector('[data-js-variant-quantity]');
				section.querySelector('product-variants').productStockProgress = section.querySelector('[data-js-variant-quantity-progress]');
				section.querySelector('product-variants').updateStock();
			}, 50);
		}
		if ( section.querySelector('show-more') ) {
			const showMore = section.querySelector('show-more');
			showMore.setAttribute('style', `--height:${parseInt(window.getComputedStyle(showMore).getPropertyValue('line-height')) * parseInt(showMore.dataset.lines)}px`);
			section.querySelector('show-more')?.init();
		}
		if ( section.querySelector('product-variants') ) {
			section.querySelector('product-variants').init();
		}
	}

	if ( section.classList.contains('mount-quick-buy') ) {
		section.querySelectorAll('.product-item__quick-buy').forEach(elm=>{
			const blockId = elm.dataset.id;
			document.getElementById(`add-to-cart-${blockId}`)?.querySelector('form').append(document.getElementById(`add-to-cart-${blockId}`).querySelector('template').content.cloneNode(true));
			elm.querySelector('product-variants')?.init();
		});
	}

	if ( section.classList.contains('mount-slider-vertical') ) {
		setTimeout(()=>{
			section.querySelector('slider-vertical').init();
		}, 50);
	}

	if ( section.classList.contains('mount-countdown') ) {
		setTimeout(()=>{
			section.querySelector('countdown-clock').init();
		}, 50);
	}

	if ( section.classList.contains('mount-filters') ) {
		if ( section.querySelector('#site-filters-sidebar') ) {
			document.body.append(section.querySelector('#site-filters-sidebar'));
		}
	}

	if (document.getElementById('main').lastElementChild.querySelector('[data-hide-section-bottom-border]')) {
		document.getElementById('main').classList.add('main-content--hidden-section-bottom-border');
	}

	if ( section.classList.contains('mount-age-verification') ) {
		section.querySelector('.age-verification').style.display = 'block';
	}

	if ( section.classList.contains('mount-rotating-badges') ) {
		const rb = section.querySelector('.rotating-badge');
		rb.style.setProperty('--radius', `${(parseFloat(rb.dataset.spacing) / Math.sin(360 / parseFloat(rb.dataset.size) / (180 / Math.PI)))*10}px`);
	}

});
document.addEventListener('shopify:section:unload', e=>{

	const section = e.target;
	if ( section.classList.contains('mount-header') ) {
    section.querySelector('main-header')?.unmount();
	}

	if ( document.getElementById('main').lastElementChild.querySelector('[data-hide-section-bottom-border]') ) {
		document.getElementById('main').classList.add('main-content--hidden-section-bottom-border');
	}

});

document.addEventListener('shopify:section:select', e=>{

	const section = e.target;
	if ( section.classList.contains('mount-drawer') ) {
		section.querySelector('sidebar-drawer').show();
	}
	if ( section.classList.contains('mount-age-verification') ) {
		section.querySelector('.age-verification').style.display = 'block';
	}
	if ( section.classList.contains('mount-exit-intent-popup') ) {
		document.getElementById('exit-intent-popup').show();
  }
	if ( section.classList.contains('mount-go-top') ) {
		document.getElementById('go-top').classList.add('show');
	}

});

document.addEventListener('shopify:section:deselect', e=>{

	const section = e.target;
	if ( section.classList.contains('mount-drawer') ) {
		section.querySelector('sidebar-drawer').hide();
	}
	if ( section.classList.contains('mount-age-verification') ) {
		section.querySelector('.age-verification').style.display = 'none';
	}
	if ( section.classList.contains('mount-exit-intent-popup') ) {
		document.getElementById('exit-intent-popup').hide();
  }
	if ( section.classList.contains('mount-go-top') ) {
		document.getElementById('go-top').classList.remove('show');
	}

});

document.addEventListener('shopify:block:select', e=>{

	const block = e.target;

	if ( block.classList.contains('js-slider-item') ) {

		if ( block.closest('css-slider').classList.contains('enabled') ) {
    	block.closest('css-slider').querySelector('.css-slider-holder').scrollLeft = block.offsetLeft;
		} else {
			setTimeout(()=>{
				window.scrollTo({top: block.offsetTop});
			}, 200);
		}

	} else if ( block.classList.contains('announcement') ) {
    block.closest('[data-js-slider]').scrollTo({
      top: 0,
      left: block.offsetLeft,
      behavior: 'smooth'
    });
	} else if ( block.classList.contains('popup-block') ) {
		block.style.display = 'block';
		block.show();
	} else if ( block.classList.contains('js-info-tab') ) {
		block.closest('info-tabs').reset();
		block.classList.add('active');
		document.getElementById(`panel-${block.getAttribute('rel')}`).classList.add("active");
	} else if (block.classList.contains('js-mega-menu-item') ) {
		block.classList.toggle('focus');
	} else if ( block.classList.contains('js-vertical-slide') ) {
		// find a way to scroll into view
	}
})

document.addEventListener('shopify:block:deselect', e=>{

	const block = e.target;

	if ( block.classList.contains('popup-block') ) {
		block.hide();
	} else if (block.classList.contains('js-mega-menu-item') ) {
		block.classList.toggle('focus');
	}

})

const hackTouchEvents = ()=>{
	if ( window.innerWidth < 768 ) {
		document.body.classList.add('touchevents');
		document.body.classList.remove('no-touchevents');
	} else {
		document.body.classList.remove('touchevents');
		document.body.classList.add('no-touchevents');
	}
}

window.addEventListener('resize', ()=>{
	hackTouchEvents();
})
hackTouchEvents();

document.addEventListener('shopify:block:select', e=>{
	const block = e.target;
	if ( block.classList.contains('toggle') ) {
		if ( !block.querySelector('[data-js-title]').classList.contains('opened') ) {
			block.onClickHandler();
		}
	}
})
document.addEventListener('shopify:block:deselect', e=>{
	const block = e.target;
	if ( block.classList.contains('toggle') ) {
		if ( block.querySelector('[data-js-title]').classList.contains('opened') ) {
			block.onClickHandler();
		}
	}
})
