import { createGlobalStyle } from "styled-components"
import eraser from "@images/cursors/eraser.svg"
import cursor42B8A4 from "@images/cursors/brush--42B8A4.svg"
import cursor6942B8 from "@images/cursors/brush--6942B8.svg"
import cursorA442B8 from "@images/cursors/brush--A442B8.svg"
import cursor4291B8 from "@images/cursors/brush--4291B8.svg"
import cursor4256B8 from "@images/cursors/brush--4256B8.svg"

export const CursorStyle = createGlobalStyle`
  .cursor-brush {
    &--42B8A4 {
      cursor: url(${cursor42B8A4}) 0 32, auto;
    }

    &--6942B8 {
      cursor: url(${cursor6942B8}) 0 32, auto;
    }

    &--A442B8 {
      cursor: url(${cursorA442B8}) 0 32, auto;
    }

    &--4291B8 {
      cursor: url(${cursor4291B8}) 0 32, auto;
    }

    &--4256B8 {
      cursor: url(${cursor4256B8}) 0 32, auto;
    }
  }

  .cursor-erase {
    cursor: url(${eraser}) 0 32, auto;
  }
`
