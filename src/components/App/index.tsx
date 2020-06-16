/* eslint-disable import/no-unresolved */
import React from "react"

import "styled-components/macro"
import { createGlobalStyle }  from "styled-components"
import { Grommet, Box, ResponsiveContext } from "grommet"
import { Cube, Brush } from "grommet-icons"
import { EndButton } from "@components/buttonGroups"
import * as ShapeSettingsContext from "@components/Shapes/context"
import ShapeView from "@components/Shapes"
import DrawView, { DrawSettingsContext } from "@components/Draw"
import ConnectionStatus from "./connectionStatus"

import { customTheme, brand } from "../../theme"
import { CursorStyle } from './cursorss';

type DesignView = "shapes" | "draw"

const App = (): JSX.Element => {
  const [view, setView] = React.useState<DesignView>("shapes")

  return (
    <Grommet full theme={customTheme}>
      <CursorStyle />
      <GlobalStyle />
      <ShapeSettingsContext.Provider>
        <DrawSettingsContext.Provider>
        {view === "draw" && <DrawView /> }
        {view === "shapes" && <ShapeView />}
        <NavButtons view={view} setView={setView} />
        <ConnectionStatus />
        </DrawSettingsContext.Provider>
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
        user-select: none;
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
          border-color: ${brand};
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
          border-color: ${brand};
          &:focus {
            box-shadow: none;
          }
        `}
      />
    </Box>
  )
}

const GlobalStyle = createGlobalStyle`
  html {
    overflow: hidden;
  }

  body {
    position: absolute;
    overflow: hidden;
  }
`
