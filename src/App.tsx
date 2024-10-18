import './App.css'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { getRandomColor } from './utils'
// @ts-expect-error -> no support for EaselJS in TypeScript -> https://github.com/CreateJS/EaselJS/issues/796
import { Stage, Shape, Ticker } from '@createjs/easeljs'
import { Shape as ShapeInterface } from './interfaces'
import { defaultPathThickness, ShapeType } from './utils/constants'
import Sidebar from './components/Sidebar'
import ThreeJSViewer from './components/ThreeJSViewer'
import { isEmpty } from 'lodash'

const Canvas: React.FC = () => {
  const [pathThickness, setPathThickness] = useState(defaultPathThickness)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stageRef = useRef<Stage | null>(null)
  const [shapes, setShapes] = useState<ShapeInterface[]>([])
  const [selectedShape, setSelectedShape] = useState<ShapeInterface | null>(null)
  const [shapeType, setShapeType] = useState<ShapeType>('rectangle')
  const [isDrawing, setIsDrawing] = useState(false)
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null)
  const [currentShape, setCurrentShape] = useState<Shape | null>(null)
  const [is3DMode, setIs3DMode] = useState(false)
  const pathColor = useRef(getRandomColor())

  const selectedIdRef = useRef<number | undefined>(undefined)
  const pathPointsRef = useRef<{ x: number; y: number }[]>([])

  const toggleViewMode = () => setIs3DMode(!is3DMode)

  const getStrokeThickness = (thickness?: number) => thickness ?? pathThickness

  // Function to handle shape creation
  const createShape = useCallback(
    (props: ShapeInterface) => {
      const stage = stageRef.current
      if (!stage) return

      const shape = new Shape()
      const g = shape.graphics

      switch (props.type) {
        case 'rectangle':
          g.beginFill(props.fillColor).beginStroke(props.strokeColor).drawRect(0, 0, props.width, props.height)
          break
        case 'circle':
          g.beginFill(props.fillColor).beginStroke(props.strokeColor).drawCircle(0, 0, props.radius)
          break
        case 'line':
          if (props.endX === undefined || props.endY === undefined) return

          g.beginStroke(props.strokeColor)
            .setStrokeStyle(getStrokeThickness(props?.thickness))
            .moveTo(0, 0)
            .lineTo(props.endX - props.x, props.endY - props.y)
          break
        case 'path':
          if (props?.points && props.points?.length > 1) {
            g.beginStroke(props.strokeColor).setStrokeStyle(getStrokeThickness(props?.thickness))
            g.moveTo(props.points[0].x, props.points[0].y)

            props.points.forEach((point: { x: number; y: number }, index: number) => {
              if (index > 0) g.lineTo(point.x, point.y)
            })
          }
          break
        default:
          return
      }

      shape.x = props.x
      shape.y = props.y

      // Handle mousedown event
      shape.on('mousedown', function (this: Shape, evt: { stageX: number; stageY: number }) {
        const { stageX, stageY } = evt
        const { x, y } = this

        // Calculate the offset for dragging
        this.offset = { x: x - stageX, y: y - stageY }
      })

      // Handle pressmove event (dragging)
      shape.on('pressmove', function (this: Shape, evt: { stageX: number; stageY: number }) {
        const { stageX, stageY } = evt
        const { offset } = this

        // Update position based on the drag event
        this.x = stageX + offset.x
        this.y = stageY + offset.y

        if (props.type === 'line') {
          if (props.endX === undefined || props.endY === undefined) return

          const dx = this.x - props.x
          const dy = this.y - props.y

          props.endX &&= props.endX + dx
          props.endY &&= props.endY + dy

          props.x = this.x
          props.y = this.y

          const g = this.graphics
          g.clear()
            .beginStroke(props.strokeColor)
            .setStrokeStyle(getStrokeThickness(props?.thickness))
            .moveTo(0, 0)
            .lineTo(props.endX - props.x, props.endY - props.y)
        } else if (props.type === 'path' && props.points) {
          // Update path points relative to new position
          const { x, y } = props

          props.points = props.points.map((point: { x: number; y: number }) => ({
            x: point.x + (this.x - x),
            y: point.y + (this.y - y),
          }))

          // Update path origin
          props.x = this.x
          props.y = this.y
        }

        // Only update the stage once per movement
        stage.update()
      })

      shape.on('pressup', function (this: Shape) {
        const { id, x, y } = this

        // Update only if the coordinates have changed
        setShapes(prevShapes =>
          prevShapes.map(shape => {
            if (shape.id === id) {
              if (shape.type === 'line') return { ...shape, x, y, endX: props.endX, endY: props.endY }
              return { ...shape, x, y, points: props?.points }
            }
            return shape
          })
        )
      })

      props.id = shape?.id || shapes.length + 1

      stage.addChild(shape)
      setShapes(prevShapes => [...prevShapes, { ...props, instance: shape }])
      stage.update()

      return shape
    },
    [shapes]
  )

  const startDrawing = (x: number, y: number) => {
    setStartPoint({ x, y })
    setIsDrawing(true)

    const newShape = new Shape()
    stageRef.current?.addChild(newShape)
    setCurrentShape(newShape)
  }

  const draw = (x: number, y: number) => {
    if (!isDrawing || !startPoint || !currentShape) return

    const g = currentShape.graphics
    g.clear()

    const { x: startX, y: startY } = startPoint
    let thickness = pathThickness

    if (['line', 'path'].includes(shapeType) && currentShape?.graphics?._strokeStyle?.width) {
      thickness = currentShape?.graphics?._strokeStyle?.width
    }

    switch (shapeType) {
      case 'rectangle':
        g.beginFill(pathColor.current)
          .beginStroke(pathColor.current)
          .drawRect(startX, startY, x - startX, y - startY)
        break
      case 'circle': {
        const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2))
        g.beginFill(pathColor.current).beginStroke(pathColor.current).drawCircle(startX, startY, radius)
        break
      }
      case 'line':
        g.beginStroke(pathColor.current).setStrokeStyle(thickness).moveTo(startX, startY).lineTo(x, y)
        break
      case 'path': {
        const newPoints = g.beginStroke(pathColor.current).setStrokeStyle(thickness)

        if (isEmpty(pathPointsRef.current)) {
          newPoints.moveTo(startX, startY)
        } else {
          pathPointsRef.current.forEach(point => newPoints.lineTo(point.x, point.y))
        }

        newPoints.lineTo(x, y)
      }
    }

    stageRef.current?.update()
  }

  const endDrawing = (x: number, y: number) => {
    if (!isDrawing || !startPoint || !currentShape) return

    let shapeProps: Shape
    const radius = Math.sqrt(Math.pow(x - startPoint.x, 2) + Math.pow(y - startPoint.y, 2))

    switch (shapeType) {
      case 'rectangle':
        shapeProps = {
          type: 'rectangle',
          fillColor: pathColor.current,
          strokeColor: getRandomColor(),
          x: Math.min(startPoint.x, x),
          y: Math.min(startPoint.y, y),
          width: Math.abs(x - startPoint.x),
          height: Math.abs(y - startPoint.y),
        }
        break
      case 'circle':
        shapeProps = {
          type: 'circle',
          fillColor: pathColor.current,
          strokeColor: getRandomColor(),
          x: startPoint.x,
          y: startPoint.y,
          radius,
        }
        break
      case 'line':
        shapeProps = {
          type: 'line',
          fillColor: 'transparent',
          strokeColor: pathColor.current,
          x: startPoint.x,
          y: startPoint.y,
          endX: x,
          endY: y,
          thickness: pathThickness,
        }
        break
      default:
        return
    }

    createShape(shapeProps)
    stageRef.current?.removeChild(currentShape)
    setIsDrawing(false)
    setStartPoint(null)
    setCurrentShape(null)
    stageRef.current?.update()
  }

  // Mouse event handlers
  const handleCanvasMouseDown = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing) pathColor.current = getRandomColor()
      const { offsetX, offsetY } = event.nativeEvent

      if (shapeType === 'path') {
        pathPointsRef.current.push({ x: offsetX, y: offsetY })
      }

      const clickedShape = stageRef.current?.getObjectsUnderPoint(offsetX, offsetY, 1)?.[0] as ShapeInterface

      if (clickedShape) {
        selectedIdRef.current = clickedShape?.id as number
        setSelectedShape(clickedShape)
      } else {
        startDrawing(offsetX, offsetY)
      }
    },
    [shapeType, isDrawing]
  )

  const handleCanvasMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const { offsetX, offsetY } = event.nativeEvent

      if (isDrawing) {
        draw(offsetX, offsetY)
      }
    },
    [isDrawing, shapeType]
  )

  const handleCanvasMouseUp = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const { offsetX, offsetY } = event.nativeEvent

      if (isDrawing) {
        if (shapeType === 'path') {
          pathPointsRef.current = [...pathPointsRef.current, { x: offsetX, y: offsetY }]
        } else {
          endDrawing(offsetX, offsetY)
        }
      } else if (shapeType === 'line') {
        // Find the shape with the corresponding id
        const foundLine = stageRef.current?.children.find((shape: Shape) => shape.id === selectedIdRef.current)

        // Extract coordinates with fallback to avoid undefined values
        const coordinates = {
          x: startPoint?.x ?? 0,
          y: startPoint?.y ?? 0,
          endX: foundLine?.x ?? 0,
          endY: foundLine?.y ?? 0,
        }

        // Update shapes, ensuring we don't spread undefined values
        setShapes(prevShapes =>
          prevShapes.map(shape =>
            shape.id === selectedIdRef.current ? { ...shape, ...coordinates, instance: foundLine } : shape
          )
        )
      }
    },
    [isDrawing, shapeType]
  )

  // Initialize canvas and attach event handlers
  useEffect(() => {
    if (canvasRef.current) {
      const stage = new Stage(canvasRef.current)
      stageRef.current = stage

      stage.enableMouseOver()

      Ticker.framerate = 60
      Ticker.addEventListener('tick', stage)

      return () => {
        Ticker.removeEventListener('tick', stage)
        stage.removeAllChildren()
        stage.clear()
      }
    }
  }, [])

  // Clear all shapes
  const clearShapes = useCallback(() => {
    const stage = stageRef.current

    if (stage) {
      stage.removeAllChildren()
      stage.clear()
      stage.update()
    }

    setShapes([])
    setSelectedShape(null)
    setIsDrawing(false)
    pathPointsRef.current = []
  }, [])

  // Keyboard delete, backspace handlers
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (['Delete', 'Backspace'].includes(event.key) && selectedShape) {
        const stage = stageRef.current

        if (stage) {
          stage.removeChild(selectedShape)
          setSelectedShape(null)
          setShapes(prevShapes => prevShapes.filter(shape => shape.id !== selectedShape?.id))
          stage.update()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedShape])

  useEffect(() => {
    // With this effect, we can finalize the path if the user right clicks
    const handleRightClick = (event: MouseEvent) => {
      event.preventDefault()

      if (isDrawing) {
        if (shapeType === 'path' && Array.isArray(pathPointsRef.current) && pathPointsRef.current.length > 1) {
          const current = {
            type: 'path',
            fillColor: pathColor.current,
            strokeColor: pathColor.current,
            x: 0,
            y: 0,
            points: pathPointsRef.current,
            instance: stageRef.current?.children[stageRef.current?.children.length - 1] as Shape,
            thickness: pathThickness,
          }

          stageRef.current?.removeChild(currentShape)
          stageRef.current?.update()

          createShape({
            ...current,
          })

          pathPointsRef.current = []
          setStartPoint(null)
        }

        setIsDrawing(false)
      }
    }

    window.addEventListener('contextmenu', handleRightClick)

    return () => {
      window.removeEventListener('contextmenu', handleRightClick)
    }
  }, [isDrawing])

  useEffect(() => {
    setIsDrawing(false)
  }, [shapeType])

  return (
    <div className='min-h-screen min-w-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-8'>
      <div className='flex gap-8 p-4 min-w-full'>
        <Sidebar
          clearShapes={clearShapes}
          createShape={createShape}
          setShapeType={setShapeType}
          shapes={shapes}
          shapeType={shapeType}
          toggleViewMode={toggleViewMode}
          is3DMode={is3DMode}
          pathThickness={pathThickness}
          setPathThickness={setPathThickness}
        />
        <div
          id='CanvasContainer'
          className='flex-1 bg-white rounded-lg shadow-lg border border-gray-400 rounded rounded-3xl shadow-lg cursor-crosshair p-0 max-w-[800px]'
        >
          <div
            className={`flex-1 bg-white rounded-lg shadow-lg border border-gray-400 rounded rounded-3xl shadow-lg p-0 max-w-[800px] ${
              is3DMode ? 'block' : 'hidden'
            }`}
          >
            <ThreeJSViewer shapes={shapes} />
          </div>

          <div
            id='CanvasContainer'
            className={`flex-1 bg-white rounded-lg shadow-lg border border-gray-400 rounded rounded-3xl shadow-lg cursor-crosshair p-0 max-w-[800px] ${
              !is3DMode ? 'block' : 'hidden'
            } `}
          >
            <canvas
              ref={canvasRef}
              width={800}
              height={700}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Canvas
