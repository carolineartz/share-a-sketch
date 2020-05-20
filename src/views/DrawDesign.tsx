/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react"

import { Box, Keyboard, Nav, Button } from "grommet"
import styled from "styled-components"

import firebase from "../Firebase"
import DrawingCanvas from "./../DrawingCanvas"

type PathData = {
  id: string
  value: any
}

export const DrawDesign = () => {
  const canvasRef = React.useRef(null)
  const [paths, setPaths]: [PathData[], React.Dispatch<React.SetStateAction<PathData[]>>] = React.useState([] as PathData[]) // prettier-ignore
  const [drawingCanvas, setDrawingCanvas]: [DrawingCanvas | undefined, React.Dispatch<React.SetStateAction<undefined | DrawingCanvas>>] = React.useState() // prettier-ignore

  React.useEffect(() => {
    console.log("UPDATING FOR NEW DRAWING CANVAS")

    const pathsRef = firebase.database().ref("draw_paths")
    if (drawingCanvas) {
      pathsRef
        .orderByKey()
        .once("value")
        .then((snapshot: any) => {
          try {
            const ps = Object.entries(snapshot.val()).map(([pathId, pathVal]: [string, unknown]) => {
              const p = { id: pathId, value: pathVal }
              drawingCanvas.loadPath(p)
              return p
            })
            setPaths(ps)
          } catch (e) {
            console.error(e)
          }
        })

      pathsRef.on("child_added", (addedSnapshot: any) => {
        console.log("CHILD ADDED")
        // debugger
        drawingCanvas.loadPath({ id: addedSnapshot.key, value: addedSnapshot.val() })
        // const key = addedSnapshot.key

        // if (!drawingCanvas.localIds.has(key)) {
          // const pathRef = firebase.database().ref(`/draw_paths/${key}`)
          // pathRef.on("value", (updatedSnapshot: any) => {
          //   drawingCanvas.loadPath(updatedSnapshot.val())
          // })
        // }
      })
    }

    return () => {
      pathsRef.off()
    }
  }, [drawingCanvas])

  // React.useEffect(() => {
  //     const pathRef = firebase.database().ref(`/draw_paths`)
  //     // pathRef.off()

  // })

  React.useEffect(() => {
    const canvas = canvasRef.current

    if (canvas) {
      let dc = drawingCanvas

      if (!dc) {
        dc = new DrawingCanvas({ canvas })
        setDrawingCanvas(dc)
      }
    }
    return () => {
      firebase.database().ref().off()
    }
  }, [drawingCanvas])

  const handleKeyPress = (event: any) => {
    switch (event.key) {
      case "d":
        if (drawingCanvas) {
          drawingCanvas.draw()
        }
        break
      case "e":
        if (drawingCanvas) {
          drawingCanvas.erase()
        }
    }
  }

  return (
    <Keyboard target="document" onKeyDown={handleKeyPress}>
      <canvas ref={canvasRef} style={{ height: "100%", width: "100%" }} />
    </Keyboard>
  )
}
