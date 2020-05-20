/* eslint-disable no-case-declarations */
import * as React from "react"

import { Box } from "grommet"
import styled from "styled-components"
import { hslToColorString } from "polished"
import firebase from "../Firebase"

const DEFAULT_SATURATION = 0.47
const DEFAULT_LIGHTNESS = 0.49

type ShapeCycleButtonProps = {
  id: string
  mode: ShapeMode
  initialData: ShapeData
}

type ShapeData = {
  hue?: number
  saturation?: number
  lightness?: number
  clip?: string
}

const SHAPE_CLIPS: string[] = [
  "0 0, 100% 0, 100% 100%",
  "0 0, 100% 0, 0 100%",
  "0 0, 100% 100%, 0 100%",
  "100% 0, 100% 100%, 0 100%",
]
const SHAPE_COLORS: number[] = [170, 200, 230, 260, 290, 320]

export const ShapeCycleButton = ({ id, mode, initialData }: ShapeCycleButtonProps) => {
  const [color, setColor] = React.useState({
    hue: initialData.hue || SHAPE_COLORS[0],
    saturation: DEFAULT_SATURATION,
    lightness: DEFAULT_LIGHTNESS,
  })
  const [shape, setShape] = React.useState(initialData.clip || SHAPE_CLIPS[0])

  React.useEffect(() => {
    const shapeRef = firebase.database().ref("shapes/" + id)

    shapeRef.on("value", (snapshot: any) => {
      setColor({
        hue: snapshot.val().hue || SHAPE_COLORS[0],
        saturation: DEFAULT_SATURATION,
        lightness: DEFAULT_LIGHTNESS,
      })

      setShape(snapshot.val().clip || SHAPE_CLIPS[0])

      return () => {
        shapeRef.off()
      }
    })
  }, [id])

  React.useEffect(() => {
    const shapeRef = firebase.database().ref("shapes/" + id)

    shapeRef.set({
      hue: color.hue,
      saturation: color.saturation,
      lightness: color.lightness,
      clip: shape,
    })

    return () => {
      shapeRef.off()
    }
  }, [color, shape, id])

  return (
    <ButtonContainer
      onClick={() => {
        switch (mode) {
          case "color":
            const lastHueIndex: number = SHAPE_COLORS.indexOf(color.hue)
            const nextHue = lastHueIndex >= 0 && SHAPE_COLORS[lastHueIndex + 1]
            setColor({
              hue: nextHue || SHAPE_COLORS[0],
              saturation: DEFAULT_SATURATION,
              lightness: DEFAULT_LIGHTNESS,
            })
            break
          case "shape":
            const lastShapeIndex: number = SHAPE_CLIPS.indexOf(shape)
            const nextShape = lastShapeIndex >= 0 && SHAPE_CLIPS[lastShapeIndex + 1]

            setShape(nextShape || SHAPE_CLIPS[0])
        }
      }}
      css={`
        margin: -1px;
      `}
    >
      <ColorButton
        id={id}
        height="100%"
        width="100%"
        hue={color.hue}
        saturation={color.saturation}
        lightness={color.lightness}
        clip={shape}
      />
    </ButtonContainer>
  )
}

type ColorButtonProps = {
  hue: number
  saturation: number
  lightness: number
  clip: string
}

const ColorButton = styled(Box)<ColorButtonProps>`
  background: ${({ hue, saturation, lightness }) =>
    hslToColorString({ hue, saturation, lightness })};
  clip-path: ${({ clip }) => `polygon(${clip})`};
  cursor: pointer;
  &:active,
  &:focus {
    outline: none;
  }
`

const ButtonContainer = styled(Box)`
  background: #0a0b27;
  &:active,
  &:focus {
    box-shadow: none;
  }

  &:hover {
    border: 3px solid white;
  }
`
