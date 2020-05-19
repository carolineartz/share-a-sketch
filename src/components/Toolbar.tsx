import * as React from "react"
import { Box, Sidebar, Avatar, Button, Clock, Nav } from "grommet"
import { Projects, Help, Ad } from "grommet-icons"

type ToolbarProps = {
  children: React.ReactChild
}

export const Toolbar = ({ children }: ToolbarProps) => {
  return (
    <Sidebar
      // background="#4256b8"
      // border={{
      //   color: "control",
      //   size: "medium",
      //   style: "dashed",
      //   side: "all",
      // }}
      elevation="small"
      round="xsmall"
      header={<Ad />}
      footer={<Button icon={<Help />} hoverIndicator />}
    >
      <Nav gap="small">{children}</Nav>
    </Sidebar>
  )
}

{
  /* <Button icon={<Projects />} hoverIndicator />
<Button icon={<Clock />} hoverIndicator /> */
}
