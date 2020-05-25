import React from "react"

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
  <Box justify="center" align="center" direction="row">
    <EndButton
      side="left"
      active={view === "shapes"}
      icon={<Cube color={view === "shapes" ? "white" : "text"} />}
      label="Shapes"
      onClick={() => setView("shapes")}
    />
    <EndButton
      side="right"
      active={view === "draw"}
      icon={<Brush color={view === "draw" ? "white" : "text"} />}
      label="Draw"
      onClick={() => setView("draw")}
    />
  </Box>
)
