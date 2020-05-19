import React from "react"

import { Grommet, Box, Button, Sidebar, Avatar, Nav } from "grommet"
import { Help, Projects, Clock } from "grommet-icons"

// import times from "lodash.times"
import { ColorDesign } from "./views/ColorDesign"
// import firebase from "./Firebase"
import customTheme from "./theme"

// const customTheme = deepFreeze({
//   global: {
//     colors: {
//       brand: "#222340",
//       "accent-1": "#0a0b27",
//     },
//   },
// })

type View = "press" | "draw"

const App = () => {
  const [view, setView]: [View, React.Dispatch<React.SetStateAction<View>>] = React.useState(
    "press" as View
  )

  return (
    <Grommet full themeMode="dark" theme={customTheme}>
      <Box pad="medium" justify="between" direction="row">
        <Sidebar
          background="brand"
          elevation="small"
          round="xsmall"
          header={<Avatar src="//s.gravatar.com/avatar/b7fb138d53ba0f573212ccce38a7c43b?s=80" />}
          footer={<Button icon={<Help />} hoverIndicator />}
        >
          <Nav gap="small">
            <Button icon={<Projects />} hoverIndicator />
            <Button icon={<Clock />} hoverIndicator />
          </Nav>
        </Sidebar>
        <Box pad="small" background="white" elevation="small" round="xsmall">
          <ColorDesign />
        </Box>
      </Box>
    </Grommet>
  )
}

export default App
