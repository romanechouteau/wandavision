import { Scene, sRGBEncoding, WebGLRenderer } from 'three'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'
import { TechnicolorShader } from 'three/examples/jsm/shaders/TechnicolorShader.js'
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import * as dat from 'dat.gui'

import Sizes from '@tools/Sizes'
import Time from '@tools/Time'
import Assets from '@tools/Loader'

import Camera from './Camera'
import World from '@world/index'

export default class App {
  constructor(options) {
    // Set options
    this.canvas = options.canvas

    // Set up
    this.time = new Time()
    this.sizes = new Sizes()
    this.assets = new Assets()

    this.setConfig()
    this.setRenderer()
    this.setCamera()
    this.setWorld()
  }
  setRenderer() {
    // Set scene
    this.scene = new Scene()
    // Set renderer
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    this.renderer.outputEncoding = sRGBEncoding
    this.renderer.gammaFactor = 2.2
    // Set background color
    this.renderer.setClearColor(0x212121, 1)
    // Set renderer pixel ratio & sizes
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.sizes.viewport.width, this.sizes.viewport.height)
    this.composer = new EffectComposer(this.renderer)
    // Resize renderer on resize event
    this.sizes.on('resize', () => {
      this.renderer.setSize(
        this.sizes.viewport.width,
        this.sizes.viewport.height
      )
    })
    // Set RequestAnimationFrame with 60fps
    this.time.on('tick', () => {
      // When tab is not visible (tab is not active or window is minimized), browser stops requesting animation frames. Thus, this does not work
      // if the window is only in the background without focus (for example, if you select another window without minimizing the browser one),
      // which might cause some performance or batteries issues when testing on multiple browsers
      if (!(this.renderOnBlur?.activated && !document.hasFocus())) {
        this.renderer.render(this.scene, this.camera.camera)
        this.composer.render()
      }
    })

    if (this.debug) {
      this.renderOnBlur = { activated: true }
      const folder = this.debug.addFolder('Renderer')
      folder.open()
      folder.add(this.renderOnBlur, 'activated').name('Render on window blur')
    }
  }
  setCamera() {
    // Create camera instance
    this.camera = new Camera({
      sizes: this.sizes,
      renderer: this.renderer,
      debug: this.debug,
    })
    this.setPostProcessing()
    // Add camera to scene
    this.scene.add(this.camera.container)
  }
  setWorld() {
    // Create world instance
    this.world = new World({
      resolution: [this.sizes.viewport.width, this.sizes.viewport.height],
      time: this.time,
      debug: this.debug,
      assets: this.assets,
      camera: this.camera,
    })
    // Add world to scene
    this.scene.add(this.world.container)
  }
  setConfig() {
    if (window.location.hash === '#debug') {
      this.debug = new dat.GUI({ width: 450 })
    }
  }
  setPostProcessing() {
    const renderPass = new RenderPass(this.scene, this.camera.camera)
    this.composer.addPass(renderPass)

    // const effectFilm = new FilmPass(0.35, 0.025, 648, false)
    // this.composer.addPass(effectFilm)

    // const glitchPass = new GlitchPass()
    // this.composer.addPass(glitchPass)

    // const technicolor = new ShaderPass(TechnicolorShader)
    // this.composer.addPass(technicolor)
  }
}
