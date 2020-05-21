import paper, { Tool, Path, Color, Size } from "paper"
import throttle from "lodash.throttle"
import firebase from "./Firebase"

type PathMap = Record<
  number,
  {
    id?: string
    data: string
  }
>
type ToolState = "inactive" | "active"

export default class DrawingCanvas {
  scope: paper.PaperScope
  localIds: Set<string> = new Set()
  brush: DrawTool
  mode: DrawMode = "paint"
  toolState: ToolState = "inactive"
  onResize: Function

  constructor({ canvas }: { canvas: HTMLCanvasElement }) {
    paper.setup(canvas)
    ;(window as any).paper = paper
    this.scope = paper

    this.brush = new DrawTool()
    this.draw()

    this.onResize = (): void => {
      const elem = paper.project.view.element
      if (elem.parentElement) {
        const rect = elem.parentElement.getBoundingClientRect()
        ;(paper.project.view as any).setViewSize(new Size(rect.width, rect.height))
        // eslint-disable-next-line indent
      }
    }

    paper.project.view.onMouseUp = (_event: paper.MouseEvent): void => {
      this.toolState = "inactive"
      const brush = this.brush
      // just drew a new line, need to update its store it add event listenr to erase if appropriate
      if (this.mode === "paint" && brush.currentPath) {
        this.setPathEventHandlers(brush.currentPath)
      }
    }

    paper.project.view.onMouseDown = (_event: paper.MouseEvent): void => {
      this.toolState = "active"

      if (this.mode === "paint" && this.brush.currentPath) {
        this.localIds.add(this.brush.currentPath.data.id)
      }
    }
  }

  get paths(): paper.Path[] {
    return paper.project.activeLayer.children as paper.Path[]
  }

  findPath(pathId: string): paper.Path | undefined {
    return this.paths.find(path => path.data.id === pathId)
  }

  loadPath(pathData: PathData): void {
    const existingPath = this.findPath(pathData.id) as any
    if (existingPath) {
      existingPath.setPathData(pathData.value)
    } else {
      const newPath = new Path({
        strokeColor: new Color("black"),
        strokeWidth: 8,
        strokeCap: "round",
      }) as any
      newPath.setPathData(pathData.value)
      newPath.data.id = pathData.id
      this.setPathEventHandlers(newPath)

      const pathRef = firebase.database().ref(`/draw_paths/${pathData.id}`)

      pathRef.on("value", (updatedSnapshot: any) => {
        this.loadPath({ id: updatedSnapshot.key, value: updatedSnapshot.val() })
      })
    }
  }

  setPathEventHandlers(path: paper.Path): void {
    path.onMouseEnter = (_event: paper.MouseEvent): void => {
      if (this.mode === "erase" && this.toolState === "active") {
        path.remove()
        if (path.data.id) {
          const pathRef = firebase.database().ref(`/draw_paths/${path.data.id}`)
          pathRef.remove()
        }
      } else if (this.mode === "erase") {
        path.fullySelected = true
      }
    }

    path.onMouseLeave = (_event: paper.MouseEvent): void => {
      if (path) {
        path.fullySelected = false
      }
    }
  }

  erase(): void {
    this.mode = "erase"
    this.brush.remove()
  }

  draw(): void {
    if (this.mode === "erase") {
      this.brush = new DrawTool()
    }
    this.mode = "paint"
    this.brush.activate()
  }
}

class DrawTool extends Tool {
  currentPath?: paper.Path
  pathRef?: any

  constructor() {
    super()

    const syncData = throttle(() => {
      if (this.pathRef && this.currentPath) {
        this.pathRef.set((this.currentPath as any).getPathData())
      }
    }, 300)

    this.onMouseDown = (_evt: paper.ToolEvent): void => {
      const key = firebase
        .database()
        .ref("draw_paths")
        .push().key
      this.pathRef = firebase.database().ref(`/draw_paths/${key}`)
      console.log("ADDING KEY")

      this.currentPath = new Path()
      this.currentPath.data.id = key
      this.currentPath.strokeColor = new Color("black")
      this.currentPath.strokeWidth = 8
      this.currentPath.strokeCap = "round"
    }

    this.onMouseUp = (_evt: paper.ToolEvent): void => {
      if (this.currentPath) {
        this.currentPath.simplify()
      }
    }

    this.onMouseDrag = (evt: paper.ToolEvent): void => {
      if (this.currentPath) {
        this.currentPath.add(evt.point)
        syncData()
      }
    }
  }
}
