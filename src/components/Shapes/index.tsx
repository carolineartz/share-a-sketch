import * as React from "react"

import "styled-components/macro"
import { Box, Keyboard } from "grommet"
import { ShapeButton } from "@components/Shapes/button"
import { Main } from "@components/Main"
import * as ShapeSettingsContext from "./context"
import ShapeTools from "./tools"
import { withFirebase, WithFirebaseProps } from '../Firebase';

const SHAPE_COLORS: string[] = ["#42b8a4", "#4291b8", "#4256b8", "#6942b8", "#a442b8"]

type LoadingState = "loading" | "loaded" | "error"

type ShapeData = Record<string, {
  rotationIndex: number
  color: string
}>

const Shapes = ({firebase}: WithFirebaseProps): JSX.Element => {
  const { mode, setMode } = ShapeSettingsContext.useShapeSettings()
  const [shapes, setShapes] = React.useState<ShapeData | undefined>()
  const [loading, setLoading] = React.useState<LoadingState>("loading")

  React.useEffect(() => {
    if (!shapes) {
      firebase.shapes().orderByKey().limitToFirst(192).once("value", async (snapshot: firebase.database.DataSnapshot) => {
        try {
          const loadedShapes = await snapshot.val()
          setShapes(loadedShapes)
          setLoading("loaded")

          firebase.onShapeChanged((snapshot: firebase.database.DataSnapshot) => {
            if (snapshot.key) {
              const s = shapes as any
              setShapes({...s, [snapshot.key]: { rotationIndex: snapshot.val().rotationIndex, color: snapshot.val().color }})
            }
          })

        } catch (e) {
          setLoading("error")
        }
      })
    }

    return () => {
      firebase.shapes().off()
    }
  }, [shapes, firebase])

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
      <ShapeTools />
      <Main
        css={`
          display: grid;
          grid-template-columns: repeat(12, minmax(6.25vh, 8.33333vw));
          grid-auto-rows: minmax(8.33333vw, 6.25vh);
        `}
      >
        {shapes && Object.entries(shapes).map(([id, { rotationIndex, color }]) => (
          <ShapeButton
            key={id}
            color={color}
            rotation={(rotationIndex % 4) * 90}
            onClick={() =>
              firebase.shape(id).set({
                rotationIndex: mode === "rotate" ? rotationIndex + 1 : rotationIndex,
                color: mode === "color" ? SHAPE_COLORS[SHAPE_COLORS.indexOf(color) + 1] || SHAPE_COLORS[0] : color,
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

export default withFirebase(Shapes)
