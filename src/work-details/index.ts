import debounce from "lodash/debounce";
import NormalizeWheel from "normalize-wheel";
import { Camera, OGLRenderingContext, Plane, Renderer, Transform } from "ogl";

import { images } from "./images.ts";

import { DebouncedFunc } from "lodash";
import Media from "./Media.ts";
import { isMobile } from "../global.ts";

export type Screen = {
  height: number;
  width: number;
};

export type Viewport = {
  height: number;
  width: number;
};

export type Scroll = {
  ease: number;
  current: number;
  target: number;
  last: number;
  position?: number;
};

export function lerp(p1: number, p2: number, t: number) {
  return p1 + (p2 - p1) * t;
}

export default class WorkDetails {
  // TYPE DEFINITION
  scroll: Scroll;
  parentNode: HTMLElement;
  container: HTMLDivElement | null;
  renderer?: Renderer;
  gl?: OGLRenderingContext;
  camera?: Camera;
  scene?: Transform;
  planeGeometry?: Plane;
  mediasElements?: NodeListOf<HTMLElement>;
  onCheckDebounce: DebouncedFunc<() => void>;
  mediasImages: { image: string }[];
  medias: Media[];
  isDown: boolean;
  start: number;
  screen?: Screen;
  viewport?: Viewport;
  direction?: "right" | "left";

  constructor(containerNode: HTMLElement) {
    this.scroll = {
      ease: 0.05,
      current: 0,
      target: 0,
      last: 0,
    };
    this.parentNode = containerNode;
    this.container = containerNode.querySelector(
      ".work-details__gallery__container"
    );

    this.onCheckDebounce = debounce(this.onCheck, 200);

    this.mediasImages = [];
    this.medias = [];

    this.isDown = false;
    this.start = 0;

    this.createRenderer();
    this.createCamera();
    this.createScene();

    this.onResize();

    this.createGeometry();
    this.createMedias();

    this.update();

    this.addEventListeners();
  }

  createRenderer() {
    this.renderer = new Renderer({ alpha: true });

    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);

    if (this.container) this.container.appendChild(this.gl.canvas);
  }

  createCamera() {
    if (this.gl) {
      this.camera = new Camera(this.gl);
      this.camera.fov = 45;
      this.camera.position.z = 20;
    }
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    if (this.gl)
      this.planeGeometry = new Plane(this.gl, {
        heightSegments: 50,
        widthSegments: 100,
      });
  }

  createMedias() {
    // Get project ID
    const id = parseInt(
      (this.parentNode.querySelector(".work-details") as HTMLElement).dataset
        .project || "0"
    );
    // @ts-ignore
    this.mediasImages = images[id];

    this.medias = this.mediasImages.map(({ image }, index) => {
      const media = new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image,
        index,
        length: this.mediasImages.length,
        scene: this.scene,
        screen: this.screen,
        viewport: this.viewport,
      });

      return media;
    });
  }

  /**
   * Events.
   */
  onTouchDown(event: any) {
    this.isDown = true;

    this.scroll.position = this.scroll.current;
    this.start = event.touches ? event.touches[0].clientX : event.clientX;
  }

  onTouchMove(event: any) {
    if (event.type === "touchmove") event.preventDefault();
    if (!this.isDown) return;

    const x = event.touches ? event.touches[0].clientX : event.clientX;
    const distance = (this.start - x) * (isMobile() ? 0.15 : 0.07);

    if (this.scroll.position !== undefined)
      this.scroll.target = this.scroll.position + distance;
  }

  onTouchUp() {
    this.isDown = false;

    this.onCheck();
  }

  onWheel(event: WheelEvent) {
    const normalized = NormalizeWheel(event);
    const speed = normalized.pixelY;

    this.scroll.target += speed * 0.025;

    this.onCheckDebounce();
  }

  /**
   * Resize.
   */
  onResize() {
    this.screen = {
      height: (this.container?.getBoundingClientRect().height ?? 0) / 0.66375,
      width: this.container?.getBoundingClientRect().width ?? 0,
    };

    this.renderer?.setSize(this.screen.width, this.screen.height);

    this.camera?.perspective({
      aspect: (this.gl?.canvas.width ?? 0) / (this.gl?.canvas.height ?? 0),
    });

    const fov = (this.camera?.fov ?? 0) * (Math.PI / 180);
    const height =
      (2 * Math.tan(fov / 2) * (this.camera?.position.z ?? 0)) / 1.5;
    const width = height * (this.camera?.aspect ?? 0);

    this.viewport = {
      height,
      width,
    };

    if (this.medias) {
      this.medias.forEach((media) =>
        media.onResize({
          screen: this.screen,
          viewport: this.viewport,
        })
      );
    }
  }

  onCheck() {
    const { width } = this.medias[0];
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;

    if (this.scroll.target < 0) {
      this.scroll.target = -item;
    } else {
      this.scroll.target = item;
    }
  }

  /**
   * Update.
   */
  update() {
    this.scroll.current = lerp(
      this.scroll.current,
      this.scroll.target,
      this.scroll.ease
    );

    if (this.scroll.current > this.scroll.last) {
      this.direction = "right";
    } else {
      this.direction = "left";
    }

    if (this.medias) {
      this.medias.forEach((media) => media.update(this.scroll, this.direction));
    }

    this.renderer?.render({
      scene: this.scene,
      camera: this.camera,
    });

    this.scroll.last = this.scroll.current;

    window.requestAnimationFrame(this.update.bind(this));
  }

  /**
   * Listeners.
   */
  addEventListeners() {
    window.addEventListener("resize", this.onResize.bind(this));

    window.addEventListener("wheel", this.onWheel.bind(this));

    this.container?.addEventListener("mousedown", this.onTouchDown.bind(this));
    this.container?.addEventListener("mousemove", this.onTouchMove.bind(this));
    this.container?.addEventListener("mouseup", this.onTouchUp.bind(this));

    this.container?.addEventListener("touchstart", this.onTouchDown.bind(this));
    this.container?.addEventListener("touchmove", this.onTouchMove.bind(this));
    this.container?.addEventListener("touchend", this.onTouchUp.bind(this));
  }

  dispose() {
    window.removeEventListener("resize", this.onResize.bind(this));

    window.removeEventListener("wheel", this.onWheel.bind(this));

    this.container?.removeEventListener(
      "mousedown",
      this.onTouchDown.bind(this)
    );
    this.container?.removeEventListener(
      "mousemove",
      this.onTouchMove.bind(this)
    );
    this.container?.removeEventListener("mouseup", this.onTouchUp.bind(this));

    this.container?.removeEventListener(
      "touchstart",
      this.onTouchDown.bind(this)
    );
    this.container?.removeEventListener(
      "touchmove",
      this.onTouchMove.bind(this)
    );
    this.container?.removeEventListener("touchend", this.onTouchUp.bind(this));

    this.medias.forEach((media) => media.dispose());
  }
}
