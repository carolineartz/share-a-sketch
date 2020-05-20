/* eslint-disable @typescript-eslint/no-unused-vars */
import paper, { Tool, Path, Color } from "paper"
import firebase from "./Firebase"

type PathMap = Record<number, string>
type EraseState = "inactive" | "active"

export default class DrawingCanvas {
  brush: DrawTool
  // eraser: DrawTool
  paths: PathMap = {}
  mode: DrawMode = "draw"
  eraseState: EraseState = "inactive"

  constructor({ canvas, initialData }: { canvas: HTMLCanvasElement; initialData?: any }) {
    paper.setup(canvas)
    ;(window as any).paper = paper
    // debugger

    if (initialData) {
      this.import(initialData)
    }

    this.brush = new DrawTool()

    this.draw()

    paper.project.view.onMouseUp = (event: paper.MouseEvent) => {
      const brush = this.brush
      // just drew a new line, need to update its store it add event listenr to erase if appropriate
      if (this.mode === "draw") {
        this.setPathEventHandlers(brush.currentPath)
        this.storePath(brush.currentPath)
      } else if (this.mode === "erase") {
        this.eraseState = "inactive"
      }
    }

    paper.project.view.onMouseDown = (event: paper.MouseEvent) => {
      if (this.mode === "erase") {
        this.eraseState = "active"
      }
    }
  }

  storePath(path: paper.Path) {
    this.paths[path.id] = path.exportJSON()
  }

  setPathEventHandlers(path: paper.Path) {
    path.onMouseEnter = (event: paper.MouseEvent) => {
      if (this.mode === "erase" && this.eraseState === "active") {
        path.remove()
        delete this.paths[path.id]
      }
    }
  }

  import(data: any) {
    // console.log(data)
    // console.log("IMPORTING")
    // paper.project.importJSON(data)
  }

  erase() {
    this.mode = "erase"
    this.brush.remove()
  }

  draw() {
    if (this.mode === "erase") {
      this.brush = new DrawTool()
    }
    this.mode = "draw"
    this.brush.activate()
  }

  export() {
    return paper.project.exportJSON({ precision: 2 })
  }
}

class DrawTool extends Tool {
  currentPath: paper.Path

  constructor() {
    super()
    this.currentPath = new Path()

    this.onMouseDown = (_evt: paper.ToolEvent) => {
      this.currentPath = new Path()
      this.currentPath.strokeColor = new Color("black")
      this.currentPath.strokeWidth = 8
      this.currentPath.strokeCap = "round"
    }

    this.onMouseUp = (_evt: paper.ToolEvent) => {
      this.currentPath.simplify()
    }

    this.onMouseDrag = (evt: paper.ToolEvent) => {
      this.currentPath.add(evt.point)
    }
  }
}

// class EraseTool extends Tool {
//   currentPath: paper.Path
//   onUpdateStart?: () => void
//   onUpdateComplete?: () => void

//   constructor({
//     onUpdateStart,
//     onUpdateComplete,
//   }: {
//     onUpdateStart?: () => void
//     onUpdateComplete?: () => void
//   }) {
//     super()
//     this.currentPath = new Path()

//     this.onMouseDown = this._onMouseDown
//     this.onMouseDrag = this._onMouseDrag
//     this.onMouseUp = this._onMouseUp
//     // this.onUpdateStart = onUpdateStart
//     // this.onUpdateComplete = onUpdateComplete
//   }
//   private _onMouseDown(event: paper.ToolEvent) {
//     const item = event.item

//     if (item instanceof Path) {
//       item.removeSegments()

//       if (this.onUpdateStart) {
//         this.onUpdateStart()
//       }
//     }
//   }

//   private _onMouseUp(_event: paper.MouseEvent) {
//     if (this.onUpdateComplete) {
//       this.onUpdateComplete()
//     }
//   }

//   private _onMouseDrag(event: paper.ToolEvent) {
//     const item = event.item
//     // debugger
//     if (item instanceof Path) {
//       item.removeSegments()
//     }
//     // if (this.onUpdate) {
//     //   this.onUpdate()
//     // }
//   }
// }
