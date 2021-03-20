import {
  Mesh,
  Object3D,
  ShaderMaterial,
  DoubleSide,
  PlaneGeometry,
  UniformsLib,
} from 'three'
import vertexShader from '@shaders/hex/shader.vert'
import fragmentShader from '@shaders/hex/shader.frag'

export default class Hex {
  constructor(options) {
    this.time = options.time
    this.color = options.color
    this.camera = options.camera
    this.BLOOM_SCENE = options.BLOOM_SCENE

    this.container = new Object3D()
    this.container.name = 'Hex'

    this.createHex()
    this.setMovement()
  }

  createHex() {
    const geometry = new PlaneGeometry(70, 15)
    this.material = new ShaderMaterial({
      uniforms: {
        ...UniformsLib['fog'],
        time: { value: 0.0 },
        color: { type: 'v3', value: this.color },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      side: DoubleSide,
      fog: true,
    })

    this.hex = new Mesh(geometry, this.material)
    this.hex.position.y = 7.5
    this.hex.rotation.y = Math.PI / 2
    this.hex.layers.enable(this.BLOOM_SCENE)

    this.container.add(this.hex)
  }

  setMovement() {
    this.time.on('tick', () => {
      this.material.uniforms.time.value += 0.005
    })
  }
}
