/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react"

import "styled-components/macro"
import { Box } from "grommet"
import * as ShapeSettingsContext from "./ShapeSettingsContext"
import * as ShapesApi from "./shapesApi"
import { ShapeButton } from "./ShapeButton"
import { Main } from "../../components/Main"

const SHAPE_COLORS: string[] = ["#42b8a4", "#4291b8", "#4256b8", "#6942b8", "#a442b8"]

export const ShapesView = (): JSX.Element => {
  const { mode } = ShapeSettingsContext.useShapeSettings()
  const [shapes, setShapes] = React.useState<ShapesApi.ShapeData>({} as ShapesApi.ShapeData)

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
    <Main
      css={`
        display: grid;
        grid-template-columns: repeat(12, minmax(6.25vh, 8.33333vw));
        grid-auto-rows: minmax(8.33333vw, 6.25vh);
      `}
    >
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
    </Main>
  )
}
