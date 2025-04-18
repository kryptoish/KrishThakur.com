var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import "../styles/style.scss";
import barba from "@barba/core";
import { gsap } from "gsap";
import { RoughEase } from "gsap/EasePack";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(RoughEase);
import Lenis from "lenis";
import buttonTilt from "./components/buttonTilt";
import ImageHover from "./components/imageHover";
import Splitting from "splitting";
import "splitting/dist/splitting-cells.css";
import "splitting/dist/splitting.css";
import { disposelifeDisplay, disposeWorkDetails, initlifeDisplay, initErrorPage, initFlickerAnimation, initFooterAnimations, initHeaderAnimations, initMain, initWorkDetails, initWorks, } from "./helpers/animations";
// Smooth scroll
const lenis = new Lenis();
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
// ----------------------------------------------
const initButtonTilt = () => {
    // Buttons
    document.querySelectorAll("[data-tilt]").forEach((button) => {
        buttonTilt(button, true);
    });
};
let imagesHover = [];
const initImageHover = () => {
    document.querySelectorAll("[data-image]").forEach((img) => {
        const instance = new ImageHover({
            dom: img,
        });
        // @ts-ignore
        img.imageHover = instance;
        imagesHover.push(instance);
    });
};
// Detect if touch device
export const isMobile = () => {
    const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent);
};
// GSAP Scroll Triggers
export const scroll = (customAnimations = null) => {
    // Images hover effects
    initImageHover();
    if (!isMobile()) {
        initButtonTilt();
    }
    // Header scrolling events
    const header = document.querySelector(".header");
    let last = window.scrollY;
    window.addEventListener("scroll", () => {
        let current = window.scrollY;
        // When scrolling upward
        if (last > current || current <= window.innerHeight / 2) {
            header === null || header === void 0 ? void 0 : header.classList.remove("header--hidden");
        }
        // When scrolling downward
        else if (last < current) {
            header === null || header === void 0 ? void 0 : header.classList.add("header--hidden");
        }
        last = window.scrollY;
    });
    // HEADER ANIMATIONS
    initHeaderAnimations();
    // FOOTER ANIMATIONS
    initFooterAnimations();
    if (customAnimations)
        customAnimations();
};
const initPageTransitions = () => {
    document.querySelectorAll(".header a").forEach((link) => {
        link.addEventListener("click", (e) => {
            if (e.currentTarget.href === window.location.href) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    });
    barba.init({
        transitions: [
            {
                name: "transition",
                leave(data) {
                    return __awaiter(this, void 0, void 0, function* () {
                        disposeWorkDetails();
                        disposelifeDisplay();
                        // Kill all active GSAP scroll triggers
                        let triggers = ScrollTrigger.getAll();
                        triggers.forEach((trigger) => {
                            trigger.kill();
                        });
                        // Kill images renderer
                        imagesHover.forEach((instance) => {
                            instance.dispose();
                        });
                        imagesHover = [];
                        document.body.style.overflow = "";
                        document.body.classList.remove("error-page");
                        return gsap.to(data.current.container, {
                            opacity: 0,
                            onComplete: () => { var _a; return (_a = data.current.container.querySelector(".footer")) === null || _a === void 0 ? void 0 : _a.remove(); },
                        });
                    });
                },
            },
        ],
        views: [
            {
                namespace: "home",
                afterEnter: () => {
                    window.scrollTo({
                        top: 0,
                    });
                    // Kill all active GSAP scroll triggers
                    let triggers = ScrollTrigger.getAll();
                    triggers.forEach((trigger) => {
                        trigger.kill();
                    });
                    // Splitting texts into words and chars
                    Splitting();
                    hideElements();
                    return gsap
                        .timeline()
                        .set(transition, {
                        transform: "translate(0, 100%) scaleY(1)",
                    })
                        .to(transition, {
                        transform: "translate(0, 0) scaleY(0)",
                        duration: 1.6,
                        ease: "power3.inOut",
                        onComplete: () => {
                            scroll(initMain);
                            ScrollTrigger.refresh(true);
                        },
                    });
                },
            },
            {
                namespace: "404",
                afterEnter() {
                    // Splitting texts into words and chars
                    Splitting();
                    hideElements();
                    document.body.classList.add("error-page");
                    return scroll(initErrorPage);
                },
            },
            {
                namespace: "works",
                afterEnter() {
                    window.scrollTo({
                        top: 0,
                    });
                    // Kill all active GSAP scroll triggers
                    let triggers = ScrollTrigger.getAll();
                    triggers.forEach((trigger) => {
                        trigger.kill();
                    });
                    // Splitting texts into words and chars
                    Splitting();
                    hideElements();
                    return gsap
                        .timeline()
                        .set(transition, {
                        transform: "translate(0, 100%) scaleY(1)",
                    })
                        .to(transition, {
                        transform: "translate(0, 0) scaleY(0)",
                        duration: 1.6,
                        ease: "power3.inOut",
                        onComplete: () => {
                            scroll(initWorks);
                            ScrollTrigger.refresh(true);
                        },
                    });
                },
            },
            {
                namespace: "work-details",
                afterEnter(data) {
                    window.scrollTo({
                        top: 0,
                    });
                    // Kill all active GSAP scroll triggers
                    let triggers = ScrollTrigger.getAll();
                    triggers.forEach((trigger) => {
                        trigger.kill();
                    });
                    // Splitting texts into words and chars
                    Splitting();
                    hideElements();
                    return gsap
                        .timeline()
                        .set(transition, {
                        transform: "translate(0, 100%) scaleY(1)",
                    })
                        .to(transition, {
                        transform: "translate(0, 0) scaleY(0)",
                        duration: 1.6,
                        ease: "power3.inOut",
                        onComplete: () => {
                            scroll(() => initWorkDetails(data.next.container));
                            ScrollTrigger.refresh(true);
                        },
                    });
                },
            },
            {
                namespace: "life-display",
                afterEnter() {
                    window.scrollTo({
                        top: 0,
                    });
                    // Kill all active GSAP scroll triggers
                    let triggers = ScrollTrigger.getAll();
                    triggers.forEach((trigger) => {
                        trigger.kill();
                    });
                    // Splitting texts into words and chars
                    Splitting();
                    hideElements();
                    document.body.style.overflow = "hidden";
                    return gsap
                        .timeline()
                        .set(transition, {
                        transform: "translate(0, 100%) scaleY(1)",
                    })
                        .to(transition, {
                        transform: "translate(0, 0) scaleY(0)",
                        duration: 1.6,
                        ease: "power3.inOut",
                        onComplete: () => {
                            scroll(initlifeDisplay);
                            ScrollTrigger.refresh(true);
                        },
                    });
                },
            },
        ],
    });
};
// ------------------------------------------------------------------------
// LOADING
const hideElements = () => {
    gsap.set([
        // Header
        ".header__logo",
        ".header__baseline .char",
        ".header__nav__el .word",
        ".header__nav__el:not([data-splitting])",
        // Footer
        ".footer__title .word",
        ".footer__location .char",
        ".footer__mail a .word",
        ".footer__time > span:first-child .char",
        ".footer__time > span:last-child .word",
        ".footer__socials__el a .word",
        // Page
        "[data-section-text-animation]",
        "[data-splitting][data-title-animation] .char",
        "[data-text-animation] .word",
        // work-details
        ".work-details__title .char",
        ".work-details__gallery",
        ".work-details__header > p .char",
        ".work-details__description .word",
        ".work-details__link .word",
        ".work-details__nav > a",
        ".work-details__nav ul li",
        ".work-details__back .word",
        ".work-details hr",
        // Life Display
        ".life__title .char",
        ".life__text .word",
        ".life__canvas",
        // Error
        ".error-page__title .word",
        ".error-page__text .word",
        ".error-page__subtitle .char",
        ".error-page__link",
    ], { opacity: 0 });
    gsap.set("[data-triangle]", { "--triangle-opacity": 0 });
};
const transition = document.querySelector(".transition");
export const initLoading = () => {
    const loading = document.querySelector(".loading");
    if (loading) {
        let pourcent = 0;
        const loadingPourcent = loading === null || loading === void 0 ? void 0 : loading.querySelectorAll(".loading__digits span");
        // Animate logo
        const logo = document.querySelector(".loading__logo");
        initFlickerAnimation(gsap.timeline(), logo);
        // Splitting texts into words and chars
        Splitting();
        // Hide elements
        hideElements();
        const interval = setInterval(() => {
            loadingPourcent === null || loadingPourcent === void 0 ? void 0 : loadingPourcent.forEach((n) => (n.innerHTML = `${pourcent}`));
            pourcent++;
            if (pourcent === 101) {
                clearInterval(interval);
                // hide loading
                loading.style.translate = "0 -100%";
                loading.style.opacity = "0";
                initPageTransitions();
            }
        }, 10);
    }
    else {
        initPageTransitions();
    }
};
export const initPage = () => {
    initLoading();
};
initPage();
