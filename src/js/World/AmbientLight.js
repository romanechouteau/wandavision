import { Object3D, AmbientLight, Color } from 'three'

export default class AmbientLightSource {
  constructor(options) {
    this.debug = options.debug

    this.container = new Object3D()
    this.container.name = 'Ambient Light'
    this.params = { color: 0x111111 }

    this.createAmbientLight()

    if (this.debug) {
      this.setDebug()
    }
  }

  createAmbientLight() {
    this.light = new AmbientLight(this.params.color, 1)
    this.container.add(this.light)
  }

  setDebug() {
    this.debugFolder = this.debug.addFolder('Ambient Light')
    this.debugFolder.open()
    this.debugFolder
      .addColor(this.params, 'color')
      .name('Color')
      .onChange(() => {
        this.light.color = new Color(this.params.color)
      })
  }
}
