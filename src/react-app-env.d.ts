/// <reference types="react-scripts" />
type ColorMode = "hue" | "saturation" | "lightness"

type DesignView = "press" | "draw"
type DesignMode = ShapeMode | DrawMode

type ShapeMode = "rotate" | "color"
type DrawMode = "paint" | "erase" | "none"

type ButtonToggleSide = "left" | "right"

declare module "lz-string"

type PathData = {
  id: string
  value: any
}

type DesignModeContextType = {
  mode: DesignMode
  setMode: (mode: DesignMode) => void
}
