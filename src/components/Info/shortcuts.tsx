import * as React from "react"

import { Box } from "grommet"
import { KeyboardText } from '@components/keyboardText';
import styled from 'styled-components';


export const Shortcut = ({keys, description}: {keys: string[], description: JSX.Element}) => {
  return (
    <Box pad={{vertical: "small"}} direction="row" border={{color: "text", side: "bottom"}}>
      <Box align="start" width="xsmall" direction="row" gap="xsmall">
        {keys.map((k: string, i: number) => {
          return <span key={`${k}-${i}`}><KeyboardText>{k}</KeyboardText>{i < (keys.length - 1) ? ", " : ""}</span>
        })}
      </Box>
      <Box flex="grow">{description}</Box>
    </Box>
  )
}

export const Shortcuts = styled(Box)`
  div:last-child {
    border-bottom: none;
  }
`
