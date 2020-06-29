import * as React from "react"
import {  ResponsiveContext, Box, Text, Heading } from "grommet"
import { Cycle, ClearOption } from "grommet-icons"
import * as ShapeSettingsContext from "./context"
import { ToolMenu, ToolMenuItem } from "@components/ToolMenu"
import Info, { Shortcut, Shortcuts } from "@components/Info"


const ShapeTools = (): JSX.Element => {
  const { mode, setMode } = ShapeSettingsContext.useShapeSettings()
  const screenWidth = React.useContext(ResponsiveContext)

  return (
    <ToolMenu size={screenWidth === "small" ? "small" : "medium"}>
      <ToolMenuItem
        title="Rotate Shape"
        icon={{ icon: Cycle }}
        onSelect={() => setMode("rotate")}
        isSelected={mode === "rotate"}
        isActive={mode === "rotate"}
      />
      <ToolMenuItem
        title="Color Shape"
        icon={{ icon: ClearOption }}
        onSelect={() => setMode("color")}
        isSelected={mode === "color"}
        isActive={mode === "color"}
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

    </ToolMenu>
  )
}

export default ShapeTools
