import * as React from "react"
import { Button } from "grommet"
import { Cycle, ClearOption } from "grommet-icons"
import * as ShapeSettingsContext from "./ShapeSettingsContext"
import { ToolMenu } from "../../components/ToolMenu"

export const ShapesTools = (): JSX.Element => {
  const { mode, setMode } = ShapeSettingsContext.useShapeSettings()

  return (
    <ToolMenu>
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
    </ToolMenu>
  )
}
