/* Carrd Site JS | carrd.co | License: MIT */

(function() {

	// Main.
		var	on = addEventListener,
			off = removeEventListener,
			$ = function(q) { return document.querySelector(q) },
			$$ = function(q) { return document.querySelectorAll(q) },
			$body = document.body,
			$inner = $('.inner'),
			client = (function() {
		
				var o = {
						browser: 'other',
						browserVersion: 0,
						os: 'other',
						osVersion: 0,
						mobile: false,
						canUse: null,
						flags: {
							lsdUnits: false,
						},
					},
					ua = navigator.userAgent,
					a, i;
		
				// browser, browserVersion.
					a = [
						[
							'firefox',
							/Firefox\/([0-9\.]+)/
						],
						[
							'edge',
							/Edge\/([0-9\.]+)/
						],
						[
							'safari',
							/Version\/([0-9\.]+).+Safari/
						],
						[
							'chrome',
							/Chrome\/([0-9\.]+)/
						],
						[
							'chrome',
							/CriOS\/([0-9\.]+)/
						],
						[
							'ie',
							/Trident\/.+rv:([0-9]+)/
						]
					];
		
					for (i=0; i < a.length; i++) {
		
						if (ua.match(a[i][1])) {
		
							o.browser = a[i][0];
							o.browserVersion = parseFloat(RegExp.$1);
		
							break;
		
						}
		
					}
		
				// os, osVersion.
					a = [
						[
							'ios',
							/([0-9_]+) like Mac OS X/,
							function(v) { return v.replace('_', '.').replace('_', ''); }
						],
						[
							'ios',
							/CPU like Mac OS X/,
							function(v) { return 0 }
						],
						[
							'ios',
							/iPad; CPU/,
							function(v) { return 0 }
						],
						[
							'android',
							/Android ([0-9\.]+)/,
							null
						],
						[
							'mac',
							/Macintosh.+Mac OS X ([0-9_]+)/,
							function(v) { return v.replace('_', '.').replace('_', ''); }
						],
						[
							'windows',
							/Windows NT ([0-9\.]+)/,
							null
						],
						[
							'undefined',
							/Undefined/,
							null
						]
					];
		
					for (i=0; i < a.length; i++) {
		
						if (ua.match(a[i][1])) {
		
							o.os = a[i][0];
							o.osVersion = parseFloat( a[i][2] ? (a[i][2])(RegExp.$1) : RegExp.$1 );
		
							break;
		
						}
		
					}
		
					// Hack: Detect iPads running iPadOS.
						if (o.os == 'mac'
						&&	('ontouchstart' in window)
						&&	(
		
							// 12.9"
								(screen.width == 1024 && screen.height == 1366)
							// 10.2"
								||	(screen.width == 834 && screen.height == 1112)
							// 9.7"
								||	(screen.width == 810 && screen.height == 1080)
							// Legacy
								||	(screen.width == 768 && screen.height == 1024)
		
						))
							o.os = 'ios';
		
				// mobile.
					o.mobile = (o.os == 'android' || o.os == 'ios');
		
				// canUse.
					var _canUse = document.createElement('div');
		
					o.canUse = function(property, value) {
		
						var style;
		
						// Get style.
							style = _canUse.style;
		
						// Property doesn't exist? Can't use it.
							if (!(property in style))
								return false;
		
						// Value provided?
							if (typeof value !== 'undefined') {
		
								// Assign value.
									style[property] = value;
		
								// Value is empty? Can't use it.
									if (style[property] == '')
										return false;
		
							}
		
						return true;
		
					};
		
				// flags.
					o.flags.lsdUnits = o.canUse('width', '100dvw');
		
				return o;
		
			}()),
			ready = {
				list: [],
				add: function(f) {
					this.list.push(f);
				},
				run: function() {
					this.list.forEach((f) => {
						f();
					});
				},
			},
			trigger = function(t) {
				dispatchEvent(new Event(t));
			},
			cssRules = function(selectorText) {
		
				var ss = document.styleSheets,
					a = [],
					f = function(s) {
		
						var r = s.cssRules,
							i;
		
						for (i=0; i < r.length; i++) {
		
							if (r[i] instanceof CSSMediaRule && matchMedia(r[i].conditionText).matches)
								(f)(r[i]);
							else if (r[i] instanceof CSSStyleRule && r[i].selectorText == selectorText)
								a.push(r[i]);
		
						}
		
					},
					x, i;
		
				for (i=0; i < ss.length; i++)
					f(ss[i]);
		
				return a;
		
			},
			escapeHtml = function(s) {
		
				// Blank, null, or undefined? Return blank string.
					if (s === ''
					||	s === null
					||	s === undefined)
						return '';
		
				// Escape HTML characters.
					var a = {
						'&': '&amp;',
						'<': '&lt;',
						'>': '&gt;',
						'"': '&quot;',
						"'": '&#39;',
					};
		
					s = s.replace(/[&<>"']/g, function(x) {
						return a[x];
					});
		
				return s;
		
			},
			thisHash = function() {
		
				var h = location.hash ? location.hash.substring(1) : null,
					a;
		
				// Null? Bail.
					if (!h)
						return null;
		
				// Query string? Move before hash.
					if (h.match(/\?/)) {
		
						// Split from hash.
							a = h.split('?');
							h = a[0];
		
						// Update hash.
							history.replaceState(undefined, undefined, '#' + h);
		
						// Update search.
							window.location.search = a[1];
		
					}
		
				// Prefix with "x" if not a letter.
					if (h.length > 0
					&&	!h.match(/^[a-zA-Z]/))
						h = 'x' + h;
		
				// Convert to lowercase.
					if (typeof h == 'string')
						h = h.toLowerCase();
		
				return h;
		
			},
			scrollToElement = function(e, style, duration) {
		
				var y, cy, dy,
					start, easing, offset, f;
		
				// Element.
		
					// No element? Assume top of page.
						if (!e)
							y = 0;
		
					// Otherwise ...
						else {
		
							offset = (e.dataset.scrollOffset ? parseInt(e.dataset.scrollOffset) : 0) * parseFloat(getComputedStyle(document.documentElement).fontSize);
		
							switch (e.dataset.scrollBehavior ? e.dataset.scrollBehavior : 'default') {
		
								case 'default':
								default:
		
									y = e.offsetTop + offset;
		
									break;
		
								case 'center':
		
									if (e.offsetHeight < window.innerHeight)
										y = e.offsetTop - ((window.innerHeight - e.offsetHeight) / 2) + offset;
									else
										y = e.offsetTop - offset;
		
									break;
		
								case 'previous':
		
									if (e.previousElementSibling)
										y = e.previousElementSibling.offsetTop + e.previousElementSibling.offsetHeight + offset;
									else
										y = e.offsetTop + offset;
		
									break;
		
							}
		
						}
		
				// Style.
					if (!style)
						style = 'smooth';
		
				// Duration.
					if (!duration)
						duration = 750;
		
				// Instant? Just scroll.
					if (style == 'instant') {
		
						window.scrollTo(0, y);
						return;
		
					}
		
				// Get start, current Y.
					start = Date.now();
					cy = window.scrollY;
					dy = y - cy;
		
				// Set easing.
					switch (style) {
		
						case 'linear':
							easing = function (t) { return t };
							break;
		
						case 'smooth':
							easing = function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 };
							break;
		
					}
		
				// Scroll.
					f = function() {
		
						var t = Date.now() - start;
		
						// Hit duration? Scroll to y and finish.
							if (t >= duration)
								window.scroll(0, y);
		
						// Otherwise ...
							else {
		
								// Scroll.
									window.scroll(0, cy + (dy * easing(t / duration)));
		
								// Repeat.
									requestAnimationFrame(f);
		
							}
		
					};
		
					f();
		
			},
			scrollToTop = function() {
		
				// Scroll to top.
					scrollToElement(null);
		
			},
			loadElements = function(parent) {
		
				var a, e, x, i;
		
				// IFRAMEs.
		
					// Get list of unloaded IFRAMEs.
						a = parent.querySelectorAll('iframe[data-src]:not([data-src=""])');
		
					// Step through list.
						for (i=0; i < a.length; i++) {
		
							// Load.
								a[i].contentWindow.location.replace(a[i].dataset.src);
		
							// Save initial src.
								a[i].dataset.initialSrc = a[i].dataset.src;
		
							// Mark as loaded.
								a[i].dataset.src = '';
		
						}
		
				// Video.
		
					// Get list of videos (autoplay).
						a = parent.querySelectorAll('video[autoplay]');
		
					// Step through list.
						for (i=0; i < a.length; i++) {
		
							// Play if paused.
								if (a[i].paused)
									a[i].play();
		
						}
		
				// Autofocus.
		
					// Get first element with data-autofocus attribute.
						e = parent.querySelector('[data-autofocus="1"]');
		
					// Determine type.
						x = e ? e.tagName : null;
		
						switch (x) {
		
							case 'FORM':
		
								// Get first input.
									e = e.querySelector('.field input, .field select, .field textarea');
		
								// Found? Focus.
									if (e)
										e.focus();
		
								break;
		
							default:
								break;
		
						}
		
				// Embeds.
		
					// Get unloaded embeds.
						a = parent.querySelectorAll('unloaded-script');
		
					// Step through list.
						for (i=0; i < a.length; i++) {
		
							// Create replacement script tag.
								x = document.createElement('script');
		
							// Set "loaded" data attribute (so we can unload this element later).
								x.setAttribute('data-loaded', '');
		
							// Set "src" attribute (if present).
								if (a[i].getAttribute('src'))
									x.setAttribute('src', a[i].getAttribute('src'));
		
							// Set text content (if present).
								if (a[i].textContent)
									x.textContent = a[i].textContent;
		
							// Replace.
								a[i].replaceWith(x);
		
						}
		
				// Everything else.
		
					// Create "loadelements" event.
						x = new Event('loadelements');
		
					// Get unloaded elements.
						a = parent.querySelectorAll('[data-unloaded]');
		
					// Step through list.
						a.forEach((element) => {
		
							// Clear attribute.
								element.removeAttribute('data-unloaded');
		
							// Dispatch event.
								element.dispatchEvent(x);
		
						});
		
			},
			unloadElements = function(parent) {
		
				var a, e, x, i;
		
				// IFRAMEs.
		
					// Get list of loaded IFRAMEs.
						a = parent.querySelectorAll('iframe[data-src=""]');
		
					// Step through list.
						for (i=0; i < a.length; i++) {
		
							// Don't unload? Skip.
								if (a[i].dataset.srcUnload === '0')
									continue;
		
							// Mark as unloaded.
		
								// IFRAME was previously loaded by loadElements()? Use initialSrc.
									if ('initialSrc' in a[i].dataset)
										a[i].dataset.src = a[i].dataset.initialSrc;
		
								// Otherwise, just use src.
									else
										a[i].dataset.src = a[i].src;
		
							// Unload.
								a[i].contentWindow.location.replace('about:blank');
		
						}
		
				// Video.
		
					// Get list of videos.
						a = parent.querySelectorAll('video');
		
					// Step through list.
						for (i=0; i < a.length; i++) {
		
							// Pause if playing.
								if (!a[i].paused)
									a[i].pause();
		
						}
		
				// Autofocus.
		
					// Get focused element.
						e = $(':focus');
		
					// Found? Blur.
						if (e)
							e.blur();
		
				// Embeds.
				// NOTE: Disabled for now. May want to bring this back later.
				/*
		
					// Get loaded embeds.
						a = parent.querySelectorAll('script[data-loaded]');
		
					// Step through list.
						for (i=0; i < a.length; i++) {
		
							// Create replacement unloaded-script tag.
								x = document.createElement('unloaded-script');
		
							// Set "src" attribute (if present).
								if (a[i].getAttribute('src'))
									x.setAttribute('src', a[i].getAttribute('src'));
		
							// Set text content (if present).
								if (a[i].textContent)
									x.textContent = a[i].textContent;
		
							// Replace.
								a[i].replaceWith(x);
		
						}
		
				*/
		
			};
		
			// Expose scrollToElement.
				window._scrollToTop = scrollToTop;
	
	// "On Load" animation.
		// Set loader timeout.
			var loaderTimeout = setTimeout(function() {
				$body.classList.add('with-loader');
			}, 500);
		
		// Create load handler.
			var loadHandler = function() {
				setTimeout(function() {
		
					// Stop loader.
						clearTimeout(loaderTimeout);
		
					// Unmark as loading.
						$body.classList.remove('is-loading');
		
					// Mark as playing.
						$body.classList.add('is-playing');
		
					// Wait for animation to complete.
						setTimeout(function() {
		
							// Remove loader.
								$body.classList.remove('with-loader');
		
							// Unmark as playing.
								$body.classList.remove('is-playing');
		
							// Mark as ready.
								$body.classList.add('is-ready');
		
						}, 1000);
		
				}, 100);
			};
		
		// Load event.
			on('load', loadHandler);
	
	// Load elements.
		// Load elements (if needed).
			loadElements(document.body);
	
	// Scroll points.
		(function() {
		
			var	scrollPointParent = function(target) {
		
					var inner;
		
					inner = $('#main > .inner');
		
					while (target && target.parentElement != inner)
						target = target.parentElement;
		
					return target;
		
				},
				scrollPointSpeed = function(scrollPoint) {
		
					let x = parseInt(scrollPoint.dataset.scrollSpeed);
		
					switch (x) {
		
						case 5:
							return 250;
		
						case 4:
							return 500;
		
						case 3:
							return 750;
		
						case 2:
							return 1000;
		
						case 1:
							return 1250;
		
						default:
							break;
		
					}
		
					return 750;
		
				},
				doNextScrollPoint = function(event) {
		
					var e, target, id;
		
					// Determine parent element.
						e = scrollPointParent(event.target);
		
						if (!e)
							return;
		
					// Find next scroll point.
						while (e && e.nextElementSibling) {
		
							e = e.nextElementSibling;
		
							if (e.dataset.scrollId) {
		
								target = e;
								id = e.dataset.scrollId;
								break;
		
							}
		
						}
		
						if (!target
						||	!id)
							return;
		
					// Redirect.
						if (target.dataset.scrollInvisible == '1')
							scrollToElement(target, 'smooth', scrollPointSpeed(target));
						else
							location.href = '#' + id;
		
				},
				doPreviousScrollPoint = function(e) {
		
					var e, target, id;
		
					// Determine parent element.
						e = scrollPointParent(event.target);
		
						if (!e)
							return;
		
					// Find previous scroll point.
						while (e && e.previousElementSibling) {
		
							e = e.previousElementSibling;
		
							if (e.dataset.scrollId) {
		
								target = e;
								id = e.dataset.scrollId;
								break;
		
							}
		
						}
		
						if (!target
						||	!id)
							return;
		
					// Redirect.
						if (target.dataset.scrollInvisible == '1')
							scrollToElement(target, 'smooth', scrollPointSpeed(target));
						else
							location.href = '#' + id;
		
				},
				doFirstScrollPoint = function(e) {
		
					var e, target, id;
		
					// Determine parent element.
						e = scrollPointParent(event.target);
		
						if (!e)
							return;
		
					// Find first scroll point.
						while (e && e.previousElementSibling) {
		
							e = e.previousElementSibling;
		
							if (e.dataset.scrollId) {
		
								target = e;
								id = e.dataset.scrollId;
		
							}
		
						}
		
						if (!target
						||	!id)
							return;
		
					// Redirect.
						if (target.dataset.scrollInvisible == '1')
							scrollToElement(target, 'smooth', scrollPointSpeed(target));
						else
							location.href = '#' + id;
		
				},
				doLastScrollPoint = function(e) {
		
					var e, target, id;
		
					// Determine parent element.
						e = scrollPointParent(event.target);
		
						if (!e)
							return;
		
					// Find last scroll point.
						while (e && e.nextElementSibling) {
		
							e = e.nextElementSibling;
		
							if (e.dataset.scrollId) {
		
								target = e;
								id = e.dataset.scrollId;
		
							}
		
						}
		
						if (!target
						||	!id)
							return;
		
					// Redirect.
						if (target.dataset.scrollInvisible == '1')
							scrollToElement(target, 'smooth', scrollPointSpeed(target));
						else
							location.href = '#' + id;
		
				};
		
			// Expose doNextScrollPoint, doPreviousScrollPoint, doFirstScrollPoint, doLastScrollPoint.
				window._nextScrollPoint = doNextScrollPoint;
				window._previousScrollPoint = doPreviousScrollPoint;
				window._firstScrollPoint = doFirstScrollPoint;
				window._lastScrollPoint = doLastScrollPoint;
		
			// Override exposed scrollToTop.
				window._scrollToTop = function() {
		
					// Scroll to top.
						scrollToElement(null);
		
					// Scroll point active?
						if (window.location.hash) {
		
							// Reset hash (via new state).
								history.pushState(null, null, '.');
		
						}
		
				};
		
			// Initialize.
		
				// Set scroll restoration to manual.
					if ('scrollRestoration' in history)
						history.scrollRestoration = 'manual';
		
				// Load event.
					on('load', function() {
		
						var initialScrollPoint, h;
		
						// Determine target.
							h = thisHash();
		
							// Contains invalid characters? Might be a third-party hashbang, so ignore it.
								if (h
								&&	!h.match(/^[a-zA-Z0-9\-]+$/))
									h = null;
		
							// Scroll point.
								initialScrollPoint = $('[data-scroll-id="' + h + '"]');
		
						// Scroll to scroll point (if applicable).
							if (initialScrollPoint)
								scrollToElement(initialScrollPoint, 'instant');
		
					});
		
			// Hashchange event.
				on('hashchange', function(event) {
		
					var scrollPoint, h, pos;
		
					// Determine target.
						h = thisHash();
		
						// Contains invalid characters? Might be a third-party hashbang, so ignore it.
							if (h
							&&	!h.match(/^[a-zA-Z0-9\-]+$/))
								return false;
		
						// Scroll point.
							scrollPoint = $('[data-scroll-id="' + h + '"]');
		
					// Scroll to scroll point (if applicable).
						if (scrollPoint)
							scrollToElement(scrollPoint, 'smooth', scrollPointSpeed(scrollPoint));
		
					// Otherwise, just scroll to top.
						else
							scrollToElement(null);
		
					// Bail.
						return false;
		
				});
		
				// Hack: Allow hashchange to trigger on click even if the target's href matches the current hash.
					on('click', function(event) {
		
						var t = event.target,
							tagName = t.tagName.toUpperCase(),
							scrollPoint;
		
						// Find real target.
							switch (tagName) {
		
								case 'IMG':
								case 'SVG':
								case 'USE':
								case 'U':
								case 'STRONG':
								case 'EM':
								case 'CODE':
								case 'S':
								case 'MARK':
								case 'SPAN':
		
									// Find ancestor anchor tag.
										while ( !!(t = t.parentElement) )
											if (t.tagName == 'A')
												break;
		
									// Not found? Bail.
										if (!t)
											return;
		
									break;
		
								default:
									break;
		
							}
		
						// Target is an anchor *and* its href is a hash?
							if (t.tagName == 'A'
							&&	t.getAttribute('href') !== null
							&&	t.getAttribute('href').substr(0, 1) == '#') {
		
								// Hash matches an invisible scroll point?
									if (!!(scrollPoint = $('[data-scroll-id="' + t.hash.substr(1) + '"][data-scroll-invisible="1"]'))) {
		
										// Prevent default.
											event.preventDefault();
		
										// Scroll to element.
											scrollToElement(scrollPoint, 'smooth', scrollPointSpeed(scrollPoint));
		
									}
		
								// Hash matches the current hash?
									else if (t.hash == window.location.hash) {
		
										// Prevent default.
											event.preventDefault();
		
										// Replace state with '#'.
											history.replaceState(undefined, undefined, '#');
		
										// Replace location with target hash.
											location.replace(t.hash);
		
									}
		
							}
		
					});
		
		})();
	
	// Browser hacks.
		// Init.
			var style, sheet, rule;
		
			// Create <style> element.
				style = document.createElement('style');
				style.appendChild(document.createTextNode(''));
				document.head.appendChild(style);
		
			// Get sheet.
				sheet = style.sheet;
		
		// Mobile.
			if (client.mobile) {
		
				// Prevent overscrolling on Safari/other mobile browsers.
				// 'vh' units don't factor in the heights of various browser UI elements so our page ends up being
				// a lot taller than it needs to be (resulting in overscroll and issues with vertical centering).
					(function() {
		
						// Lsd units available?
							if (client.flags.lsdUnits) {
		
								document.documentElement.style.setProperty('--viewport-height', '100svh');
								document.documentElement.style.setProperty('--background-height', '100lvh');
		
							}
		
						// Otherwise, use innerHeight hack.
							else {
		
								var f = function() {
									document.documentElement.style.setProperty('--viewport-height', window.innerHeight + 'px');
									document.documentElement.style.setProperty('--background-height', (window.innerHeight + 250) + 'px');
								};
		
								on('load', f);
								on('orientationchange', function() {
		
									// Update after brief delay.
										setTimeout(function() {
											(f)();
										}, 100);
		
								});
		
							}
		
					})();
		
			}
		
		// Android.
			if (client.os == 'android') {
		
				// Prevent background "jump" when address bar shrinks.
				// Specifically, this fix forces the background pseudoelement to a fixed height based on the physical
				// screen size instead of relying on "vh" (which is subject to change when the scrollbar shrinks/grows).
					(function() {
		
						// Insert and get rule.
							sheet.insertRule('body::after { }', 0);
							rule = sheet.cssRules[0];
		
						// Event.
							var f = function() {
								rule.style.cssText = 'height: ' + (Math.max(screen.width, screen.height)) + 'px';
							};
		
							on('load', f);
							on('orientationchange', f);
							on('touchmove', f);
		
					})();
		
				// Apply "is-touch" class to body.
					$body.classList.add('is-touch');
		
			}
		
		// iOS.
			else if (client.os == 'ios') {
		
				// <=11: Prevent white bar below background when address bar shrinks.
				// For some reason, simply forcing GPU acceleration on the background pseudoelement fixes this.
					if (client.osVersion <= 11)
						(function() {
		
							// Insert and get rule.
								sheet.insertRule('body::after { }', 0);
								rule = sheet.cssRules[0];
		
							// Set rule.
								rule.style.cssText = '-webkit-transform: scale(1.0)';
		
						})();
		
				// <=11: Prevent white bar below background when form inputs are focused.
				// Fixed-position elements seem to lose their fixed-ness when this happens, which is a problem
				// because our backgrounds fall into this category.
					if (client.osVersion <= 11)
						(function() {
		
							// Insert and get rule.
								sheet.insertRule('body.ios-focus-fix::before { }', 0);
								rule = sheet.cssRules[0];
		
							// Set rule.
								rule.style.cssText = 'height: calc(100% + 60px)';
		
							// Add event listeners.
								on('focus', function(event) {
									$body.classList.add('ios-focus-fix');
								}, true);
		
								on('blur', function(event) {
									$body.classList.remove('ios-focus-fix');
								}, true);
		
						})();
		
				// Apply "is-touch" class to body.
					$body.classList.add('is-touch');
		
			}
	
	// Scroll events.
		var scrollEvents = {
		
			/**
			 * Items.
			 * @var {array}
			 */
			items: [],
		
			/**
			 * Adds an event.
			 * @param {object} o Options.
			 */
			add: function(o) {
		
				this.items.push({
					element: o.element,
					triggerElement: (('triggerElement' in o && o.triggerElement) ? o.triggerElement : o.element),
					enter: ('enter' in o ? o.enter : null),
					leave: ('leave' in o ? o.leave : null),
					mode: ('mode' in o ? o.mode : 4),
					threshold: ('threshold' in o ? o.threshold : 0.25),
					offset: ('offset' in o ? o.offset : 0),
					initialState: ('initialState' in o ? o.initialState : null),
					state: false,
				});
		
			},
		
			/**
			 * Handler.
			 */
			handler: function() {
		
				var	height, top, bottom, scrollPad;
		
				// Determine values.
					if (client.os == 'ios') {
		
						height = document.documentElement.clientHeight;
						top = document.body.scrollTop + window.scrollY;
						bottom = top + height;
						scrollPad = 125;
		
					}
					else {
		
						height = document.documentElement.clientHeight;
						top = document.documentElement.scrollTop;
						bottom = top + height;
						scrollPad = 0;
		
					}
		
				// Step through items.
					scrollEvents.items.forEach(function(item) {
		
						var	elementTop, elementBottom, viewportTop, viewportBottom,
							bcr, pad, state, a, b;
		
						// No enter/leave handlers? Bail.
							if (!item.enter
							&&	!item.leave)
								return true;
		
						// No trigger element? Bail.
							if (!item.triggerElement)
								return true;
		
						// Trigger element not visible?
							if (item.triggerElement.offsetParent === null) {
		
								// Current state is active *and* leave handler exists?
									if (item.state == true
									&&	item.leave) {
		
										// Reset state to false.
											item.state = false;
		
										// Call it.
											(item.leave).apply(item.element);
		
										// No enter handler? Unbind leave handler (so we don't check this element again).
											if (!item.enter)
												item.leave = null;
		
									}
		
								// Bail.
									return true;
		
							}
		
						// Get element position.
							bcr = item.triggerElement.getBoundingClientRect();
							elementTop = top + Math.floor(bcr.top);
							elementBottom = elementTop + bcr.height;
		
						// Determine state.
		
							// Initial state exists?
								if (item.initialState !== null) {
		
									// Use it for this check.
										state = item.initialState;
		
									// Clear it.
										item.initialState = null;
		
								}
		
							// Otherwise, determine state from mode/position.
								else {
		
									switch (item.mode) {
		
										// Element falls within viewport.
											case 1:
											default:
		
												// State.
													state = (bottom > (elementTop - item.offset) && top < (elementBottom + item.offset));
		
												break;
		
										// Viewport midpoint falls within element.
											case 2:
		
												// Midpoint.
													a = (top + (height * 0.5));
		
												// State.
													state = (a > (elementTop - item.offset) && a < (elementBottom + item.offset));
		
												break;
		
										// Viewport midsection falls within element.
											case 3:
		
												// Upper limit (25%-).
													a = top + (height * (item.threshold));
		
													if (a - (height * 0.375) <= 0)
														a = 0;
		
												// Lower limit (-75%).
													b = top + (height * (1 - item.threshold));
		
													if (b + (height * 0.375) >= document.body.scrollHeight - scrollPad)
														b = document.body.scrollHeight + scrollPad;
		
												// State.
													state = (b > (elementTop - item.offset) && a < (elementBottom + item.offset));
		
												break;
		
										// Viewport intersects with element.
											case 4:
		
												// Calculate pad, viewport top, viewport bottom.
													pad = height * item.threshold;
													viewportTop = (top + pad);
													viewportBottom = (bottom - pad);
		
												// Compensate for elements at the very top or bottom of the page.
													if (Math.floor(top) <= pad)
														viewportTop = top;
		
													if (Math.ceil(bottom) >= (document.body.scrollHeight - pad))
														viewportBottom = bottom;
		
												// Element is smaller than viewport?
													if ((viewportBottom - viewportTop) >= (elementBottom - elementTop)) {
		
														state =	(
																(elementTop >= viewportTop && elementBottom <= viewportBottom)
															||	(elementTop >= viewportTop && elementTop <= viewportBottom)
															||	(elementBottom >= viewportTop && elementBottom <= viewportBottom)
														);
		
													}
		
												// Otherwise, viewport is smaller than element.
													else
														state =	(
																(viewportTop >= elementTop && viewportBottom <= elementBottom)
															||	(elementTop >= viewportTop && elementTop <= viewportBottom)
															||	(elementBottom >= viewportTop && elementBottom <= viewportBottom)
														);
		
												break;
		
									}
		
								}
		
						// State changed?
							if (state != item.state) {
		
								// Update state.
									item.state = state;
		
								// Call handler.
									if (item.state) {
		
										// Enter handler exists?
											if (item.enter) {
		
												// Call it.
													(item.enter).apply(item.element);
		
												// No leave handler? Unbind enter handler (so we don't check this element again).
													if (!item.leave)
														item.enter = null;
		
											}
		
									}
									else {
		
										// Leave handler exists?
											if (item.leave) {
		
												// Call it.
													(item.leave).apply(item.element);
		
												// No enter handler? Unbind leave handler (so we don't check this element again).
													if (!item.enter)
														item.leave = null;
		
											}
		
									}
		
							}
		
					});
		
			},
		
			/**
			 * Initializes scroll events.
			 */
			init: function() {
		
				// Bind handler to events.
					on('load', this.handler);
					on('resize', this.handler);
					on('scroll', this.handler);
		
				// Do initial handler call.
					(this.handler)();
		
			}
		};
		
		// Initialize.
			scrollEvents.init();
	
	// "On Visible" animation.
		var onvisible = {
		
			/**
			 * Effects.
			 * @var {object}
			 */
			effects: {
				'blur-in': {
					type: 'transition',
					transition: function (speed, delay) {
						return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'filter ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity) {
						this.style.opacity = 0;
						this.style.filter = 'blur(' + (0.25 * intensity) + 'rem)';
					},
					play: function() {
						this.style.opacity = 1;
						this.style.filter = 'none';
					},
				},
				'zoom-in': {
					type: 'transition',
					transition: function (speed, delay) {
						return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity, alt) {
						this.style.opacity = 0;
						this.style.transform = 'scale(' + (1 - ((alt ? 0.25 : 0.05) * intensity)) + ')';
					},
					play: function() {
						this.style.opacity = 1;
						this.style.transform = 'none';
					},
				},
				'zoom-out': {
					type: 'transition',
					transition: function (speed, delay) {
						return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity, alt) {
						this.style.opacity = 0;
						this.style.transform = 'scale(' + (1 + ((alt ? 0.25 : 0.05) * intensity)) + ')';
					},
					play: function() {
						this.style.opacity = 1;
						this.style.transform = 'none';
					},
				},
				'slide-left': {
					type: 'transition',
					transition: function (speed, delay) {
						return 'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function() {
						this.style.transform = 'translateX(100vw)';
					},
					play: function() {
						this.style.transform = 'none';
					},
				},
				'slide-right': {
					type: 'transition',
					transition: function (speed, delay) {
						return 'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function() {
						this.style.transform = 'translateX(-100vw)';
					},
					play: function() {
						this.style.transform = 'none';
					},
				},
				'flip-forward': {
					type: 'transition',
					transition: function (speed, delay) {
						return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity, alt) {
						this.style.opacity = 0;
						this.style.transformOrigin = '50% 50%';
						this.style.transform = 'perspective(1000px) rotateX(' + ((alt ? 45 : 15) * intensity) + 'deg)';
					},
					play: function() {
						this.style.opacity = 1;
						this.style.transform = 'none';
					},
				},
				'flip-backward': {
					type: 'transition',
					transition: function (speed, delay) {
						return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity, alt) {
						this.style.opacity = 0;
						this.style.transformOrigin = '50% 50%';
						this.style.transform = 'perspective(1000px) rotateX(' + ((alt ? -45 : -15) * intensity) + 'deg)';
					},
					play: function() {
						this.style.opacity = 1;
						this.style.transform = 'none';
					},
				},
				'flip-left': {
					type: 'transition',
					transition: function (speed, delay) {
						return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity, alt) {
						this.style.opacity = 0;
						this.style.transformOrigin = '50% 50%';
						this.style.transform = 'perspective(1000px) rotateY(' + ((alt ? 45 : 15) * intensity) + 'deg)';
					},
					play: function() {
						this.style.opacity = 1;
						this.style.transform = 'none';
					},
				},
				'flip-right': {
					type: 'transition',
					transition: function (speed, delay) {
						return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity, alt) {
						this.style.opacity = 0;
						this.style.transformOrigin = '50% 50%';
						this.style.transform = 'perspective(1000px) rotateY(' + ((alt ? -45 : -15) * intensity) + 'deg)';
					},
					play: function() {
						this.style.opacity = 1;
						this.style.transform = 'none';
					},
				},
				'tilt-left': {
					type: 'transition',
					transition: function (speed, delay) {
						return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity, alt) {
						this.style.opacity = 0;
						this.style.transform = 'rotate(' + ((alt ? 45 : 5) * intensity) + 'deg)';
					},
					play: function() {
						this.style.opacity = 1;
						this.style.transform = 'none';
					},
				},
				'tilt-right': {
					type: 'transition',
					transition: function (speed, delay) {
						return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity, alt) {
						this.style.opacity = 0;
						this.style.transform = 'rotate(' + ((alt ? -45 : -5) * intensity) + 'deg)';
					},
					play: function() {
						this.style.opacity = 1;
						this.style.transform = 'none';
					},
				},
				'fade-right': {
					type: 'transition',
					transition: function (speed, delay) {
						return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity) {
						this.style.opacity = 0;
						this.style.transform = 'translateX(' + (-1.5 * intensity) + 'rem)';
					},
					play: function() {
						this.style.opacity = 1;
						this.style.transform = 'none';
					},
				},
				'fade-left': {
					type: 'transition',
					transition: function (speed, delay) {
						return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity) {
						this.style.opacity = 0;
						this.style.transform = 'translateX(' + (1.5 * intensity) + 'rem)';
					},
					play: function() {
						this.style.opacity = 1;
						this.style.transform = 'none';
					},
				},
				'fade-down': {
					type: 'transition',
					transition: function (speed, delay) {
						return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity) {
						this.style.opacity = 0;
						this.style.transform = 'translateY(' + (-1.5 * intensity) + 'rem)';
					},
					play: function() {
						this.style.opacity = 1;
						this.style.transform = 'none';
					},
				},
				'fade-up': {
					type: 'transition',
					transition: function (speed, delay) {
						return  'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity) {
						this.style.opacity = 0;
						this.style.transform = 'translateY(' + (1.5 * intensity) + 'rem)';
					},
					play: function() {
						this.style.opacity = 1;
						this.style.transform = 'none';
					},
				},
				'fade-in': {
					type: 'transition',
					transition: function (speed, delay) {
						return 'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function() {
						this.style.opacity = 0;
					},
					play: function() {
						this.style.opacity = 1;
					},
				},
				'fade-in-background': {
					type: 'manual',
					rewind: function() {
		
						this.style.removeProperty('--onvisible-delay');
						this.style.removeProperty('--onvisible-background-color');
		
					},
					play: function(speed, delay) {
		
						this.style.setProperty('--onvisible-speed', speed + 's');
		
						if (delay)
							this.style.setProperty('--onvisible-delay', delay + 's');
		
						this.style.setProperty('--onvisible-background-color', 'rgba(0,0,0,0.001)');
		
					},
				},
				'zoom-in-image': {
					type: 'transition',
					target: 'img',
					transition: function (speed, delay) {
						return 'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function() {
						this.style.transform = 'scale(1)';
					},
					play: function(intensity) {
						this.style.transform = 'scale(' + (1 + (0.1 * intensity)) + ')';
					},
				},
				'zoom-out-image': {
					type: 'transition',
					target: 'img',
					transition: function (speed, delay) {
						return 'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity) {
						this.style.transform = 'scale(' + (1 + (0.1 * intensity)) + ')';
					},
					play: function() {
						this.style.transform = 'none';
					},
				},
				'focus-image': {
					type: 'transition',
					target: 'img',
					transition: function (speed, delay) {
						return  'transform ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '') + ', ' +
								'filter ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity) {
						this.style.transform = 'scale(' + (1 + (0.05 * intensity)) + ')';
						this.style.filter = 'blur(' + (0.25 * intensity) + 'rem)';
					},
					play: function(intensity) {
						this.style.transform = 'none';
						this.style.filter = 'none';
					},
				},
				'wipe-up': {
					type: 'transition',
					transition: function (speed, delay) {
						return	'mask-size ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity) {
						this.style.maskComposite = 'exclude';
						this.style.maskRepeat = 'no-repeat';
						this.style.maskImage = 'linear-gradient(0deg, black 100%, transparent 100%)';
						this.style.maskPosition = '0% 100%';
						this.style.maskSize = '100% 0%';
					},
					play: function() {
						this.style.maskSize = '110% 110%';
					},
				},
				'wipe-down': {
					type: 'transition',
					transition: function (speed, delay) {
						return	'mask-size ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity) {
						this.style.maskComposite = 'exclude';
						this.style.maskRepeat = 'no-repeat';
						this.style.maskImage = 'linear-gradient(0deg, black 100%, transparent 100%)';
						this.style.maskPosition = '0% 0%';
						this.style.maskSize = '100% 0%';
					},
					play: function() {
						this.style.maskSize = '110% 110%';
					},
				},
				'wipe-left': {
					type: 'transition',
					transition: function (speed, delay) {
						return	'mask-size ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity) {
						this.style.maskComposite = 'exclude';
						this.style.maskRepeat = 'no-repeat';
						this.style.maskImage = 'linear-gradient(90deg, black 100%, transparent 100%)';
						this.style.maskPosition = '100% 0%';
						this.style.maskSize = '0% 100%';
					},
					play: function() {
						this.style.maskSize = '110% 110%';
					},
				},
				'wipe-right': {
					type: 'transition',
					transition: function (speed, delay) {
						return	'mask-size ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity) {
						this.style.maskComposite = 'exclude';
						this.style.maskRepeat = 'no-repeat';
						this.style.maskImage = 'linear-gradient(90deg, black 100%, transparent 100%)';
						this.style.maskPosition = '0% 0%';
						this.style.maskSize = '0% 100%';
					},
					play: function() {
						this.style.maskSize = '110% 110%';
					},
				},
				'wipe-diagonal': {
					type: 'transition',
					transition: function (speed, delay) {
						return	'mask-size ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity) {
						this.style.maskComposite = 'exclude';
						this.style.maskRepeat = 'no-repeat';
						this.style.maskImage = 'linear-gradient(45deg, black 50%, transparent 50%)';
						this.style.maskPosition = '0% 100%';
						this.style.maskSize = '0% 0%';
					},
					play: function() {
						this.style.maskSize = '220% 220%';
					},
				},
				'wipe-reverse-diagonal': {
					type: 'transition',
					transition: function (speed, delay) {
						return	'mask-size ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
					},
					rewind: function(intensity) {
						this.style.maskComposite = 'exclude';
						this.style.maskRepeat = 'no-repeat';
						this.style.maskImage = 'linear-gradient(135deg, transparent 50%, black 50%)';
						this.style.maskPosition = '100% 100%';
						this.style.maskSize = '0% 0%';
					},
					play: function() {
						this.style.maskSize = '220% 220%';
					},
				},
				'pop-in': {
					type: 'animate',
					keyframes: function(intensity) {
		
						let diff = (intensity + 1) * 0.025;
		
						return [
							{
								opacity: 0,
								transform: 'scale(' + (1 - diff) + ')',
							},
							{
								opacity: 1,
								transform: 'scale(' + (1 + diff) + ')',
							},
							{
								opacity: 1,
								transform: 'scale(' + (1 - (diff * 0.25)) + ')',
								offset: 0.9,
							},
							{
								opacity: 1,
								transform: 'scale(1)',
							}
						];
		
					},
					options: function(speed) {
		
						return {
							duration: speed,
							iterations: 1,
						};
		
					},
					rewind: function() {
						this.style.opacity = 0;
					},
					play: function() {
						this.style.opacity = 1;
					},
				},
				'bounce-up': {
					type: 'animate',
					keyframes: function(intensity) {
		
						let diff = (intensity + 1) * 0.075;
		
						return [
							{
								opacity: 0,
								transform: 'translateY(' + diff + 'rem)',
							},
							{
								opacity: 1,
								transform: 'translateY(' + (-1 * diff) + 'rem)',
							},
							{
								opacity: 1,
								transform: 'translateY(' + (diff * 0.25) + 'rem)',
								offset: 0.9,
							},
							{
								opacity: 1,
								transform: 'translateY(0)',
							}
						];
		
					},
					options: function(speed) {
		
						return {
							duration: speed,
							iterations: 1,
						};
		
					},
					rewind: function() {
						this.style.opacity = 0;
					},
					play: function() {
						this.style.opacity = 1;
					},
				},
				'bounce-down': {
					type: 'animate',
					keyframes: function(intensity) {
		
						let diff = (intensity + 1) * 0.075;
		
						return [
							{
								opacity: 0,
								transform: 'translateY(' + (-1 * diff) + 'rem)',
							},
							{
								opacity: 1,
								transform: 'translateY(' + diff + 'rem)',
							},
							{
								opacity: 1,
								transform: 'translateY(' + (-1 * (diff * 0.25)) + 'rem)',
								offset: 0.9,
							},
							{
								opacity: 1,
								transform: 'translateY(0)',
							}
						];
		
					},
					options: function(speed) {
		
						return {
							duration: speed,
							iterations: 1,
						};
		
					},
					rewind: function() {
						this.style.opacity = 0;
					},
					play: function() {
						this.style.opacity = 1;
					},
				},
				'bounce-left': {
					type: 'animate',
					keyframes: function(intensity) {
		
						let diff = (intensity + 1) * 0.075;
		
						return [
							{
								opacity: 0,
								transform: 'translateX(' + diff + 'rem)',
							},
							{
								opacity: 1,
								transform: 'translateX(' + (-1 * diff) + 'rem)',
							},
							{
								opacity: 1,
								transform: 'translateX(' + (diff * 0.25) + 'rem)',
								offset: 0.9,
							},
							{
								opacity: 1,
								transform: 'translateX(0)',
							}
						];
		
					},
					options: function(speed) {
		
						return {
							duration: speed,
							iterations: 1,
						};
		
					},
					rewind: function() {
						this.style.opacity = 0;
					},
					play: function() {
						this.style.opacity = 1;
					},
				},
				'bounce-right': {
					type: 'animate',
					keyframes: function(intensity) {
		
						let diff = (intensity + 1) * 0.075;
		
						return [
							{
								opacity: 0,
								transform: 'translateX(' + (-1 * diff) + 'rem)',
							},
							{
								opacity: 1,
								transform: 'translateX(' + diff + 'rem)',
							},
							{
								opacity: 1,
								transform: 'translateX(' + (-1 * (diff * 0.25)) + 'rem)',
								offset: 0.9,
							},
							{
								opacity: 1,
								transform: 'translateX(0)',
							}
						];
		
					},
					options: function(speed) {
		
						return {
							duration: speed,
							iterations: 1,
						};
		
					},
					rewind: function() {
						this.style.opacity = 0;
					},
					play: function() {
						this.style.opacity = 1;
					},
				},
			},
		
			/**
			 * Regex.
			 * @var {RegExp}
			 */
			regex: new RegExp('([^\\s]+)', 'g'),
		
			/**
			 * Adds one or more animatable elements.
			 * @param {string} selector Selector.
			 * @param {object} settings Settings.
			 */
			add: function(selector, settings) {
		
				var	_this = this,
					style = settings.style in this.effects ? settings.style : 'fade',
					speed = parseInt('speed' in settings ? settings.speed : 0),
					intensity = parseInt('intensity' in settings ? settings.intensity : 5),
					delay = parseInt('delay' in settings ? settings.delay : 0),
					replay = 'replay' in settings ? settings.replay : false,
					stagger = 'stagger' in settings ? (parseInt(settings.stagger) >= 0 ? parseInt(settings.stagger) : false) : false,
					staggerOrder = 'staggerOrder' in settings ? settings.staggerOrder : 'default',
					staggerSelector = 'staggerSelector' in settings ? settings.staggerSelector : null,
					threshold = parseInt('threshold' in settings ? settings.threshold : 3),
					state = 'state' in settings ? settings.state : null,
					effect = this.effects[style],
					enter, leave, scrollEventThreshold;
		
				// Determine scroll event threshold.
					switch (threshold) {
		
						case 1:
							scrollEventThreshold = 0;
							break;
		
						case 2:
							scrollEventThreshold = 0.125;
							break;
		
						default:
						case 3:
							scrollEventThreshold = 0.25;
							break;
		
						case 4:
							scrollEventThreshold = 0.375;
							break;
		
						case 5:
							scrollEventThreshold = 0.475;
							break;
		
					}
		
				// Determine effect type.
					switch (effect.type) {
		
						default:
						case 'transition':
		
							// Scale intensity.
								intensity = ((intensity / 10) * 1.75) + 0.25;
		
							// Build enter handler.
								enter = function(children, staggerDelay=0) {
		
									var _this = this,
										transitionOrig;
		
									// Target provided? Use it instead of element.
										if (effect.target)
											_this = this.querySelector(effect.target);
		
									// Save original transition.
										transitionOrig = _this.style.transition;
		
									// Apply temporary styles.
										_this.style.setProperty('backface-visibility', 'hidden');
		
									// Apply transition.
										_this.style.transition = effect.transition.apply(_this, [ speed / 1000, (delay + staggerDelay) / 1000 ]);
		
									// Play.
										effect.play.apply(_this, [ intensity, !!children ]);
		
									// Delay.
										setTimeout(function() {
		
											// Remove temporary styles.
												_this.style.removeProperty('backface-visibility');
		
											// Restore original transition.
												_this.style.transition = transitionOrig;
		
										}, (speed + delay + staggerDelay) * 2);
		
								};
		
							// Build leave handler.
								leave = function(children) {
		
									var _this = this,
										transitionOrig;
		
									// Target provided? Use it instead of element.
										if (effect.target)
											_this = this.querySelector(effect.target);
		
									// Save original transition.
										transitionOrig = _this.style.transition;
		
									// Apply temporary styles.
										_this.style.setProperty('backface-visibility', 'hidden');
		
									// Apply transition.
										_this.style.transition = effect.transition.apply(_this, [ speed / 1000 ]);
		
									// Rewind.
										effect.rewind.apply(_this, [ intensity, !!children ]);
		
									// Delay.
										setTimeout(function() {
		
											// Remove temporary styles.
												_this.style.removeProperty('backface-visibility');
		
											// Restore original transition.
												_this.style.transition = transitionOrig;
		
										}, speed * 2);
		
								};
		
							break;
		
						case 'animate':
		
							// Build enter handler.
								enter = function(children, staggerDelay=0) {
		
									var _this = this,
										transitionOrig;
		
									// Target provided? Use it instead of element.
										if (effect.target)
											_this = this.querySelector(effect.target);
		
									// Delay.
										setTimeout(() => {
		
											// Call play handler on target.
												effect.play.apply(_this, [ ]);
		
											// Animate.
												_this.animate(
													effect.keyframes.apply(_this, [ intensity ]),
													effect.options.apply(_this, [ speed, delay ])
												);
		
										}, delay + staggerDelay);
		
								};
		
							// Build leave handler.
								leave = function(children) {
		
									var _this = this,
										transitionOrig;
		
									// Target provided? Use it instead of element.
										if (effect.target)
											_this = this.querySelector(effect.target);
		
									// Animate.
		
										// Create Animation object.
											let a = _this.animate(
												effect.keyframes.apply(_this, [ intensity ]),
												effect.options.apply(_this, [ speed, delay ])
											);
		
										// Play in reverse.
											a.reverse();
		
										// Add finish listener.
											a.addEventListener('finish', () => {
		
												// Call rewind handler on target.
													effect.rewind.apply(_this, [ ]);
		
											});
		
								};
		
							break;
		
						case 'manual':
		
							// Build enter handler.
								enter = function(children, staggerDelay=0) {
		
									var _this = this,
										transitionOrig;
		
									// Target provided? Use it instead of element.
										if (effect.target)
											_this = this.querySelector(effect.target);
		
									// Call play handler on target.
										effect.play.apply(_this, [ speed / 1000, (delay + staggerDelay) / 1000, intensity ]);
		
								};
		
							// Build leave handler.
								leave = function(children) {
		
									var _this = this,
										transitionOrig;
		
									// Target provided? Use it instead of element.
										if (effect.target)
											_this = this.querySelector(effect.target);
		
									// Call rewind handler on target.
										effect.rewind.apply(_this, [ intensity, !!children ]);
		
								};
		
							break;
		
					}
		
				// Step through selected elements.
					$$(selector).forEach(function(e) {
		
						var children, targetElement, triggerElement;
		
						// Stagger in use, and stagger selector is "all children"? Expand text nodes.
							if (stagger !== false
							&&	staggerSelector == ':scope > *')
								_this.expandTextNodes(e);
		
						// Get children.
							children = (stagger !== false && staggerSelector) ? e.querySelectorAll(staggerSelector) : null;
		
						// Initial rewind.
		
							// Determine target element.
								if (effect.target)
									targetElement = e.querySelector(effect.target);
								else
									targetElement = e;
		
							// Children? Rewind each individually.
								if (children)
									children.forEach(function(targetElement) {
										effect.rewind.apply(targetElement, [ intensity, true ]);
									});
		
							// Otherwise. just rewind element.
								else
									effect.rewind.apply(targetElement, [ intensity ]);
		
						// Determine trigger element.
							triggerElement = e;
		
							// Has a parent?
								if (e.parentNode) {
		
									// Parent is an onvisible trigger? Use it.
										if (e.parentNode.dataset.onvisibleTrigger)
											triggerElement = e.parentNode;
		
									// Otherwise, has a grandparent?
										else if (e.parentNode.parentNode) {
		
											// Grandparent is an onvisible trigger? Use it.
												if (e.parentNode.parentNode.dataset.onvisibleTrigger)
													triggerElement = e.parentNode.parentNode;
		
										}
		
								}
		
						// Add scroll event.
							scrollEvents.add({
								element: e,
								triggerElement: triggerElement,
								initialState: state,
								threshold: scrollEventThreshold,
								enter: children ? function() {
		
									var staggerDelay = 0,
										childHandler = function(e) {
		
											// Apply enter handler.
												enter.apply(e, [children, staggerDelay]);
		
											// Increment stagger delay.
												staggerDelay += stagger;
		
										},
										a;
		
									// Default stagger order?
										if (staggerOrder == 'default') {
		
											// Apply child handler to children.
												children.forEach(childHandler);
		
										}
		
									// Otherwise ...
										else {
		
											// Convert children to an array.
												a = Array.from(children);
		
											// Sort array based on stagger order.
												switch (staggerOrder) {
		
													case 'reverse':
		
														// Reverse array.
															a.reverse();
		
														break;
		
													case 'random':
		
														// Randomly sort array.
															a.sort(function() {
																return Math.random() - 0.5;
															});
		
														break;
		
												}
		
											// Apply child handler to array.
												a.forEach(childHandler);
		
										}
		
								} : enter,
								leave: (replay ? (children ? function() {
		
									// Step through children.
										children.forEach(function(e) {
		
											// Apply leave handler.
												leave.apply(e, [children]);
		
										});
		
								} : leave) : null),
							});
		
					});
		
			},
		
			/**
			 * Expand text nodes within an element into <text-node> elements.
			 * @param {DOMElement} e Element.
			 */
			expandTextNodes: function(e) {
		
				var s, i, w, x;
		
				// Step through child nodes.
					for (i = 0; i < e.childNodes.length; i++) {
		
						// Get child node.
							x = e.childNodes[i];
		
						// Not a text node? Skip.
							if (x.nodeType != Node.TEXT_NODE)
								continue;
		
						// Get node value.
							s = x.nodeValue;
		
						// Convert to <text-node>.
							s = s.replace(
								this.regex,
								function(x, a) {
									return '<text-node>' + escapeHtml(a) + '</text-node>';
								}
							);
		
						// Update.
		
							// Create wrapper.
								w = document.createElement('text-node');
		
							// Populate with processed text.
							// This converts our processed text into a series of new text and element nodes.
								w.innerHTML = s;
		
							// Replace original element with wrapper.
								x.replaceWith(w);
		
							// Step through wrapper's children.
								while (w.childNodes.length > 0) {
		
									// Move child after wrapper.
										w.parentNode.insertBefore(
											w.childNodes[0],
											w
										);
		
								}
		
							// Remove wrapper (now that it's no longer needed).
								w.parentNode.removeChild(w);
		
						}
		
			},
		
		};
	
	// Links: links01.
		$('#links01 > li:nth-child(1) > a').addEventListener(
			'click',
			function(event) { 
				alert("TODO: Link databases.");
			}
		);
	
	// Initialize "On Visible" animations.
		onvisible.add('#text01', { style: 'fade-up', speed: 1000, intensity: 1, threshold: 3, delay: 0, stagger: 125, staggerSelector: ':scope > *', replay: false });
		onvisible.add('#text14', { style: 'fade-in', speed: 375, intensity: 5, threshold: 3, delay: 0, replay: false });
		onvisible.add('#life-expectancy', { style: 'fade-in', speed: 375, intensity: 5, threshold: 3, delay: 0, replay: false });
		onvisible.add('#cost', { style: 'fade-in', speed: 375, intensity: 5, threshold: 3, delay: 0, replay: false });
		onvisible.add('#text10', { style: 'fade-in', speed: 375, intensity: 5, threshold: 3, delay: 0, replay: false });
		onvisible.add('#text11', { style: 'fade-in', speed: 375, intensity: 5, threshold: 3, delay: 0, replay: false });
		onvisible.add('#text12', { style: 'fade-in', speed: 375, intensity: 5, threshold: 3, delay: 0, replay: false });
		onvisible.add('#text13', { style: 'fade-in', speed: 375, intensity: 5, threshold: 3, delay: 0, replay: false });
	
	// Run ready handlers.
		ready.run();

})();