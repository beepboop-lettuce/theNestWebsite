'use strict';
// var mainDocument = $(document);

// init foundation
// $(document).foundation();

// Init all plugin when document is ready 
$(document).on('ready', function () {
	let src;
	let i;
// 0. Init console to avoid error
	let method;
	const noop = function () {
	};
	const methods = [
		'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
		'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
		'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
		'timeStamp', 'trace', 'warn'
	];
	let length = methods.length;
	const console = (window.console = window.console || {});
	const contextWindow = $(window);
	const $root = $('html, body');
	while (length--) {
		method = methods[length];
		// Only stub undefined methods.
		if (!console[method]) {
			console[method] = noop;
		}
	}

	// 1. Background image as data attribut 
	const list = $('.bg-img');
	for (let i = 0; i < list.length; i++) {
		let src = list[i].getAttribute('data-image-src');
		list[i].style.backgroundImage = "url('" + src + "')";
		list[i].style.backgroundRepeat = "no-repeat";
		list[i].style.backgroundPosition = "center";
		list[i].style.backgroundSize = "cover";
	}
	// Image block to Background image 
	const listImgBlock = $('.img-block');
	for (let i = 0; i < listImgBlock.length; i++) {
		let src = listImgBlock[i].getAttribute('src');
		const divBlock = document.createElement("div");
		divBlock.setAttribute("class", "img");
		divBlock.style.backgroundImage = "url('" + src + "')";
		divBlock.style.backgroundRepeat = "no-repeat";
		divBlock.style.backgroundPosition = "center";
		divBlock.style.backgroundSize = "cover";
		$(listImgBlock[i]).after(divBlock);
		listImgBlock[i].style.display = "none";
	}
	// Background color as data attribut
	const listColor = $('.bg-color');
	for (i = 0; i < listColor.length; i++) {
		listColor[i].style.backgroundColor = listColor[i].getAttribute('data-bgcolor');
	}

	// 2. Init Coutdown clock
	try {
		// check if clock is initialised
		$('.clock-countdown').downCount({
			date: $('.site-config').attr('data-date'),
			offset: +10
		});
	}
	catch (error) {
		// Clock error : clock is unavailable
		console.log("clock disabled/unavailable");
	}

	// 3. Show/hide menu when icon is clicked
	const menuItems = $('.all-menu-wrapper .nav-link');
	const menuIcon = $('.menu-icon, #navMenuIcon');
	const menuBlock = $('.all-menu-wrapper');
	const reactToMenu = $('.page-main, .navbar-sidebar, .page-cover');
	const menuLinks = $(".navbar-mainmenu a, .navbar-sidebar a");
	// Menu icon clicked
	menuIcon.on('click', function () {
		menuIcon.toggleClass('menu-visible');
		menuBlock.toggleClass('menu-visible');
		menuItems.toggleClass('menu-visible');
		reactToMenu.toggleClass('menu-visible');
		return false;
	});

	// Hide menu after a menu item clicked
	menuLinks.on('click', function () {
		menuIcon.removeClass('menu-visible');
		menuBlock.removeClass('menu-visible');
		menuItems.removeClass('menu-visible');
		reactToMenu.removeClass('menu-visible');
		return true;
	});

	// 4 Carousel Slider
	
	// 4.a carousel-alpha demo
	$('.carousel-slick-alpha-demo').slick({
		dots: true
	});

	// carousel-fullscreen : fullscreen projects slider
	new Swiper('.carousel-swiper-fullscreen-demo .swiper-container', {
		pagination: '.carousel-swiper-fullscreen-demo .items-pagination',
		paginationClickable: '.carousel-fullscreen-demo .items-pagination',
		nextButton: '.carousel-swiper-fullscreen-demo .items-button-next',
		prevButton: '.carousel-swiper-fullscreen-demo .items-button-prev',
		loop: true,
		grabCursor: true,
		centeredSlides: false,
		autoplay: 5000,
		autoplayDisableOnInteraction: false,
		slidesPerView: 2,
		spaceBetween: 16,
		effect: 'slide',
		breakpoints: {
			440: {
				slidesPerView: 1,
				spaceBetween: 0
			}
		}
	});
	// carousel-beta :projects list slider
	new Swiper('.carousel-swiper-beta-demo .swiper-container', {
		pagination: '.carousel-swiper-beta-demo .items-pagination',
		paginationClickable: '.carousel-beta-demo .items-pagination',
		nextButton: '.carousel-swiper-beta-demo .items-button-next',
		prevButton: '.carousel-swiper-beta-demo .items-button-prev',
		loop: true,
		grabCursor: true,
		centeredSlides: false,
		autoplay: 5000,
		autoplayDisableOnInteraction: false,
		slidesPerView: 2,
		spaceBetween: 0,
		breakpoints: {
			1024: {
				slidesPerView: 2,
			},
			800: {
				slidesPerView: 1,
				spaceBetween: 0
			},
			640: {
				slidesPerView: 1,
				spaceBetween: 0
			},
			440: {
				slidesPerView: 1,
				spaceBetween: 0
			}
		}
	});
	
	// 4.1 Slideshow slider
	const imageList = $('.slide-show .img');
	const imageSlides = [];
	for (i = 0; i < imageList.length; i++) {
		src = imageList[i].getAttribute('data-src');
		imageSlides.push({ src: src });
	}
	$('.slide-show').vegas({
		delay: 5000,
		shuffle: true,
		slides: imageSlides,
		animation: ['kenburnsUp', 'kenburnsDown', 'kenburnsLeft', 'kenburnsRight']
	});
	
	// 5. Init video background
	const videoBg = $('.video-container video, .video-container object');

	// 6. Prepare content for animation
	$('.section .content .anim.anim-wrapped').wrap("<span class='anim-wrapper'></span>");

	// 7. Init fullPage.js plugin
	const pageSectionDivs = $('.page-fullpage .section');
	const headerLogo = $('.header-top .logo');
	const bodySelector = $('body');
	const sectionSelector = $('.section');
	const headerContainer = $('.hh-header');
	const slideElem = $('.slide');
	const arrowElem = $('.p-footer .arrow-d');
	const siteFooter = $('.page-footer');
	const siteHeader = $('.page-header');
	const pageElem = $('.section');
	const pageSections = [];
	const pageAnchors = [];
	let nextSectionDOM;
	let nextSection;
	let fpnavItem;
	const mainPage = $('#mainpage');
	const galleryPage = $('#gallerypage');
	const sendEmailForm = $('.send_email_form');
	const sendMessageForm = $('.send_message_form');
	let scrollOverflow = true;
	let css3 = true;
	// disable scroll overflow on small device
	if (contextWindow.width() < 601) {
		scrollOverflow = false;
		css3 = false;
	}
	if (contextWindow.height() < 480) {
		scrollOverflow = false;
		css3 = false;
	}
	// Get sections name
	for (i = 0; i < pageSectionDivs.length; i++) {
		pageSections.push(pageSectionDivs[i]);
	}
	window.asyncEach(pageSections, function (pageSection, cb) {
		const anchor = pageSection.getAttribute('data-section');
		pageAnchors.push(anchor + "");
		cb();
	}, function (err) {
		// Init plugin
		if (mainPage.width()) {
			// config fullpage.js
			mainPage.fullpage({
				menu: '#qmenu',
				anchors: pageAnchors,
				verticalCentered: false,
				css3: css3,
				navigation: true,
				responsiveWidth: 1024,
				responsiveHeight: 480,
				scrollOverflow: true,
				// scrollOverflow: scrollOverflow,
				scrollOverflowOptions: {
					// scrollbars: false,
					click: false,
					submit: true,
				},
				normalScrollElements: '.section .scrollable',
				afterRender: function () {
					// init parallax 
					const parallaxCover = document.getElementById('parallax-cover');
					if (parallaxCover) {
						if (contextWindow.width() > 1024) {
							const parallaxInstance = new Parallax(parallaxCover);
						}
					}

					// init sliders
					
					// carousel-alpha : team about us
					new Swiper('.carousel-swiper-alpha-demo .swiper-container', {
						pagination: '.carousel-swiper-alpha-demo .items-pagination',
						paginationClickable: '.carousel-alpha-demo .items-pagination',
						nextButton: '.carousel-swiper-alpha-demo .items-button-next',
						prevButton: '.carousel-swiper-alpha-demo .items-button-prev',
						loop: true,
						grabCursor: true,
						centeredSlides: false,
						autoplay: 5000,
						autoplayDisableOnInteraction: false,
						slidesPerView: 2,
						spaceBetween: 16,
						effect: 'slide',
						breakpoints: {
							440: {
								slidesPerView: 1,
								spaceBetween: 0
							}
						}
					});

					
					// Fix video background
					videoBg.maximage('maxcover');

					// Fix for internet explorer : adjust content height
					// Detect IE 6-11
					const isIE = /*@cc_on!@*/false || !!document.documentMode;
					if (isIE) {
						const contentColumns = $('.section .content .c-columns');
						contentColumns.height(contextWindow.height())
						for (let i = 0; i < contentColumns.length; i++) {
							if (contentColumns[i].height <= contextWindow.height()) {
								contentColumns[i].style.height = "100vh";
							}
						}
					}

					// init contact form
					// Default server url
					let newsletterServerUrl = './ajaxserver/serverfile.php';
					let messageServerUrl = './ajaxserver/serverfile.php';

					// Use form define action attribute
					if (sendEmailForm.attr('action') && (sendEmailForm.attr('action')) != '') {
						newsletterServerUrl = sendEmailForm.attr('action');
					}
					if (sendMessageForm.attr('action') && (sendMessageForm.attr('action') != '')) {
						messageServerUrl = sendMessageForm.attr('action');
					}

					sendEmailForm.initForm({
						serverUrl: newsletterServerUrl,
					});
					sendMessageForm.initForm({
						serverUrl: messageServerUrl,
					});

				},
				afterResize: function () {
					const pluginContainer = $(this);
					$.fn.fullpage.reBuild();
					// uncomment below to force reload windows on screen resize
					if (contextWindow.width() > 1024) {
						location.reload();
					}
				},
				onLeave: function (index, nextIndex, direction) {
					// Behavior when a full page is leaved
					arrowElem.addClass('gone');
					pageElem.addClass('transition');
					slideElem.removeClass('transition');
					pageElem.removeClass('transition');
				},
				afterLoad: function (anchorLink, index) {
					// Behavior after a full page is loaded
					const pageCover = $('.page-cover');
					if (index > 1 ){
						if (!pageCover.hasClass('scrolled')) {
							pageCover.addClass('scrolled');
						}
						
						if (!siteFooter.hasClass('fp-scrolled')) {
							siteFooter.addClass('fp-scrolled');
						}
					}  else {
						pageCover.removeClass('scrolled');
						siteHeader.removeClass('fp-scrolled');
						siteFooter.removeClass('fp-scrolled');
					}
					const activeSection = $('.section.active');
					if (!activeSection.hasClass('section-anim')) {
						// uncomment below for onetime animation
						activeSection.addClass('section-anim');
					} 
					// hide or show clock
					if ($('.section.active').hasClass('hide-clock')) {
						headerContainer.addClass('gone');
					} else {
						headerContainer.removeClass('gone');
					}
				}
			});

		}

		// Init galleryPage
		if (galleryPage.width()) {
			// config fullpage.js
			galleryPage.fullpage({
				menu: '#qmenu',
				anchors: pageAnchors,
				verticalCentered: false,
				css3: css3,
				navigation: true,
				scrollOverflow: false,
				loopTop: true,
				loopBottom: true,
				responsiveHeight: 480,
				normalScrollElements: '.section .scrollable',
				scrollOverflowOptions: {
					click: false,
					submit: true,
				},
				afterRender: function () {
				},
				afterResize: function () {
					const pluginContainer = $(this);
					$.fn.fullpage.reBuild();
				},
				afterLoad: function () {
					
				},
				onLeave: function (index, nextIndex, direction) {
					// Behavior when a full page is leaved
					arrowElem.addClass('gone');
					pageElem.addClass('transition');
					slideElem.removeClass('transition');
					pageElem.removeClass('transition');
				}
			});

		}
	});
	// Scroll to fullPage.js next/previous section
	$('.scrolldown a, .scrolldown.down, .scroll.down').on('click', function () {
		try {
			// fullpage scroll
			$.fn.fullpage.moveSectionDown();
		} catch (error) {
			// normal scroll
			$root.animate({
				scrollTop: window.innerHeight
			}, 400, function () {
			});
		}

	});
	// Scroll to fullPage.js next/previous section
	$('.scroll.up').on('click', function () {
		try {
			// fullpage scroll
			$.fn.fullpage.moveSectionUp();
		} catch (error) {
			// normal scroll
			$root.animate({
				scrollTop: window.innerHeight
			}, 400, function () {
			});
		}

	});

	// 8. Hide some ui on scroll
	const scrollHeight = $(document).height() - contextWindow.height();
	contextWindow.on('scroll', function () {
		const scrollpos = $(this).scrollTop();
		const siteHeaderFooter = $('.page-footer, .page-header');

		// if (scrollpos > 10 && scrollpos < scrollHeight - 100) {
		if (scrollpos > 100) {
			siteHeaderFooter.addClass("scrolled");
		}
		else {
			siteHeaderFooter.removeClass("scrolled");
		}
	});


	// 9. Page Loader : hide loader when all are loaded
	contextWindow.on('load', function () {
		$('#page-loader').addClass('p-hidden');
		$('.section').addClass('anim');
	});

	// 10. cursor position
	const shadowBall = $(".cursor-ball");
	$(".body-page").mousemove(function(e) {
		shadowBall.css("transform", "translateX(" + e.pageX + "px)");
		// shadowBall.css("transform", "translate(" + e.pageX + "px," + e.pageY +"px)");
		// shadowBall.posx.value = e.pageX;
		// shadowBall.posy.value = e.pageY;
	});

});

function onContactSubmit(token) {
	console.log(token)
	fetch("https://www.google.com/recaptcha/api/siteverify", {
		method: "POST", 
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			"secret": "6LcefXYgAAAAAFYVyMSEK_EXBRtw8R4PZOycodO6",
			"response": token
		})
	}).then(res => {
		console.log(res)
	})
	document.getElementById("message_form").submit();}