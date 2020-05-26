/* eslint-disable no-shadow, no-case-declarations, @typescript-eslint/no-explicit-any, indent, @typescript-eslint/explicit-function-return-type */
import * as React from "react"
import throttle from "lodash.throttle"

import paper, { Point, Path, Color, Size, Tool } from "paper"
import firebase from "../../Firebase"
import * as DrawSettingsContext from "./DrawSettingsContext"
import { DesignColor } from "../../theme"

type LoadType = "initial" | "added" | "updated"

function generateLocalId(): string {
  const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0]
  return uint32.toString(16)
}

export type RemotePath = {
  id?: string
  definition: string
  strokeWidth: number
  color: string // covers strokeColor and fill
  localId: string
}

type CreatPaperHookType = {
  setCanvas: (canvas: HTMLCanvasElement) => void
}

const pathsRef = firebase.database().ref("paths_new3")

type LocalState = {
  color: DesignColor
  strokeWidth: DrawSettingsContext.DrawStrokeWidth
  shape: DrawSettingsContext.DrawShape
  tool: DrawSettingsContext.DrawTool
  toolState: "active" | "inactive"
  currentLocalId?: string
  localPathIds: string[]
  activePath?: paper.Path
  localPathCache: Record<string, paper.Item>
  remotePathCache: Record<string, paper.Path>
  paperScope: paper.PaperScope
  paperTool?: PaperTool
}

// ONLY HAPPENING FROM DRAWERS MACHINE
const broadcastCreate = (path: paper.Path, tool: DrawSettingsContext.DrawTool) => {
  console.log("BROADCASTING CREATE", path)
  return firebase
    .database()
    .ref("paths_new3")
    .push({
      definition: path.pathData,
      strokeWidth: tool === "paint" ? path.strokeWidth : 0,
      color: path.data.color,
      localId: path.data.localId,
    })
}

// ONLY HAPPENING FROM DRAWERS MACHINE
const broadcastUpdates = (path: paper.Path) =>
  throttle(() => {
    console.log("BROADCASTING UPDATE", path)
    firebase
      .database()
      .ref(`paths_new3/${path.data.id}`)
      .set({
        definition: path.pathData,
        strokeWidth: path.closed ? 0 : path.strokeWidth,
        color: path.data.color,
        localId: path.data.localId,
      })
  })

export const usePaperJs = (): CreatPaperHookType => {
  const [canvas, setCanvas] = React.useState<HTMLCanvasElement | null>(null)
  const { tool, shape, strokeWidth, color } = DrawSettingsContext.useDrawSettings()

  const localState = React.useRef<LocalState>({
    tool,
    toolState: "inactive",
    localPathIds: [],
    shape,
    strokeWidth,
    color,
    paperScope: paper,
    localPathCache: {} as Record<string, paper.Item>,
    remotePathCache: {} as Record<string, paper.Path>,
  })
  ;(window as any).localState = localState

  React.useEffect(() => {
    localState.current.tool = tool
    localState.current.shape = shape
    localState.current.strokeWidth = strokeWidth
    localState.current.color = color
    console.log(tool)
  }, [tool, shape, strokeWidth, color])

  React.useEffect(() => {
    if (canvas) {
      const scope = localState.current.paperScope
      scope.setup(canvas)

      scope.project.view.onMouseUp = handleMouseUp
      scope.project.view.onMouseDown = handleMouseDown
      scope.project.view.onMouseDrag = handleMouseDrag

      pathsRef
        .orderByKey()
        .once("value", (snapshot: any) => {
          try {
            const paths = snapshot.val()
            if (paths) {
              Object.entries(paths).forEach(([pathId, pathVal]: [string, unknown]) => {
                loadPath({ id: pathId, ...(pathVal as RemotePath), loadType: "initial" })
              })
            }
          } catch (e) {
            console.error(e)
          }
        })
        .then(() => {
          pathsRef.on("child_added", (addedSnapshot: any) => {
            console.log("CHILD ADDED")
            loadPath({ id: addedSnapshot.key, ...addedSnapshot.val(), loadType: "added" })
          })

          pathsRef.on("child_removed", (removedSnapshot: any) => {
            console.log("CHILD REMOVED")
            const existingPath = (paper.project.activeLayer.children as paper.Path[]).find(
              p => p.data.id === removedSnapshot.key
            )
            if (existingPath) {
              existingPath.remove()
            }
          })
        })
    }

    return () => {
      pathsRef.off()
    }
  }, [canvas])

  const createPathFromRemote = ({
    id,
    definition,
    color,
    stroke,
    localId,
  }: {
    id: string
    definition: string
    color: string
    stroke: number
    localId: string
  }) => {
    const newPath = new Path()
    newPath.data.localId = localId
    newPath.pathData = definition
    newPath.data.id = id

    if (newPath.closed) {
      newPath.fillColor = new Color(color)
      newPath.strokeWidth = 0
    } else {
      newPath.strokeCap = "round"
      newPath.strokeColor = new Color(color)
      newPath.strokeWidth = stroke
    }
    return newPath
  }

  function loadPath({
    id,
    definition,
    color: loadColor,
    strokeWidth: loadStroke,
    localId,
    loadType,
  }: {
    id: string
    definition: string
    color: string
    strokeWidth: number
    loadType: LoadType
    localId: string
  }) {
    // let path
    // none of these can be drawn during this session on the local device
    if (loadType === "initial") {
      // debugger
      const initialPath = createPathFromRemote({ localId, id, definition, stroke: loadStroke, color: loadColor })
      // localState.current.remotePathCache[id] = path
      setLocalPathEventHandlers(initialPath) // hover color
    }

    // remote from child_added -- could be either from another user creating a path or from a path that was crated locally
    else if (loadType === "added") {
      if (localState.current.currentLocalId === localId || localState.current.localPathIds.includes(localId)) {
        console.log("don't watch the path because its created/updated locally", localId, id)
        return
      } else {
        // this is a path received actively drawn from aonther device, create it locally and listen for changes and update the data
        const remotelyAddedPath = createPathFromRemote({
          localId,
          id,
          definition,
          stroke: loadStroke,
          color: loadColor,
        })
        setLocalPathEventHandlers(remotelyAddedPath)
        const pathRef = firebase.database().ref(`/paths_new3/${id}`)

        pathRef.on("value", (updatedSnapshot: any) => {
          console.log("REMOTE PATH CHANGED", updatedSnapshot.val(), { originPath: remotelyAddedPath })
          loadPath({ id: updatedSnapshot.key, ...updatedSnapshot.val(), loadType: "updated" })
        })
      }
    } else if (loadType === "updated") {
      const existingPath = (paper.project.activeLayer.children as paper.Path[]).find(p => p.data.id === id)
      console.log("updated an existing path", existingPath)

      if (existingPath) {
        existingPath.pathData = definition
        existingPath.data.color = loadColor

        if (loadStroke && loadStroke > 1) {
          existingPath.strokeColor = new Color(loadColor)
          existingPath.strokeWidth = loadStroke
        } else {
          existingPath.fillColor = new Color(loadColor)
        }
      }
    }
  }

  function handleMouseDown(_event: paper.MouseEvent) {
    console.log("PAPER MOUSE DOWN")
    const { tool, color, strokeWidth } = localState.current
    localState.current.toolState = "active"

    if (tool === "erase") {
      return
    }

    let path, key
    const localId = generateLocalId()
    localState.current.localPathIds.push(localId)
    localState.current.currentLocalId = localId

    localState.current.activePath = path

    if (tool === "paint") {
      localState.current.activePath = path = new Path({
        // segments: [event.point],
        strokeWidth,
        strokeCap: "round",
        strokeColor: new Color(color),
      })
      path.data.color = color
      path.data.localId = localId
      key = broadcastCreate(path, "paint").key
      path.data.id = key
    } else {
      localState.current.activePath = path = new Path()
      path.data.color = color
      path.fillColor = new Color(color)
      path.data.localId = localId
      key = broadcastCreate(path, "shape").key
      path.data.id = key
    }

    if (!localState.current.paperTool) {
      localState.current.paperTool = new PaperTool({
        currentState: localState.current,
      })
      localState.current.paperTool.activate()
    } else {
      localState.current.paperTool.currentState = localState.current
    }
    setLocalPathEventHandlers(path)
  }

  function handleMouseUp(_evt: paper.MouseEvent) {
    localState.current.toolState = "inactive"
    const path = localState.current.activePath
    if (!path || localState.current.tool === "erase") return

    if (localState.current.tool === "paint") {
      path.simplify()
    }

    localState.current.activePath = undefined

    if (path && path.area !== 0) {
      broadcastUpdates(path)()
    }
  }

  function handleMouseDrag(evt: paper.MouseEvent) {
    console.log("PAPER MOUSE DRAG")
    localState.current.toolState = "active"

    if (localState.current.tool === "erase") {
      // evt.stopPropagation()
      console.log("erasing")
      const target = evt.target
      // debugger
      if (target && target instanceof Path) {
        if (target.data.id) {
          // this is not the currently drawn path, this is any path that is being removed.
          firebase.database().ref(`/paths_new3/${target.data.id}`).remove() // prettier-ignore
        }

        target.remove() // locally remove -- not listening to external event for this.
      }
    } else if (localState.current.tool === "paint") {
      console.log("drawing")
      // let syncData: string = ""
      const path = localState.current.activePath
      if (path) {
        broadcastUpdates(path)()
      }
    }
  }

  const setLocalPathEventHandlers = (path: paper.Path): void => {
    const handleEnter = (path: paper.Path) => {
      if (path.closed) {
        path.data.color = path.fillColor
        path.fillColor = new Color("#A9FF4D")
      } else {
        path.data.color = path.strokeColor
        path.strokeColor = new Color("#A9FF4D")
      }
    }
    const handleLeave = (path: paper.Path) => {
      if (path.closed) {
        path.fillColor = path.data.color
      } else {
        path.strokeColor = path.data.color
      }
    }
    path.onMouseEnter = function(_evt: paper.MouseEvent): void {
      if (localState.current.tool === "erase") {
        handleEnter(this)
      }
    }

    path.onMouseLeave = (_evt: paper.MouseEvent): void => {
      // console.log("PATH MOUSE LEAVE")
      const { tool, toolState } = localState.current
      // on non-mobile we have to reset from the highlighted color
      if (tool === "erase" && toolState === "inactive") {
        handleLeave(path)
      }
    }
  }

  return { setCanvas }
}

class PaperTool extends Tool {
  currentState: LocalState

  constructor({ currentState }: { currentState: LocalState }) {
    super()
    this.currentState = currentState
    this.onMouseDown = (event: paper.ToolEvent) => {
      let p
      if (this.currentState.tool === "shape" && this.currentState.activePath) {
        switch (this.currentState.shape) {
          case "square":
            p = new Path.Rectangle(new Point(event.point.x - 40, event.point.y - 40), new Size(80, 80))
            // path = new Path.Rectangle(event.point, new Size(30, 30))
            break
          case "circle":
            p = new Path.Circle(event.point, 40)
            break
          case "star":
            p = new Path.Star(event.point, 5, 30, 60)
        }

        p.fillColor = new Color(this.currentState.color)
        p.data.localId = this.currentState.activePath.data.localId
        p.data.id = this.currentState.activePath.data.id
        p.data.color = this.currentState.color
        this.currentState.activePath.pathData = p.pathData
        this.currentState.activePath.fillColor = new Color(this.currentState.color)
        this.currentState.activePath.data.color = this.currentState.color
      }
    }

    this.onMouseDrag = (event: paper.ToolEvent) => {
      if (!this.currentState.activePath) {
        return
      }

      if (this.currentState.tool === "paint") {
        this.currentState.activePath.add(event.point)
      }
    }
  }
}
