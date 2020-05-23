/* eslint-disable @typescript-eslint/no-empty-function */
import * as React from "react"

import { Button, DropButton } from "grommet"

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

export const ToolMenuDropButton = ({ button, content }: { button: JSX.Element; content: JSX.Element }): JSX.Element => (
  <DropButton
    alignSelf="center"
    margin={{ vertical: "small" }}
    dropContent={content}
    dropProps={{ align: { top: "top", left: "left" } }}
  >
    {button}
  </DropButton>
)
