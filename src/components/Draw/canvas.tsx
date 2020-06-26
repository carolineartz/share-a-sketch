import * as React from "react"
import debounce from "lodash.debounce"

export type CanvasRef = HTMLCanvasElement

export const Canvas = React.forwardRef<CanvasRef>((_props, ref) => {
  const [width, setWidth] = React.useState<number>(window.innerWidth)
  const [height, setHeight] = React.useState<number>(window.innerHeight)

  const resized = debounce(() => {
    if (ref && typeof ref !== "function" && ref.current) {
      const canvas = ref.current

      canvas.width = width
      canvas.height = height

      setWidth(window.innerWidth)
      setHeight(window.innerHeight)
    }
  }, 500, {leading: true, trailing: true})

  React.useEffect(() => {
    window.addEventListener("resize", resized)

    return (() => {
      window.removeEventListener("resize", resized)
    })
  })

  return <canvas ref={ref} style={{ background: "white", width, height }} />;
})
