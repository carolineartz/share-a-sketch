/* eslint-disable @typescript-eslint/no-empty-function */
import * as React from "react"

import { Button, DropButton, Box } from "grommet"

type ToolMenuButtonProps = {
  title?: string
  icon?: any
  isActive: boolean
  onClick?: (evt: React.MouseEvent) => void
}

export const ToolMenuButton = ({ title, icon: Icon, isActive, onClick }: ToolMenuButtonProps): JSX.Element => (
  <Button
    title={title}
    icon={<Icon color={isActive ? "white" : "text"} />}
    hoverIndicator
    active={isActive}
    onClick={onClick}
  />
)

export const ToolMenuDropButton = ({
  button,
  content,
  active,
}: {
  button: JSX.Element
  active?: boolean
  content: JSX.Element
}): JSX.Element => (
  <DropButton
    alignSelf="center"
    // margin={{ vertical: "small" }
    // pad="small"
    dropContent={content}
    dropProps={{ align: { top: "top", left: "left" } }}
  >
    <Box pad="small" background={active ? "active" : "white"}>
      {button}
    </Box>
  </DropButton>
)
