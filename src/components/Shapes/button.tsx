import { Box, BoxProps } from "grommet"
import styled from "styled-components"

type ShapeButtonProps = BoxProps & {
  color: string
  rotation: number
}

export const ShapeButton = styled(Box)<ShapeButtonProps>`
  background: #0a0b27;
  max-width: none;
  height: 100%;
  width: 100%;
  display: flex;
  max-width: none !important;
  max-height: none !important;
  overflow: hidden;

  &:active,
  &:focus {
    box-shadow: none;
  }
  &:hover {
    border: 3px solid white;

  }

  div {
    transform: ${props => `scale(1.1) rotate(${props.rotation}deg)`};
    background: ${props => props.color};
    clip-path: polygon(0 0, 100% 0, 100% 100%);
    height: 100%;
    width: 100%;
    max-width: none !important;
    max-height: none !important;
    cursor: pointer;
    &:active,
    &:focus {
      outline: none;
    }
  }
`
