declare module 'three/examples/jsm/controls/OrbitControls' {
  import { EventDispatcher } from 'three'
  import { Camera } from 'three'
  import { HTMLElement } from 'three'

  export class OrbitControls extends EventDispatcher {
    constructor(camera: Camera, domElement?: HTMLElement)

    enableDamping: boolean // Add damping option
    dampingFactor: number // Damping factor for smooth movement
    enableZoom: boolean // Enable or disable zooming

    update(): void
  }
}
