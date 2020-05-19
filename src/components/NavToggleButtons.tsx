import * as React from "react"
import { Box, Sidebar, Avatar, Button, Clock, Nav, ButtonProps, BoxProps } from "grommet"
import { Projects, Help, Ad } from "grommet-icons"
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

export const NavToggleButtons = ({ left, right, active, ...restProps }: NavToggleButtonProps) => {
  return (
    <Box direction="row" {...restProps}>
      <ButtonToggle
        icon={left.icon}
        active={active === "left"}
        side="left"
        label={left.label}
        onClick={left.onClick}
      />
      <ButtonToggle
        icon={right.icon}
        active={active === "right"}
        side="right"
        label={right.label}
        onClick={right.onClick}
      />
    </Box>
  )
}

type ButtonToggleProps = ButtonProps & {
  side: ButtonToggleSide
}

const ButtonToggle = styled(Button)<ButtonToggleProps>`
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
