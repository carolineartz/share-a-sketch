import * as React from "react"

export const useDismissTools = (isOpen: boolean = false) => {
  const [toolsOpen, setToolsOpen] = React.useState<boolean>(isOpen)

  const close = () => {
    setToolsOpen(false)
  }

  React.useEffect(() => {
    document.body.addEventListener("click", close)

    return () => {
      document.body.removeEventListener("click", close)
    }
  })

  return { toolsOpen, setToolsOpen }
}
