import { AxesHelper, Object3D, Vector3 } from 'three'
import { map } from 'lodash'

import AmbientLightSource from './AmbientLight'
import RectAreaLightSource from './RectAreaLight'
import Hex from './Hex'
import Floor from './Floor'
import Episode from './Episode'

export default class World {
  constructor(options) {
    this.time = options.time
    this.debug = options.debug
    this.assets = options.assets
    this.resolution = options.resolution
    this.camera = options.camera
    this.BLOOM_SCENE = options.BLOOM_SCENE

    this.container = new Object3D()
    this.container.name = 'World'

    if (this.debug) {
      this.container.add(new AxesHelper(5))
      this.debugFolder = this.debug.addFolder('World')
      this.debugFolder.open()
    }

    this.setLoader()
  }

  setLoader() {
    this.loadDiv = document.querySelector('.loadScreen')
    this.loadModels = this.loadDiv.querySelector('.load')
    this.progress = this.loadDiv.querySelector('.progress')

    if (this.assets.total === 0) {
      this.init()
      this.loadDiv.remove()
    } else {
      this.assets.on('ressourceLoad', () => {
        this.progress.style.width = this.loadModels.innerHTML = `${
          Math.floor((this.assets.done / this.assets.total) * 100) +
          Math.floor((1 / this.assets.total) * this.assets.currentPercent)
        }%`
      })

      this.assets.on('ressourcesReady', () => {
        setTimeout(() => {
          this.init()
          this.loadDiv.style.opacity = 0
          setTimeout(() => {
            this.loadDiv.remove()
          }, 550)
        }, 1000)
      })
    }
  }

  init() {
    this.setAmbientLight()
    this.setRectAreaLight()
    this.setHex()
    this.setFloor()
    this.setTick()
    // this.setEpisodes()
  }

  setAmbientLight() {
    this.ambientlight = new AmbientLightSource({
      debug: this.debugFolder,
    })
    this.container.add(this.ambientlight.container)
  }

  setRectAreaLight() {
    this.light = new RectAreaLightSource({
      debug: this.debugFolder,
    })
    this.container.add(this.light.container)
  }

  setHex() {
    this.hex = new Hex({
      time: this.time,
      color: new Vector3(0, 0.6, 1),
      opposite: new Vector3(1, 0, 0),
      camera: this.camera,
      BLOOM_SCENE: this.BLOOM_SCENE,
    })
    this.container.add(this.hex.container)
  }

  setFloor() {
    this.floor = new Floor({
      time: this.time,
      assets: this.assets,
    })
    this.container.add(this.floor.container)
  }

  setEpisodes() {
    const EPISODES = [
      {
        name: 'Hello',
      },
      {
        name: 'Hello',
      },
      {
        name: 'Hello',
      },
      {
        name: 'Hello',
      },
      {
        name: 'Hello',
      },
      {
        name: 'Hello',
      },
      {
        name: 'Hello',
      },
      {
        name: 'Hello',
      },
      {
        name: 'Hello',
      },
    ]
    this.episodes = map(
      EPISODES,
      (episode, id) =>
        new Episode({
          time: this.time,
          id,
          total: EPISODES.length,
          radius: 30,
          assets: this.assets,
          offset: Math.random() * EPISODES.length,
        })
    )
    this.container.add(...map(this.episodes, (episode) => episode.container))
  }

  setTick() {
    this.time.on('tick', () => {
      const cameraX = this.camera.camera.position.x
      if (
        this.container.children.includes(this.hex.container) &&
        cameraX <= -2.2 &&
        cameraX >= -2.3
      ) {
        this.container.remove(this.hex.container)
      }
    })
  }
}
