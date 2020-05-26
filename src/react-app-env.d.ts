/// <reference types="react-scripts" />

import "styled-components/macro"
import {} from "react"
import { CSSProp } from "styled-components"

declare module "react" {
  interface Attributes {
    css?: CSSProp
  }
}

declare module "grommet-controls"
