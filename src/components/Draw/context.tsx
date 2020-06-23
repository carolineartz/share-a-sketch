import * as React from "react"
import { DesignColor } from "@components/App/theme"

export type DrawTool = "erase" | "paint" | "shape" | "text"
export type DrawShape = "circle" | "square" | "star"

export type DrawSettingsContextType = {
  tool: DrawTool
  setTool: (tool: DrawTool) => void
  shape: DrawShape
  setShape: (shape: DrawShape) => void
  size: number,
  setSize: (size: number) => void,
  color: DesignColor
  setColor: (color: DesignColor) => void
}

export const DrawSettingsContext = React.createContext<DrawSettingsContextType>({
  tool: "paint",
  setTool: _tool => {},
  shape: "star",
  setShape: _shape => {},
  size: 8,
  setSize: _size => {},
  color: "#4291b8",
  setColor: _color => {},
})

type Props = {
  children: React.ReactNode
}

export const Provider = ({ children }: Props): JSX.Element => {
  const [tool, setTool] = React.useState<DrawTool>("paint")
  const [size, setSize] = React.useState<number>(8)
  const [shape, setShape] = React.useState<DrawShape>("circle")
  const [color, setColor] = React.useState<DesignColor>("#4291b8")

  return (
    <DrawSettingsContext.Provider
      value={{
        tool,
        setTool,
        shape,
        setShape,
        size,
        setSize,
        color,
        setColor,
      }}
    >
      {children}
    </DrawSettingsContext.Provider>
  )
}

export const useDrawSettings = (): DrawSettingsContextType => React.useContext(DrawSettingsContext)
