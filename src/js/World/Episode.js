import {
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
  ShaderMaterial,
} from 'three'
import vertexShader from '@shaders/episode/shader.vert'
import fragmentShader from '@shaders/episode/shader.frag'

export default class Episode {
  constructor(options) {
    // Options
    this.time = options.time
    this.assets = options.assets
    this.id = options.id
    this.total = options.total
    this.radius = options.radius
    this.offset = options.offset

    // Set up
    this.container = new Object3D()
    this.container.name = `Episode ${this.id}`

    this.createEpisode()
    this.setMovement()
  }
  createEpisode() {
    const y = 5 + Math.random() * 4
    const geometry = new PlaneGeometry(1.7, 1.5)
    const glassMaterial = new MeshStandardMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0.02,
      roughness: 0,
    })
    const tvModel = this.assets.models.tv.scene.clone()
    tvModel.scale.set(100, 100, 100)
    tvModel.position.y = 1
    tvModel.children[0].children[5].material = glassMaterial

    this.material = new ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        color: { type: 'v3', value: this.color },
        photo: {
          type: 't',
          value: this.assets.textures[`episode${this.id + 1}`],
        },
      },
      vertexShader,
      fragmentShader,
    })
    this.episode = new Mesh(geometry, this.material)
    this.episode.position.set(0, 1.07, 0.7)

    this.tv = new Object3D()
    this.tv.add(tvModel, this.episode)
    this.tv.position.y = y
    this.tv.position.x =
      Math.cos((Math.PI * this.id * 2) / this.total) * (this.radius / 2)
    this.tv.position.z =
      Math.sin((Math.PI * this.id * 2) / this.total) * (this.radius / 2)
    this.tv.lookAt(0, y, 0)

    this.container.add(this.tv)
  }
  setMovement() {
    this.time.on('tick', () => {
      this.tv.position.y +=
        Math.sin(this.time.elapsed * 0.002 + this.offset) * 0.001
    })
  }
}
