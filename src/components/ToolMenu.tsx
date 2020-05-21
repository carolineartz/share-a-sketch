import * as React from "react"

import { Box, Nav, BoxProps } from "grommet"
import { FormUp, FormDown } from "grommet-icons"
import styled from "styled-components"

type MenuState = "visible" | "hidden"

type ToolMenuProps = {
  children: React.ReactChild
}

export const ToolMenu = ({ children }: ToolMenuProps) => {
  const [visible, setVisible]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = React.useState(
    true as boolean
  )

  return (
    <Foo visible={visible} round={{ size: "xsmall", corner: "bottom" }} elevation="small" width={{ min: "small" }}>
      <Box>
        <Nav direction="row">{children}</Nav>
        <Box fill align="center" round={{ size: "xsmall", corner: "bottom" }} onClick={() => setVisible(!visible)}>
          {visible ? <FormUp /> : <FormDown />}
        </Box>
      </Box>
    </Foo>
  )
}

type FooProps = BoxProps & {
  visible: boolean
}

const Foo = styled(Box)<FooProps>`
  background: white;
  transition: all 0.5s ease;
  top: ${(props: any) => (props.visible ? "0" : "-" + props.theme.global.size.xxsmall)};
  div {
    div {
      &:active,
      &:focus {
        box-shadow: none;
      }
    }
  }
`
