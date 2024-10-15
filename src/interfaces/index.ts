import { ShapeType } from '../utils/constants'

export interface Shape {
  id?: number
  color?: string
  type?: ShapeType
  fillColor: string
  strokeColor: string
  x: number
  y: number
  points?: { x: number; y: number }[]
  width?: number
  height?: number
  radius?: number
  endX?: number
  endY?: number
  graphics?: any
  instance?: any
}

export interface SidebarProps {
  clearShapes: () => void
  createShape: (props: Shape) => void
  setShapeType: (type: string) => void
  shapes: Shape[]
  shapeType: string
  toggleViewMode: () => void
  is3DMode: boolean
}
