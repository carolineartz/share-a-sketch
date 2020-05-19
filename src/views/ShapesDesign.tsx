import React from "react"

import { Box, Keyboard, Sidebar, Nav, Button } from "grommet"
import styled from "styled-components"
import { ColorCycleButton } from "../components/ShapeCycleButton"
import firebase from "../Firebase"
import times from "lodash.times"

type ButtonData = {
  id: string
  value: any
}

export const ShapesDesign = () => {
  const [currentMode, setMode]: [
    ShapeMode,
    React.Dispatch<React.SetStateAction<ShapeMode>>
  ] = React.useState("color" as ShapeMode)

  const [shapes, setShapes]: [
    ButtonData[],
    React.Dispatch<React.SetStateAction<ButtonData[]>>
  ] = React.useState([] as ButtonData[])

  const handleKeyPress = (event: any) => {
    switch (event.key) {
      case "s":
        setMode("shape")
        break
      case "c":
        setMode("color")
        break
    }
  }

  const handleEscape = () => setMode("shape")

  React.useEffect(() => {
    firebase
      .database()
      .ref("shapes")
      .orderByKey()
      .limitToFirst(64)
      .once("value")
      .then((snapshot: any) => {
        const shapes = Object.entries(snapshot.val()).map(
          ([shapeId, shapeVal]: [string, unknown]) => {
            return { id: shapeId, value: shapeVal }
          }
        )
        setShapes(shapes)
      })
  }, [])

  return (
    <Keyboard target="document" onEsc={handleEscape} onKeyDown={handleKeyPress}>
      <Container>
        {shapes.map(({ id, value }: ButtonData) => (
          <ColorCycleButton key={id} id={id} mode={currentMode} initialData={value} />
        ))}
      </Container>
    </Keyboard>
  )
}

const Container = styled(Box)`
  /* background: #0a0b27; */
  display: grid;
  grid-template-columns: repeat(8, 4.5em);
  grid-auto-rows: 4.5em;
`
