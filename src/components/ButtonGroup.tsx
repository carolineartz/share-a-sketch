import { Button, ButtonProps } from "grommet"
import styled, { css } from "styled-components/macro"

type EndButtonProps = ButtonProps & {
  side: "left" | "right"
}

export const EndButton = styled(Button)<EndButtonProps>`
  ${props =>
    props.side === "left" &&
    css`
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    `}
  ${props =>
    props.side === "right" &&
    css`
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    `}
`
