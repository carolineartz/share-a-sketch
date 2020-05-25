import * as React from "react"

import { Box, Nav, BoxProps, Button } from "grommet"
import { FormPrevious, FormNext } from "grommet-icons"
import styled from "styled-components"

export const ToolMenu = ({ children }: { children: React.ReactChild }): JSX.Element => {
  const [visible, setVisible] = React.useState<boolean>(true)

  return (
    <StyledToolMenu visible={visible}>
      <Box background="white" direction="row" round={{ size: "xsmall", corner: "right" }} elevation="large">
        <Nav width="xsmall">{children}</Nav>
        <Button
          hoverIndicator
          icon={visible ? <FormPrevious color="text" /> : <FormNext color="text" />}
          onClick={() => setVisible(!visible)}
        />
      </Box>
    </StyledToolMenu>
  )
}

type StyledToolMenuProps = BoxProps & {
  visible: boolean
}

const StyledToolMenu = styled(Box)<StyledToolMenuProps>`
  transition: all 0.5s ease;
  display: inline-block;
  position: relative;
  top: 10vh;
  z-index: 1;
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
