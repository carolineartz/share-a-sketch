import React from "react"

import { Grommet, Box, Button, Sidebar, Avatar, Nav } from "grommet"
import { Help, Projects, Clock, Cube, Brush } from "grommet-icons"
import { Toolbar } from "./components/Toolbar"
import { ShapesDesignTools } from "./views/ShapesDesignTools"
import { NavToggleButtons } from "./components/NavToggleButtons"

import { ShapesDesign } from "./views/ShapesDesign"
import { DrawDesign } from "./views/DrawDesign"
import { DrawDesignTools } from "./views/DrawDesignTools"
import * as DesignModeContext from "./views/DesignModeContext"

import customTheme from "./theme"

// const DesignModeContext = React.createContext({
//   mode: "shape",
//   changeMode: () => {}
// })

const App = () => {
  const [view, setView]: [DesignView, React.Dispatch<React.SetStateAction<DesignView>>] = React.useState(
    "press" as DesignView
  )
  const { setMode } = DesignModeContext.useDesignMode()
  // const [mode, setMode]: [DesignMode, React.Dispatch<React.SetStateAction<DesignMode>>] = React.useState(
  //   "shape" as DesignMode
  // )

  return (
    <Grommet full theme={customTheme}>
      <Box pad="small">

          <NavToggleButtons
            width="100%"
            pad="small"
            justify="center"
            active={view === "press" ? "left" : "right"}
            left={{
              icon: <Cube color={view === "press" ? "white" : "text"} />,
              label: "Shapes",
              onClick: () => {
                setView("press")
                setMode("rotate")
              },
            }}
            right={{
              icon: <Brush color={view === "draw" ? "white" : "text"} />,
              label: "Draw",
              onClick: () => {
                setView("draw")
                setMode("paint")
              },
            }}
          />

        <DesignModeContext.Provider>
          <Box gap="medium" direction="row" justify="center">
            <Toolbar>{view === ("press" as DesignView) ? <ShapesDesignTools /> : <DrawDesignTools />}</Toolbar>
            <Box width="100%" height="90vw" style={{ maxWidth: "85vh", maxHeight: "85vh" }}>
              <Box
                flex="grow"
                pad="small"
                background="white"
                width="100%"
                height="100%"
                // height="672px" // TOOD: use ResponsiveContext
                // width="672px" // TOOD: use ResponsiveContext
                elevation="small"
                round="xsmall"
              >
                {view === "press" && <ShapesDesign />}
                {view === "draw" && <DrawDesign />}
              </Box>
            </Box>
          </Box>
        </DesignModeContext.Provider>
      </Box>
    </Grommet>
  )
}

export default App
