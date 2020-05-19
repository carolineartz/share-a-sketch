import * as React from "react"
import { Box, Button } from "grommet"
import { Projects, ClearOption } from "grommet-icons"

export const ColorDesignTools = () => {
  return (
    <>
      <Button key="color-design-tools-projects" icon={<Projects />} hoverIndicator />
      <Button key="color-design-tools-clock" icon={<ClearOption />} hoverIndicator />
    </>
  )
}
