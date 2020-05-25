import { Box } from "grommet"
import styled from "styled-components"

type ShapeButtonProps = {
  color: string
  rotation: number
}

export const ShapeButton = styled(Box)<ShapeButtonProps>`
  background: #0a0b27;
  max-width: none;
  height: 101%;
  width: 101%;
  display: flex;
  max-width: none !important;
  max-height: none !important;
  &:active,
  &:focus {
    box-shadow: none;
  }
  &:hover {
    box-shadow: 3px 3px white inset, -3px -3px white inset;
    div {
      box-shadow: 3px 3px white inset, -3px -3px white inset;
    }
  }

  div {
    transform: ${props => `rotate(${props.rotation}deg)`};
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
