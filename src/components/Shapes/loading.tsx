import * as React from "react"
import styled, { keyframes } from "styled-components"
import sample from "lodash.sample"
import random from "lodash.random"
import times from "lodash.times"

import { Box, ThemeContext, Layer, BoxProps } from "grommet"
import {activePalette} from "@components/App/theme"

const defaultClip = "0 0, 100% 0, 0 100%"
const clips = [
  defaultClip,
  "0 0, 100% 0, 100% 100%",
  "0 0, 100% 100%, 0 100%",
  "100% 0, 100% 100%, 0 100%",
]

const RandomLoadingSquare = ({colors, transitionOut}: {colors: string[], transitionOut: boolean}) =>
  <LoadingShapeSquare color={sample(colors) || "text"} clip={sample(clips) || defaultClip} delay={random(1, 4)} drop={transitionOut} />

export const Loading = ({show}: {show: boolean}) => {
  const colors = activePalette(React.useContext(ThemeContext)).colors

  const [visible, setVisible] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (!show) {
      setTimeout(setVisible, 500, false)
    } else {
      setVisible(true)
    }
  }, [show])

  return (
    <>
      { visible && <Layer full animation={false}>
        <Box fill background="text" align="center" justify="center">
          <LoadingShapesContainer background="text">
            {times(9, (index: number) => <RandomLoadingSquare transitionOut={!show} colors={colors} key={`loading-square-${index}`} />)}
          </LoadingShapesContainer>
        </Box>
      </Layer>
      }
    </>
  )
}

type LoadingShapeProps = BoxProps & {
  color: string
  clip: string
  delay: number
  drop: boolean
}

const rotate = keyframes`
  to { transform: rotate(360deg); }
`

const dropOut = keyframes`
  to { opacity: 0; }
`

const LoadingShapesContainer = styled(Box)`
  display: grid;
  grid-template-columns: repeat(3, 60px);
  grid-template-rows: repeat(3, 60px);
  animation: ${rotate} 8s steps(8, end) infinite;
`

const LoadingShapeSquare = ({color, clip, delay, drop}: LoadingShapeProps) => (
  <LoadingShapeOuter background="text" height="60px" width="60px" color={color} clip={clip} delay={delay} drop={drop}>
    <LoadingShapeInner color={color} clip={clip} delay={delay} drop={drop} />
  </LoadingShapeOuter>
)

const LoadingShapeOuter = styled(Box)<LoadingShapeProps>`
  animation-duration: 0.75s;
  animation-timing-function: ease-out;
  animation-fill-mode: forwards;

  animation-name: ${dropOut};
  animation-play-state: ${props => props.drop ? 'running' : 'paused'};
`

const LoadingShapeInner = styled(Box)<LoadingShapeProps>`
  height: 60px;
  width: 60px;
  background: ${props => props.color};
  clip-path: ${props => "polygon( " + props.clip + ")"};
  animation: ${rotate} 4s steps(4, end) infinite;
  animation-delay: ${props => `${props.delay}s`};
`
