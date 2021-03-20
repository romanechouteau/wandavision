import {
  Mesh,
  Object3D,
  PlaneGeometry,
  RepeatWrapping,
  MeshStandardMaterial,
} from 'three'

export default class Floor {
  constructor(options) {
    this.time = options.time
    this.assets = options.assets

    this.container = new Object3D()
    this.container.name = 'Floor'

    this.createFloor()
  }
  createFloor() {
    this.assets.textures.grass.color.repeat.set(8, 8)
    this.assets.textures.grass.ambientOcclusion.repeat.set(8, 8)
    this.assets.textures.grass.normal.repeat.set(8, 8)
    this.assets.textures.grass.roughness.repeat.set(8, 8)

    this.assets.textures.grass.color.wrapS = RepeatWrapping
    this.assets.textures.grass.ambientOcclusion.wrapS = RepeatWrapping
    this.assets.textures.grass.normal.wrapS = RepeatWrapping
    this.assets.textures.grass.roughness.wrapS = RepeatWrapping

    this.assets.textures.grass.color.wrapT = RepeatWrapping
    this.assets.textures.grass.ambientOcclusion.wrapT = RepeatWrapping
    this.assets.textures.grass.normal.wrapT = RepeatWrapping
    this.assets.textures.grass.roughness.wrapT = RepeatWrapping

    const geometry = new PlaneGeometry(80, 80)
    this.material = new MeshStandardMaterial({
      map: this.assets.textures.grass.color,
      aoMap: this.assets.textures.grass.ambientOcclusion,
      normalMap: this.assets.textures.grass.normal,
      roughnessMap: this.assets.textures.grass.roughness,
    })

    this.floor = new Mesh(geometry, this.material)
    this.floor.rotation.x = -Math.PI / 2

    this.container.add(this.floor)
  }
}
