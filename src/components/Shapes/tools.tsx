import * as React from "react"
import { Button, ResponsiveContext, Box, Text, Heading } from "grommet"
import { Cycle, ClearOption } from "grommet-icons"
import * as ShapeSettingsContext from "./context"
import { ToolMenu } from "@components/toolMenu"
import Info, { Shortcut, Shortcuts } from "@components/Info"

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
        <Info>
          <Box>
            <Heading level="3">Shapes!</Heading>
            <Text>Make designs by rotating tiles and changing colors. Clicking on the tiles will cycle through the possible options.</Text>
            <Heading level="4">Shortcuts</Heading>
            <Shortcuts>
              <Shortcut
                keys={["r"]}
                description={<Box direction="row" gap="small"><Text>Switch to rotation mode</Text><Cycle color="text" /></Box>}
              />
              <Shortcut
                keys={["c"]}
                description={<Box direction="row" gap="small"><Text>Switch to color mode</Text><ClearOption color="text" /></Box>}
              />
            </Shortcuts>
          </Box>
        </Info>
      </>
    </ToolMenu>
  )
}

export default ShapeTools
