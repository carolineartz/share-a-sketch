import * as React from "react"

import { Stack, Box, BoxProps, ResponsiveContext } from "grommet"
import { StatusGood, StatusCritical, StatusGoodSmall, StatusCriticalSmall } from "grommet-icons"
import { ReactComponent as CloudDisconnected } from "../images/disconnected.svg"
import { ReactComponent as Cloud } from "../images/cloud.svg"
import { connection } from "../Firebase"

export const ConnectionStatus = (): JSX.Element => {
  const [status, setStatus]: [DatabaseStatus, React.Dispatch<React.SetStateAction<DatabaseStatus>>] = React.useState(
    "connected" as DatabaseStatus
  )

  React.useEffect(() => {
    connection.listen(setStatus)
    return connection.disconnect
  }, [])

  const screenWidth = React.useContext(ResponsiveContext)

  return (
    <Box
      id="foo"
      round={{ corner: "left", size: "large" }}
      direction="row"
      margin={{ top: "xlarge" }}
      pad="small"
      background="rgba(10, 11, 37, 0.6)"
      style={{
        top: "0",
        right: "0",
        transformOrigin: "right",
        transform: screenWidth === "small" ? "scale(0.8)" : "none",
      }}
    >
      <StatusIcon isConnected={status === "connected"} />
      <Box width="10px" />
    </Box>
  )
}

type StatusIconProps = BoxProps & {
  isConnected: boolean
}

const StatusIcon = ({ isConnected }: StatusIconProps): JSX.Element => (
  <Stack style={{ bottom: "50%", right: "-10%" }}>
    <Box>
      {isConnected ? (
        <Cloud width="3em" height="2.5em" style={{ overflow: "visible" }} />
      ) : (
        <CloudDisconnected width="3em" height="2.5em" style={{ overflow: "visible" }} />
      )}
    </Box>
    {isConnected && (
      <>
        <StatusGoodSmall style={{ position: "absolute" }} color="status-ok" />{" "}
        <StatusGood style={{ position: "absolute" }} color="white" />
      </>
    )}{" "}
    {!isConnected && (
      <>
        <StatusCriticalSmall style={{ position: "absolute" }} color="status-critical" />{" "}
        <StatusCritical style={{ position: "absolute" }} color="white" />
      </>
    )}
  </Stack>
)