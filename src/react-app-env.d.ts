/// <reference types="react-scripts" />

type DesignView = "shapes" | "draw"
type DesignColor = "#42b8a4" | "#4291b8" | "#4256b8" | "#6942b8" | "#a442b8"
type ButtonToggleSide = "left" | "right"
type DatabaseStatus = "connected" | "disconnected"

type PathData = {
  id: string
  value: any
}

type ShapeMode = "rotate" | "color"
type ShapeSettingsContextType = {
  mode: ShapeMode
  setMode: (mode: ShapeMode) => void
}

type DrawTool = "erase" | "paint" | "shape"
type DrawShape = "circle" | "square" | "star"
type DrawStrokeWidth = 0 | 4 | 6 | 8 | 14 | 18

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
