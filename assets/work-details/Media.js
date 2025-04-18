import { Mesh, Program, Texture, } from "ogl";
import { isMobile } from "../global";
const fragment = `
precision highp float;
 
uniform vec2 uImageSizes;
uniform vec2 uPlaneSizes;
uniform sampler2D tMap;
 
varying vec2 vUv;
 
void main() {
  vec2 ratio = vec2(
    min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
    min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
  );
 
  vec2 uv = vec2(
    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );
 
  gl_FragColor.rgb = texture2D(tMap, uv).rgb;
  gl_FragColor.a = 1.0;
}
`;
const vertex = `
precision highp float;
 
attribute vec3 position;
attribute vec2 uv;
 
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float uStrength;
uniform vec2 uViewportSizes;

uniform vec2 uOffset;
 
varying vec2 vUv;

float PI = 3.141529;

vec3 deformationCurve(vec3 position, vec2 uv, vec2 offset) {
  position.x += sin(uv.y * PI) * offset.x;
  position.y += sin(uv.x * PI) * offset.y;

  return position;
}
 
void main() {
  // vUv = uv;
 
  // vec3 p = deformationCurve(position, uv, uOffset);
 
  // gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);

  vec4 newPosition = modelViewMatrix * vec4(position, 1.0);

  newPosition.z += sin(newPosition.x / uViewportSizes.x * PI + PI / 2.0) * -uStrength * 2.0;

  vUv = uv;

  gl_Position = projectionMatrix * newPosition;
}
`;
export default class Media {
    constructor({ geometry, gl, image, index, length, scene, screen, viewport, }) {
        this.extra = 0;
        this.scale = 0;
        this.padding = 0.5;
        this.width = 0;
        this.widthTotal = 0;
        this.x = 0;
        this.geometry = geometry;
        this.gl = gl;
        this.image = image;
        this.index = index;
        this.length = length;
        this.scene = scene;
        this.screen = screen;
        this.viewport = viewport;
        this.offset = [0, 0];
        this.isBefore = false;
        this.isAfter = false;
        this.createShader();
        this.createMesh();
        this.onResize();
    }
    createShader() {
        var _a, _b, _c, _d;
        if (this.gl) {
            const texture = new Texture(this.gl, {
                generateMipmaps: false,
            });
            this.program = new Program(this.gl, {
                fragment,
                vertex,
                uniforms: {
                    tMap: { value: texture },
                    uPlaneSizes: { value: [0, 0] },
                    uImageSizes: { value: [0, 0] },
                    uViewportSizes: {
                        value: [(_b = (_a = this.viewport) === null || _a === void 0 ? void 0 : _a.width) !== null && _b !== void 0 ? _b : 0, (_d = (_c = this.viewport) === null || _c === void 0 ? void 0 : _c.height) !== null && _d !== void 0 ? _d : 0],
                    },
                    uStrength: { value: 0 },
                    uSpeed: { value: 0 },
                    uTime: { value: 0 },
                    uOffset: { value: [0, 0] },
                },
                transparent: true,
            });
            const image = new Image();
            image.src = this.image;
            image.onload = (_) => {
                texture.image = image;
                if (this.program)
                    this.program.uniforms.uImageSizes.value = [
                        image.naturalWidth,
                        image.naturalHeight,
                    ];
            };
        }
    }
    createMesh() {
        if (this.gl) {
            this.plane = new Mesh(this.gl, {
                geometry: this.geometry,
                program: this.program,
            });
            if (this.scene)
                this.plane.setParent(this.scene);
        }
    }
    onResize({ screen, viewport, } = {}) {
        var _a, _b;
        if (screen) {
            this.screen = screen;
        }
        if (viewport && this.plane) {
            this.viewport = viewport;
            this.plane.program.uniforms.uViewportSizes.value = [
                this.viewport.width,
                this.viewport.height,
            ];
        }
        this.scale = ((_b = (_a = this.screen) === null || _a === void 0 ? void 0 : _a.height) !== null && _b !== void 0 ? _b : 0) / 550;
        if (this.plane) {
            if (this.viewport && this.screen) {
                this.plane.scale.y =
                    (this.viewport.height * (488 * this.scale)) / this.screen.height;
                this.plane.scale.x =
                    (this.viewport.width * (650 * this.scale)) / this.screen.width;
            }
            this.plane.program.uniforms.uPlaneSizes.value = [
                this.plane.scale.x,
                this.plane.scale.y,
            ];
            this.width = this.plane.scale.x + this.padding;
            this.widthTotal = this.width * this.length;
        }
        this.x = this.width * this.index;
    }
    update(scroll, direction) {
        var _a, _b, _c, _d;
        if (this.plane) {
            this.plane.position.x = this.x - scroll.current - this.extra;
            const planeOffset = this.plane.scale.x / 2;
            const viewportOffset = (_b = (_a = this.viewport) === null || _a === void 0 ? void 0 : _a.width) !== null && _b !== void 0 ? _b : 0;
            this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
            this.isAfter = this.plane.position.x - planeOffset > viewportOffset;
            if (direction === "right" && this.isBefore) {
                this.extra -= this.widthTotal;
                this.isBefore = false;
                this.isAfter = false;
            }
            if (direction === "left" && this.isAfter) {
                this.extra += this.widthTotal;
                this.isBefore = false;
                this.isAfter = false;
            }
            this.plane.program.uniforms.uStrength.value =
                ((scroll.current - scroll.last) / ((_d = (_c = this.screen) === null || _c === void 0 ? void 0 : _c.width) !== null && _d !== void 0 ? _d : 1)) *
                    (isMobile() ? 300 : 2000);
        }
    }
    dispose() { }
}
