import { Renderer, Camera, Transform, Plane } from "ogl";
import NormalizeWheel from "normalize-wheel";
import Media from "./Media";
import { lerp } from "../helpers/utils";
export default class {
    constructor() {
        this.medias = [];
        this.screen = {
            height: 0,
            width: 0,
        };
        this.viewport = {
            height: 0,
            width: 0,
        };
        this.direction = "down";
        this.scene = null;
        this.galleryHeight = 0;
        this.isDown = false;
        this.start = 0;
        this.scroll = {
            ease: 0.05,
            current: 0,
            target: 0,
            last: 0,
        };
        this.speed = 2;
        this.createRenderer();
        this.createCamera();
        this.createScene();
        this.createGallery();
        this.onResize();
        this.createGeometry();
        this.createMedias();
        this.update();
        this.addEventListeners();
    }
    createGallery() {
        this.gallery = document.querySelector(".life__gallery");
    }
    createRenderer() {
        var _a;
        this.renderer = new Renderer({
            alpha: true,
        });
        this.gl = this.renderer.gl;
        this.gl.canvas.classList.add("life__canvas");
        if (document.querySelector(".life__canvas--wrapper") !== null) {
            (_a = document
                .querySelector(".life__canvas--wrapper")) === null || _a === void 0 ? void 0 : _a.appendChild(this.gl.canvas);
        }
    }
    createCamera() {
        if (this.gl) {
            this.camera = new Camera(this.gl);
            this.camera.fov = 45;
            this.camera.position.z = 5;
        }
    }
    createScene() {
        this.scene = new Transform();
    }
    createGeometry() {
        if (this.gl) {
            this.planeGeometry = new Plane(this.gl, {
                heightSegments: 10,
            });
        }
    }
    createMedias() {
        this.mediasElements = document.querySelectorAll(".life__gallery__figure");
        this.medias = Array.from(this.mediasElements).map((element) => {
            let media = new Media({
                element,
                geometry: this.planeGeometry,
                gl: this.gl,
                height: this.galleryHeight,
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
        event.preventDefault();
        this.isDown = true;
        this.scroll.position = this.scroll.current;
        this.start = event.touches ? event.touches[0].clientY : event.clientY;
    }
    onTouchMove(event) {
        var _a;
        if (!this.isDown)
            return;
        const y = event.touches ? event.touches[0].clientY : event.clientY;
        const distance = (this.start - y) * 4;
        this.scroll.target = ((_a = this.scroll.position) !== null && _a !== void 0 ? _a : 0) + distance;
    }
    onTouchUp() {
        this.isDown = false;
    }
    onWheel(event) {
        const normalized = NormalizeWheel(event);
        const speed = normalized.pixelY;
        this.scroll.target += speed * 0.4;
    }
    /**
     * Resize.
     */
    onResize() {
        var _a, _b, _c;
        this.screen = {
            height: window.innerHeight,
            width: window.innerWidth,
        };
        (_a = this.renderer) === null || _a === void 0 ? void 0 : _a.setSize(this.screen.width, this.screen.height);
        (_b = this.camera) === null || _b === void 0 ? void 0 : _b.perspective({
            aspect: this.gl ? this.gl.canvas.width / this.gl.canvas.height : 1,
        });
        const fov = (this.camera ? this.camera.fov : 1) * (Math.PI / 180);
        const height = 2 * Math.tan(fov / 2) * (this.camera ? this.camera.position.z : 1);
        const width = height * (this.camera ? this.camera.aspect : 1);
        this.viewport = {
            height,
            width,
        };
        this.galleryBounds = (_c = this.gallery) === null || _c === void 0 ? void 0 : _c.getBoundingClientRect();
        this.galleryHeight =
            (this.viewport.height * this.galleryBounds.height) / this.screen.height;
        if (this.medias) {
            this.medias.forEach((media) => media.onResize({
                height: this.galleryHeight,
                screen: this.screen,
                viewport: this.viewport,
            }));
        }
    }
    /**
     * Update.
     */
    update() {
        var _a;
        this.scroll.target += this.speed;
        this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
        if (this.scroll.current > this.scroll.last) {
            this.direction = "down";
            this.speed = 2;
        }
        else if (this.scroll.current < this.scroll.last) {
            this.direction = "up";
            this.speed = -2;
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
        window.addEventListener("resize", this.onResize.bind(this));
        window.addEventListener("mousewheel", this.onWheel.bind(this));
        window.addEventListener("wheel", this.onWheel.bind(this));
        window.addEventListener("mousedown", this.onTouchDown.bind(this));
        window.addEventListener("mousemove", this.onTouchMove.bind(this));
        window.addEventListener("mouseup", this.onTouchUp.bind(this));
        window.addEventListener("touchstart", this.onTouchDown.bind(this));
        window.addEventListener("touchmove", this.onTouchMove.bind(this));
        window.addEventListener("touchend", this.onTouchUp.bind(this));
    }
    dispose() {
        // Remove event listeners
        window.removeEventListener("resize", this.onResize.bind(this));
        window.removeEventListener("mousewheel", this.onWheel.bind(this));
        window.removeEventListener("wheel", this.onWheel.bind(this));
        window.removeEventListener("mouseup", this.onTouchUp.bind(this));
        window.removeEventListener("mousedown", this.onTouchDown.bind(this));
        window.removeEventListener("mousemove", this.onTouchMove.bind(this));
        window.removeEventListener("touchstart", this.onTouchDown.bind(this));
        window.removeEventListener("touchmove", this.onTouchMove.bind(this));
        window.removeEventListener("touchend", this.onTouchUp.bind(this));
        // Remove canvas
        if (this.gl) {
            this.gl.canvas.remove();
        }
    }
}
