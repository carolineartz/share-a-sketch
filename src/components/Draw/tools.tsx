import * as React from "react"
import { useMediaQuery } from 'react-responsive'

import { Edit, Erase, Star, StopFill } from "grommet-icons"
import { Drop, Button, ResponsiveContext, RangeInput, Box, ThemeContext, Heading, Text, TextInput } from "grommet"
import { normalizeColor } from "grommet/utils"
import { DropMenu, DropOption, DropSelectProps } from "@components/dropMenu"
import { ToolMenu } from "@components/toolMenu"
import { ColorDrop, ShapeCircle, Ruler, Font, SmileyEmoji } from "@components/icon"
import * as DrawSettingsContext from "@components/Draw/context"
import { DesignColor } from "@components/App/theme"
import Info, { Shortcut, Shortcuts } from "@components/Info"

import "styled-components/macro"

import 'emoji-mart/css/emoji-mart.css'

import { Picker, EmojiData } from 'emoji-mart'

// import { Picker } from 'emoji-mart'

const colors: DesignColor[] = ["#42b8a4", "#4291b8", "#4256b8", "#6942b8", "#a442b8"]
const shapes: DrawSettingsContext.DrawShape[] = ["circle", "square", "star"]
const HiddenTextInput = TextInput as any

const DrawTools = (): JSX.Element => {
  const { tool, setTool, color, setColor, shape, setShape, size, setSize, setEmoji } = DrawSettingsContext.useDrawSettings()
  const [showColorOptions, setShowColorOptions] = React.useState<boolean>(false)
  const [showShapeOptions, setShowShapeOptions] = React.useState<boolean>(false)
  const [showSizeOptions, setShowSizeOptions] = React.useState<boolean>(false)
  const [showEmojiOptions, setShowEmojiOptions] = React.useState<boolean>(false)
  const textInputRef = React.useRef<HTMLInputElement>(null)

  const colorMenuItemRef = React.useRef() as any
  const shapeMenuItemRef = React.useRef() as any
  const sizeMenuItemRef = React.useRef() as any
  const textMenuItemRef = React.useRef() as any
  const emojiMenuItemRef = React.useRef() as any

  const closeColorOptions = (): void => setShowColorOptions(false)
  const closeShapeOptions = (): void => setShowShapeOptions(false)
  const closeSizeOptions = (): void => setShowSizeOptions(false)
  const closeEmojiOptions = (): void => setShowEmojiOptions(false)

  const screenWidth = React.useContext(ResponsiveContext)
  const isShort = useMediaQuery({ query: '(max-device-height: 450px)' })
  const isNarrow = screenWidth === "small"
  const isSmall = isShort || isNarrow

  const theme = React.useContext(ThemeContext)

  const iconSize = isSmall ? "medium" : "large"

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
    <ToolMenu size={isSmall? "small" : "medium"}>
      <>
        <Box css="z-index: -1; position: absolute; width: 0; height: 0; opacity: 0; overflow: hidden;">
          <HiddenTextInput id="draw-tools-hidden-input" ref={textInputRef} />
        </Box>
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
          onClick={() => setTool("text")}
          title="Text"
          active={tool === "text"}
          ref={textMenuItemRef}
          key="draw-text"
          icon={<Font size={iconSize} color={normalizeColor("text", theme)} />}
        />
        <Button
          onClick={() => {
            setShowEmojiOptions(true)
            setTool("emoji")
          }}
          title="Emoji"
          active={tool === "emoji"}
          ref={emojiMenuItemRef}
          key="draw-emoji"
          icon={<SmileyEmoji color="plain" size={iconSize} />}
        />
        {showEmojiOptions && emojiMenuItemRef && emojiMenuItemRef.current && (
          <Drop
            align={{ top: "top", left: "right" }}
            target={emojiMenuItemRef.current}
            onClickOutside={closeEmojiOptions}
            onEsc={closeEmojiOptions}
          >
            <Picker
              set="twitter"
              emoji='point_up'
              title='Pick your emoji…'
              perLine={screenWidth === "small" ? 6 : 9}
              emojiSize={32}
              onClick={(clickedEmoji: EmojiData) => {
                setEmoji(clickedEmoji)
                setShowEmojiOptions(false)
              }}
              onSelect={(selectedEmoji: EmojiData) => {
                setEmoji(selectedEmoji)
                setShowEmojiOptions(false)
              }}
              emojiTooltip
            />
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
            <Shortcuts>
              <Shortcut
                keys={["p", 'd']}
                description={<Box direction="row" gap="small"><Text>Switch to paint mode</Text><Edit color="text" /></Box>}
              />
              <Shortcut
                keys={["s"]}
                description={<Box direction="row" gap="small"><Text>Switch to stamp/shape mode</Text><Star color="text" /></Box>}
              />
              <Shortcut
                keys={["e"]}
                description={<Box direction="row" gap="small"><Text>Switch to erase mode</Text><Erase color="text" /></Box>}
              />
              <Shortcut
                keys={["+"]}
                description={<Text>Increase size</Text>}
              />
              <Shortcut
                keys={["-"]}
                description={<Text>Decrease size</Text>}
              />
            </Shortcuts>
          </Box>
        </Info>
      </>
    </ToolMenu>
  )
}

export default DrawTools
