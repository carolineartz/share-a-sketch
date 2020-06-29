import * as React from "react"
import { DesignColor } from "@components/App/theme"
import { EmojiData } from 'emoji-mart'

export type DrawTool = "erase" | "paint" | "shape" | "text" | "emoji"
export type DrawShape = "circle" | "square" | "star"

export type DrawSettingsContextType = {
  isActive: boolean
  setActive: (active: boolean) => void
  tool: DrawTool
  setTool: (tool: DrawTool) => void
  shape: DrawShape
  setShape: (shape: DrawShape) => void
  size: number,
  setSize: (size: number) => void,
  color: DesignColor
  setColor: (color: DesignColor) => void
  emoji: EmojiData
  setEmoji: (emoji: EmojiData) => void
}

const defaultEmoji: EmojiData = {
  colons: ":grin:",
  emoticons: [],
  id: "grin",
  name: "Grinning Face with Smiling Eyes",
  native: "😁",
  short_names: ["grin"],
  skin: null,
  unified: "1f601"
}

export const DrawSettingsContext = React.createContext<DrawSettingsContextType>({
  isActive: false,
  setActive: _active => {},
  tool: "paint",
  setTool: _tool => {},
  shape: "star",
  setShape: _shape => {},
  size: 8,
  setSize: _size => {},
  color: "#4291b8",
  setColor: _color => { },
  emoji: defaultEmoji,
  setEmoji: _emoji => {}
})

type Props = {
  children: React.ReactNode
}

export const Provider = ({ children }: Props): JSX.Element => {
  const [tool, setTool] = React.useState<DrawTool>("paint")
  const [size, setSize] = React.useState<number>(8)
  const [shape, setShape] = React.useState<DrawShape>("circle")
  const [color, setColor] = React.useState<DesignColor>("#4291b8")
  const [emoji, setEmoji] = React.useState<EmojiData>(defaultEmoji)
  const [isActive, setActive] = React.useState<boolean>(false)

  return (
    <DrawSettingsContext.Provider
      value={{
        isActive,
        setActive,
        tool,
        setTool,
        shape,
        setShape,
        size,
        setSize,
        color,
        setColor,
        emoji,
        setEmoji
      }}
    >
      {children}
    </DrawSettingsContext.Provider>
  )
}

export const useDrawSettings = (): DrawSettingsContextType => React.useContext(DrawSettingsContext)
