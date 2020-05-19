import { deepFreeze, DeepReadonly, deepMerge } from "grommet/utils"
// import { ThemeType } from "grommet/themes/base"
import { dark, ThemeType } from "grommet"

export const customTheme: ThemeType = {
  global: {
    colors: {
      active: "rgba(102,102,102,0.5)",
      border: "rgba(255,255,255,0.33)",
      brand: "#02c6cc",
      control: "#6AB2E0",
      focus: "#6AB2E0",
      text: "#eeeeee",
      "accent-1": "#DA8455",
      "accent-2": "#60EB9F",
      "accent-3": "#60EBE1",
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

export default deepFreeze(customTheme)
