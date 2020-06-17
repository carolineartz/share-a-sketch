import { deepFreeze } from "grommet/utils"
import { ThemeType } from "grommet"

export type DesignColor = "#42b8a4" | "#4291b8" | "#4256b8" | "#6942b8" | "#a442b8"
export const colorStatusCritical = "#FF3333"
export const colorStatusUnknown = "#a8a8a8"
export const brand = "#eaaf2a"
// export const dark =

const theme: ThemeType = {
  button: {
    extend: "font-weight: bold; border-width: 5px ;",
  },
  icon: {
    size: {},
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
    colors: {
      active: "brand",
      border: "rgba(255,255,255,0.33)",
      brand: brand,
      control: "#6AB2E0",
      focus: brand,
      text: "#0a0a27",
      "dark-1": "#0a0b27",
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
    },
  },
}

export const customTheme = deepFreeze(theme)
