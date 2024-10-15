// src/@types/easeljs.d.ts
import { Shape as CustomShape } from '../interfaces'

declare module '@createjs/easeljs' {
  export class Stage {
    constructor(canvas: HTMLCanvasElement)
    addChild(shape: CustomShape | Shape): void
    enableMouseOver(): void
    removeAllChildren(): void
    clear(): void
    removeChild(selectedShape: CustomShape | Shape): void
    update(): void
    children: Shape[]
    getObjectsUnderPoint(x: number, y: number, mode?: number): Shape[]
  }

  export class Shape {
    x: number
    y: number
    offset: { x: number; y: number }
    id: number
    graphics: Graphics
    constructor()
    on(event: string, handler: (this: Shape, evt: { stageX: number; stageY: number }) => void): void
  }

  export class Graphics {
    beginFill(color: string): Graphics
    beginStroke(color: string): Graphics
    setStrokeStyle(thickness: number): Graphics
    drawRect(x: number, y: number, width: number, height: number): Graphics
    drawCircle(x: number, y: number, radius: number): Graphics
    moveTo(x: number, y: number): Graphics
    lineTo(x: number, y: number): Graphics
    clear(): Graphics
  }

  export class Ticker {
    static framerate: number
    static addEventListener(event: string, listener: (event: Event) => void): void
    static removeEventListener(event: string, listener: (event: Event) => void): void
  }
}
