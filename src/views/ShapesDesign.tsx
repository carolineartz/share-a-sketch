import React from "react"

import { Box, Keyboard } from "grommet"
import styled from "styled-components"
import { ShapeCycleButton } from "../components/ShapeCycleButton"
import firebase from "../Firebase"

type ButtonData = Record<
  string,
  {
    id: string
    value: any
  }
>

export const ShapesDesign = () => {
  const [currentMode, setMode]: [ShapeMode, React.Dispatch<React.SetStateAction<ShapeMode>>] = React.useState(
    "color" as ShapeMode
  )

  const [shapes, setShapes]: [ButtonData, React.Dispatch<React.SetStateAction<ButtonData>>] = React.useState(
    {} as ButtonData
  )

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
    const shapesRef = firebase.database().ref("shapes")
    shapesRef
      .orderByKey()
      .limitToFirst(64)
      .once("value")
      .then((snapshot: any) => {
        const initialShapes: ButtonData = {}

        Object.entries(snapshot.val()).forEach(([shapeId, shapeVal]: [string, unknown]) => {
          initialShapes[shapeId] = { id: shapeId, value: shapeVal }
        })

        setShapes(initialShapes)
      })

    shapesRef.on("child_changed", (snapshot: any) => {
      setShapes(shapes => ({ ...shapes, ...{ [snapshot.key]: { id: snapshot.key, value: snapshot.val() } } }))
    })

    return () => {
      shapesRef.off()
    }
  }, [])

  return (
    <Keyboard target="document" onEsc={handleEscape} onKeyDown={handleKeyPress}>
      <Container>
        {Object.values(shapes).map(({ id, value }) => (
          <ShapeCycleButton key={`${id}-${value.hue}-${value.clip}`} id={id} mode={currentMode} initialData={value} />
        ))}
      </Container>
    </Keyboard>
  )
}

const Container = styled(Box)`
  display: grid;
  grid-template-columns: repeat(8, 4.5em);
  grid-auto-rows: 4.5em;
`
