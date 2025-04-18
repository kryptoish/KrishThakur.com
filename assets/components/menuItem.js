import { gsap } from "gsap";
export class MenuItem {
    constructor(DomEl, thumbGrid) {
        this.DOM = {
            el: null,
            title: null,
        };
        this.mouseEnterTimeout = null;
        this.mouseLeaveTimeout = null;
        this.enterTL = null;
        this.leaveTL = null;
        this.DOM.el = DomEl;
        this.thumbGrid = thumbGrid;
        this.DOM.title = this.DOM.el.querySelector('.list__el__title');
        gsap.set(this.DOM.title, { willChange: 'transform, opacity' });
    }
}
