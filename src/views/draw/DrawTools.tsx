import * as React from "react"
import { Edit, Erase, Star, StopFill } from "grommet-icons"
import { Drop, Button, ResponsiveContext } from "grommet"
import { DropMenu, DropOption, DropSelectProps } from "@components/DropMenu"
import { ToolMenu } from "@components/ToolMenu"
import { ColorDrop, ShapeCircle } from "@components/Icon"
import * as DrawSettingsContext from "@draw/DrawSettingsContext"
import { DesignColor } from "../../theme"

const colors: DesignColor[] = ["#42b8a4", "#4291b8", "#4256b8", "#6942b8", "#a442b8"]
const shapes: DrawSettingsContext.DrawShape[] = ["circle", "square", "star"]

export const DrawTools = (): JSX.Element => {
  const { tool, setTool, color, setColor, shape, setShape } = DrawSettingsContext.useDrawSettings()
  const [showColorOptions, setShowColorOptions] = React.useState<boolean>(false)
  const [showShapeOptions, setShowShapeOptions] = React.useState<boolean>(false)

  const colorMenuItemRef = React.useRef() as any
  const shapeMenuItemRef = React.useRef() as any

  const closeColorOptions = (): void => setShowColorOptions(false)
  const closeShapeOptions = (): void => setShowShapeOptions(false)
  const screenWidth = React.useContext(ResponsiveContext)

  const iconSize = screenWidth === "small" ? "medium" : "large"

  const colorOptions: DropOption<DesignColor>[] = colors.map((c: DesignColor) => ({
    value: c,
    icon: <ShapeCircle size={iconSize} color={c} />,
  }))

  const colorSelectProps: DropSelectProps<DesignColor> = {
    onClick: (c: DesignColor) => {
      setColor(c)
      closeShapeOptions()
      closeColorOptions()
    },
    value: color,
    options: colorOptions,
  }

  const shapeIcon = (s: DrawSettingsContext.DrawShape): JSX.Element =>
    s === "circle" ? (
      <ShapeCircle size={iconSize} color={color} />
    ) : s === "square" ? (
      <StopFill size={iconSize} color={color} />
    ) : (
      <Star size={iconSize} color={color} />
    )

  const shapeOptions: DropOption<DrawSettingsContext.DrawShape>[] = shapes.map((s: DrawSettingsContext.DrawShape) => ({
    value: s,
    icon: shapeIcon(s),
  }))

  const shapeSelectProps: DropSelectProps<DrawSettingsContext.DrawShape> = {
    onClick: (s: DrawSettingsContext.DrawShape) => {
      setShape(s)
      closeShapeOptions()
      closeColorOptions()
    },
    value: shape,
    options: shapeOptions,
  }

  return (
    <ToolMenu size={screenWidth === "small" ? "small" : "medium"}>
      <>
        <Button
          onClick={() => setShowColorOptions(!showColorOptions)}
          title="Color"
          ref={colorMenuItemRef}
          key="draw-color"
          icon={<ColorDrop size={iconSize} color={color} />}
        />
        {showColorOptions && colorMenuItemRef && colorMenuItemRef.current && (
          <Drop
            align={{ top: "top", left: "right" }}
            target={colorMenuItemRef.current}
            onClickOutside={closeColorOptions}
            onEsc={closeColorOptions}
          >
            <DropMenu {...colorSelectProps} />
          </Drop>
        )}
        <Button
          onClick={() => {
            setTool("shape")
            setShowShapeOptions(!showShapeOptions)
          }}
          title="Shape"
          active={tool === "shape"}
          ref={shapeMenuItemRef}
          key="draw-shape"
          icon={shapeIcon(shape)}
        />
        {showShapeOptions && shapeMenuItemRef && shapeMenuItemRef.current && (
          <Drop
            align={{ top: "top", left: "right" }}
            target={shapeMenuItemRef.current}
            onClickOutside={closeShapeOptions}
            onEsc={closeShapeOptions}
          >
            <DropMenu {...shapeSelectProps} />
          </Drop>
        )}
        <Button
          title="Draw"
          key="draw-design-paint"
          icon={<Edit size={iconSize} color={tool === "paint" ? "white" : "text"} />}
          active={tool === "paint"}
          onClick={() => setTool("paint")}
        />
        <Button
          title="Draw"
          key="draw-design-erase"
          icon={<Erase size={iconSize} color={tool === "erase" ? "white" : "text"} />}
          active={tool === "erase"}
          onClick={() => setTool("erase")}
        />
      </>
    </ToolMenu>
  )
}
