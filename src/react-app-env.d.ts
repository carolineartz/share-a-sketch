/// <reference types="react-scripts" />

type ColorMode = "hue" | "saturation" | "lightness"
type ShapeMode = "shape" | "color"
type DrawMode = "draw" | "erase" | "none"
type ButtonToggleSide = "left" | "right"

declare module "lz-string"

type PathData = {
  id: string
  value: any
}