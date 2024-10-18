import { Shape } from '../interfaces'
import { defaultPathThickness } from './constants'

const getUpdatedShapeData = (shape: Shape) => {
  const instance = shape.instance
  const updatedShape: Shape = {
    type: shape.type,
    fillColor: shape.fillColor,
    strokeColor: shape.strokeColor,
    x: instance ? instance.x : shape.x,
    y: instance ? instance.y : shape.y,
    width: shape.width,
    height: shape.height,
    radius: shape.radius,
    points: shape.points ? [...shape.points] : undefined,
    endX: shape.endX,
    endY: shape.endY,
  }

  switch (shape.type) {
    case 'line':
      if (instance) {
        const dx = instance.x - shape.x
        const dy = instance.y - shape.y
        updatedShape.endX = (shape.endX ?? 0) + dx
        updatedShape.endY = (shape.endY ?? 0) + dy
        updatedShape.thickness ??= shape?.instance?._strokeStyle?.width || defaultPathThickness
      }

      break
    case 'path':
      if (instance && updatedShape.points) {
        updatedShape.x = 0
        updatedShape.y = 0
        updatedShape.thickness ??= shape?.instance?._strokeStyle?.width || defaultPathThickness

        const dx = instance.x - shape.x
        const dy = instance.y - shape.y

        updatedShape.points = updatedShape.points.map(point => ({
          x: point.x + dx,
          y: point.y + dy,
        }))
      }
      break
  }

  return updatedShape
}

export const exportShapes = (shapes: Shape[]) => {
  // Only export active shapes (not deleted)
  const activeShapes = shapes.filter(shape => !shape.instance?.isDeleted)
  const exportedData = activeShapes.map(getUpdatedShapeData)

  try {
    const jsonString = JSON.stringify(exportedData, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'shapes.json'
    a.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error during export:', error)
  }
}

export const importShapes = ({
  event,
  createShape,
  clearShapes,
}: Readonly<{ event: React.ChangeEvent<HTMLInputElement>; createShape: any; clearShapes: any }>) => {
  const file = event.target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = e => {
      const result = e.target?.result
      if (result) {
        try {
          const importedShapes: Shape[] = JSON.parse(result as string)

          // Clear all existing shapes before importing
          clearShapes()

          importedShapes.forEach(shapeProps => {
            createShape(shapeProps)
          })
        } catch (error) {
          console.error('Failed to parse JSON:', error)
        }
      }
    }
    reader.readAsText(file)
  }
}
