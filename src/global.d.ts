import { CSSProp } from "styled-components"
import { ThemeType } from "grommet/themes/base"

type ColorMode = "hue" | "saturation" | "lightness"
type ShapeMode = "shape" | "color"

declare module "react" {
  interface Attributes {
    css?: CSSProp<ThemeType>
  }
}
