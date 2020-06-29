import * as React from "react"
import { useMediaQuery } from 'react-responsive'

import {  ResponsiveContext, Box, Text, Heading } from "grommet"
import { Cycle, ClearOption } from "grommet-icons"
import * as ShapeSettingsContext from "./context"
import { ToolMenu, ToolMenuItem } from "@components/ToolMenu"
import Info, { Shortcut, Shortcuts } from "@components/Info"


const ShapeTools = (): JSX.Element => {
  const { mode, setMode } = ShapeSettingsContext.useShapeSettings()
  const screenWidth = React.useContext(ResponsiveContext)
  const isShortMobile = useMediaQuery({ query: '(max-device-height: 450px)' })
  const isShortDesktop = useMediaQuery({ query: '(max-height: 450px)' })
  const isShort = isShortMobile || isShortDesktop
  const isMediumHeightDesktop = useMediaQuery({ minHeight: 451, maxHeight: 640 })
  const isMediumHeightMobile = useMediaQuery({ minDeviceHeight: 451, maxDeviceHeight: 640 })
  const isMediumHeight = isMediumHeightDesktop || isMediumHeightMobile
  const isNarrow = screenWidth === "small"

  const textSize = isShort || isNarrow ? "small" : "medium"

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
          <Heading level="3" margin={{ vertical: isShort || isNarrow ? "xsmall" : "small" }}>Shapes!</Heading>
          <Text size={textSize}>Make designs by rotating tiles and changing colors. Clicking on the tiles will cycle through the possible options.</Text>
          <Heading level="4" margin={{ vertical: isShort || isNarrow ? "xsmall" : "small" }}>Shortcuts</Heading>
          <Shortcuts>
            <Shortcut
              keys={["r"]}
              description={<Box direction="row" gap="small" align="center"><Text size={textSize}>Switch to rotation mode</Text><Cycle size={textSize} color="text" /></Box>}
            />
            <Shortcut
              keys={["c"]}
              description={<Box direction="row" gap="small" align="center"><Text size={textSize}>Switch to color mode</Text><ClearOption size={textSize} color="text" /></Box>}
            />
          </Shortcuts>
        </Box>
      </Info>

    </ToolMenu>
  )
}

export default ShapeTools
