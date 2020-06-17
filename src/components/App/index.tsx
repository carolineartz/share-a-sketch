import React from "react"

import "styled-components/macro"
import { createGlobalStyle }  from "styled-components"
import { Grommet } from "grommet"

import ConnectionStatus from "./connectionStatus"
import { customTheme } from "./theme"
import { Nav } from "./nav"
import { CursorStyle } from './cursors';
import { DesignView } from "~/react-app-env"

import ShapeView, { ShapeSettingsContext } from "@components/Shapes"
import DrawView, { DrawSettingsContext } from "@components/Draw"

const App = (): JSX.Element => {
  const [view, setView] = React.useState<DesignView>("shapes")
  const GlobalStyle = style(view)

  return (
    <Grommet full theme={customTheme}>
      <CursorStyle />
      <GlobalStyle />
      <ShapeSettingsContext.Provider>
        <DrawSettingsContext.Provider>
          {view === "draw" && <DrawView /> }
          {view === "shapes" && <ShapeView />}
          <Nav view={view} setView={setView} />
          <ConnectionStatus />
        </DrawSettingsContext.Provider>
      </ShapeSettingsContext.Provider>
    </Grommet>
  )
}

export default App

const style = (view: "shapes" | "draw") => createGlobalStyle`
  html {
    overflow: hidden;
    background: ${view === 'shapes' ? '#0a0b27' : 'white'};
  }

  body {
    position: absolute;
    overflow: hidden;
  }
`
