import React from "react"

import { Grommet, Box } from "grommet"
import { Cube, Brush } from "grommet-icons"
import styled from "styled-components"
import { ToolMenu } from "./components/ToolMenu"
import { ShapesTools } from "./views/shapes/ShapesTools"
import { NavToggleButtons } from "./components/NavToggleButtons"
import { DrawDesignTools } from "./views/DrawDesignTools"
import * as DesignModeContext from "./views/DesignModeContext"
import { ShapesView } from "./views/shapes/ShapesView"
import { ConnectionStatus } from "./components/ConnectionStatus"

import { customTheme } from "./theme"

const App = (): JSX.Element => {
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
          <ConnectionStatus />
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
    /* background: white; */
    position: absolute;
  }
`
