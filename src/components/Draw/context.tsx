import * as React from "react"
import { DesignColor } from "../../theme"

export type DrawTool = "erase" | "paint" | "shape"
export type DrawShape = "circle" | "square" | "star"
export type DrawStrokeWidth = 0 | 4 | 6 | 8 | 14 | 18

type DrawSettingsContextType = {
  tool: DrawTool
  setTool: (tool: DrawTool) => void
  shape: DrawShape
  setShape: (shape: DrawShape) => void
  strokeWidth: DrawStrokeWidth
  setStrokeWidth: (strokeWidth: DrawStrokeWidth) => void
  color: DesignColor
  setColor: (color: DesignColor) => void
}

export const DrawSettingsContext = React.createContext<DrawSettingsContextType>({
  tool: "paint",
  setTool: _tool => {},
  shape: "star",
  setShape: _shape => {},
  strokeWidth: 8,
  setStrokeWidth: _width => {},
  color: "#4291b8",
  setColor: _color => {},
})

type Props = {
  children: React.ReactNode
}

export const Provider = ({ children }: Props): JSX.Element => {
  const [tool, setTool] = React.useState<DrawTool>("paint")
  const [shape, setShape] = React.useState<DrawShape>("circle")
  const [strokeWidth, setStrokeWidth] = React.useState<DrawStrokeWidth>(8)
  const [color, setColor] = React.useState<DesignColor>("#4291b8")

  return (
    <DrawSettingsContext.Provider
      value={{
        tool,
        setTool,
        shape,
        setShape,
        strokeWidth,
        setStrokeWidth,
        color,
        setColor,
      }}
    >
      {children}
    </DrawSettingsContext.Provider>
  )
}

export const useDrawSettings = (): DrawSettingsContextType => React.useContext(DrawSettingsContext)
