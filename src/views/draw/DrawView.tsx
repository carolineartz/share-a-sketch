/* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars, indent */
import React from "react"

// import { Keyboard } from "grommet"
import { usePaperJs } from "./usePaperjs"
import { Main } from "../../components/Main"

export const DrawView = (): JSX.Element => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const { setCanvas } = usePaperJs()

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      setCanvas(canvas)
    }
    return () => {}
  }, [canvasRef, setCanvas])

  return (
    <Main>
      <canvas ref={canvasRef} style={{ width: "100vw", height: "100vh" }} width="100%" height="100%" />
    </Main>
  )
}

// <Keyboard target="document" onKeyDown={handleKeyPress}>

// </Keyboard>
