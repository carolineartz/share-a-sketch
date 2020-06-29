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
  const screenWidth = React.useContext(ResponsiveContext)
  const isShortMobile = useMediaQuery({ query: '(max-device-height: 450px)' })
  const isShortDesktop = useMediaQuery({ query: '(max-height: 450px)' })
  const isShort = isShortMobile || isShortDesktop
  const isMediumHeightDesktop = useMediaQuery({ minHeight: 451, maxHeight: 640 })
  const isMediumHeightMobile = useMediaQuery({ minDeviceHeight: 451, maxDeviceHeight: 640 })
  const isMediumHeight = isMediumHeightDesktop || isMediumHeightMobile
  const isNarrow = screenWidth === "small"
  const { toolMenuDisplay, setToolMenuDisplay } = ToolMenuContext.useToolMenuDisplay()!

  return (
    <StyledToolMenu id="tool-menu" visible={toolMenuDisplay !== "minimize"} medium={isMediumHeight} short={isShort} narrow={isNarrow}>
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
            padding-left: ${isNarrow || isShort ? "2px" : size === "medium" ? "6px" : "3px"};
            padding-right: ${isNarrow || isShort ? "2px" : size === "medium" ? "6px" : "3px"};
            background-clip: border-box;
          `}
          icon={toolMenuDisplay !== "minimize" ? <FormPrevious color="text" /> : <FormNext color="text" />}
          onClick={() => setToolMenuDisplay(toolMenuDisplay === "maximize" ? "minimize" : "maximize")}
        />
      </Box>
    </StyledToolMenu>
  )
}

type StyledToolMenuProps = BoxProps & {
  visible: boolean
  narrow: boolean
  short: boolean
  medium:boolean
}

const StyledToolMenu = styled(Box)<StyledToolMenuProps>`
  transition: all 0.5s ease;
  display: inline-block;
  position: relative;
  top: ${props => (props.short ? '0' : '10vh')};
  z-index: 1;
  left: ${props => (props.visible ? 0 : props.short && props.narrow ? "-38px" : props.narrow || props.short || props.medium ? "-49px" : "-73px")};

  div {
    div {
      &:active,
      &:focus {
        box-shadow: none;
      }
    }
  }
`
