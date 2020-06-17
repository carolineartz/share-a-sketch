import * as React from "react"

import "styled-components/macro"
import { Stack, Box, Text, ThemeContext, ResponsiveContext } from "grommet"
import { StatusGood, StatusCritical, StatusGoodSmall, StatusCriticalSmall } from "grommet-icons"
import { Spinning } from "grommet-controls"
import { Cloud, CrossLarge, CrossSmall } from "@components/icon"
import { colorStatusCritical, colorStatusUnknown } from "@components/App/theme"
import { withFirebase, WithFirebaseProps, DatabaseStatus } from '@components/Firebase';

const ConnectionStatus = ({firebase}: WithFirebaseProps): JSX.Element => {
  const [status, setStatus] = React.useState<DatabaseStatus>("unknown")
  const [listening, setListening] = React.useState<boolean>(false)
  const [loading, setLoading] = React.useState<boolean>(true)
  const [showWarning, setShowWarning] = React.useState<boolean>(false)

  const timeoutId = React.useRef<number | undefined>()
  const screenWidth = React.useContext(ResponsiveContext)

  React.useEffect(() => {
    firebase.onConnectionChanged(setStatus)
    setListening(true)

    if (status !== "connected") {
      timeoutId.current = setTimeout(() => {
        setShowWarning(true)
      }, 1000)
    }

    if (status === "connected") {
      setLoading(false)
      setShowWarning(false)
      clearTimeout(timeoutId.current)
    }

    return () => {
      firebase.connection().off()
    }
  }, [status, setStatus, showWarning, setShowWarning, listening, setListening, loading, setLoading, firebase])

  const theme: any = React.useContext(ThemeContext)
  return (
    <Box
      width="medium"
      margin={{ top: "xlarge" }}
      pad={{ right: "medium", top: "small", left: "medium" }}
      round={{ corner: "left", size: "large" }}
      css={`
        position: absolute;
        right: 0;
        margin-right: ${showWarning
          ? screenWidth === "small"
            ? "-80px"
            : "-60px"
          : `calc(-1 * (${theme.global.size.medium} - 72px))`};
        top: 2em;
        background: #0a0b27bf;
        transition: all 1s ease;
      `}
    >
      <Box direction="row">
        {status === "connected" ? (
          <StatusConnected />
        ) : loading || status === "unknown" ? (
          <StatusUnknown />
        ) : (
          <StatusDisconnected />
        )}
        {status !== "connected" && showWarning && <WarningMessage />}
      </Box>
    </Box>
  )
}

const StatusUnknown = (): JSX.Element => (
  <Stack anchor="bottom-right">
    <Stack anchor="center">
      <Cloud size="large" color="white" />
      <CrossLarge size="large" color="white" />
      <CrossSmall size="large" color={colorStatusUnknown} />
    </Stack>
    <Stack>
      <StatusGoodSmall size="medium" color="white" />
      <Spinning kind="pulse" size="medium" color="text" />
    </Stack>
  </Stack>
)

const StatusDisconnected = (): JSX.Element => (
  <Stack anchor="bottom-right">
    <Cloud size="large" color="white" />
    <CrossLarge size="large" color="white" />
    <CrossSmall size="large" color={colorStatusCritical} />
    <Stack>
      <StatusCriticalSmall size="medium" color="status-critical" />
      <StatusCritical size="medium" color="white" />
    </Stack>
  </Stack>
)

const StatusConnected = (): JSX.Element => (
  <Stack anchor="right">
    <Cloud size="large" color="white" />
    <Stack>
      <StatusGoodSmall size="medium" color="status-ok" />
      <StatusGood size="medium" color="white" />
    </Stack>
  </Stack>
)

const WarningMessage = (): JSX.Element => (
  <Box pad={{ top: "10px", left: "medium" }}>
    <Text color="white" css="display: block;">
      Local changes will be lost!
    </Text>
  </Box>
)

export default withFirebase(ConnectionStatus)
