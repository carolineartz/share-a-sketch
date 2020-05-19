import React from "react"

import { Grommet, Box, Button, Sidebar, Avatar, Nav } from "grommet"
import { Help, Projects, Clock, Cube, Brush } from "grommet-icons"
import { Toolbar } from "./components/Toolbar"
import { ColorDesignTools } from "./views/ColorDesignTools"
import { NavToggleButtons } from "./components/NavToggleButtons"

// import times from "lodash.times"
import { ColorDesign } from "./views/ColorDesign"
// import firebase from "./Firebase"
import customTheme from "./theme"

// const customTheme = deepFreeze({
//   global: {
//     colors: {
//       brand: "#222340",
//       "accent-1": "#0a0b27",
//     },
//   },
// })

type View = "press" | "draw"

const App = () => {
  const [view, setView]: [View, React.Dispatch<React.SetStateAction<View>>] = React.useState(
    "press" as View
  )
  console.log(view)

  return (
    <Grommet full theme={customTheme}>
      <Box pad="medium">
        <Box pad={{ bottom: "medium" }}>
          <NavToggleButtons
            width="100%"
            pad="small"
            justify="center"
            active={view === "press" ? "left" : "right"}
            left={{
              icon: <Cube />,
              label: "Shapes",
              onClick: () => setView("press"),
            }}
            right={{
              icon: <Brush />,
              label: "Draw",
              onClick: () => setView("draw"),
            }}
          />
        </Box>
        <Box gap="medium" direction="row">
          <Toolbar>{view === ("press" as View) ? <ColorDesignTools /> : <Box />}</Toolbar>
          <Box align="center" flex="grow">
            <Box flex="grow" pad="small" background="white" elevation="small" round="xsmall">
              {view === "press" && <ColorDesign />}
            </Box>
          </Box>
        </Box>
      </Box>
    </Grommet>
  )
}

export default App
