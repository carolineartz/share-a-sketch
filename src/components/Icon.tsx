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
      d="M12,22 C17.5228475,22 22,17.5228475 22,12 C22,6.4771525 17.5228475,2 12,2 C9.82221987,2 7.80703466,2.69615164 6.16483752,3.87806177 C3.64242491,5.69347416 2,8.65493263 2,12 C2,17.5228475 6.4771525,22 12,22 Z"
    />
  </Icon>
)

export const ShapeSquare = (props: any): JSX.Element => (
  <Icon viewBox="0 0 24 24" a11yTitle="Shape-Circle" {...props}>
    <path
      stroke="none"
      d="M-7.10542736e-15,7.10542736e-15 C-7.10542736e-15,7.10542736e-15 -7.10542736e-15,6.66666667 -7.10542736e-15,20 L20,20 L20,7.10542736e-15 C6.66666667,7.10542736e-15 -7.10542736e-15,7.10542736e-15 -7.10542736e-15,7.10542736e-15 Z"
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

export const ColorDrop = (props: any): JSX.Element => (
  <Icon viewBox="0 0 24 24" a11yTitle="Color-Drop" {...props}>
    <path
      stroke="none"
      d="M13.752,1.7664 C13.2144,1.1264 12.7024,0.5376 12.2416,0 C11.7808,0.5632 11.2688,1.152 10.7312,1.7664 C7.48,5.504 3,10.7008 3,14.7456 C3,17.3056 4.024,19.6096 5.7136,21.2736 C7.3776,22.9376 9.6816,23.9872 12.2416,23.9872 C14.8016,23.9872 17.1056,22.9632 18.7696,21.2736 C20.4336,19.6096 21.4832,17.28 21.4832,14.7456 C21.4832,10.7008 17.0032,5.5296 13.752,1.7664 Z"
    />
  </Icon>
)
