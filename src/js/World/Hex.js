import {
  CylinderGeometry,
  Mesh,
  Object3D,
  ShaderMaterial,
  DoubleSide,
} from 'three'
import vertexShader from '@shaders/hex/shader.vert'
import fragmentShader from '@shaders/hex/shader.frag'

export default class Hex {
  constructor(options) {
    // Options
    this.time = options.time
    this.color = options.color
    this.camera = options.camera

    // Set up
    this.container = new Object3D()
    this.container.name = 'Hex'

    this.createHex()
    this.setMovement()
  }
  createHex() {
    const geometry = new CylinderGeometry(10, 10, 25, 6, 1, true)
    this.material = new ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        color: { type: 'v3', value: this.color },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      side: DoubleSide,
    })
    this.hex = new Mesh(geometry, this.material)
    this.hex.position.y = 12.5

    this.container.add(this.hex)
  }
  setMovement() {
    this.time.on('tick', () => {
      this.material.uniforms.time.value += 0.005
    })
  }
}
