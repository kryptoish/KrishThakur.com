import debounce from "lodash/debounce";
import NormalizeWheel from "normalize-wheel";
import { Camera, Plane, Renderer, Transform } from "ogl";
import { images } from "./images.ts";
import Media from "./Media.ts";
import { isMobile } from "../global.ts";
export function lerp(p1, p2, t) {
    return p1 + (p2 - p1) * t;
}
export default class WorkDetails {
    constructor(containerNode) {
        this.scroll = {
            ease: 0.05,
            current: 0,
            target: 0,
            last: 0,
        };
        this.parentNode = containerNode;
        this.container = containerNode.querySelector(".work-details__gallery__container");
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
        if (this.container)
            this.container.appendChild(this.gl.canvas);
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
        const id = parseInt(this.parentNode.querySelector(".work-details").dataset
            .project || "0");
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
    onTouchDown(event) {
        this.isDown = true;
        this.scroll.position = this.scroll.current;
        this.start = event.touches ? event.touches[0].clientX : event.clientX;
    }
    onTouchMove(event) {
        if (event.type === "touchmove")
            event.preventDefault();
        if (!this.isDown)
            return;
        const x = event.touches ? event.touches[0].clientX : event.clientX;
        const distance = (this.start - x) * (isMobile() ? 0.15 : 0.07);
        if (this.scroll.position !== undefined)
            this.scroll.target = this.scroll.position + distance;
    }
    onTouchUp() {
        this.isDown = false;
        this.onCheck();
    }
    onWheel(event) {
        const normalized = NormalizeWheel(event);
        const speed = normalized.pixelY;
        this.scroll.target += speed * 0.025;
        this.onCheckDebounce();
    }
    /**
     * Resize.
     */
    onResize() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        this.screen = {
            height: ((_b = (_a = this.container) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect().height) !== null && _b !== void 0 ? _b : 0) / 0.66375,
            width: (_d = (_c = this.container) === null || _c === void 0 ? void 0 : _c.getBoundingClientRect().width) !== null && _d !== void 0 ? _d : 0,
        };
        (_e = this.renderer) === null || _e === void 0 ? void 0 : _e.setSize(this.screen.width, this.screen.height);
        (_f = this.camera) === null || _f === void 0 ? void 0 : _f.perspective({
            aspect: ((_h = (_g = this.gl) === null || _g === void 0 ? void 0 : _g.canvas.width) !== null && _h !== void 0 ? _h : 0) / ((_k = (_j = this.gl) === null || _j === void 0 ? void 0 : _j.canvas.height) !== null && _k !== void 0 ? _k : 0),
        });
        const fov = ((_m = (_l = this.camera) === null || _l === void 0 ? void 0 : _l.fov) !== null && _m !== void 0 ? _m : 0) * (Math.PI / 180);
        const height = (2 * Math.tan(fov / 2) * ((_p = (_o = this.camera) === null || _o === void 0 ? void 0 : _o.position.z) !== null && _p !== void 0 ? _p : 0)) / 1.5;
        const width = height * ((_r = (_q = this.camera) === null || _q === void 0 ? void 0 : _q.aspect) !== null && _r !== void 0 ? _r : 0);
        this.viewport = {
            height,
            width,
        };
        if (this.medias) {
            this.medias.forEach((media) => media.onResize({
                screen: this.screen,
                viewport: this.viewport,
            }));
        }
    }
    onCheck() {
        const { width } = this.medias[0];
        const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
        const item = width * itemIndex;
        if (this.scroll.target < 0) {
            this.scroll.target = -item;
        }
        else {
            this.scroll.target = item;
        }
    }
    /**
     * Update.
     */
    update() {
        var _a;
        this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
        if (this.scroll.current > this.scroll.last) {
            this.direction = "right";
        }
        else {
            this.direction = "left";
        }
        if (this.medias) {
            this.medias.forEach((media) => media.update(this.scroll, this.direction));
        }
        (_a = this.renderer) === null || _a === void 0 ? void 0 : _a.render({
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
        var _a, _b, _c, _d, _e, _f;
        window.addEventListener("resize", this.onResize.bind(this));
        window.addEventListener("wheel", this.onWheel.bind(this));
        (_a = this.container) === null || _a === void 0 ? void 0 : _a.addEventListener("mousedown", this.onTouchDown.bind(this));
        (_b = this.container) === null || _b === void 0 ? void 0 : _b.addEventListener("mousemove", this.onTouchMove.bind(this));
        (_c = this.container) === null || _c === void 0 ? void 0 : _c.addEventListener("mouseup", this.onTouchUp.bind(this));
        (_d = this.container) === null || _d === void 0 ? void 0 : _d.addEventListener("touchstart", this.onTouchDown.bind(this));
        (_e = this.container) === null || _e === void 0 ? void 0 : _e.addEventListener("touchmove", this.onTouchMove.bind(this));
        (_f = this.container) === null || _f === void 0 ? void 0 : _f.addEventListener("touchend", this.onTouchUp.bind(this));
    }
    dispose() {
        var _a, _b, _c, _d, _e, _f;
        window.removeEventListener("resize", this.onResize.bind(this));
        window.removeEventListener("wheel", this.onWheel.bind(this));
        (_a = this.container) === null || _a === void 0 ? void 0 : _a.removeEventListener("mousedown", this.onTouchDown.bind(this));
        (_b = this.container) === null || _b === void 0 ? void 0 : _b.removeEventListener("mousemove", this.onTouchMove.bind(this));
        (_c = this.container) === null || _c === void 0 ? void 0 : _c.removeEventListener("mouseup", this.onTouchUp.bind(this));
        (_d = this.container) === null || _d === void 0 ? void 0 : _d.removeEventListener("touchstart", this.onTouchDown.bind(this));
        (_e = this.container) === null || _e === void 0 ? void 0 : _e.removeEventListener("touchmove", this.onTouchMove.bind(this));
        (_f = this.container) === null || _f === void 0 ? void 0 : _f.removeEventListener("touchend", this.onTouchUp.bind(this));
        this.medias.forEach((media) => media.dispose());
    }
}
