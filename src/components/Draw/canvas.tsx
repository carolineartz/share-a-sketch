import * as React from "react"
import debounce from "lodash.debounce"

export type CanvasRef = HTMLCanvasElement

export const Canvas = React.forwardRef<CanvasRef>((_props, ref) => {
  const [width, setWidth] = React.useState<number>(window.innerWidth)
  const [height, setHeight] = React.useState<number>(window.innerHeight)

  const resized = debounce(() => {
    if (ref && typeof ref !== "function" && ref.current) {
      const canvas = ref.current

      setWidth(window.innerWidth)
      setHeight(window.innerHeight)

      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      canvas.style.width = `${window.innerWidth}`
      canvas.style.height = `${window.innerHeight}`
    }
  }, 500, {leading: true, trailing: true})

  React.useEffect(() => {
    window.addEventListener("resize", resized)
    window.addEventListener("orientationchange", resized)

    return (() => {
      window.removeEventListener("resize", resized)
      window.removeEventListener("orientationchange", resized)
    })
  })

  return <canvas ref={ref} style={{ background: "white", width, height }} />;
})
