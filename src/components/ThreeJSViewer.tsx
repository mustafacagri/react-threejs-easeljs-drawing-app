import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Shape as ShapeInterface } from '../interfaces'
import { defaultPathThickness } from '../utils/constants'

interface ThreeJSViewerProps {
  shapes: ShapeInterface[]
}

const ThreeJSViewer: React.FC<ThreeJSViewerProps> = ({ shapes }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xffffff)

    const camera = new THREE.PerspectiveCamera(75, 800 / 800, 0.01, 2000)
    camera.position.set(0, 0, 500)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(800, 800)
    containerRef.current.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.25
    controls.enableZoom = true

    const light = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(light)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(0, 1, 0)
    scene.add(directionalLight)

    const convertTo3DCoords = (x: number, y: number): THREE.Vector3 => {
      const halfWidth = 400
      const halfHeight = 400
      return new THREE.Vector3(x - halfWidth, halfHeight - y, 0)
    }

    const create3DShape = (shape: ShapeInterface) => {
      let geometry: THREE.BufferGeometry
      let material: THREE.Material
      let mesh: THREE.Mesh

      const thickness = shape?.thickness ?? shape?.instance?._strokeStyle?.width ?? defaultPathThickness

      switch (shape.type) {
        case 'rectangle': {
          if (shape.width === undefined || shape.height === undefined) {
            return // Invalid rectangle, skip
          }

          const position = convertTo3DCoords(shape.x + shape.width / 2, shape.y + shape.height / 2)
          geometry = new THREE.BoxGeometry(shape.width, shape.height, 20)
          material = new THREE.MeshPhongMaterial({ color: shape.fillColor || 0xffffff })
          mesh = new THREE.Mesh(geometry, material)
          mesh.position.copy(position)
          break
        }
        case 'circle': {
          const position = convertTo3DCoords(shape.x, shape.y)
          geometry = new THREE.CylinderGeometry(shape.radius, shape.radius, 20, 32)
          material = new THREE.MeshPhongMaterial({ color: shape.fillColor || 0xffffff })
          mesh = new THREE.Mesh(geometry, material)
          mesh.rotation.x = Math.PI / 2
          mesh.position.copy(position)
          break
        }
        case 'line': {
          const startPosition = convertTo3DCoords(shape.x, shape.y)
          const endPosition = convertTo3DCoords(shape.endX!, shape.endY!)
          const lineCurve = new THREE.LineCurve3(startPosition, endPosition)
          geometry = new THREE.TubeGeometry(lineCurve, 10, thickness, 8, false)
          material = new THREE.MeshPhongMaterial({ color: shape?.strokeColor ?? 0x000000 })
          mesh = new THREE.Mesh(geometry, material)
          break
        }
        case 'path': {
          if (shape.points && shape.points.length > 1) {
            const pathPoints = shape.points.map(point => convertTo3DCoords(point.x, point.y))
            const curve = new THREE.CatmullRomCurve3(pathPoints)
            geometry = new THREE.TubeGeometry(curve, 64, thickness, 8, false)
            material = new THREE.MeshPhongMaterial({ color: shape.strokeColor || 0x000000 })
            mesh = new THREE.Mesh(geometry, material)
          } else {
            return // Invalid path, skip
          }
          break
        }
        default:
          return // Unknown shape type, skip
      }

      scene.add(mesh)
    }

    shapes.forEach(create3DShape)

    sceneRef.current = scene

    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }

    animate()

    return () => {
      if (container) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [shapes])

  return <div ref={containerRef}></div>
}

export default ThreeJSViewer
