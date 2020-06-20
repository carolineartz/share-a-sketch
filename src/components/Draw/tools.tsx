import * as React from "react"
import { Edit, Erase, Star, StopFill } from "grommet-icons"
import { Drop, Button, ResponsiveContext, RangeInput, Box, ThemeContext, Heading, Text, List } from "grommet"
import { normalizeColor } from "grommet/utils"
import { DropMenu, DropOption, DropSelectProps } from "@components/dropMenu"
import { ToolMenu } from "@components/toolMenu"
import { ColorDrop, ShapeCircle, Ruler } from "@components/icon"
import * as DrawSettingsContext from "@components/Draw/context"
import { DesignColor } from "@components/App/theme"
import Info from "@components/Info"
import { KeyboardText } from '@components/keyboardText';

const colors: DesignColor[] = ["#42b8a4", "#4291b8", "#4256b8", "#6942b8", "#a442b8"]
const shapes: DrawSettingsContext.DrawShape[] = ["circle", "square", "star"]

const DrawTools = (): JSX.Element => {
  const { tool, setTool, color, setColor, shape, setShape, size, setSize } = DrawSettingsContext.useDrawSettings()
  const [showColorOptions, setShowColorOptions] = React.useState<boolean>(false)
  const [showShapeOptions, setShowShapeOptions] = React.useState<boolean>(false)
  const [showSizeOptions, setShowSizeOptions] = React.useState<boolean>(false)

  const colorMenuItemRef = React.useRef() as any
  const shapeMenuItemRef = React.useRef() as any
  const sizeMenuItemRef = React.useRef() as any

  const closeColorOptions = (): void => setShowColorOptions(false)
  const closeShapeOptions = (): void => setShowShapeOptions(false)
  const closeSizeOptions = (): void => setShowSizeOptions(false)
  const screenWidth = React.useContext(ResponsiveContext)
  const theme = React.useContext(ThemeContext)

  const iconSize = screenWidth === "small" ? "medium" : "large"

  const colorOptions: DropOption<DesignColor>[] = colors.map((c: DesignColor) => ({
    value: c,
    icon: <ShapeCircle size={iconSize} color={c} />,
  }))

  const colorSelectProps: DropSelectProps<DesignColor> = {
    onClick: (c: DesignColor) => {
      setColor(c)
      closeShapeOptions()
      closeColorOptions()
    },
    value: color,
    options: colorOptions,
  }

  const shapeIcon = (s: DrawSettingsContext.DrawShape): JSX.Element =>
    s === "circle" ? (
      <ShapeCircle size={iconSize} color={color} />
    ) : s === "square" ? (
      <StopFill size={iconSize} color={color} />
    ) : (
      <Star size={iconSize} color={color} />
    )

  const shapeOptions: DropOption<DrawSettingsContext.DrawShape>[] = shapes.map((s: DrawSettingsContext.DrawShape) => ({
    value: s,
    icon: shapeIcon(s),
  }))

  const shapeSelectProps: DropSelectProps<DrawSettingsContext.DrawShape> = {
    onClick: (s: DrawSettingsContext.DrawShape) => {
      setShape(s)
      closeShapeOptions()
      closeColorOptions()
    },
    value: shape,
    options: shapeOptions,
  }

  return (
    <ToolMenu size={screenWidth === "small" ? "small" : "medium"}>
      <>
        <Button
          onClick={() => setShowColorOptions(!showColorOptions)}
          title="Color"
          ref={colorMenuItemRef}
          key="draw-color"
          icon={<ColorDrop size={iconSize} color={color} />}
        />
        {showColorOptions && colorMenuItemRef && colorMenuItemRef.current && (
          <Drop
            align={{ top: "top", left: "right" }}
            target={colorMenuItemRef.current}
            onClickOutside={closeColorOptions}
            onEsc={closeColorOptions}
          >
            <DropMenu {...colorSelectProps} />
          </Drop>
        )}
        <Button
          onClick={() => {
            setTool("shape")
            setShowShapeOptions(!showShapeOptions)
          }}
          title="Shape"
          active={tool === "shape"}
          ref={shapeMenuItemRef}
          key="draw-shape"
          icon={shapeIcon(shape)}
        />
        {showShapeOptions && shapeMenuItemRef && shapeMenuItemRef.current && (
          <Drop
            align={{ top: "top", left: "right" }}
            target={shapeMenuItemRef.current}
            onClickOutside={closeShapeOptions}
            onEsc={closeShapeOptions}
          >
            <DropMenu {...shapeSelectProps} />
          </Drop>
        )}
        <Button
          onClick={() => setShowSizeOptions(!showSizeOptions)}
          title="Size"
          ref={sizeMenuItemRef}
          key="draw-size"
          icon={<Ruler size={iconSize} color={normalizeColor("text", theme)} />}
        />
        {showSizeOptions && sizeMenuItemRef && sizeMenuItemRef.current && (
          <Drop
            align={{ top: "top", left: "right" }}
            target={sizeMenuItemRef.current}
            onClickOutside={closeSizeOptions}
            onEsc={closeSizeOptions}
          >
            <Box pad={{vertical: "medium", horizontal: "small"}}>
              <RangeInput
                value={size}
                min={3}
                max={60}
                onChange={(event: any) => setSize(event.target.value)}
              />
            </Box>
          </Drop>
        )}
        <Button
          title="Draw"
          key="draw-design-paint"
          icon={<Edit size={iconSize} color={tool === "paint" ? "white" : "text"} />}
          active={tool === "paint"}
          onClick={() => setTool("paint")}
        />
        <Button
          title="Erase"
          key="draw-design-erase"
          icon={<Erase size={iconSize} color={tool === "erase" ? "white" : "text"} />}
          active={tool === "erase"}
          onClick={() => setTool("erase")}
        />
        <Info>
          <Box>
            <Heading level="3">Draw!</Heading>
            <Text>Doodle designs with the pen or stamp with shapes. Adjust settings for various sizes and colors.</Text>
            <Heading level="4">Shortcuts</Heading>
            <List
              border={{
                color: "text",
                side: "horizontal"
              }}
              primaryKey={
                data => <>{data.key.map((k: string) =>
                <KeyboardText>{k}</KeyboardText>)}</>
              }
              secondaryKey={data => <><Text>{data.description.text}</Text>{data.description.icon}</>}
              data={[
                {key: ['p', 'd'], description: {text: 'Switch to paint mode', icon: <Edit color="text" />}},
                {key: ['s'], description: {text: 'Switch to stamp/shape mode', icon: <Star color="text" />}},
                {key: ['e'], description: {text: 'Switch to erase mode', icon: <Erase color="text" />}},
                {key: ['+'], description: {text: 'Increase size'}},
                {key: ['-'], description: {text: 'Decrease sizee'}}
              ]}
            />
          </Box>
        </Info>
      </>
    </ToolMenu>
  )
}

export default DrawTools
