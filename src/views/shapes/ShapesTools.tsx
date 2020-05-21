import * as React from "react"
import { Button } from "grommet"
import { Cycle, ClearOption } from "grommet-icons"
import * as DesignModeContext from "./../DesignModeContext"

export const ShapesTools = () => {
  const { mode, setMode } = DesignModeContext.useDesignMode()

  return (
    <>
      <Button
        title="Rotate Shape"
        key="shapes-design-rotate"
        icon={<Cycle color={mode === "rotate" ? "white" : "text"} />}
        hoverIndicator
        active={mode === "rotate"}
        onClick={() => setMode("rotate")}
      />
      <Button
        title="Color Shape"
        key="shapes-design-color"
        icon={<ClearOption color={mode === "color" ? "white" : "text"} />}
        hoverIndicator
        active={mode === "color"}
        onClick={() => setMode("color")}
      />
    </>
  )
}
