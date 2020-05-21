import * as React from "react"
import { Button } from "grommet"
import { Edit, Erase } from "grommet-icons"
import * as DesignModeContext from "./DesignModeContext"

export const DrawDesignTools = (): JSX.Element => {
  const { mode, setMode } = DesignModeContext.useDesignMode()

  return (
    <>
      <Button
        title="Draw"
        key="draw-design-paint"
        icon={<Edit color={mode === "paint" ? "white" : "text"} />}
        hoverIndicator
        active={mode === "paint"}
        onClick={() => {
          setMode("paint")
        }}
      />
      <Button
        title="Erase"
        key="draw-design-erase"
        icon={<Erase color={mode === "erase" ? "white" : "text"} />}
        hoverIndicator
        active={mode === "erase"}
        onClick={() => {
          console.log(mode)
          const newMode: DesignMode = "erase"
          setMode(newMode)
        }}
      />
    </>
  )
}
