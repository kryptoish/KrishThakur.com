import * as THREE from "three";
import { isMobile } from "../global";
const vertex = `
uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
uniform vec2 pixels;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;
const fragment = `
uniform float time;
uniform float progress;
uniform sampler2D uDataTexture;
uniform sampler2D uTexture;

uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
void main()	{
  vec2 coords = vUv;

  float texture_ratio = resolution.z / resolution.w;
  float canvas_ratio = resolution.x / resolution.y;

  if(texture_ratio > canvas_ratio) {
    float diff = canvas_ratio / texture_ratio;
    coords.x *= diff;
    coords.x += (1. - diff) / 2.;
  }
  else {
    float diff = texture_ratio / canvas_ratio;
    coords.y *= diff;
    coords.y += (1. - diff) / 2.;
  }

  vec4 offset = texture2D(uDataTexture,vUv);

  gl_FragColor = texture2D(uTexture,coords - 0.02*offset.rg);
}
`;
function clamp(number, min, max) {
    return Math.max(min, Math.min(number, max));
}
export default class ImageHover {
    constructor(options) {
        var _a;
        this.scene = new THREE.Scene();
        this.container = (_a = options.dom) !== null && _a !== void 0 ? _a : document.body;
        const bounds = this.container.getBoundingClientRect();
        this.img = this.container.querySelector("img");
        this.width = bounds.width;
        this.height = bounds.height;
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0xffffff, 1);
        this.imageAspect = 1;
        this.size = 0;
        this.container.appendChild(this.renderer.domElement);
        var frustumSize = 1;
        this.camera = new THREE.OrthographicCamera(frustumSize / -2, frustumSize / 2, frustumSize / 2, frustumSize / -2, -1000, 1000);
        this.camera.position.set(0, 0, 2);
        this.time = 0;
        this.mouse = {
            x: 0,
            y: 0,
            prevX: 0,
            prevY: 0,
            vX: 0,
            vY: 0,
        };
        this.isPlaying = true;
        this.settings = {
            grid: this.getValue("grid") || 34,
            mouse: this.getValue("mouse") || 0.25,
            strength: this.getValue("strength") || 1,
            relaxation: this.getValue("relaxation") || 0.9,
        };
        this.addObjects();
        this.resize();
        this.render();
        this.setupResize();
        this.mouseEvents();
    }
    getValue(val) {
        var _a;
        return parseFloat((_a = this.container.getAttribute("data-" + val)) !== null && _a !== void 0 ? _a : "");
    }
    mouseMoveHandler(e) {
        if (e.type === "touchmove")
            e.preventDefault();
        const clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;
        const bounds = this.container.getBoundingClientRect();
        this.mouse.x = (clientX - bounds.left) / this.width;
        this.mouse.y = (clientY - bounds.top) / this.height;
        this.mouse.vX = this.mouse.x - this.mouse.prevX;
        this.mouse.vY = this.mouse.y - this.mouse.prevY;
        this.mouse.prevX = this.mouse.x;
        this.mouse.prevY = this.mouse.y;
    }
    mouseEvents() {
        this.container.addEventListener("mousemove", this.mouseMoveHandler.bind(this));
        this.container.addEventListener("touchmove", this.mouseMoveHandler.bind(this));
    }
    setupResize() {
        window.addEventListener("resize", this.resize.bind(this, false));
    }
    resize(init = false) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const bounds = this.container.getBoundingClientRect();
        this.width = bounds.width;
        this.height = bounds.height;
        this.renderer.setSize(this.width, this.height);
        // image cover
        this.imageAspect =
            ((_b = (_a = this.img) === null || _a === void 0 ? void 0 : _a.naturalWidth) !== null && _b !== void 0 ? _b : 1) / ((_d = (_c = this.img) === null || _c === void 0 ? void 0 : _c.naturalHeight) !== null && _d !== void 0 ? _d : 1);
        if (this.material) {
            this.material.uniforms.resolution.value.x = this.width;
            this.material.uniforms.resolution.value.y = this.height;
            this.material.uniforms.resolution.value.z = (_f = (_e = this.img) === null || _e === void 0 ? void 0 : _e.naturalWidth) !== null && _f !== void 0 ? _f : 1;
            this.material.uniforms.resolution.value.w = (_h = (_g = this.img) === null || _g === void 0 ? void 0 : _g.naturalHeight) !== null && _h !== void 0 ? _h : 1;
        }
        this.camera.updateProjectionMatrix();
        if ((isMobile() && init) || !isMobile())
            this.regenerateGrid();
    }
    regenerateGrid() {
        var _a;
        this.size = this.settings.grid;
        const bounds = this.container.getBoundingClientRect();
        const width = Math.round(bounds.width / this.size);
        const height = Math.round(bounds.height / this.size);
        const size = width * height;
        const data = new Float32Array(3 * size);
        for (let i = 0; i < size; i++) {
            let r = Math.random() * 255 - 125;
            let r1 = Math.random() * 255 - 125;
            const stride = i * 3;
            data[stride] = r;
            data[stride + 1] = r1;
            data[stride + 2] = r;
        }
        // used the buffer to create a DataTexture
        this.texture = new THREE.DataTexture(data, width, height, 
        // @ts-ignore
        THREE.RGBFormat, THREE.FloatType);
        this.texture.magFilter = this.texture.minFilter = THREE.NearestFilter;
        if (this.material) {
            this.material.uniforms.uDataTexture.value = this.texture;
            this.material.uniforms.uDataTexture.value.needsUpdate = true;
        }
        // Hide img element
        (_a = this.container) === null || _a === void 0 ? void 0 : _a.setAttribute("data-image-loaded", "");
    }
    addObjects() {
        this.regenerateGrid();
        if (this.img) {
            let texture = new THREE.Texture(this.img);
            texture.needsUpdate = true;
            this.material = new THREE.ShaderMaterial({
                side: THREE.DoubleSide,
                uniforms: {
                    time: {
                        value: 0,
                    },
                    resolution: {
                        value: new THREE.Vector4(),
                    },
                    uTexture: {
                        value: texture,
                    },
                    uDataTexture: {
                        value: this.texture,
                    },
                },
                vertexShader: vertex,
                fragmentShader: fragment,
            });
            this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
            this.plane = new THREE.Mesh(this.geometry, this.material);
            this.scene.add(this.plane);
        }
    }
    updateDataTexture() {
        const bounds = this.container.getBoundingClientRect();
        const width = Math.round(bounds.width / this.size);
        const height = Math.round(bounds.height / this.size);
        if (this.texture) {
            let data = this.texture.image.data;
            for (let i = 0; i < data.length; i += 3) {
                data[i] *= this.settings.relaxation;
                data[i + 1] *= this.settings.relaxation;
            }
            let gridMouseX = width * this.mouse.x;
            let gridMouseY = height * (1 - this.mouse.y);
            let maxDist = width * this.settings.mouse;
            let aspect = this.height / this.width;
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    let distance = Math.pow((gridMouseX - i), 2) / aspect + Math.pow((gridMouseY - j), 2);
                    let maxDistSq = Math.pow(maxDist, 2);
                    if (distance < maxDistSq) {
                        let index = 3 * (i + width * j);
                        let power = maxDist / Math.sqrt(distance);
                        power = clamp(power, 0, 10);
                        data[index] += this.settings.strength * 100 * this.mouse.vX * power;
                        data[index + 1] -=
                            this.settings.strength * 100 * this.mouse.vY * power;
                    }
                }
            }
            this.mouse.vX *= 0.9;
            this.mouse.vY *= 0.9;
            this.texture.needsUpdate = true;
        }
    }
    render() {
        if (!this.isPlaying)
            return;
        this.time += 0.05;
        this.updateDataTexture();
        if (this.material)
            this.material.uniforms.time.value = this.time;
        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this.scene, this.camera);
    }
    dispose() {
        window.removeEventListener("resize", this.resize.bind(this, false));
        this.container.removeEventListener("mousemove", this.mouseMoveHandler.bind(this));
        this.container.removeEventListener("touchmove", this.mouseMoveHandler.bind(this));
        this.container.removeChild(this.renderer.domElement);
        this.renderer.dispose();
    }
}
