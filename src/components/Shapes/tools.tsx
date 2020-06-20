import * as React from "react"
import { Button, ResponsiveContext, Box, Paragraph, Text, Heading, List } from "grommet"
import { Cycle, ClearOption } from "grommet-icons"
import * as ShapeSettingsContext from "./context"
import { ToolMenu } from "@components/toolMenu"
import Info from "@components/Info"
import { KeyboardText } from '@components/keyboardText';

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
            <List
              border={{
                color: "text",
                side: "horizontal"
              }}
              primaryKey={(data) => <KeyboardText>{data.key}</KeyboardText>}
              secondaryKey={(data) => <><Text>{data.description.text}</Text>{data.description.icon}</>}
              data={[
                {key: 'r', description: {text: 'Switch to rotation mode', icon: <Cycle color="text" />}},
                {key: 'c', description: {text: 'Switch to color mode', icon: <ClearOption color="text" />}},
              ]}
            />
          </Box>
        </Info>
      </>
    </ToolMenu>
  )
}

export default ShapeTools
