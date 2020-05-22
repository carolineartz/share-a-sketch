/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react"
import styled from "styled-components"
import { Box } from "grommet"
import * as DesignModeContext from "../DesignModeContext"
import * as ShapesApi from "./shapesApi"
import { ShapeButton } from "./ShapeButton"

const SHAPE_COLORS: string[] = ["#42b8a4", "#4291b8", "#4256b8", "#6942b8", "#a442b8"]

export const ShapesView = (): JSX.Element => {
  const { mode } = DesignModeContext.useDesignMode()
  const [shapes, setShapes]: [
    ShapesApi.ShapeData,
    React.Dispatch<React.SetStateAction<ShapesApi.ShapeData>>
  ] = React.useState({} as ShapesApi.ShapeData)

  React.useEffect(() => {
    if (!Object.values(shapes).length) {
      ShapesApi.loadShapes(setShapes)
      ShapesApi.connect(setShapes)
    }

    return () => {
      ShapesApi.disconnect()
    }
  }, [])

  return (
    <Shapes fill>
      {Object.entries(shapes).map(([id, { rotationIndex, color }]) => (
        <ShapeButton
          key={id}
          color={color}
          rotation={(rotationIndex % 4) * 90}
          onClick={() =>
            ShapesApi.updateShape({
              id: id,
              shape: {
                rotationIndex: mode === "rotate" ? rotationIndex + 1 : rotationIndex,
                color: mode === "color" ? SHAPE_COLORS[SHAPE_COLORS.indexOf(color) + 1] || SHAPE_COLORS[0] : color,
              },
            })
          }
        >
          <Box />
        </ShapeButton>
      ))}
    </Shapes>
  )
}

const Shapes = styled(Box)`
  display: grid;
  grid-template-columns: repeat(12, minmax(6.25vh, 8.33333vw));
  grid-auto-rows: minmax(8.33333vw, 6.25vh);
`
