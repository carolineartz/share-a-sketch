import React from "react"

import { Grommet, grommet, Box, Button } from "grommet"
import times from "lodash.times"
import { ColorDesign } from "./views/ColorDesign"
import firebase from "./Firebase"

type View = "press" | "draw"

const App = () => {
  const [view, setView]: [View, React.Dispatch<React.SetStateAction<View>>] = React.useState(
    "press" as View
  )

  return (
    <Grommet full theme={grommet}>
      <ColorDesign />
    </Grommet>
  )
}

export default App
