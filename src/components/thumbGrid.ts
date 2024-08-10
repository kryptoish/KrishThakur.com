import { gsap } from "gsap";

export type ThumbGridDOM = {
  el: Element | null;
  items: NodeListOf<HTMLElement> | null;
};

export class ThumbGrid {
  DOM: ThumbGridDOM = {
    el: null,
    items: null,
  };
  constructor(DomEl: Element) {
    this.DOM.el = DomEl;
    this.DOM.items = this.DOM.el.querySelectorAll(".thumbgrid__item");

    gsap.set(this.DOM.items, { willChange: "transform, opacity" });
  }
}
