import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { FontLoader} from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/4.png')

/**
 * Particles
 */

//Geometry
const particleGeometry = new THREE.BufferGeometry()
const count = 5000

const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for(let i = 0; i < count * 3; i++){
    positions[i] = (Math.random() - 0.5) * 10
    colors[i] = Math.random()
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3),
particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
)


//Material
const particleMaterial = new THREE.PointsMaterial()
particleMaterial.size = 0.1
particleMaterial.sizeAttenuation = true;
particleMaterial.alphaMap = particleTexture;
particleMaterial.transparent = true;
// particleMaterial.alphaTest = 0.001
// particleMaterial.depthTest = false;
particleMaterial.depthWrite = false; 
particleMaterial.blending = THREE.AdditiveBlending
particleMaterial.color = new THREE.Color('white')
// particleMaterial.vertexColors = true

//Points
const particles = new THREE.Points(particleGeometry, particleMaterial)
scene.add(particles)



/**
 * Fonts
 */
const audio = new Audio('/textures/song/song.mp3');

// Function to play audio when text is clicked
function playAudioOnClick() {
    audio.play();
}

function stopAudio(){
    audio.pause();
}

// Fonts (Assuming this is where your 'Merry Christmas!' text is created)
const fontLoader = new FontLoader()
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry = new TextGeometry(
            'Merry Christmas!',
            {
                font,
                size: 0.5,
                height: 0.2,
                curveSegments: 5,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 4
            }
        );
        textGeometry.center();
        const textMaterial = new THREE.MeshNormalMaterial();
        const text = new THREE.Mesh(textGeometry, textMaterial);
        scene.add(text);
        
        const play = false;
        text.addEventListener('click', () => {
            if(!play){
                playAudioOnClick();
            }else{
                stopAudio();
            }
        });
        
    }
);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    particles.rotation.x += 0.001; 
    particles.rotation.y += 0.001;
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()