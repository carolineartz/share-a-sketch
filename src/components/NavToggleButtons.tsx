import * as React from "react"
import { Box, Button, ButtonProps, BoxProps } from "grommet"
import styled, { css } from "styled-components"

type NavToggleButtonProps = BoxProps & {
  active: ButtonToggleSide
  left: ButtonProps & {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  }
  right: ButtonProps & {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  }
}

export const NavToggleButtons = ({ left, right, active, ...restProps }: NavToggleButtonProps): JSX.Element => (
  <Box direction="row" round="large" elevation="large" {...restProps} style={{ alignSelf: "center" }} margin="medium">
    <ButtonToggle
      color="white"
      size="large"
      icon={left.icon}
      active={active === "left"}
      side="left"
      label={left.label}
      onClick={left.onClick}
    />
    <ButtonToggle
      icon={right.icon}
      size="large"
      color="white"
      active={active === "right"}
      side="right"
      label={right.label}
      onClick={right.onClick}
    />
  </Box>
)

type ButtonToggleProps = ButtonProps & {
  side: ButtonToggleSide
}

const ButtonToggle = styled(Button)<ButtonToggleProps>`
  ${props =>
    props.active
      ? css`
          background-color: #eaaf2a;
        `
      : css`
          background-color: white;
        `}
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
