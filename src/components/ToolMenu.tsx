import * as React from "react"

import { Box, Nav, BoxProps } from "grommet"
import { FormUp, FormDown } from "grommet-icons"
import styled from "styled-components"

export const ToolMenu = ({ children }: { children: React.ReactChild }): JSX.Element => {
  const [visible, setVisible]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = React.useState(
    true as boolean
  )

  return (
    <StyledToolMenu
      visible={visible}
      round={{ size: "xsmall", corner: "bottom" }}
      elevation="small"
      width={{ min: "small" }}
    >
      <Box>
        <Nav direction="row">{children}</Nav>
        <Box fill align="center" round={{ size: "xsmall", corner: "bottom" }} onClick={() => setVisible(!visible)}>
          {visible ? <FormUp /> : <FormDown />}
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
  top: ${props => (props.visible ? "0" : "-" + props.theme.global.size.xxsmall)};
  div {
    div {
      &:active,
      &:focus {
        box-shadow: none;
      }
    }
  }
`
