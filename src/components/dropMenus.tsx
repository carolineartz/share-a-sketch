import * as React from "react"
import { Box, Button } from "grommet"

export type DropOption<T> = {
  value: T
  icon: JSX.Element
}

export type DropSelectProps<T> = {
  options: DropOption<T>[]
  value: T
  onClick: (value: T) => void
}

export function DropMenu<T>({ options, value, onClick }: DropSelectProps<T>): JSX.Element {
  return (
    <Box direction="row" flex={false}>
      {options.map((option: DropOption<T>, i: number) => (
        <Button
          key={`${value}-${i}`}
          icon={option.icon}
          active={value === option.value}
          onClick={() => onClick(option.value)}
        />
      ))}
    </Box>
  )
}
