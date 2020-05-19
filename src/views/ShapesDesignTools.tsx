import * as React from "react"
import { Box, Button } from "grommet"
import { Projects, ClearOption } from "grommet-icons"

export const ShapesDesignTools = () => {
  return (
    <>
      <Button key="color-design-tools-projects" icon={<Projects />} hoverIndicator />
      <Button key="color-design-tools-clock" icon={<ClearOption />} hoverIndicator />
    </>
  )
}
