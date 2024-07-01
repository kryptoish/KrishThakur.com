import { ThumbGrid } from "./thumbGrid";
import { gsap } from "gsap";

type MenuItemDOM = {
    el: Element | null,
    title: Element | null;
}

export class MenuItem {
    DOM: MenuItemDOM = {
        el : null,
        title: null,
    }
    thumbGrid: ThumbGrid;
    mouseEnterTimeout: NodeJS.Timeout | null = null;
    mouseLeaveTimeout: NodeJS.Timeout | null = null;
    enterTL: GSAPTimeline | null = null;
    leaveTL: GSAPTimeline | null = null;

    constructor(DomEl: Element, thumbGrid: ThumbGrid) {
        this.DOM.el = DomEl;
        this.thumbGrid = thumbGrid;

        this.DOM.title = this.DOM.el.querySelector('.list__el__title');

        gsap.set(this.DOM.title, {willChange: 'transform, opacity'});
    }
}