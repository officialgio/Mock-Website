// const process = require('process');

/**
 * @see https://github.com/janpaepke/ScrollMagic/wiki/Getting-Started-:-How-to-use-ScrollMagic
 * @See 
 */


let controller;
let slideScene;
let pageScene;
let detailScene;

function animateSlides() {
    // init controller
    controller = new ScrollMagic.Controller();

    //Selectors
    const sliders = document.querySelectorAll('.slide');
    const nav = document.querySelector('.header__nav');

    sliders.forEach((slide, index, slides) => {
        const revealImg = slide.querySelector('.reveal-img');
        const img = slide.querySelector('img');
        const revealText = slide.querySelector('.reveal-text');

        // First Animation 
        const slideTl = gsap.timeline({ defaults: { duration: 1, ease: 'power2.inOut' } });
        slideTl.fromTo(revealImg, { x: '0%' }, { x: '100%' },);
        slideTl.fromTo(img, { scale: 2 }, { scale: 1 }, '-=1');
        slideTl.fromTo(revealText, { x: '0%' }, { x: '100%' }, '-=0.75');
        // slideTl.fromTo(nav, { y: '-80%' }, { y: '0%' }, '-=0.5');

        // Create Scene 
        slideScene = new ScrollMagic.Scene({
            triggerElement: slide,
            triggerHook: 0.25 // adjust depending on viewport trigger
        })
            .setTween(slideTl)
            // .addIndicators({ colorStart: 'white', colorTrigger: 'white', name: 'slide' })
            .addTo(controller);

        // Second Animation
        const pageTl = gsap.timeline();

        // if we reached the end then there's no need for more sliding
        // Otherwise, move the next slide 50% and maintain the opacity animation  
        let nextSlide = slides.length - 1 === index ? 'end' : slides[index + 1];
        pageTl.fromTo(nextSlide, { y: '0%' }, { y: '50%' }); // trick for keeing page (push content down)
        pageTl.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
        pageTl.fromTo(nextSlide, { y: '50%' }, { y: '0%' }, '-=0.5');

        // New Scene
        pageScene = new ScrollMagic.Scene({
            triggerElement: slide,
            duration: '100%', // duration of width (end-page)
            triggerHook: 0
        })
            // .addIndicators({ colorStart: 'red', colorTrigger: 'red', name: 'page', indent: 200 })
            .setPin(slide, { pushFollowers: false }) // Controlls based on the scroll of the mouse
            .setTween(pageTl)
            .addTo(controller)
    })
}

const mouse = document.querySelector('.cursor');
const mouseTxt = mouse.querySelector('span');
const burger = document.querySelector('.header__nav__burger');

// This functuin handles having the circle div attached on mousemove
function cursor(e) {
    mouse.style.top = e.pageY + 'px';
    mouse.style.left = e.pageX + 'px';
}

/**
 * This function handles adding div adjust circle to a hover (mouseover) in any of 
 * the following conditions.
 * 
 * @param {e} event
 */
function activeCursor(e) {
    const item = e.target;
    if (item.id === 'logo' || item.classList.contains('header__nav__burger')) {
        mouse.classList.add('nav-active');
    } else {
        mouse.classList.remove('nav-active');
    }

    // Animating the element's y property to a value of 0% over a duration of 1.2 seconds.
    if (item.classList.contains('section__explore')) {
        mouse.classList.add('explore-active');
        gsap.to('.section__title__swipe', 1.2, { y: '0%' });
        mouseTxt.innerText = 'Tap';
    } else {
        mouse.classList.remove('explore-active');
        mouseTxt.innerText = '';
        gsap.to('.section__title__swipe', 1, { y: '100%' });
    }
}

/**
 * this code is creating an animation effect 
 * that transforms a hamburger menu icon into a "full screen" 
 * navigation menu by animating the position, rotation, and clipping of various elements.
 * 
 * 'active': is meant to be used when menu is opened/closed.
 * 'hide': is meant for hiding scroll bar overflow.
 * @param {event} e 
 */
function navToggle(e) {
    if (!e.target.classList.contains('active')) {
        e.target.classList.add('active');
        gsap.to('.header__nav__line1', 0.5, { rotate: '45', y: 5, background: 'black' });
        gsap.to('.header__nav__line2', 0.5, { rotate: '-45', y: -5, background: 'black' });
        gsap.to('.nav__bar', 1, { clipPath: 'circle(2500px at 100% -10%)' });
        gsap.to('#logo', 1, { color: 'black' });
        document.body.classList.add('hide');
    } else {
        e.target.classList.remove('active');
        gsap.to('.header__nav__line1', 0.5, { rotate: '0', y: 0, background: 'white' });
        gsap.to('.header__nav__line2', 0.5, { rotate: '0', y: 0, background: 'white' });
        gsap.to('.nav__bar', 1, { clipPath: 'circle(50px at 100% -10%)' });
        gsap.to('#logo', 1, { color: 'white' });
        document.body.classList.remove('hide');
    }
}

// Barba Page Transitions


/**
 * Before entering to the main page we call @method animateSlides()
 * Before leaving the main page we destroy the controller & scenes.
 * 
 * When leaving the current page do a fade-out transition
 * When entering the next page do a fade-in transition
 * 
 * When leaving the current page do a swiping effect of 0.75sec from where is not seen to 0%
 * When entering the next page from 0% do swipe effect of 1sec to 100% sequentially.
 */

const logo = document.querySelector('#logo');

barba.init({
    views: [
        {
            namespace: 'home',
            beforeEnter() {
                animateSlides();
                logo.href = './index.html'; // UPDATE
            },
            beforeLeave() {
                console.log('beforeLeave called');
                slideScene.destroy();
                pageScene.destroy();
                controller.destroy();
            }
        },
        {
            namespace: 'fashion',
            beforeEnter() {
                logo.href = '../index.html'; // UPDATE
                detailAnimation();
            },
            beforeLeave() {
                controller.destroy();
                detailScene.destroy();
            }
        }
    ],
    transitions: [
        {
            leave({ current, next }) {
                let done = this.async();
                const tl = gsap.timeline({ default: { ease: 'power2.inOut' } });
                tl.fromTo(current.container, 1, { opacity: 1 }, { opacity: 0 });
                tl.fromTo('.swipe', 0.75, { x: '-100%' }, { x: '0%', onComplete: done }, '-=0.5');

            },
            enter({ current, next }) {
                // Scroll to top
                window.scrollTo(0, 0);
                let done = this.async();
                const tl = gsap.timeline({ default: { ease: 'power2.inOut' } });
                tl.fromTo('.swipe', 1, { x: '0' }, { x: '100%', stagger: 0.25, onComplete: done });
                tl.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 });
                tl.fromTo('.header__nav', 2, { y: '-100%' }, { y: "0%", ease: 'power2.inOut' }, '-=1.5')
            }
        }
    ]
})


/**
 * This is similar function to the main page. 
 */
function detailAnimation() {
    controller = new ScrollMagic.Controller();
    const slides = document.querySelectorAll('.detail-slide');

    slides.forEach((slide, index, slides) => {
        const slideTl = gsap.timeline({ defaults: { duration: 1 } });
        let nextSlide = slides.length - 1 === index ? 'end' : slides[index + 1];
        const nextImg = nextSlide.querySelector('img');
        slideTl.fromTo(slide, { opacity: 1 }, { opacity: 0 });
        slideTl.fromTo(nextSlide, { opacity: 0 }, { opacity: 1 }, '-=1');
        slideTl.fromTo(nextSlide, { y: '0%' }, { y: '20%' }); // trick for keeing page (push content down)
        slideTl.fromTo(nextImg, { x: '50%' }, { x: '0%' });
        slideTl.fromTo(nextSlide, { y: '20%' }, { y: '0%' });

        // Scene
        detailScene = new ScrollMagic.Scene({
            triggerElement: slide,
            duration: '100%',
            triggerHook: 0
        })
            .setPin(slide, { pushFollowers: false })
            .setTween(slideTl)
            // .addIndicators({colorStart: 'white', colorTrigger: 'white', name: 'detailScene' })
            .addTo(controller);
    });
}

// Event handlers
burger.addEventListener('click', navToggle);
window.addEventListener('mousemove', cursor);
window.addEventListener('mouseover', activeCursor);
