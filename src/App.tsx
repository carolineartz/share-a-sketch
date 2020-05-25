import React from "react"

import "styled-components/macro"

import { Grommet, Box } from "grommet"
import { Cube, Brush } from "grommet-icons"
import { ShapesTools } from "./views/shapes/ShapesTools"
import { DrawTools } from "./views/draw/DrawTools"
import * as ShapeSettingsContext from "./views/shapes/ShapeSettingsContext"
import { ShapesView } from "./views/shapes/ShapesView"
import { DrawView } from "./views/draw/DrawView"
import { ConnectionStatus } from "./components/ConnectionStatus"
import * as DrawSettingsContext from "./views/draw/DrawSettingsContext"
import { EndButton } from "./components/ButtonGroup"

import { customTheme } from "./theme"

type DesignView = "shapes" | "draw"

const App = (): JSX.Element => {
  const [view, setView] = React.useState<DesignView>("shapes")

  return (
    <Grommet full theme={customTheme}>
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
        <NavButtons view={view} setView={setView} />
        <ConnectionStatus />
      </ShapeSettingsContext.Provider>
    </Grommet>
  )
}

export default App

type NavButtonProps = {
  view: DesignView
  setView: (view: DesignView) => void
}

const NavButtons = ({ view, setView }: NavButtonProps): JSX.Element => (
  <Box
    justify="center"
    align="center"
    round="medium"
    direction="row"
    background="white"
    elevation="large"
    css={`
      position: absolute;
      display: inline-flex;
      top: 1.5em;
      margin-left: calc(50vw - 153px);
      transform: translateX(-50%);
    `}
  >
    <EndButton
      color={view === "shapes" ? "white" : "brand"}
      side="left"
      active={view === "shapes"}
      icon={<Cube color={view === "shapes" ? "white" : "text"} />}
      hoverIndicator
      label="Shapes"
      onClick={() => setView("shapes")}
      css={`
        min-width: 8em;
        &:focus {
          box-shadow: none;
        }
      `}
      size="medium"
    />
    <EndButton
      color={view === "draw" ? "white" : "brand"}
      side="right"
      size="medium"
      hoverIndicator
      css={`
        min-width: 8em;
        &:focus {
          box-shadow: none;
        }
      `}
      active={view === "draw"}
      icon={<Brush color={view === "draw" ? "white" : "text"} />}
      label="Draw"
      onClick={() => setView("draw")}
    />
  </Box>
)
