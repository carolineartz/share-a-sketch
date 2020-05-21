/* eslint-disable react/display-name */
import * as React from "react"

import debounce from "lodash.debounce"
import styled from "styled-components"

type ResizableCanvasProps = {
  drawingCanvas: any
}

export const ResizableCanvas = React.forwardRef<HTMLCanvasElement, ResizableCanvasProps>(
  ({ drawingCanvas }: ResizableCanvasProps, ref) => {
    React.useEffect(() => {
      const handleResize = debounce(() => {
        if (drawingCanvas) {
          drawingCanvas.onResize()
        }
      }, 1000)

      window.addEventListener("resize", handleResize)

      return () => {
        window.removeEventListener("resize", handleResize)
      }
    }, [drawingCanvas])

    return <SizedCanvas resize ref={ref} />
  }
)

type SizedCanvasProps = JSX.IntrinsicAttributes & { resize: any }

const SizedCanvas = styled.canvas<SizedCanvasProps>`
  width: 100% !important;
  height: 100% !important;
`
