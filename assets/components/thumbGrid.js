import { gsap } from "gsap";
export class ThumbGrid {
    constructor(DomEl) {
        this.DOM = {
            el: null,
            items: null,
        };
        this.DOM.el = DomEl;
        this.DOM.items = this.DOM.el.querySelectorAll(".thumbgrid__item");
        gsap.set(this.DOM.items, { willChange: "transform, opacity" });
    }
}
