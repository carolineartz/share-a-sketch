import React from "react"

import { Box, Keyboard } from "grommet"
import styled from "styled-components"
import { ShapeCycleButton } from "../components/ShapeCycleButton"
import * as DesignModeContext from "./DesignModeContext"
import firebase from "../Firebase"

type ButtonData = Record<
  string,
  {
    id: string
    value: any
  }
>

export const ShapesDesign = () => {
  const { setMode } = DesignModeContext.useDesignMode()
  const [shapes, setShapes]: [ButtonData, React.Dispatch<React.SetStateAction<ButtonData>>] = React.useState(
    {} as ButtonData
  )

  const handleKeyPress = (event: any) => {
    switch (event.key) {
      case "r":
      case "s":
        setMode("rotate")
        break
      case "c":
        setMode("color")
        break
    }
  }

  const handleEscape = () => setMode("rotate")

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

    setMode("rotate")

    return () => {
      shapesRef.off()
    }
  }, [setMode])

  return (
    <Keyboard target="document" onEsc={handleEscape} onKeyDown={handleKeyPress}>
      <Container>
        {Object.values(shapes).map(({ id, value }) => (
          <ShapeCycleButton key={`${id}-${value.hue}-${value.clip}`} id={id} initialData={value} />
        ))}
      </Container>
    </Keyboard>
  )
}

// const

const Container = styled(Box)`
  display: grid;
  height: 100%;
  width: 100%;
  grid-template-columns: repeat(8, auto);
  /* grid-auto-rows: 12.5%; */
`
