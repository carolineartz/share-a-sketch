/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react"

import { Box, Keyboard, Nav, Button } from "grommet"
import { ResizableCanvas } from "./../components/ResizableCanvas"
import firebase from "../Firebase"
import DrawingCanvas from "./../DrawingCanvas"
import * as DesignModeContext from "./DesignModeContext"

type PathData = {
  id: string
  value: any
}

export const DrawDesign = () => {
  const { mode, setMode } = DesignModeContext.useDesignMode()
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [drawingCanvas, setDrawingCanvas]: [DrawingCanvas | undefined, React.Dispatch<React.SetStateAction<undefined | DrawingCanvas>>] = React.useState() // prettier-ignore


  // TODO: combine effects
  React.useEffect(() => {
    console.log("UPDATING FOR NEW DRAWING CANVAS")

    const pathsRef = firebase.database().ref("draw_paths")
    if (drawingCanvas) {
      pathsRef
        .orderByKey()
        .once("value")
        .then((snapshot: any) => {
          try {
            Object.entries(snapshot.val()).forEach(([pathId, pathVal]: [string, unknown]) => {
              drawingCanvas.loadPath({ id: pathId, value: pathVal })
            })
          } catch (e) {
            console.error(e)
          }
        })

      pathsRef.on("child_added", (addedSnapshot: any) => {
        console.log("CHILD ADDED")
        drawingCanvas.loadPath({ id: addedSnapshot.key, value: addedSnapshot.val() })
      })

      setMode("paint")
    }

    return () => {
      pathsRef.off()
    }
  }, [drawingCanvas, setMode])

  React.useEffect(() => {
    const canvas = canvasRef.current

    if (canvas) {
      let dc = drawingCanvas

      if (!dc) {
        dc = new DrawingCanvas({ canvas })
        setDrawingCanvas(dc)
      }

      if (mode === "paint") {
        dc.draw()
      } else if (mode === "erase") {
        dc.erase()
      }
    }
    return () => {
      firebase.database().ref().off()
    }
  }, [drawingCanvas, mode])

  const handleKeyPress = (event: any) => {
    switch (event.key) {
      case "p":
      case "d":
        if (drawingCanvas) {
          setMode("paint")
          drawingCanvas.mode = "paint"
          drawingCanvas.draw()
        }
        break
      case "e":
        if (drawingCanvas) {
          setMode("erase")
          drawingCanvas.mode = "erase"
          drawingCanvas.erase()
        }
    }
  }

  return (
    <Keyboard target="document" onKeyDown={handleKeyPress}>
      <ResizableCanvas drawingCanvas={drawingCanvas} ref={canvasRef} />
    </Keyboard>
  )
}
