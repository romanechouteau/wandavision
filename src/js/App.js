import {
  Fog,
  Scene,
  sRGBEncoding,
  WebGLRenderer,
  Layers,
  Vector2,
  Vector3,
  ShaderMaterial,
  MeshBasicMaterial,
} from 'three'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import gsap from 'gsap'
import * as dat from 'dat.gui'

import logo from '../../static/logo.png'

import Sizes from '@tools/Sizes'
import Time from '@tools/Time'
import Assets from '@tools/Loader'

import vertexShader from '@shaders/bloom/bloom.vert'
import fragmentShader from '@shaders/bloom/bloom.frag'

import Camera from './Camera'
import World from '@world/index'

const BLOOM_SCENE = 1

export default class App {
  constructor(options) {
    this.canvas = options.canvas

    this.time = new Time()
    this.sizes = new Sizes()
    this.assets = new Assets()

    this.begin = false
    this.bgColor = 0x050505

    this.setConfig()
    this.setRenderer()
    this.setCamera()
    this.setPostProcessing()
    this.setWorld()
    this.setTitle()
  }

  setConfig() {
    if (window.location.hash === '#debug') {
      this.debug = new dat.GUI({ width: 450 })
    }
  }

  setRenderer() {
    // Scene
    this.scene = new Scene()
    this.scene.fog = new Fog(this.bgColor, 1, 35)

    // Bloom layers
    this.bloomLayer = new Layers()
    this.bloomLayer.set(BLOOM_SCENE)

    // Materials
    this.darkMaterial = new MeshBasicMaterial({
      color: 'black',
      fog: false,
    })
    this.materials = {}

    // Renderer
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    this.renderer.outputEncoding = sRGBEncoding
    this.renderer.gammaFactor = 2.2

    // Background color
    this.renderer.setClearColor(this.bgColor, 1)

    // Pixel Ration & sizes
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.sizes.viewport.width, this.sizes.viewport.height)

    // Resize event
    this.sizes.on('resize', () => {
      this.renderer.setSize(
        this.sizes.viewport.width,
        this.sizes.viewport.height
      )
    })

    // requestAnimationFrame
    this.time.on('tick', () => {
      this.onTick()
    })

    if (this.debug) {
      this.renderOnBlur = { activated: true }
      const folder = this.debug.addFolder('Renderer')
      folder.open()
      folder.add(this.renderOnBlur, 'activated').name('Render on window blur')
    }
  }

  onTick() {
    this.camera.camera.position.lerp(this.cameraCenter, 0.005)

    const cameraX = this.camera.camera.position.x
    const cameraInWall = cameraX <= -2 && cameraX >= -2.5

    if (cameraInWall && !this.finalComposer.passes.includes(this.glitchPass)) {
      this.finalComposer.addPass(this.glitchPass)
    } else if (
      !cameraInWall &&
      this.finalComposer.passes.includes(this.glitchPass)
    ) {
      this.finalComposer.removePass(this.glitchPass)
    }

    if (
      !(this.renderOnBlur?.activated && !document.hasFocus()) &&
      this.bloomComposer &&
      this.finalComposer
    ) {
      this.renderer.setClearColor(0x000000, 1)
      this.scene.traverse(this.darkenNonBloomed.bind(this))
      this.bloomComposer.render()
      this.renderer.setClearColor(this.bgColor, 1)
      this.scene.traverse(this.restoreMaterial.bind(this))
      this.finalComposer.render()
    }
  }

  setCamera() {
    this.camera = new Camera({
      sizes: this.sizes,
      renderer: this.renderer,
      debug: this.debug,
    })
    this.cameraCenter = this.camera.camera.position
    this.scene.add(this.camera.container)
  }

  setWorld() {
    this.world = new World({
      resolution: [this.sizes.viewport.width, this.sizes.viewport.height],
      time: this.time,
      debug: this.debug,
      assets: this.assets,
      camera: this.camera,
      BLOOM_SCENE: BLOOM_SCENE,
    })
    this.scene.add(this.world.container)
  }

  setTitle() {
    document.getElementById('titleLogo').src = logo
    document.getElementById('titleStart').addEventListener('click', () => {
      gsap.to('.titleOverlay', { opacity: 0, display: 'none' })
      setTimeout(() => (this.cameraCenter = new Vector3(0, 4, 0)), 500)
    })
  }

  setPostProcessing() {
    this.renderScene = new RenderPass(this.scene, this.camera.camera)

    this.bloomComposer = new EffectComposer(this.renderer)
    this.bloomComposer.renderToScreen = false
    this.bloomPass = new UnrealBloomPass(
      new Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    )
    this.bloomPass.threshold = 0.2
    this.bloomPass.strength = 1
    this.bloomPass.radius = 0.2
    this.bloomPass.exposure = 0.5
    this.bloomComposer.addPass(this.renderScene)
    this.bloomComposer.addPass(this.bloomPass)

    this.finalPass = new ShaderPass(
      new ShaderMaterial({
        uniforms: {
          baseTexture: {
            value: null,
          },
          bloomTexture: {
            value: this.bloomComposer.renderTarget2.texture,
          },
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        defines: {},
      }),
      'baseTexture'
    )
    this.finalPass.needsSwap = true
    this.finalComposer = new EffectComposer(this.renderer)
    this.finalComposer.addPass(this.renderScene)
    this.finalComposer.addPass(this.finalPass)

    this.glitchPass = new GlitchPass()
  }

  darkenNonBloomed(obj) {
    if (obj.isMesh && this.bloomLayer.test(obj.layers) === false) {
      this.materials[obj.uuid] = obj.material
      obj.material = this.darkMaterial
    }
  }

  restoreMaterial(obj) {
    if (this.materials[obj.uuid]) {
      obj.material = this.materials[obj.uuid]
      delete this.materials[obj.uuid]
    }
  }
}
