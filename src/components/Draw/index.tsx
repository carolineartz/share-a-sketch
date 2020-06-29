import React from "react"

import "styled-components/macro"

import { Keyboard } from "grommet"
import { Main } from "@components/main"
import * as DrawSettingsContext from "./context"
import DrawTools from "./tools"
import { usePaperJs } from "./usePaperjs"
import { withFirebase, WithFirebaseProps } from '../Firebase';
import { ToolMenuContext } from "@components/ToolMenu"

export { DrawSettingsContext }

const DrawView = ({ firebase }: WithFirebaseProps): JSX.Element => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const { setTool, color, tool, setSize, size } = DrawSettingsContext.useDrawSettings()
   const { toolMenuDisplay } = ToolMenuContext.useToolMenuDisplay()!
  const { setCanvas, width, height } = usePaperJs({ firebase })

  const emojiMenuOpen = toolMenuDisplay === "submenu" && tool === "emoji"

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

    // allow using the keyboard normally for searching emojis
    else if (!emojiMenuOpen && tool !== "text") {
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
        <canvas  id={`canvas-${width}-${height}`} ref={canvasRef} style={{ background: "white", width: `${width}px`, height: `${height}px` }} />
      </Main>
    </Keyboard>
  )
}

export default withFirebase(DrawView)
