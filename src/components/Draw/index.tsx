import React from "react"

import "styled-components/macro"

import { Keyboard } from "grommet"
import { Main } from "@components/main"
import * as DrawSettingsContext from "./context"
import DrawTools from "./tools"
import { usePaperJs } from "./usePaperjs"
import { withFirebase, WithFirebaseProps } from '../Firebase';

export { DrawSettingsContext }

const DrawView = ({ firebase }: WithFirebaseProps): JSX.Element => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const { setTool, color, tool, setSize, size } = DrawSettingsContext.useDrawSettings()
  const { setCanvas } = usePaperJs({ firebase })

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      setCanvas(canvas)
    }
  }, [canvasRef, setCanvas])

  // TODO: Dry this up.
  const handleKeyDown = (evt: any): void => {
    if (tool === "text" && evt.altKey) {
      switch (evt.code) {
        case "KeyE":
          setTool("erase")
          break
        case "KeyP":
        case "KeyD":
          setTool("paint")
          break
        case "KeyS":
          setTool("shape")
          break
        case "=":
        case "+":
          size < 60 && setSize(size + 1)
          break
        case "-":
        case "_":
          size > 3 && setSize(size - 1)
      }
    }

    else if (tool !== "text") {
      switch (evt.key) {
        case "e":
          setTool("erase")
          break
        case "p":
        case "d":
          setTool("paint")
          break
        case "s":
          setTool("shape")
          break
        case "t":
          setTool("text")
          break
        case "=":
        case "+":
          size < 60 && setSize(size + 1)
          break
        case "-":
        case "_":
          size > 3 && setSize(size - 1)
      }
    }
  }

  const cursorClass = tool === "erase" ?
    "cursor-erase" :
    tool === "paint" ?
      `cursor-brush--${color.substr(1, 6).toUpperCase()}` :
      `cursor-shape`

  return (
    <Keyboard target="document" onKeyDown={handleKeyDown}>
      <DrawTools />
      <Main className={cursorClass}>
        <canvas ref={canvasRef} style={{ background: "white", width: "100vw", height: "100vh" }} width="100%" height="100%" />
      </Main>
    </Keyboard>
  )
}

export default withFirebase(DrawView)
