import React from "react"

import { Grommet, Box, Button, Sidebar, Avatar, Nav, Layer, Stack } from "grommet"
import { Help, Projects, Clock, Cube, Brush } from "grommet-icons"
// import { Toolbar } from "./components/Toolbar"
import { ToolMenu } from "./components/ToolMenu"
import { ShapesTools } from "./views/shapes/ShapesTools"
import { NavToggleButtons } from "./components/NavToggleButtons"

import { DrawDesign } from "./views/DrawDesign"
import { DrawDesignTools } from "./views/DrawDesignTools"
import * as DesignModeContext from "./views/DesignModeContext"
import { ShapesView } from "./views/shapes/ShapesView"

import customTheme from "./theme"
import styled from "styled-components"

const App = () => {
  const [view, setView]: [DesignView, React.Dispatch<React.SetStateAction<DesignView>>] = React.useState(
    "press" as DesignView
  )
  const { setMode } = DesignModeContext.useDesignMode()

  return (
    <Grommet full theme={customTheme}>
      <Container>
        <DesignModeContext.Provider>
          <ShapesView />
          <NavToggleButtons
            justify="center"
            align="center"
            active={view === "press" ? "left" : "right"}
            left={{
              icon: <Cube color={view === "press" ? "white" : "text"} />,
              label: "Shapes",
              onClick: () => {
                setView("press")
                setMode("color")
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
          <ToolMenu>{view === "press" ? <ShapesTools /> : <DrawDesignTools />}</ToolMenu>
        </DesignModeContext.Provider>
      </Container>
    </Grommet>
  )
}

export default App

const Container = styled(Box)`
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative;
  > * {
    position: absolute;
  }
`