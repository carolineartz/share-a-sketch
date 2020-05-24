/* eslint-disable indent */
import * as React from "react"
import { Edit, Erase, Star } from "grommet-icons"
import { Box, Text, BoxProps } from "grommet"
import { ToolMenuButton, ToolMenuDropButton } from "../../components/ToolMenuButton"
import { ToolMenu } from "../../components/ToolMenu"
import * as DrawSettingsContext from "./DrawSettingsContext"
import { ColorDrop } from "../../components/Icon"

const colors: DesignColor[] = ["#42b8a4", "#4291b8", "#4256b8", "#6942b8", "#a442b8"]
const shapes: DrawShape[] = ["circle", "square", "star"]

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
      return <Star color={color} />
  }
}

export const DrawTools = (): JSX.Element => {
  const { tool, setTool, color, setColor, shape, setShape } = DrawSettingsContext.useDrawSettings()

  return (
    <ToolMenu>
      <>
        <ToolMenuDropButton
          key="draw-design-color"
          button={<ColorDrop color={color} />}
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
          key="draw-design-shape"
          active={tool == "shape"}
          button={
            <Box
              fill
              pad="none"
              margin="0"
              height={{ min: "24px" }}
              align="center"
              onClick={() => setTool("shape")}
              justify="center"
              background={tool === "shape" ? "active" : "white"}
            >
              <Shape shapeTool={shape} color={color} />
            </Box>
          }
          content={
            <Box pad="small" direction="row" gap="xsmall">
              {shapes.map((shapeTool: DrawShape, i: number) => (
                <Box
                  key={`draw-color-button-${i}`}
                  align="center"
                  pad="small"
                  style={{ cursor: "pointer" }}
                  background={shape === shapeTool ? "active" : "white"}
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
