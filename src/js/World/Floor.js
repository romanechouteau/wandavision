import { Mesh, Object3D, PlaneGeometry, MeshBasicMaterial } from 'three'

export default class Floor {
  constructor(options) {
    // Options
    this.time = options.time

    // Set up
    this.container = new Object3D()
    this.container.name = 'Floor'

    this.createFloor()
  }
  createFloor() {
    const geometry = new PlaneGeometry(80, 80)
    this.material = new MeshBasicMaterial({
      color: '#020202',
    })
    this.floor = new Mesh(geometry, this.material)
    this.floor.rotation.x = -Math.PI / 2

    this.container.add(this.floor)
  }
}
