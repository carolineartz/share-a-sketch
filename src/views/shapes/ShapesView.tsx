/* eslint-disable import/no-unresolved, indent */
import * as React from "react"

import "styled-components/macro"
import { Box, Keyboard } from "grommet"
import * as ShapesApi from "@shapes/shapesApi"
import { ShapeButton } from "@shapes/ShapeButton"
import { Main } from "@components/Main"
import * as ShapeSettingsContext from "@shapes/ShapeSettingsContext"

const SHAPE_COLORS: string[] = ["#42b8a4", "#4291b8", "#4256b8", "#6942b8", "#a442b8"]

export const ShapesView = (): JSX.Element => {
  const { mode, setMode } = ShapeSettingsContext.useShapeSettings()
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

  const handleKeyDown = (evt: React.KeyboardEvent): void => {
    switch (evt.key) {
      case "c":
        setMode("color")
        break
      case "r":
        setMode("rotate")
    }
  }

  return (
    <Keyboard target="document" onKeyDown={handleKeyDown}>
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
    </Keyboard>
  )
}
