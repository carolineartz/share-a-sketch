/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react"

import { Box, Keyboard, Nav, Button } from "grommet"
import styled from "styled-components"

import firebase from "../Firebase"
import times from "lodash.times"
import DrawingCanvas from "./../DrawingCanvas"
import LZString from "lz-string"

type DrawData = {
  id: string
  value: any
}
export const DrawDesign = () => {
  const canvasRef = React.useRef(null)
  // const drawingRef = React.useRef(null)
  const [drawingRef, setDrawingRef]: [
    any | undefined,
    React.Dispatch<React.SetStateAction<any | undefined>>
  ] = React.useState()

  const [drawingCanvas, setDrawingCanvas]: [
    DrawingCanvas | undefined,
    React.Dispatch<React.SetStateAction<undefined | DrawingCanvas>>
  ] = React.useState()

  React.useEffect(() => {
    firebase
      .database()
      .ref("drawing-comp")
      .orderByKey()
      .limitToFirst(1)
      .once("value", (snapshot: any) => {
        const drawings = Object.entries(snapshot.val()).map(
          ([drawingId, drawingVal]: [string, unknown]) => {
            return {
              ref: "/drawing-comp/" + drawingId,
              value: drawingVal,
            }
          }
        )
        // const dr = firebase.database().ref("/drawing-comp/" + drawings[0].id)
        setDrawingRef(drawings[0])
      })
    return () => {
      firebase.database().ref().off()
    }
  }, [])

  React.useEffect(() => {
    const canvas = canvasRef.current

    if (canvas && drawingRef) {
      // const dr = firebase.database().ref(drawingRef)
      let dc = drawingCanvas

      if (!dc) {
        dc = new DrawingCanvas({ canvas })
        setDrawingCanvas(dc)
      }

      const decoded = LZString.decompressFromUTF16(drawingRef.value)
      dc.import(decoded)
    }
    return () => {
      firebase.database().ref().off()
    }
  }, [drawingRef, drawingCanvas])

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

// const Container = styled(Box)`
//   /* background: #0a0b27; */
//   display: grid;
// <Keyboard target="document" onEsc={handleEscape} onKeyDown={handleKeyPress}>
// </Keyboard>
//   grid-template-columns: repeat(8, 4.5em);
//   grid-auto-rows: 4.5em;
// `
