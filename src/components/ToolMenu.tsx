import * as React from "react"

import { Box, Nav, BoxProps } from "grommet"
import { FormPrevious, FormNext } from "grommet-icons"
import styled from "styled-components"

export const ToolMenu = ({ children }: { children: React.ReactChild }): JSX.Element => {
  const [visible, setVisible]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = React.useState(
    true as boolean
  )

  return (
    <StyledToolMenu visible={visible} round={{ size: "xsmall", corner: "right" }} elevation="large">
      <Box direction="row" height={{ min: "small" }} align="center">
        <Nav width="xsmall" height={{ min: "small" }}>
          {children}
        </Nav>
        <Box
          height={{ min: "small" }}
          fill
          alignContent="center"
          justify="center"
          align="center"
          hoverIndicator
          onClick={() => setVisible(!visible)}
        >
          {visible ? <FormPrevious color="text" /> : <FormNext color="text" />}
        </Box>
      </Box>
    </StyledToolMenu>
  )
}

type StyledToolMenuProps = BoxProps & {
  visible: boolean
}

const StyledToolMenu = styled(Box)<StyledToolMenuProps>`
  background: white;
  transition: all 0.5s ease;
  top: 30%;
  left: ${props => (props.visible ? "0" : "-" + props.theme.global.size.xsmall)};
  div {
    div {
      &:active,
      &:focus {
        box-shadow: none;
      }
    }
  }
`
