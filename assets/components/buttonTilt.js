// import gsap from "gsap";
import { distance, getMousePos, lerp } from "../helpers/utils";
let mousePos = { x: 0, y: 0 };
export default (el, isFixed = false) => {
    // Track the mouse position
    window.addEventListener("mousemove", (ev) => (mousePos = getMousePos(ev)));
    return new ButtonCtrl(el, isFixed);
};
export class ButtonCtrl {
    constructor(el, isFixed = false) {
        this.requestId = undefined;
        this.onResize = () => { };
        // Store the element
        this.DOM = { el };
        this.isFixed = isFixed;
        // Query the parts of the element
        // this.DOM.text = this.DOM.el.querySelector(".button__text");
        // this.DOM.textInner = this.DOM.text.querySelector(".button__inner");
        // this.DOM.filler = this.DOM.el.querySelector(".button__filler");
        // Values of the button's translate
        this.renderedStyles = {
            tx: {
                previous: 0,
                current: 0,
                amt: 0.1,
            },
            ty: {
                previous: 0,
                current: 0,
                amt: 0.1,
            },
        };
        // Button's hover state
        this.hover = false;
        // Init computing size/position and init events
        this.calculateSizePosition();
        this.initEvents();
        // Begin animation request loop
        this.requestId = requestAnimationFrame(() => this.render());
    }
    calculateSizePosition() {
        this.rect = this.DOM.el.getBoundingClientRect();
        // The threshold distance value when the animation must be triggered
        const DELTA = 1;
        this.distanceToTrigger = this.rect.width * DELTA;
    }
    initEvents() {
        this.onResize = () => this.calculateSizePosition();
        window.addEventListener("resize", this.onResize);
    }
    render() {
        if (!this.distanceToTrigger)
            return;
        // Clear requestId for the next frame
        this.requestId = undefined;
        this.rect = this.DOM.el.getBoundingClientRect();
        const mousePosX = mousePos.x + window.scrollX;
        const mousePosY = mousePos.y + 0;
        const buttonCenterX = this.rect.left + this.rect.width / 2;
        const buttonCenterY = this.rect.top + this.rect.height / 2;
        // The distance from the mouse to the center of the button
        const distanceMouseButton = distance(mousePosX, mousePosY, buttonCenterX, buttonCenterY);
        // New values for the translate
        let x = 0;
        let y = 0;
        if (distanceMouseButton < this.distanceToTrigger) {
            if (!this.hover)
                this.enter();
            x = (mousePosX - buttonCenterX) * 0.3;
            y = (mousePosY - buttonCenterY) * 0.3;
        }
        else if (this.hover)
            this.leave();
        // Save new translate values
        this.renderedStyles["tx"].current = x;
        this.renderedStyles["ty"].current = y;
        // ???
        for (const key in this.renderedStyles) {
            this.renderedStyles[key].previous = lerp(this.renderedStyles[key].previous, this.renderedStyles[key].current, this.renderedStyles[key].amt);
        }
        // Apply the new values to element's style
        this.DOM.el.style.transform = `
        translate3d(
          ${this.renderedStyles["tx"].previous}px,
          ${this.renderedStyles["ty"].previous}px,
          0
        )
      `;
        requestAnimationFrame(() => this.render());
    }
    enter() {
        this.hover = true;
    }
    leave() {
        this.hover = false;
    }
}
