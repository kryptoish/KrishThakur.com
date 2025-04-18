
//Import the THREE.js library
import * as THREE from "three";
// To allow for importing the .gltf file
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const pc_model = () => {
    //Create a Three.JS Scene
    const scene = new THREE.Scene();
    //create a new camera with positions and angles
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 800);
``
    //Keep track of the mouse position, so we can make the eye move
    let mouseX = window.innerWidth / 3;
    let mouseY = window.innerHeight / 3;

    //Keep the 3D object on a global variable so we can access it later
    let object: THREE.Object3D<THREE.Object3DEventMap>;

    //OrbitControls allow the camera to move around the scene
    let controls;

    //Set which object to render
    let objToRender = 'old_pc';

    //Instantiate a loader for the .gltf file
    const loader = new GLTFLoader();

    //Load the file
    loader.load(
        `models/${objToRender}/scene.gltf`,
        function (gltf) {
            //If the file is loaded, add it to the scene
            object = gltf.scene;
            scene.add(object);
        },
        function (xhr) {
            //While it is loading, log the progress
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            //If there is an error, log it
            console.error(error);
        }
    );

    //Instantiate a new renderer and set its size
    const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
    renderer.setSize(window.innerWidth, window.innerHeight);

    //Add the renderer to the DOM
    document.getElementById("container3D")!
    .appendChild(renderer.domElement);

    //Set how far the camera will be from the 3D model
    camera.position.z = objToRender === "old_pc" ? 250: 50;


    function zoomOut() {
        camera.position.z = objToRender === "old_pc" ? 1.2 : 50;
    }

    //Add lights to the scene, so we can actually see the 3D model

    const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
    topLight.position.set(500, 500, 500) //top-left-ish
    topLight.castShadow = true;
    scene.add(topLight);

    const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "old_pc" ? 5 : 1);
    scene.add(ambientLight);

    //Render the scene
    function animate() {
        requestAnimationFrame(animate);
        //Here we could add some code to update the scene, adding some automatic movement

        //Make the eye move
        if (object && objToRender === "old_pc") {
            //I've played with the constants here until it looked good 
            object.rotation.y = mouseX / window.innerWidth + 10;
            object.rotation.x = mouseY / window.innerHeight;
            renderer.render(scene, camera);
        }
    }
    
    //Add a listener to the window, so we can resize the window and the camera
    window.addEventListener("resize", function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });


    //add mouse position listener, so we can make the eye move
    document.onmousemove = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }


    animate();
    setTimeout(zoomOut, 6500);
}

document.addEventListener('DOMContentLoaded', function() {
    pc_model();
});



