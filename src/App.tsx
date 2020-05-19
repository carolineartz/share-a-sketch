import React from "react"

import { Grommet, Box, Button, Sidebar, Avatar, Nav } from "grommet"
import { Help, Projects, Clock, Cube, Brush } from "grommet-icons"
import { Toolbar } from "./components/Toolbar"
import { ShapesDesignTools } from "./views/ShapesDesignTools"
import { NavToggleButtons } from "./components/NavToggleButtons"

import { ShapesDesign } from "./views/ShapesDesign"
import customTheme from "./theme"

type View = "press" | "draw"

const App = () => {
  const [view, setView]: [View, React.Dispatch<React.SetStateAction<View>>] = React.useState(
    "press" as View
  )

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
          <Toolbar>{view === ("press" as View) ? <ShapesDesignTools /> : <Box />}</Toolbar>
          <Box align="center" flex="grow">
            <Box
              flex="grow"
              pad="small"
              background="white"
              height="672px" // TOOD: use ResponsiveContext
              width="672px" // TOOD: use ResponsiveContext
              elevation="small"
              round="xsmall"
            >
              {view === "press" && <ShapesDesign />}
            </Box>
          </Box>
        </Box>
      </Box>
    </Grommet>
  )
}

export default App
