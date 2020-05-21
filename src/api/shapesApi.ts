import * as React from "react"
import firebase from "./../Firebase"
import times from "lodash.times"
import range from "lodash.range"
import zipObject from "lodash.zipobject"
import constant from "lodash.constant"

const shapesRef = firebase.database().ref("shapes_new")

export type Shape = {
  rotationIndex: number
  color: string
}

export type ShapeData = Record<string, Shape>

const DEFAULT_COLOR = "#4291b8"
const DEFAULT_ROTATION_INDEX = 0

const DEFAULT_SHAPE: Shape = {
  color: DEFAULT_COLOR,
  rotationIndex: DEFAULT_ROTATION_INDEX,
}

export const createShapes = (): Promise<ShapeData> => {
  return Promise.all(
    range(200).map(() => {
      return shapesRef.push(DEFAULT_SHAPE).key
    })
  ).then(foo => {
    return zipObject(foo as string[], times(200, constant(DEFAULT_SHAPE))) as ShapeData
  })
}

export const loadShapes = (onLoadShapes: React.Dispatch<React.SetStateAction<ShapeData>>): Promise<void> => {
  return shapesRef
    .orderByKey()
    .limitToFirst(200)
    .once("value")
    .then(async (snapshot: any) => {
      let shapes = await snapshot.val()
      if (shapes) {
        onLoadShapes(shapes)
      } else {
        shapes = await createShapes()
        onLoadShapes(shapes)
      }

    })
    .catch((err: any) => {
      // const foo = createShapes()
      console.error("error fetching shapes")
    })
}

export const connect = (onChange: React.Dispatch<React.SetStateAction<ShapeData>>): void => {
  shapesRef.on("child_changed", (snapshot: any) => {
    onChange((shapes: ShapeData) => ({
      ...shapes,
      ...{ [snapshot.key]: { rotationIndex: snapshot.val().rotationIndex, color: snapshot.val().color } },
    }))
  })
}

export const disconnect = () => shapesRef.off()

export const updateShape = ({ id, shape }: { id: string; shape: Shape }) => {
  const shapeRef = firebase.database().ref(`/shapes_new/${id}`)
  shapeRef.set(shape)
}
