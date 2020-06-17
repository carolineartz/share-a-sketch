import { deepFreeze, ColorType } from "grommet/utils"
import { ThemeType } from "grommet"

export type DesignColor = "#42b8a4" | "#4291b8" | "#4256b8" | "#6942b8" | "#a442b8"
export const colorStatusCritical = "#FF3333"
export const colorStatusUnknown = "#a8a8a8"
export const brand = "#eaaf2a"
export const dark = "#0a0b27"

type DesignPalette = {
  name: string
  colors: string[]
}

const defaultPalette =   {
    name: "default",
    colors: ["#42b8a4", "#4291b8", "#4256b8", "#6942b8", "#a442b8"]
  }

export const palettes: DesignPalette[] = [defaultPalette]

export const activePalette = (theme: ThemeType): DesignPalette => {
  if (theme.global && theme.global.colors && theme.global.colors.palette && typeof theme.global.colors.palette === 'string') {
    const activePaletteName = theme.global.colors.palette
    return palettes.find((p: DesignPalette) => p.name === activePaletteName) || defaultPalette
  }

  return defaultPalette
}

const colors: Record<string, ColorType> = {
  palette: "default", // FIXME: need to create a separate context for this - this is not a valid "color" value.
  active: "brand",
  border: "rgba(255,255,255,0.33)",
  brand: brand,
  control: "#6AB2E0",
  focus: brand,
  text: dark,
  "dark-1": dark,
  "accent-1": "#DA8455",
  "accent-2": "#60EB9F",
  "accent-3": brand,
  "accent-4": "#6AB2E0",
  "neutral-1": "#EB6060",
  "neutral-2": "#01C781",
  "neutral-3": "#6095EB",
  "neutral-4": "#FFB200",
  "status-critical": colorStatusCritical,
  "status-error": "#FF3333",
  "status-warning": "#F7E464",
  "status-ok": "#7DD892",
  "status-unknown": colorStatusUnknown,
  "status-disabled": colorStatusUnknown,
}

type ColorMap = Record<string, ColorType>
const generatePaletteColors = (palette: DesignPalette): ColorMap =>
  palette.colors.reduce((colorMap: ColorMap, color: string, index: number) => {
    colorMap[`palette-${palette.name}-${index + 1}`] = color
    return colorMap
  }, {} as ColorMap)

palettes.forEach((palette: DesignPalette) => {
  const colorMap = generatePaletteColors(palette)
  for (const paletteColor in colorMap) {
   colors[paletteColor] = colorMap[paletteColor]
  }
})

const theme: ThemeType = {
  button: {
    extend: "font-weight: bold; border-width: 5px;",
  },
  icon: {
    size: {},
  },
  layer: {
    background: "text"
  },
  rangeInput: {
    track: {
      color: "text"
    }
  },
  global: {
    font: {
      family: "Quicksand",
    },
    hover: {
      background: {
        color: "brand",
        opacity: 0.6,
      },
    },
    active: {
      color: "white",
      background: {
        opacity: 1,
      },
    },
    colors
  },
}

export const customTheme = deepFreeze(theme)
