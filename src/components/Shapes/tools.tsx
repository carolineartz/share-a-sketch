import * as React from "react"
import { Button, ResponsiveContext } from "grommet"
import { Cycle, ClearOption } from "grommet-icons"
import * as ShapeSettingsContext from "./context"
import { ToolMenu } from "../ToolMenu"

const ShapeTools = (): JSX.Element => {
  const { mode, setMode } = ShapeSettingsContext.useShapeSettings()

  const screenWidth = React.useContext(ResponsiveContext)
  const iconSize = screenWidth === "small" ? "medium" : "large"
  return (
    <ToolMenu size={screenWidth === "small" ? "small" : "medium"}>
      <>
        <Button
          title="Rotate Shape"
          key="shapes-design-rotate"
          icon={<Cycle size={iconSize} color={mode === "rotate" ? "white" : "text"} />}
          hoverIndicator
          active={mode === "rotate"}
          onClick={() => setMode("rotate")}
        />
        <Button
          title="Color Shape"
          key="shapes-design-color"
          icon={<ClearOption size={iconSize} color={mode === "color" ? "white" : "text"} />}
          hoverIndicator
          active={mode === "color"}
          onClick={() => setMode("color")}
        />
      </>
    </ToolMenu>
  )
}

export default ShapeTools
