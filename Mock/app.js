// const process = require('process');

/**
 * @see https://github.com/janpaepke/ScrollMagic/wiki/Getting-Started-:-How-to-use-ScrollMagic
 * @See 
 */


let controller;
let slideScene;
let pageScene;

function animateSlides() {
    // init controller
    const controller = new ScrollMagic.Controller();

    //Selectors
    const sliders = document.querySelectorAll('.slide');
    const nav = document.querySelector('.header__nav');

    sliders.forEach((slide, index, slides) => {
        const revealImg = slide.querySelector('.reveal-img');
        const img = slide.querySelector('img');
        const revealText = slide.querySelector('.reveal-text');

        // GSAP 

        // First Animation 
        const slideTl = gsap.timeline({ defaults: { duration: 1, ease: 'power2.inOut' } });
        slideTl.fromTo(revealImg, { x: '0%' }, { x: '100%' },);
        slideTl.fromTo(img, { scale: 2 }, { scale: 1 }, '-=1');
        slideTl.fromTo(revealText, { x: '0%' }, { x: '100%' }, '-=0.75');
        slideTl.fromTo(nav, { y: '-80%' }, { y: '0%' }, '-=0.5');

        // Create Scene 
        slideScene = new ScrollMagic.Scene({
            triggerElement: slide,
            triggerHook: 0.25
        })
            .setTween(slideTl)
            .addIndicators({ colorStart: 'white', colorTrigger: 'white', name: 'slide' })
            .addTo(controller);

        // Second Animation
        const pageTl = gsap.timeline();

        // if we reached the end then there's no need for more sliding
        // Otherwise, move the next slide 50% and maintain the opacity animation  
        let nextSlide = slides.length - 1 === index ? 'end' : slides[index + 1];
        pageTl.fromTo(nextSlide, { y: '0%' }, { y: '50%' });
        pageTl.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
        pageTl.fromTo(nextSlide, { y: '50%' }, { y: '0%' });

        // New Scene
        pageScene = new ScrollMagic.Scene({
            triggerElement: slide,
            duration: '100%',
            triggerHook: 0
        })
            .addIndicators({ colorStart: 'white', colorTrigger: 'white', name: 'page', indent: 200 })
            .setPin(slide, { pushFollowers: false }) // Controlls based on the scroll of the mouse
            .setTween(pageTl)
            .addTo(controller)
    })


    // // Create Scene
    // const slideScene = new ScrollMagic.Scene({
    //     triggerElement: '.hike-exp', // element to hit
    //     triggerHook: 0.5
    // })
    //     .addIndicators({ colorStart: 'white', colorTrigger: 'white' }) // indicators
    //     .addTo(controller) // Add Scene to ScrollMagic Controller

    /**
     * This is without reverse
     */
    // // Create Scene 
    //     slideScene = new ScrollMagic.Scene({
    //         triggerElement: slide,
    //         triggerHook: 0.25,
    //         reverse: false
    //     })
    //         .setTween(slideTl)
    //         .addIndicators({ colorStart: 'white', colorTrigger: 'white', name: 'slide' })
    //         .addTo(controller);

}

const mouse = document.querySelector('.cursor');
const mouseTxt = mouse.querySelector('span');
const burger = document.querySelector('.header__nav__burger');

function cursor(e) {
    mouse.style.top = e.pageY + 'px';
    mouse.style.left = e.pageX + 'px';
}

function activeCursor(e) {
    const item = e.target;
    if (item.id === 'logo' || item.classList.contains('header__nav__burger')) {
        mouse.classList.add('nav-active');
    } else {
        mouse.classList.remove('nav-active');
    }


    if (item.classList.contains('section__explore')) {
        mouse.classList.add('explore-active');
        gsap.to('.section__title__swipe', 1, { y: '0%' });
        mouseTxt.innerText = 'Tap';
    } else {
        mouse.classList.remove('explore-active');
        mouseTxt.innerText = '';
        gsap.to('.section__title__swipe', 1, { y: '100%' });
    }

}

function navToggle(e) {
    gsap.to('.header__nav__line1', 0.5, { rotate: '45', y: 5});
    gsap.to('.header__nav__line2', 0.5, { rotate: '-45', y: -5 });
    gsap.to('.nav__bar', 1, {clipPath: 'circle(2500px at 100% -10%)'});
}

// Event handlers
burger.addEventListener('click', navToggle);
window.addEventListener('mousemove', cursor);
window.addEventListener('mouseover', activeCursor);

animateSlides();

