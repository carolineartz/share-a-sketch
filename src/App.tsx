import React from "react"

import { Grommet, Box } from "grommet"
import { Cube, Brush } from "grommet-icons"
import styled from "styled-components"
import { ShapesTools } from "./views/shapes/ShapesTools"
import { NavToggleButtons } from "./components/NavToggleButtons"
import { DrawTools } from "./views/draw/DrawTools"
import * as ShapeSettingsContext from "./views/shapes/ShapeSettingsContext"
import { ShapesView } from "./views/shapes/ShapesView"
import { DrawView } from "./views/draw/DrawView"
import { ConnectionStatus } from "./components/ConnectionStatus"
import * as DrawSettingsContext from "./views/draw/DrawSettingsContext"

import { customTheme } from "./theme"

const App = (): JSX.Element => {
  const [view, setView]: [DesignView, React.Dispatch<React.SetStateAction<DesignView>>] = React.useState(
    "shapes" as DesignView
  )

  return (
    <Grommet full theme={customTheme}>
      <Container>
        <ShapeSettingsContext.Provider>
          {view === "draw" && (
            <DrawSettingsContext.Provider>
              <DrawView />
              <DrawTools />
            </DrawSettingsContext.Provider>
          )}
          {view === "shapes" && (
            <ShapeSettingsContext.Provider>
              <ShapesView />
              <ShapesTools />
            </ShapeSettingsContext.Provider>
          )}
          <NavToggleButtons
            justify="center"
            align="center"
            active={view === "shapes" ? "left" : "right"}
            left={{
              icon: <Cube color={view === "shapes" ? "white" : "text"} />,
              label: "Shapes",
              onClick: () => setView("shapes"),
            }}
            right={{
              icon: <Brush color={view === "draw" ? "white" : "text"} />,
              label: "Draw",
              onClick: () => setView("draw"),
            }}
          />
          <ConnectionStatus />
        </ShapeSettingsContext.Provider>
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
