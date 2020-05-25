import * as React from "react"
import { Edit, Erase, Star } from "grommet-icons"
import { Drop, Button } from "grommet"
import { DropMenu, DropOption, DropSelectProps } from "../../components/DropMenu"
import { ToolMenu } from "../../components/ToolMenu"
import * as DrawSettingsContext from "./DrawSettingsContext"
import { ColorDrop, ShapeSquare, ShapeCircle } from "../../components/Icon"
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

  const colorOptions: DropOption<DesignColor>[] = colors.map((c: DesignColor) => ({
    value: c,
    icon: <ShapeCircle size="large" color={c} />,
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
      <ShapeCircle size="large" color={color} />
    ) : s === "square" ? (
      <ShapeSquare size="large" color={color} />
    ) : (
      <Star size="large" color={color} />
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
    <ToolMenu>
      <>
        <Button
          onClick={() => setShowColorOptions(!showColorOptions)}
          title="Color"
          ref={colorMenuItemRef}
          key="draw-color"
          icon={<ColorDrop size="large" color={color} />}
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
          icon={<Edit size="large" color={tool === "paint" ? "white" : "text"} />}
          active={tool === "paint"}
          onClick={() => setTool("paint")}
        />
        <Button
          title="Draw"
          key="draw-design-erase"
          icon={<Erase size="large" color={tool === "erase" ? "white" : "text"} />}
          active={tool === "erase"}
          onClick={() => setTool("erase")}
        />
      </>
    </ToolMenu>
  )
}
