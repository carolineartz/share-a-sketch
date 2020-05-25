/// <reference types="react-scripts" />
// / <reference types="styled-components/cssprop" />

import "styled-components/macro"
import {} from "react"
import { CSSProp } from "styled-components"

declare module "react" {
  interface Attributes {
    css?: CSSProp
  }
}
