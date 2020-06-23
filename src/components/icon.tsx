import * as React from "react"
import "styled-components/macro"
import styled, { css } from "styled-components"
import { IconProps } from "grommet-icons"

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

export const Ruler = (props: any): JSX.Element => (
  <Icon viewBox="0 0 24 24" a11yTitle="Tool Size" {...props}>
    <path
      strokeWidth="2"
      fill="none"
      stroke={props.color || "black"}
      d="M4,14.5855314 L17.2864907,1.29904073 C17.680551,0.904980411 18.3127724,0.898303801 18.7057732,1.29130457 L22.2942268,4.87975825 C22.6840146,5.269546 22.6812861,5.90424531 22.2864907,6.29904073 L9,19.5855314 L19.5845905,9 L6.29809984,22.2864907 C5.90403954,22.680551 5.27181814,22.6872276 4.87881734,22.2942268 L1.29036374,18.7057732 C0.900575935,18.3159854 0.903304435,17.6812861 1.29809984,17.2864907 L14.5845905,4 M7,13 L8,14 M13,7 L14,8 M4,16 L6,18 M10,10 L12,12 M16,4 L18,6 M16,4 L18,6"
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

export const Cloud = (props: any): JSX.Element => (
  <Icon viewBox="0 0 24 24" a11yTitle="Network Connected" {...props}>
    <path
      stroke="none"
      d="M12.3546667,2.4 C15.3035689,2.4 17.7672402,4.47752055 18.361897,7.24877804 C18.6279534,7.20266097 18.9018413,7.17866667 19.1813333,7.17866667 C21.8205181,7.17866667 23.96,9.31814861 23.96,11.9573333 C23.96,14.5965181 21.8205181,16.736 19.1813333,16.736 C19.0906135,16.736 19.0004841,16.733472 18.9110118,16.7284827 C18.8882568,16.7334339 18.8644281,16.736 18.84,16.736 L5.18666667,16.736 C2.35896876,16.736 0.0666666667,14.4436979 0.0666666667,11.616 C0.0666666667,8.7883021 2.35896876,6.496 5.18666667,6.496 C5.64165185,6.496 6.08277576,6.55534722 6.50271956,6.66672282 C7.29604427,4.19170028 9.61611848,2.4 12.3546667,2.4 Z"
    />
  </Icon>
)

export const CrossSmall = (props: any): JSX.Element => (
  <Icon viewBox="0 0 24 24" a11yTitle="Cross Out Small Line" {...props}>
    <path
      stroke="none"
      d="M21.3763517,2.19431496 C21.5763001,2.39426342 21.5763001,2.71844386 21.3763517,2.91839232 L3.03305899,21.261685 C2.83311053,21.4616335 2.50893008,21.4616335 2.30898162,21.261685 C2.1090332,21.0617366 2.1090332,20.7375561 2.30898162,20.5376077 L20.6522743,2.19431496 C20.8522228,1.99436653 21.1764033,1.99436653 21.3763517,2.19431496 Z"
    />
  </Icon>
)

export const CrossLarge = (props: any): JSX.Element => (
  <Icon viewBox="0 0 24 24" a11yTitle="Cross Out Small Line" {...props}>
    <path
      stroke="none"
      d="M19.2380609,0.780101274 L0.894768061,19.1233941 C-0.0862289067,20.1043913 -0.0862289067,21.6949015 0.89476794,22.6758985 C1.8757652,23.6568956 3.46627541,23.6568956 4.44727243,22.6758987 L22.7905653,4.33260588 C23.7715622,3.35160875 23.7715622,1.76109853 22.7905652,0.780101274 C21.8095681,-0.200895573 20.2190579,-0.200895573 19.2380609,0.780101274 Z"
    />
  </Icon>
)

export const Font = (props: any): JSX.Element => (
  <Icon viewBox="0 0 24 24" a11yTitle="Cross Out Small Line" {...props}>
    <path d="M21.7831406,20.25 L12.6893906,0 L11.3028281,0 L2.58407813,20.25 L0,20.25 L0,21.65625 L7.5,21.65625 L7.5,20.25 L4.11515625,20.25 L6.35540625,15.046875 L14.6237813,15.046875 L16.9603594,20.25 L14.625,20.25 L14.625,21.65625 L24,21.65625 L24,20.25 L21.7831406,20.25 Z M6.96084375,13.640625 L10.4025469,5.64703125 L13.9922344,13.640625 L6.96084375,13.640625 Z M18.5018906,20.25 L11.1570938,3.8945625 L12.0086719,1.91676563 L20.2416094,20.25 L18.5018906,20.25 Z" />
  </Icon>
)

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
    return Number.parseFloat(match[0])
  }
    return 24

}

export const Icon = styled(IconInner)<IconProps & { viewBox: string }>`
  display: inline-block;
  flex: 0 0 auto;
  ${({ size = "medium", theme, viewBox }) => {
    const [, , w, h] = (viewBox || "0 0 24 24").split(" ")
    const scale = (Number.parseInt(w, 2) || 24) / (Number.parseInt(h, 2) || 24)
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
