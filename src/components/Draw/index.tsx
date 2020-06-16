import React from "react"

import { Keyboard } from "grommet"
import { Main } from "@components/Main"
import * as DrawSettingsContext from "./context"
import DrawTools from "./tools"
import { usePaperJs } from "./usePaperjs"
import { withFirebase, WithFirebaseProps } from '../Firebase';

export { DrawSettingsContext }

const DrawView = ({firebase}: WithFirebaseProps): JSX.Element => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const { setTool, color, tool } = DrawSettingsContext.useDrawSettings()
  const { setCanvas } = usePaperJs({firebase})

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      setCanvas(canvas)
    }
    return () => {}
  }, [canvasRef, setCanvas])

  const handleKeyDown = (evt: React.KeyboardEvent): void => {
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
    }
  }

  const cursorClass = tool === "erase" ? "cursor-erase" : tool === "paint" ? `cursor-brush--${color.substr(1, 6).toUpperCase()}` : `cursor-shape`

  return (
    <Keyboard target="document" onKeyDown={handleKeyDown}>
      <DrawTools />
      <Main className={cursorClass}>
        <canvas ref={canvasRef} style={{ width: "100vw", height: "100vh" }} width="100%" height="100%" />
      </Main>
    </Keyboard>
  )
}

export default withFirebase(DrawView)
