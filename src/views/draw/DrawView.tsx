/* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars, indent, import/no-unresolved  */
import React from "react"

import { Keyboard } from "grommet"
import { Main } from "@components/Main"
import * as DrawSettingsContext from "@draw/DrawSettingsContext"
import { usePaperJs } from "@draw/usePaperjs"

export const DrawView = (): JSX.Element => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const { setCanvas } = usePaperJs()
  const { setTool } = DrawSettingsContext.useDrawSettings()

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

  return (
    <Keyboard target="document" onKeyDown={handleKeyDown}>
      <Main>
        <canvas ref={canvasRef} style={{ width: "100vw", height: "100vh" }} width="100%" height="100%" />
      </Main>
    </Keyboard>
  )
}
