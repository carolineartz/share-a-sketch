/* eslint-disable no-shadow, no-case-declarations, @typescript-eslint/no-explicit-any, indent, @typescript-eslint/explicit-function-return-type */
import * as React from "react"
import throttle from "lodash.throttle"

import paper, { Path, Group, PathItem, Color, Size, Tool } from "paper"
import firebase from "../../Firebase"
import * as DrawSettingsContext from "./DrawSettingsContext"

export type RemotePath = {
  id?: string
  definition: string
  strokeWidth: number
  color: string // covers strokeColor and fill
}

type CreatPaperHookType = {
  setCanvas: (canvas: HTMLCanvasElement) => void
}

const pathsRef = firebase.database().ref("paths_new")

type LocalState = {
  color: DesignColor
  strokeWidth: DrawStrokeWidth
  shape: DrawShape
  tool: DrawTool
  toolState: "active" | "inactive"
  activePath?: paper.Item
  localPathCache: Record<string, paper.Item>
  paperScope: paper.PaperScope
  paperTool: paper.Tool
}

export const usePaperJs = (): CreatPaperHookType => {
  const [canvas, setCanvas] = React.useState<HTMLCanvasElement | null>(null)
  const { tool, shape, strokeWidth, color } = DrawSettingsContext.useDrawSettings()

  const localState = React.useRef<LocalState>({
    tool,
    toolState: "inactive",
    shape,
    strokeWidth,
    color,
    paperScope: paper,
    localPathCache: {} as Record<string, paper.Item>,
    paperTool: new Tool(),
  })

  React.useEffect(() => {
    if (canvas) {
      const scope = localState.current.paperScope
      scope.setup(canvas)

      scope.project.view.onMouseUp = handleMouseUp
      scope.project.view.onMouseDown = handleMouseDown
      scope.project.view.onMouseDrag = handleMouseDrag

      pathsRef.orderByKey().once("value", (snapshot: any) => {
        try {
          const paths = snapshot.val()
          if (paths) {
            Object.entries(paths).forEach(([pathId, pathVal]: [string, unknown]) => {
              loadPath({ id: pathId, ...(pathVal as RemotePath) })
            })
          }
        } catch (e) {
          console.error(e)
        }
      })

      pathsRef.on("child_added", (addedSnapshot: any) => {
        console.log("CHILD ADDED")
        loadPath({ id: addedSnapshot.key, ...addedSnapshot.val() })
      })
    }

    return () => {
      pathsRef.off()
    }
  }, [canvas])

  React.useEffect(() => {
    localState.current.tool = tool
    localState.current.shape = shape
    localState.current.strokeWidth = strokeWidth
    localState.current.color = color
  }, [tool, shape, strokeWidth, color])

  function loadPath({
    id,
    definition,
    color: loadColor,
    strokeWidth: stroke,
  }: {
    id: string
    definition: string
    color: string
    strokeWidth: number
  }) {
    const existingPath = (paper.project.activeLayer.children as paper.Item[]).find(item => item.data.id === id)

    if (existingPath) {
      const path = existingPath as any
      path.pathData = definition
    } else {
      const newPath = new Path({
        strokeColor: new Color(loadColor),
        strokeWidth: stroke,
        strokeCap: "round",
        fillColor: stroke === 0 ? new Color(loadColor) : new Color("transparent"),
        fill: stroke === 0 ? new Color(loadColor) : "none",
      }) as any

      newPath.pathData = definition
      newPath.data.id = id
      setPathEventHandlers(newPath)

      const newPathRef = firebase.database().ref(`/paths_new/${id}`)

      newPathRef.on("value", (updatedSnapshot: any) => {
        console.log("REMOTE PATH CHANGED")
        loadPath({ id: updatedSnapshot.key, ...updatedSnapshot.val() })
      })
    }
  }

  function handleMouseDown(event: paper.MouseEvent) {
    const { tool, color, strokeWidth } = localState.current
    localState.current.toolState = "active"

    // we have to create a new path and sync with Firebase
    if (tool !== "erase") {
      const key = firebase.database().ref("paths_new").push().key // prettier-ignore

      if (key) {
        let path
        if (tool === "paint") {
          path = new Path({
            segments: [event.point],
            strokeWidth,
            strokeCap: "round",
            strokeColor: new Color(color),
          })
        } else {
          path = new Group()
        }
        path.data.id = key // local link to remote path
        localState.current.activePath = path

        localState.current.paperTool = new PaperTool({
          activePath: path,
          shape,
          tool,
          color,
        })

        localState.current.paperTool.activate()

        setPathEventHandlers(path)
        const ref = firebase.database().ref(`/paths_new/${key}`)

        ref.set({
          color: color,
          definition: path instanceof paper.Path ? path.pathData : (path as any)._asPathItem().pathData,
          strokeWidth: path.strokeWidth,
        })
      }
    } else {
      console.log("erasing")
    }
  }

  function handleMouseUp(_evt: paper.MouseEvent) {
    localState.current.toolState = "inactive"
    // localState.current.paperTool.remove()

    if (localState.current.tool === "paint") {
      const path = localState.current.activePath

      if (path && path instanceof paper.Path) {
        path.simplify()
      }
    }

    localState.current.activePath = undefined
  }

  function handleMouseDrag(evt: paper.MouseEvent) {
    console.log("drawing")
    localState.current.toolState = "active"

    if (localState.current.tool === "erase") {
      const target = evt.target
      if (target && target instanceof Path) {
        target.remove() // locally remove -- not listening to external event for this.

        if (target.data.id) {
          // this is not the currently drawn path, this is any path that is being removed.
          firebase.database().ref(`/paths_new/${target.data.id}`).remove() // prettier-ignore
        }
      }
    } else {
      let syncData: string = ""

      try {
        syncData = (localState.current.activePath as any).pathData
      } catch (e) {
        try {
          syncData = (localState.current.activePath as any)._asPathItem().pathData
        } catch (e) {
          console.log("couldn't set sync data")
        }
      }

      if (syncData && localState.current.activePath) {
        syncer(firebase.database().ref(`/paths_new/${localState.current.activePath.data.id}`), {
          strokeWidth: localState.current.strokeWidth,
          color: localState.current.color,
          definition: syncData,
        })()
      }
    }
  }

  function syncer(ref: firebase.database.Reference, data: any) {
    return throttle(() => {
      ref.set(data)
    }, 300)
  }

  const setPathEventHandlers = (path: paper.Item): void => {
    path.onMouseEnter = (_evt: paper.MouseEvent): void => {
      if (localState.current.tool === "erase") {
        // highlight the path about to be removed
        path.strokeColor = new Color("#B85642")
        path.fillColor = new Color("#B85642")
      }
    }

    path.onMouseLeave = (_evt: paper.MouseEvent): void => {
      const { tool, toolState } = localState.current
      // on non-mobile we have to reset from the highlighted color
      if (tool === "erase" && toolState === "inactive") {
        path.strokeColor = new Color(color)
        path.fillColor = new Color(color)
      }
    }
  }

  return { setCanvas }
}

class PaperTool extends Tool {
  activePath: paper.Item
  shape: DrawShape
  tool: DrawTool
  color: DesignColor

  constructor({
    activePath,
    shape,
    tool,
    color,
  }: {
    activePath: paper.Item
    tool: DrawTool
    shape: DrawShape
    color: DesignColor
  }) {
    super()
    this.activePath = activePath
    this.tool = tool
    this.color = color
    this.shape = shape

    this.onMouseDrag = (event: paper.ToolEvent) => {
      switch (this.tool) {
        case "paint":
          ;(this.activePath as paper.Path).add(event.point)
          break
        case "shape":
          let path
          const rad = event.delta.length / 2

          switch (this.shape) {
            case "circle":
              path = new Path.Circle(event.point, rad)
              break
            case "square":
              path = new Path.Rectangle(event.point, new Size(rad, rad))
              break
            case "star":
              path = new Path.Star(event.point, 5, rad / 2, rad)
          }

          path.fillColor = new Color(this.color)

          this.activePath.addChild(path)
          break
        case "erase":
          console.log("erasing")
      }
    }
  }
}
