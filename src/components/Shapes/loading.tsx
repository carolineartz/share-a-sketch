import * as React from "react"
import styled, {keyframes} from "styled-components"

import {Box} from "grommet"

export const Loading = () =>
  <LoadingShapeContainer>
    <LoadingShapeSquare color="#4256b8" clip="0 0, 100% 0, 0 100%" delay={1} />
    <LoadingShapeSquare color="#a442b8" clip="0 0, 100% 0, 100% 100%" delay={2} />
    <LoadingShapeSquare color="#a442b8" clip="0 0, 100% 0, 100% 100%" delay={1} />
    <LoadingShapeSquare color="#4291b8" clip="0 0, 100% 100%, 0 100%" delay={3} />
    <LoadingShapeSquare color="#6942b8" clip="100% 0, 100% 100%, 0 100%" delay={4} />
    <LoadingShapeSquare color="#6942b8" clip="100% 0, 100% 100%, 0 100%" delay={3} />
    <LoadingShapeSquare color="#4256b8" clip="0 0, 100% 0, 0 100%" delay={1} />
    <LoadingShapeSquare color="#4291b8" clip="0 0, 100% 100%, 0 100%" delay={3} />
    <LoadingShapeSquare color="#42B8A4" clip="100% 0, 100% 100%, 0 100%" delay={2} />
  </LoadingShapeContainer>



type LoadingShapeProps = {
  color: string
  clip: string
  delay: number
}

const rotate = keyframes`
  to {
     transform: rotate(360deg);
  }
`;

const LoadingShapeContainer = styled(Box)`
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(3, 100px);
  animation: ${rotate} 8s steps(8, end) infinite;
`

const LoadingShapeSquare = ({color, clip, delay}: LoadingShapeProps) => {
   return <Box background="#0a0b27" height="100px" width="100px">
     <LoadingShape color={color} clip={clip} delay={delay} />
   </Box>
}

const LoadingShape = styled(Box)<LoadingShapeProps>`
  height: 100px;
  width: 100px;
  background: ${props => props.color};
  clip-path: ${props => "polygon( " + props.clip + ")"};
  animation: ${rotate} 4s steps(4, end) infinite;
  animation-delay: ${props => `${props.delay}s`};
`
