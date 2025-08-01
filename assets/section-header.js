if ( typeof MainHeader !== 'function' ) {

	class MainHeader extends HTMLElement {

		constructor() {
			super();
			this.mount();
		}

		mount(){

			/* -- > DRAWERS < -- */

			document.querySelectorAll('#main > div').forEach(elm=>{
				if ( ! elm.classList.contains('no-inert') ) {
					elm.setAttribute('data-js-inert', '');
				}
			})
			window.inertElems = document.querySelectorAll('[data-js-inert]');

			// drawer connections

			document.querySelectorAll('[data-js-sidebar-handle]').forEach(elm => {
				if ( elm.hasAttribute('aria-controls') ) {
					const elmSidebar = document.getElementById(elm.getAttribute('aria-controls'));
					if ( elm.hasAttribute('data-js-sidebar-handle-direction') ) {
						elmSidebar.setAttribute('data-direction', elm.getAttribute('data-js-sidebar-handle-direction'));
					}
					elm.addEventListener('click', e=>{
						e.preventDefault();
						elm.setAttribute('aria-expanded', 'true');
						elmSidebar.show();
					})
					elm.addEventListener('keyup', e=>{
						if ( e.keyCode == window.KEYCODES.RETURN ) {
							elm.setAttribute('aria-expanded', 'true');
							elmSidebar.show();
							elmSidebar.querySelector('[data-js-close]').focus();
						}
					})
				}
			});
			if ( this.classList.contains('site-header--alignment-left') ) {
				document.getElementById('site-search-sidebar').classList.remove('sidebar--left');
				document.getElementById('site-search-sidebar').classList.add('sidebar--right');
			}
			
			// closing drawers

			document.querySelectorAll('sidebar-drawer [data-js-close]').forEach(elm=>{
				elm.addEventListener('click', e=>{
					e.preventDefault();
					if ( e.target.closest('.sidebar').classList.contains('sidebar--opened') ) {
						e.target.closest('.sidebar').hide();
					}
				});
			});
			document.querySelector('.site-overlay').addEventListener('click', ()=>{
				if ( document.querySelector('.sidebar--opened') ) {
					document.querySelector('.sidebar--opened').hide();
				}
			});
			document.addEventListener('keydown', e=>{
				if ( e.keyCode == window.KEYCODES.ESC ) {
					if ( document.querySelector('.sidebar--opened') ) {
						document.querySelector('.sidebar--opened').hide();
					}
				}
			});

			// resizing drawers

			const rootHeight = document.getElementById('root-height');
			this.RESIZE_SidebarHelper = debounce(()=>{
				rootHeight.innerHTML = `:root {
					--window-height: ${window.innerHeight}px;
					--window-width: ${document.body.clientWidth}px;
					--sidebar-width: ${window.innerWidth}px;
				}`;
			}, 200);
			window.addEventListener('resize', this.RESIZE_SidebarHelper);
			rootHeight.innerHTML = `:root {
				--window-height: ${window.innerHeight}px;
				--window-width: ${document.body.clientWidth}px;
			}`;
			document.body.classList.add('header-loaded');

			// switch menu (on load and on resize)
			this._previousWidth = window.innerWidth;
			this._adjustNavLayout();

			window.addEventListener('resize', ()=>{
				const currentWidth = window.innerWidth;
				if ( currentWidth < this._previousWidth ) {
					this._adjustNavLayout();
				}
				this._previousWidth = currentWidth;
			});

			// submenu animations

			const siteHeader = document.getElementById('site-header');
			let submenuOpenHandle = true;

			document.querySelectorAll('.site-nav.style--classic .top-level-link > .menu-link').forEach(elm=>{
				
				elm.addEventListener('click', e=>{

					const link = elm.parentElement;

					if ( link.classList.contains('has-submenu') ) {
						e.preventDefault();
					}


					let differentMenu = false;
					if ( link.classList.contains('has-submenu') && siteHeader.querySelectorAll('.has-submenu.focus')[0] ) {
						differentMenu = true;
						siteHeader.querySelectorAll('.has-submenu.focus').forEach(focused=>{
							focused.classList.remove('focus');
						});
						siteHeader.classList.remove('submenu-focus');
						siteHeader.setAttribute('style', `--submenu-height: 0px`);
					}

					let ableToOpen = true;
					if ( link.classList.contains('focus') ) {
						ableToOpen = false;
					} else {
						if ( ! differentMenu ) {
							setTimeout(()=>{
								submenuOpenHandle = false;
							}, 50);
						}
					}

					siteHeader.querySelectorAll('.has-submenu.focus').forEach(focused=>{
						focused.classList.remove('focus');
					});
					siteHeader.classList.remove('submenu-focus');
					siteHeader.setAttribute('style', `--submenu-height: 0px`);
					
					if ( ableToOpen && link.classList.contains('has-submenu') ) {
						document.body.classList.add('add-submenu-overlay');
						link.classList.add('focus');
						siteHeader.setAttribute('style', `--submenu-height:${link.querySelector('.submenu').offsetHeight}px`);
						siteHeader.classList.add('submenu-focus');
					} else {
						document.body.classList.remove('add-submenu-overlay');
						submenuOpenHandle = true;
					}

				});
			});
			
			siteHeader.addEventListener('click', e=>{
				if ( e.target.closest('.submenu') || e.target.classList.contains('submenu') ) {
					//
				} else if ( ! submenuOpenHandle ) {
					document.body.classList.remove('add-submenu-overlay');
					siteHeader.querySelectorAll('.has-submenu.focus').forEach(elm=>{
						elm.classList.remove('focus');
					});
					siteHeader.classList.remove('submenu-focus');
					siteHeader.setAttribute('style', `--submenu-height: 0px`);
					submenuOpenHandle = true;
				}
			});

			document.querySelector('.header-overlay').addEventListener('click', ()=>{
				document.body.classList.remove('add-submenu-overlay');
				siteHeader.querySelectorAll('.has-submenu.focus').forEach(elm=>{
					elm.classList.remove('focus');
				});
				siteHeader.classList.remove('submenu-focus');
				siteHeader.setAttribute('style', `--submenu-height: 0px`);
				submenuOpenHandle = true;
			});

			// predictive search

			if ( JSON.parse(document.getElementById('shopify-features').text).predictiveSearch ) {

				// predictive search (sidebar)

				document.querySelectorAll('[data-js-open-search-drawer').forEach(elm=>{
					elm.addEventListener('click', e=>{
						e.preventDefault();
						if ( ! document.body.classList.contains('predictive-script-loaded') ) {
							document.body.classList.add('predictive-script-loaded')
							const predictiveSearchJS = document.createElement('script');
							predictiveSearchJS.src = KROWN.settings.predictive_search_script;
							document.head.appendChild(predictiveSearchJS); 
						}
						setTimeout(()=>{
							document.querySelector('#search-form-sidebar').focus();
						}, 200)
					});
				});

			} else {

				this.querySelector('search-form').addEventListener('click', e=>{
					e.preventDefault();
					window.location.href = KROWN.settings.routes.search_url;
				});

			}

			// tab navigation for the menu

			document.querySelectorAll('.site-nav.style--classic .has-submenu > a').forEach(childEl=>{

				const elm = childEl.parentNode;

				elm.addEventListener('keydown', e=>{

					if ( e.keyCode == window.KEYCODES.RETURN ) {
						if ( ! e.target.classList.contains('no-focus-link') ) {
							e.preventDefault();
						}
						if ( ! elm.classList.contains('focus') ) {

							elm.classList.add('focus');
							elm.setAttribute('aria-expanded', 'true');

							document.body.classList.add('add-submenu-overlay');
							siteHeader.setAttribute('style', `--submenu-height:${elm.querySelector('.submenu').offsetHeight}px`);
							siteHeader.classList.add('submenu-focus');

						} else if ( document.activeElement.parentNode.classList.contains('has-submenu') && elm.classList.contains('focus') ) {

							elm.classList.remove('focus');
							elm.setAttribute('aria-expanded', 'false');

							siteHeader.classList.remove('submenu-focus');
							siteHeader.setAttribute('style', `--submenu-height: 0px`);
							document.body.classList.remove('add-submenu-overlay');

						}
					}
				});	

				const submenuLinks = elm.querySelectorAll('.submenu-masonry a[href]');
				if ( submenuLinks[0] ) {
					submenuLinks[submenuLinks.length-1].addEventListener('focusout', (e)=>{
						if ( elm.classList.contains('focus') ) {
							elm.classList.remove('focus');
							elm.setAttribute('aria-expanded', 'false');
							siteHeader.classList.remove('submenu-focus');
							siteHeader.setAttribute('style', `--submenu-height: 0px`);
							document.body.classList.remove('add-submenu-overlay');
						}
					});
				}

			});

		}

		unmount(){
			window.removeEventListener('resize', this.RESIZE_SidebarHelper);
		}
		
		_adjustNavLayout() {

			if ( this.querySelector('.site-nav') && this.querySelector('.site-nav').classList.contains('style--classic') ) {
				const siteNavWidth = this.classList.contains('site-header--grid-one-row') ? this.querySelector('.site-nav').offsetWidth - 20 : this.querySelector('nav').offsetWidth + 20;
				if ( this.querySelector('nav > ul').scrollWidth >= siteNavWidth ) {
					this.classList.add('site-header--swap-menu-style');
					document.body.classList.remove('header--has-two-rows');
					let header = document.getElementById('site-header');
					let twoRowsDetected = header.querySelectorAll('[class*="two-rows"]');
					twoRowsDetected.forEach(el=>{
						el.className = el.className.replace('two-rows', 'one-row');
					});
					if ( this.classList.contains('site-header--alignment-center') ) {
					document.getElementById('site-menu-sidebar').setAttribute('data-direction', 'left');
					}
				}
			}
		}

	}
	
  if ( typeof customElements.get('main-header') == 'undefined' ) {
		customElements.define('main-header', MainHeader);
	}

}

if ( typeof SidebarDrawer !== 'function' ) {

	class SidebarDrawer extends HTMLElement {

		constructor(){
			super();
			this.querySelector('[data-js-close]').addEventListener('click', ()=>{
				this.hide();
			});
			document.addEventListener('keydown', e=>{
				if ( e.keyCode == window.KEYCODES.ESC ) {
					const openedSidebar = document.querySelector('sidebar-drawer.sidebar--opened');
					if ( openedSidebar ){
						openedSidebar.hide();
					}
				}
			});
		}

		/* 
			* generic hide/show functions 
		*/

		show(){

			this._opened = true;
			document.body.classList.add('sidebar-opened');
			document.body.classList.add('sidebar-opened-set-header-index');
			if ( this.dataset.direction == 'right' ) {
				document.body.classList.add('sidebar-opened--right');
			} else if ( this.dataset.direction== 'left' ) {
				document.body.classList.add('sidebar-opened--left');
			}
			if ( this.id == 'site-cart-sidebar' && document.querySelector('#cart-recommendations-sidebar css-slider') ) {
				setTimeout(()=>{
					document.querySelector('#cart-recommendations-sidebar css-slider').resetSlider();
				}, 10);
			}
			this.style.display = 'grid';
			setTimeout(()=>{
				this.classList.add('sidebar--opened');
				window.inertElems.forEach(elm=>{
					elm.setAttribute('inert', '');
				})
			}, 15);

		}

		hide(){

			this._opened = false;
			this.classList.remove('sidebar--opened');

			document.body.classList.remove('sidebar-opened');
			document.body.classList.remove('sidebar-opened--left');
			document.body.classList.remove('sidebar-opened--right');
			window.inertElems.forEach(elm=>{
				elm.removeAttribute('inert');
			})

			document.querySelector(`[aria-controls="${this.id}"]`)?.setAttribute('aria-expanded', 'false');

			setTimeout(()=>{
				this.style.display = 'none';
			}, 501);

			setTimeout(()=>{
				document.body.classList.remove('sidebar-opened-set-header-index');
			}, 301);

		}

	}


  if ( typeof customElements.get('sidebar-drawer') == 'undefined' ) {
		customElements.define('sidebar-drawer', SidebarDrawer);
	}

}

if ( typeof MobileNavigation !== 'function' ) {
		
	class MobileNavigation extends HTMLElement {

		constructor() {

			super();

			this._openedFirstSubmenu = false;
			this._openedSecondSubmenu = false;

			const animationsTimer = 195;
			const animationsTimerDelayed = 235;

			this.querySelectorAll('.has-submenu > a').forEach(elm=>{
				elm.addEventListener('click', e=>{
					e.preventDefault();
					this._handlePointerEvents();
					if ( ! this._openedFirstSubmenu ) {

						this._openedFirstSubmenu = true;
						this.classList.add('opened-first-submenu');
						this.closest('sidebar-drawer').scrollTo({top: 0});
						e.target.closest('nav').classList.add('opened-nav');

						this.querySelectorAll('nav').forEach(elm=>{
							this._animate(
								elm, 
								{translateX: 0, opacity: 1},
								{translateX: -50, opacity: 0},
								animationsTimer, 0
							);
							if ( elm.classList.contains('opened-nav') ) {
								setTimeout(()=>{
									elm.style.transform = `translateX(-100%)`;
									elm.style.opacity = 1;
								}, animationsTimerDelayed);
							} else {
								setTimeout(()=>{
									elm.style.maxHeight = 0;
								}, animationsTimerDelayed);
							}
						});

						this._animate(
							e.target.closest('li').querySelector('.submenu'), 
							{translateX: 150, opacity: 0},
							{translateX: 100, opacity: 1},
							animationsTimer, animationsTimer
						);
						
					}
					e.target.closest('li').classList.add('opened');
					this._resizeContainer();
				})
			});

			this.querySelectorAll('.has-babymenu > a').forEach(elm=>{
				elm.addEventListener('click', e=>{
					e.preventDefault();
					this._handlePointerEvents();
					if ( ! this._openedSecondSubmenu ) {

						this._openedSecondSubmenu = true;
						this.classList.add('opened-second-submenu')
						this.closest('sidebar-drawer').scrollTo({top: 0});

						this._animate(
							e.target.closest('nav.opened-nav'), 
							{translateX: -100, opacity: 1},
							{translateX: -150, opacity: 0},
							animationsTimer, 0
						);
						setTimeout(()=>{
							e.target.closest('nav.opened-nav').style.transform = `translateX(-200%)`;
							e.target.closest('nav.opened-nav').style.opacity = 1;
						}, animationsTimerDelayed)

						this._animate(
							e.target.closest('li').querySelector('.babymenu'), 
							{translateX: 150, opacity: 0},
							{translateX: 100, opacity: 1},
							animationsTimer, animationsTimer
						);

					}
					e.target.closest('li').classList.add('opened');
					this._resizeContainer();
				})
			});

			this.querySelectorAll('.submenu-back a').forEach(elm=>{
				elm.addEventListener('click', e=>{
					e.preventDefault();
					this._handlePointerEvents();
					if ( this._openedSecondSubmenu ) {

						this._animate(
							this.querySelector('nav.opened-nav .has-babymenu.opened .babymenu'), 
							{translateX: 100, opacity: 1},
							{translateX: 150, opacity: 0},
							animationsTimer, 0
						);

						setTimeout(()=>{
							this._animate(
								this.querySelector('nav.opened-nav'), 
								{translateX: -150, opacity: 0},
								{translateX: -100, opacity: 1},
								animationsTimer, 0
							);
						}, animationsTimer);

						setTimeout(()=>{
							this._openedSecondSubmenu = false;
							this.classList.remove('opened-second-submenu');
							this._resizeContainer();
							this.classList.remove('reverse-second');
						}, animationsTimerDelayed);

					} else if ( this._openedFirstSubmenu ) {

						this._animate(
							this.querySelector('nav.opened-nav .has-submenu.opened .submenu'), 
							{translateX: 100, opacity: 1},
							{translateX: 150, opacity: 0},
							animationsTimer, 0
						);

						setTimeout(()=>{
							this.querySelectorAll('nav').forEach(elm=>{
								this._animate(
									elm, 
									{translateX: -50, opacity: 0},
									{translateX: 0, opacity: 1},
									animationsTimer, 0
								);
								elm.style.maxHeight = '100%';
							})
						}, animationsTimer);
						
						setTimeout(()=>{
							this._openedFirstSubmenu = false;
							this.classList.remove('opened-first-submenu');
							this._resizeContainer(true);
							this.querySelector('nav.opened-nav').classList.remove('opened-nav');
						}, animationsTimerDelayed);

					}
					this.closest('sidebar-drawer').scrollTo({top: 0});
					setTimeout(()=>{
						e.target.closest('li.opened').classList.remove('opened');
					}, animationsTimerDelayed);
					e.preventDefault();
				})

			});

		}

		_resizeContainer(main=false){
			if ( main ) {
				this.style.height = `auto`;
			} else {
				if ( this._openedSecondSubmenu ) {
					this.style.height = `${this.querySelector('.has-babymenu.opened .babymenu').scrollHeight}px`;
				} else if ( this._openedFirstSubmenu ) {
					this.style.height = `${this.querySelector('.has-submenu.opened .submenu').scrollHeight}px`;
				}  
			}
		}

		_handlePointerEvents(){
			this.style.pointerEvents = 'none';
			setTimeout(()=>{
				this.style.pointerEvents = 'all';
			}, 300);
		}

		_animate(element, startProperties, endProperties, duration, delay = 0, easing = t => t){

			const initialProperties = {
				translateX: startProperties.translateX,
				opacity: startProperties.opacity,
				maxHeight: startProperties.maxHeight
			}; 
				
			if (startProperties.translateX !== undefined) {
				element.style.transform = `translateX(${startProperties.translateX})`;
			}
			if (startProperties.opacity !== undefined) {
				element.style.opacity = startProperties.opacity;
			}
			if (startProperties.maxHeight !== undefined) {
				element.style.maxHeight = startProperties.maxHeight;
			}

			const animationsEasing = (n) => {
  			return --n * n * n + 1;
			}

			setTimeout(() => {

        const startTime = performance.now();

				const deltas = {
					translateX: endProperties.translateX !== undefined ? parseFloat(endProperties.translateX) - parseFloat(initialProperties.translateX) : undefined,
					opacity: endProperties.opacity !== undefined ? endProperties.opacity - initialProperties.opacity : undefined,
					maxHeight: endProperties.maxHeight ? parseFloat(endProperties.maxHeight) - parseFloat(initialProperties.maxHeight) : undefined
				};

				const updateProperties = progress => {
					const easedProgress = animationsEasing(progress);
					if (deltas.translateX !== undefined) {
						const currentTranslateX = parseFloat(initialProperties.translateX) + deltas.translateX * easedProgress;
						element.style.transform = `translateX(${currentTranslateX}%)`;
					}
					
					if (deltas.opacity !== undefined) {
						const currentOpacity = initialProperties.opacity + deltas.opacity * easedProgress;
						element.style.opacity = currentOpacity;
					}

					if (deltas.maxHeight !== undefined) {
						const currentMaxHeight = parseFloat(initialProperties.maxHeight) + deltas.maxHeight * easedProgress;
						element.style.maxHeight = `${currentMaxHeight}%`;
					}
				};

				const animationStep = timestamp => {
					const elapsed = timestamp - startTime;
					let progress = Math.min(elapsed / duration, 1);
					updateProperties(progress);
					if (progress >= .9) {	
						if (endProperties.translateX !== undefined) {
							element.style.transform = `translateX(${endProperties.translateX})`;
						}
						if (endProperties.opacity !== undefined) {
							element.style.opacity = endProperties.opacity;
						}
						if (endProperties.maxHeight !== undefined) {
							element.style.maxHeight = endProperties.maxHeight;
						}
					} else {
						requestAnimationFrame(animationStep);
					}
				};

				requestAnimationFrame(animationStep);

    	}, delay);

		}

	}

  if ( typeof customElements.get('mobile-navigation') == 'undefined' ) {
		customElements.define('mobile-navigation', MobileNavigation);
	}

}