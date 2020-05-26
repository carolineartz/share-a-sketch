import React from "react"

import "styled-components/macro"

import { Grommet, Box, ResponsiveContext } from "grommet"
import { Cube, Brush } from "grommet-icons"
import { ShapesTools } from "./views/shapes/ShapesTools"
import { DrawTools } from "./views/draw/DrawTools"
import * as ShapeSettingsContext from "./views/shapes/ShapeSettingsContext"
import { ShapesView } from "./views/shapes/ShapesView"
import { DrawView } from "./views/draw/DrawView"
import { ConnectionStatus } from "./views/ConnectionStatus"
import * as DrawSettingsContext from "./views/draw/DrawSettingsContext"
import { EndButton } from "./components/ButtonGroup"

import { customTheme } from "./theme"

type DesignView = "shapes" | "draw"

const App = (): JSX.Element => {
  const [view, setView] = React.useState<DesignView>("draw")

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

const NavButtons = ({ view, setView }: NavButtonProps): JSX.Element => {
  const screenWidth = React.useContext(ResponsiveContext)
  console.log(screenWidth)

  return (
    <Box
      justify="center"
      align="center"
      round={screenWidth === "small" ? "large" : "medium"}
      direction="row"
      background="white"
      elevation="large"
      margin={{ top: "medium" }}
      css={`
        position: absolute;
        display: inline-flex;
        left: 50%;
        transform: translateX(-50%);
      `}
    >
      <EndButton
        color={view === "shapes" ? "white" : "brand"}
        side="left"
        size={screenWidth === "small" ? "medium" : "large"}
        active={view === "shapes"}
        icon={<Cube color={view === "shapes" ? "white" : "text"} />}
        hoverIndicator
        label="Shapes"
        onClick={() => setView("shapes")}
        css={`
          width: 8em;
          &:focus {
            box-shadow: none;
          }
        `}
      />
      <EndButton
        color={view === "draw" ? "white" : "brand"}
        side="right"
        size={screenWidth === "small" ? "medium" : "large"}
        active={view === "draw"}
        icon={<Brush color={view === "draw" ? "white" : "text"} />}
        hoverIndicator
        label="Draw"
        onClick={() => setView("draw")}
        css={`
          width: 8em;
          &:focus {
            box-shadow: none;
          }
        `}
      />
    </Box>
  )
}
