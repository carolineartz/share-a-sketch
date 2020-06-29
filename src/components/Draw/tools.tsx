import * as React from "react"
import { useMediaQuery } from 'react-responsive'

import { Edit, Erase, Star, StopFill } from "grommet-icons"
import { ResponsiveContext, RangeInput, Box, Heading, Text, TextInput } from "grommet"
import { ToolMenu, ToolMenuItem, DropSubmenu, ToolMenuContext } from "@components/ToolMenu"
import { ColorDrop, ShapeCircle, Ruler, Font, SmileyEmoji } from "@components/icon"
import * as DrawSettingsContext from "@components/Draw/context"
import { DesignColor, dark } from "@components/App/theme"
import Info, { Shortcut, Shortcuts } from "@components/Info"

import "styled-components/macro"

import 'emoji-mart/css/emoji-mart.css'

import { Picker, EmojiData } from 'emoji-mart'

const HiddenTextInput = TextInput as any

const DrawTools = (): JSX.Element => {
  const screenWidth = React.useContext(ResponsiveContext)
  const isShort = useMediaQuery({ query: '(max-device-height: 450px)' })
  const isNarrow = screenWidth === "small"
  const isSmall = isShort || isNarrow

  return (
    <ToolMenu size={isSmall? "small" : "medium"}>
      <ColorMenuItem />
      <ShapeMenuItem />
      <TextMenuItem />
      <EmojiMenuItem />
      <SizeMenuItem />
      <PaintMenuItem />
      <EraseMenuItem />
      <InfoItem />
    </ToolMenu>
  )
}

const ShapeMenuItem = () => {
  const { tool, setTool, shape, color, setShape } = DrawSettingsContext.useDrawSettings()
  const { displayMode, setToolMenuDisplay, toolMenuDisplay } = ToolMenuContext.useToolMenuDisplay()!
  const [selected, setSelected] = React.useState<boolean>(false)

  const shapes: DrawSettingsContext.DrawShape[] = ["circle", "square", "star"]

  React.useEffect(() => {
    if (toolMenuDisplay === "maximize") {
      setSelected(false)
    }
  }, [toolMenuDisplay])

  return (
    <ToolMenuItem
      title="Draw Tools: Select Shape"
      icon={{
        icon: shape === "circle" ? ShapeCircle : shape === "square" ? StopFill : Star,
        color: color as string,
        activeColor: color as string
      }}
      onSelect={() => {
        setTool("shape")
        setSelected(true)
      }}
      isSelected={tool === "shape" && selected}
      isActive={tool === "shape"}
    >
      <DropSubmenu.Menu
        onClick={(s: DrawSettingsContext.DrawShape) => {
          setShape(s)
          setToolMenuDisplay(displayMode === "autohide" ? "minimize" : "maximize")
          setSelected(false)
        }}
        value={shape}
        options={shapes.map((s: DrawSettingsContext.DrawShape) => ({
          value: s,
          icon: {
            icon: s === "circle" ? ShapeCircle : s === "square" ? StopFill : Star,
            color
          }
        }))}
      />
    </ToolMenuItem>
  )
}

const ColorMenuItem = () => {
  const { color, setColor } = DrawSettingsContext.useDrawSettings()
  const { displayMode, setToolMenuDisplay, toolMenuDisplay } = ToolMenuContext.useToolMenuDisplay()!
  const [selected, setSelected] = React.useState<boolean>(false)

  const colors: DesignColor[] = ["#42b8a4", "#4291b8", "#4256b8", "#6942b8", "#a442b8"]

  React.useEffect(() => {
    if (toolMenuDisplay === "maximize") {
      setSelected(false)
    }
  }, [toolMenuDisplay])

  return (
    <ToolMenuItem
      title="Draw Tools: Select Shape"
      icon={{
        icon: ColorDrop,
        color: color as string
      }}
      onSelect={() => setSelected(true)}
      onDeselect={() => setSelected(false)}
      isSelected={selected}
      isActive={false}
    >
      <DropSubmenu.Menu
        onClick={(c: DesignColor) => {
          setColor(c)
          setToolMenuDisplay(displayMode === "autohide" ? "minimize" : "maximize")
        }}
        value={color}
        options={colors.map((c: DesignColor) => ({
          value: c,
          icon: {
            icon: ShapeCircle,
            color: c
          }
        }))}
      />
    </ToolMenuItem>
  )
}

const TextMenuItem = () => {
  const { tool, setTool } = DrawSettingsContext.useDrawSettings()
  const textInputRef = React.useRef<HTMLInputElement>(null)

  return (
    <>
      <ToolMenuItem
        title="Draw Tools: Text Tool"
        key="draw-tools-text-tool-item"
        icon={{icon: Font}}
        onSelect={() => setTool("text")}
        isActive={tool === "text"}
        isSelected={tool === "text"}
      />
      <Box key="draw-tools-text-tool-hidden-text-input" css="z-index: -1; position: absolute; width: 0; height: 0; opacity: 0; overflow: hidden;">
        <HiddenTextInput id="draw-tools-hidden-input" ref={textInputRef} />
      </Box>
    </>
  )
}

const EmojiMenuItem = () => {
  const { setEmoji, tool, setTool } = DrawSettingsContext.useDrawSettings()
  const screenWidth = React.useContext(ResponsiveContext)
  const { displayMode, setToolMenuDisplay, toolMenuDisplay } = ToolMenuContext.useToolMenuDisplay()!
  const [selected, setSelected] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (toolMenuDisplay === "maximize") {
      setSelected(false)
    }
  }, [toolMenuDisplay])

  return (
    <ToolMenuItem
      title="Draw Tools: Select Shape"
      icon={{
        icon: SmileyEmoji,
        color: "plain",
        plain: true
      }}
      onSelect={() => {
        setTool("emoji")
        setSelected(true)
      }}
      isActive={tool === "emoji"}
      isSelected={tool === "emoji" && selected}
    >
      <Picker
        set="twitter"
        emoji='point_up'
        title='Pick your emoji…'
        perLine={screenWidth === "small" ? 6 : 9}
        emojiSize={32}
        onClick={(clickedEmoji: EmojiData) => {
          setEmoji(clickedEmoji)
          setToolMenuDisplay(displayMode === "autohide" ? "minimize" : "maximize")
        }}
        onSelect={(selectedEmoji: EmojiData) => {
          setEmoji(selectedEmoji)
          setToolMenuDisplay(displayMode === "autohide" ? "minimize" : "maximize")
        }}
        emojiTooltip
      />
    </ToolMenuItem>
  )
}

const SizeMenuItem = () => {
  const { setSize, size } = DrawSettingsContext.useDrawSettings()
  const { toolMenuDisplay } = ToolMenuContext.useToolMenuDisplay()!
  const [selected, setSelected] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (toolMenuDisplay === "maximize") {
      setSelected(false)
    }
  }, [toolMenuDisplay])

  return (
    <ToolMenuItem
      title="Draw Tools: Set Size"
      icon={{ icon: Ruler, color: dark }}
      onSelect={() => setSelected(true)}
      onDeselect={() => setSelected(false)}
      isActive={false}
      isSelected={selected}
    >
      <Box pad={{vertical: "medium", horizontal: "small"}}>
        <RangeInput
          value={size}
          min={3}
          max={60}
          onChange={(event: any) => {
            setSize(event.target.value)
          }}
        />
      </Box>
    </ToolMenuItem>
  )
}

const PaintMenuItem = () => {
  const { tool, setTool } = DrawSettingsContext.useDrawSettings()

  return (
    <ToolMenuItem
      title="Draw Tools: Paint Tool"
      icon={{ icon: Edit }}
      onSelect={() => setTool("paint")}
      isSelected={tool === "paint"}
      isActive={tool === "paint"}
    />
  )
}

const EraseMenuItem = () => {
  const { tool, setTool } = DrawSettingsContext.useDrawSettings()

  return (
    <ToolMenuItem
      title="Draw Tools: Erase Tool"
      icon={{ icon: Erase }}
      onSelect={() => setTool("erase")}
      isSelected={tool === "erase"}
      isActive={tool === "erase"}
    />
  )
}

const InfoItem = () => {
  return (
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
  )
}

export default DrawTools
