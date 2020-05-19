import React from "react"

import { Box, Keyboard } from "grommet"
import styled from "styled-components"
import { ColorCycleButton } from "./../components/ColorCycleButton"
import firebase from "./../Firebase"

type ButtonColor = {
  id: string
  value: any
}

export const ColorDesign = () => {
  const [currentMode, setMode]: [
    ColorMode,
    React.Dispatch<React.SetStateAction<ColorMode>>
  ] = React.useState("hue" as ColorMode)

  const [colors, setColors]: [
    ButtonColor[],
    React.Dispatch<React.SetStateAction<ButtonColor[]>>
  ] = React.useState([] as ButtonColor[])

  const handleKeyPress = (event: any) => {
    switch (event.key) {
      case "h":
        setMode("hue")
        break
      case "s":
        setMode("saturation")
        break
      case "l":
        setMode("lightness")
        break
    }
  }

  const handleEscape = () => setMode("hue")

  React.useEffect(() => {
    firebase
      .database()
      .ref("colors")
      .orderByKey()
      .limitToFirst(100)
      .once("value")
      .then((snapshot: any) => {
        const colors = Object.entries(snapshot.val()).map(
          ([colorId, colorVal]: [string, unknown]) => {
            return { id: colorId, value: colorVal }
          }
        )
        setColors(colors)
      })
  }, [])

  return (
    <Keyboard target="document" onEsc={handleEscape} onKeyDown={handleKeyPress}>
      <Container>
        {colors.map(({ id, value }: ButtonColor) => (
          <ColorCycleButton key={id} id={id} mode={currentMode} initialColor={value} />
        ))}
      </Container>
    </Keyboard>
  )
}

const Container = styled(Box)`
  display: grid;
  grid-gap: 0.25em;
  grid-template-columns: repeat(10, 3em);
  grid-auto-rows: 3em;
`
