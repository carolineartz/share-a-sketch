import * as React from "react"
import { Box, Button } from "grommet"
import { IconProps } from "grommet-icons"
// import { useDismissTools } from "@components/ToolMenu"

export type Option<T> = {
  value: T
  icon: {
    icon: React.ComponentType <IconProps & React.SVGProps <SVGSVGElement>>
    color ?: string
  }
}

export type SelectProps<T> = {
  options: Option<T>[]
  value: T
  onClick: (value: T) => void
}

export function Menu<T>({ options, value, onClick }: SelectProps<T>): JSX.Element {
  // const { setToolsOpen, displayMode } = useDismissTools()

  return (
    <Box direction="row" flex={false}>
      {options.map((option: Option<T>, i: number) => (
        <Button
          key={`${value}-${i}`}
          icon={<option.icon.icon color={option.icon.color} />}
          active={value === option.value}
          onClick={() => {
            // if (displayMode === "")
            onClick(option.value)
          }}
        />
      ))}
    </Box>
  )
}
