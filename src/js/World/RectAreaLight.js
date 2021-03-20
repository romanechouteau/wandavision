import { Object3D, Color, RectAreaLight } from 'three'

export default class RectAreaLightSource {
  constructor(options) {
    this.debug = options.debug

    this.container = new Object3D()
    this.container.name = 'RectArea Light'
    this.params = {
      color: 0x0099ff,
      positionX: 0,
      positionY: 0,
      positionZ: 0,
    }

    this.createRectAreaLight()

    if (this.debug) {
      this.setDebug()
    }
  }

  createRectAreaLight() {
    this.light = new RectAreaLight(this.params.color, 0.9, 70, 8)
    this.light.castShadow = true
    this.light.position.set(
      this.params.positionX,
      this.params.positionY,
      this.params.positionZ
    )
    this.light.lookAt(-15, 4, 0)
    this.container.add(this.light)
  }

  setDebug() {
    this.debugFolder = this.debug.addFolder('Point Light')
    this.debugFolder.open()
    this.debugFolder
      .addColor(this.params, 'color')
      .name('Color')
      .onChange(() => {
        this.light.color = new Color(this.params.color)
      })
    this.debugFolder
      .add(this.light.position, 'x')
      .step(0.1)
      .min(-5)
      .max(5)
      .name('Position X')
    this.debugFolder
      .add(this.light.position, 'y')
      .step(0.1)
      .min(-5)
      .max(5)
      .name('Position Y')
    this.debugFolder
      .add(this.light.position, 'z')
      .step(0.1)
      .min(-5)
      .max(5)
      .name('Position Z')
  }
}
