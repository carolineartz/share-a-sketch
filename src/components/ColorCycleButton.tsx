/* eslint-disable no-case-declarations */
import * as React from "react"

import { Box } from "grommet"
import styled from "styled-components"
import { hslToColorString } from "polished"
import firebase from "./../Firebase"


// const DEFAULT_HUE = 10
// const DEFAULT_SATURATION = 0.8
// const DEFAULT_LIGHTNESS = 0.6

type ColorCycleButtonProps = {
  id: string
  mode: ColorMode
  initialColor: ColorComponents
}

type ColorComponents = {
  hue: number
  saturation: number
  lightness: number
}

export const ColorCycleButton = ({ id, mode, initialColor }: ColorCycleButtonProps) => {

  const [color, setColor] = React.useState({
    hue: initialColor.hue,
    saturation: parseFloat(initialColor.saturation.toFixed(2)),
    lightness: parseFloat(initialColor.lightness.toFixed(2)),
  })

  const colorRef = firebase.database().ref("colors/" + id)

  React.useEffect(() => {
    colorRef.on("value", (snapshot: any) => {
      setColor(snapshot.val())
    })
  }, [])

  return (
    <ColorButton
      id={id}
      height="100%"
      width="100%"
      round="small"
      elevation="medium"
      bg={color}
      onClick={() => {
        switch (mode) {
          case "hue":
            colorRef.set({
              hue: color.hue === 360 ? 0 : color.hue + 20,
              saturation: color.saturation,
              lightness: color.lightness,
            })

            break
          case "saturation":
            const saturation = parseFloat(color.saturation.toFixed(2))
            colorRef.set({
              hue: color.hue,
              saturation: saturation === 1 ? 0.2 : saturation + 0.2,
              lightness: color.lightness,
            })
            break
          case "lightness":
            const lightness = parseFloat(color.lightness.toFixed(2))
            colorRef.set({
              hue: color.hue,
              saturation: color.saturation,
              lightness: lightness === 1 ? 0.2 : lightness + 0.2,
            })
        }
      }}
    />
  )
}

type ColorButtonProps = {
  bg: ColorComponents
}

const ColorButton = styled(Box)<ColorButtonProps>`
  background: ${props => hslToColorString(props.bg)};
  cursor: pointer;
`
