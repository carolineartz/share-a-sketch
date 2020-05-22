import { deepFreeze } from "grommet/utils"
import { ThemeType } from "grommet"

const theme: ThemeType = {
  button: {
    extend: "font-weight: bold; border-width: 5px ;",
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
      // border:
    },
    colors: {
      active: "brand",
      border: "rgba(255,255,255,0.33)",
      brand: "#eaaf2a",
      control: "#6AB2E0",
      focus: "#eaaf2a",
      text: "#0a0a27",
      "accent-1": "#DA8455",
      "accent-2": "#60EB9F",
      "accent-3": "#eaaf2a",
      "accent-4": "#6AB2E0",
      "neutral-1": "#EB6060",
      "neutral-2": "#01C781",
      "neutral-3": "#6095EB",
      "neutral-4": "#FFB200",
      "status-critical": "#FF3333",
      "status-error": "#FF3333",
      "status-warning": "#F7E464",
      "status-ok": "#7DD892",
      "status-unknown": "#a8a8a8",
      "status-disabled": "#a8a8a8",
    },
    // drop: {
    //   background: "#333333",
    // },
    // focus: {
    //   border: {
    //     color: [null, ";"],
    //   },
    // },
    // input: {
    //   weight: 700,
    // },
  },
  // anchor: {
  //   color: "#FFCA58",
  // },
  // layer: {
  //   background: "#111111",
  //   overlay: {
  //     background: "rgba(48,48,48,0.5)",
  //   },
  // },
}

export const customTheme = deepFreeze(theme)
