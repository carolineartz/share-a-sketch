import * as React from "react"
import "styled-components/macro"

import { Box, Nav, BoxProps, Button } from "grommet"
import { FormPrevious, FormNext } from "grommet-icons"
import styled from "styled-components"

type ToolMenuProps = {
  children: React.ReactChild
  size: "small" | "medium"
}

export const ToolMenu = ({ children, size }: ToolMenuProps): JSX.Element => {
  const [visible, setVisible] = React.useState<boolean>(true)

  return (
    <StyledToolMenu visible={visible} size={size}>
      <Box
        background="white"
        direction="row"
        border="all"
        round={{ size: "xsmall", corner: "right" }}
        elevation="large"
      >
        <Nav>{children}</Nav>
        <Button
          hoverIndicator
          css={`
            padding-left: 6px;
            padding-right: ${size === "medium" ? "6px" : "3px"};
          `}
          icon={visible ? <FormPrevious color="text" /> : <FormNext color="text" />}
          onClick={() => setVisible(!visible)}
        />
      </Box>
    </StyledToolMenu>
  )
}

type StyledToolMenuProps = BoxProps & {
  visible: boolean
  size: ToolMenuProps["size"]
}

const StyledToolMenu = styled(Box)<StyledToolMenuProps>`
  transition: all 0.5s ease;
  display: inline-block;
  position: relative;
  top: 10vh;
  z-index: 1;
  left: ${props => (props.visible ? 0 : props.size === "small" ? "-54px" : "-78px")};

  div {
    border: 6px solid white;
    div {
      &:active,
      &:focus {
        box-shadow: none;
      }
    }
  }
`