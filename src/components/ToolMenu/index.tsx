import * as React from "react"
import { useMediaQuery } from 'react-responsive'

import "styled-components/macro"
import styled from "styled-components"

import { Box, BoxProps, Button, ResponsiveContext } from "grommet"
import { FormPrevious, FormNext } from "grommet-icons"
import * as ToolMenuContext from "./context"
import * as DropSubmenu from "@components/ToolMenu/dropSubmenu"

export { ToolMenuItem } from "./toolMenuItem"
export { DropSubmenu }
export { ToolMenuContext }


type ToolMenuProps = {
  children: React.ReactNode
  size: "small" | "medium"
}

export const ToolMenu = ({ children, size }: ToolMenuProps): JSX.Element => {
  const [visible, setVisible] = React.useState<boolean>(true)

  const screenWidth = React.useContext(ResponsiveContext)
  const isShort = useMediaQuery({ query: '(max-device-height: 450px)' })
  const isNarrow = screenWidth === "small"

  return (
    <StyledToolMenu id="tool-menu" visible={visible} short={isShort} narrow={isNarrow}>
      <Box
        background="white"
        direction="row"
        border="all"
        round={{ size: "xsmall", corner: "right" }}
        elevation="large"
      >
        <Box as="nav">{ children }</Box>
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
  narrow: boolean
  short: boolean
}

const StyledToolMenu = styled(Box)<StyledToolMenuProps>`
  transition: all 0.5s ease;
  display: inline-block;
  position: relative;
  top: ${props => (props.short ? '0' : '10vh')};
  z-index: 1;
  left: ${props => (props.visible ? 0 : props.narrow || props.short ? "-54px" : "-78px")};

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
