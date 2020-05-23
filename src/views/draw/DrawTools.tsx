/* eslint-disable indent */
import * as React from "react"
import { Edit, Erase } from "grommet-icons"
import { Box, Text, BoxProps } from "grommet"
import { ToolMenuButton, ToolMenuDropButton } from "../../components/ToolMenuButton"
import { ToolMenu } from "../../components/ToolMenu"
import * as DrawSettingsContext from "./DrawSettingsContext"

const colors: DesignColor[] = ["#42b8a4", "#4291b8", "#4256b8", "#6942b8", "#a442b8"]
const shapes: DrawShape[] = ["circle", "square", "star"]

// const renderItems = ({ color, setColor }) => (
//   <Box direction="row">
//     <Text>hi</Text>
//     <Text>hi</Text>
//     <Text>hi</Text>
//     <Text>hi</Text>
//   </Box>
// )

// const shapeEntityMap: Record<DrawShape, string> = {
//   star: "\2605",
//   circle: "\2688",
//   square:
// }

const Shape = ({
  shapeTool,
  color,
  ...restProps
}: BoxProps & { color: DesignColor; shapeTool: DrawShape }): JSX.Element => {
  switch (shapeTool) {
    case "circle":
      return <Box round width="24px" height="24px" background={color} style={{ cursor: "pointer" }} {...restProps} />
    case "square":
      return <Box width="24px" height="24px" background={color} style={{ cursor: "pointer" }} {...restProps} />
    case "star":
      return (
        <Box width="24px" height="24px" style={{ color: color, fontSize: "24px", cursor: "pointer" }} {...restProps}>
          ★
        </Box>
      )
  }
}

export const DrawTools = (): JSX.Element => {
  const { tool, setTool, color, setColor, shape, setShape } = DrawSettingsContext.useDrawSettings()
  const [selectingColor, setSelectingColor] = React.useState<boolean>(false)
  // const colorIcon = () => <Box round width="24px" height="24px" background={color} />
  return (
    <ToolMenu>
      <>
        <ToolMenuDropButton
          button={<Box round width="24px" height="24px" background={color} />}
          key="draw-design-color"
          content={
            <Box pad="small" direction="row" gap="xsmall">
              {colors.map((bg: DesignColor, i: number) => (
                <Box
                  key={`draw-color-button-${i}`}
                  align="center"
                  pad="small"
                  style={{ cursor: "pointer" }}
                  background={bg === color ? "active" : "white"}
                  onClick={() => setColor(bg)}
                >
                  <Box round width="24px" height="24px" background={bg} />
                </Box>
              ))}
            </Box>
          }
        />
        <ToolMenuDropButton
          button={
            <Shape
              shapeTool={shape}
              color={color}
              background={tool === "shape" ? "active" : "white"}
              onClick={() => setTool("shape")}
            />
          }
          key="draw-design-shape"
          content={
            <Box pad="small" direction="row" gap="xsmall">
              {shapes.map((shapeTool: DrawShape, i: number) => (
                <Box
                  key={`draw-color-button-${i}`}
                  align="center"
                  pad="small"
                  style={{ cursor: "pointer" }}
                  background={tool === "shape" ? "active" : "white"}
                  onClick={() => setShape(shapeTool)}
                >
                  <Shape shapeTool={shapeTool} color={color} />
                </Box>
              ))}
            </Box>
          }
        />
        <ToolMenuButton
          title="Draw"
          key="draw-design-paint"
          icon={Edit}
          isActive={tool === "paint"}
          onClick={() => setTool("paint")}
        />
        <ToolMenuButton
          title="Draw"
          key="draw-design-erase"
          icon={Erase}
          isActive={tool === "erase"}
          onClick={() => setTool("erase")}
        />
      </>
    </ToolMenu>
  )
}
