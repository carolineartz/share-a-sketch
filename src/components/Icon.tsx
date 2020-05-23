import * as React from "react"
import styled, { css } from "styled-components"
import { IconProps } from "grommet-icons"

const colorCss = css`
  fill: ${(props: any) => props.color || props.theme.global.colors.icon};
  stroke: ${(props: any) => props.color || props.theme.global.colors.icon};
  g {
    fill: inherit;
    stroke: inherit;
  }
  *:not([stroke]) {
    &[fill="none"] {
      stroke-width: 0;
    }
  }
  *[stroke*="#"],
  *[STROKE*="#"] {
    stroke: inherit;
    fill: none;
  }
  *[fill-rule],
  *[FILL-RULE],
  *[fill*="#"],
  *[FILL*="#"] {
    fill: inherit;
    stroke: none;
  }
`

const IconInner = ({ a11yTitle, color: _color, size: _size, ...rest }: IconProps): JSX.Element => (
  <svg aria-label={a11yTitle} {...rest} />
)

IconInner.displayName = "Icon"

const parseMetricToNum = (string: string): number => {
  const match = string.match(/\d+(\.\d+)?/)
  if (match) {
    return parseFloat(match[0])
  } else {
    return 24.0
  }
}

export const Icon = styled(IconInner)<IconProps & { viewBox: string }>`
  display: inline-block;
  flex: 0 0 auto;
  ${({ size = "medium", theme, viewBox }) => {
    const [, , w, h] = (viewBox || "0 0 24 24").split(" ")
    const scale = (parseInt(w) || 24) / (parseInt(h) || 24)
    const dimension = parseMetricToNum(theme.icon.size[size] || size)
    if (w < h) {
      return `
      width: ${dimension}px;
      height: ${dimension / scale}px;
    `
    }
    if (h < w) {
      return `
      width: ${dimension * scale}px;
      height: ${dimension}px;
    `
    }
    return `
      width: ${dimension}px;
      height: ${dimension}px;
    `
  }}
  ${({ color }) => color !== "plain" && colorCss}
  ${({ theme }) => theme && theme.icon.extend}
`

export const ShapeCircle = (props: any): JSX.Element => (
  <Icon viewBox="0 0 24 24" a11yTitle="Shape-Circle" {...props}>
    <path
      stroke="none"
      d="M20.4852656,3.51473437 C18.2187656,1.24823438 15.2052656,0 12,0 C8.7946875,0 5.78123438,1.24823438 3.51473437,3.51473437 C1.2481875,5.78128125 0,8.79473438 0,12 C0,15.2053594 1.2481875,18.2188125 3.51473437,20.4853125 C5.7811875,22.7518125 8.7946875,24 12,24 C15.2053125,24 18.2187656,22.7518125 20.4852656,20.4853125 C22.7517656,18.2188125 24,15.2053594 24,12 C24,8.79473438 22.7517656,5.78128125 20.4852656,3.51473437 Z M12,22.59375 C6.15857813,22.59375 1.40625,17.8414219 1.40625,12 C1.40625,6.15857812 6.15857813,1.40625 12,1.40625 C17.8414219,1.40625 22.59375,6.15857812 22.59375,12 C22.59375,17.8414219 17.8414219,22.59375 12,22.59375 Z"
    />
  </Icon>
)

export const ShapeSquare = (props: any): JSX.Element => (
  <Icon viewBox="0 0 24 24" a11yTitle="Shape-Circle" {...props}>
    <path
      stroke="none"
      d="M20.4852656,3.51473437 C18.2187656,1.24823438 15.2052656,0 12,0 C8.7946875,0 5.78123438,1.24823438 3.51473437,3.51473437 C1.2481875,5.78128125 0,8.79473438 0,12 C0,15.2053594 1.2481875,18.2188125 3.51473437,20.4853125 C5.7811875,22.7518125 8.7946875,24 12,24 C15.2053125,24 18.2187656,22.7518125 20.4852656,20.4853125 C22.7517656,18.2188125 24,15.2053594 24,12 C24,8.79473438 22.7517656,5.78128125 20.4852656,3.51473437 Z M12,22.59375 C6.15857813,22.59375 1.40625,17.8414219 1.40625,12 C1.40625,6.15857812 6.15857813,1.40625 12,1.40625 C17.8414219,1.40625 22.59375,6.15857812 22.59375,12 C22.59375,17.8414219 17.8414219,22.59375 12,22.59375 Z"
    />
  </Icon>
)

export const ShapeStar = (props: any): JSX.Element => (
  <Icon viewBox="0 0 24 24" a11yTitle="Shape-Circle" {...props}>
    <path
      stroke="none"
      d="M23.1428483,0 L0.857151744,0 C0.383361777,0 0,0.383361777 0,0.857151744 L0,23.1428483 C0,23.6166382 0.383361777,24 0.857151744,24 L23.1428483,24 C23.6166382,24 24,23.6166382 24,23.1428483 L24,0.857151744 C24,0.383361777 23.6166382,0 23.1428483,0 Z M22.2857463,22.2856965 L1.71430349,22.2856965 L1.71430349,1.71430349 L22.2857463,1.71430349 L22.2857463,22.2856965 L22.2857463,22.2856965 Z"
    />
  </Icon>
)
