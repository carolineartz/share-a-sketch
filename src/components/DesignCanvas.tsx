import * as React from "react"
import { ResponsiveContext, Box} from "grommet"

type DesignCanvasProps = {
  children: React.ReactChild
}

export const DesignCanvas = ({ children }: DesignCanvasProps) => {
  // const size = React.useContext(ResponsiveContext)
  return (
    <Box width="calc(100vw - 80px)" height="calc(100vw - 80px)">
      {children}
    </Box>
  )
}
