import * as React from "react"
import { Box, Layer, ResponsiveContext, Button, Text, Anchor, Paragraph } from 'grommet';
import { Help, Github, Reactjs, Grommet } from "grommet-icons"
import "styled-components/macro"

type InfoProps = {
  children: React.ReactChild
}

const Info = ({ children }: InfoProps): JSX.Element => {
  const screenWidth = React.useContext(ResponsiveContext)
  const iconSize = screenWidth === "small" ? "small" : "medium"
  const [showInfo, setShowInfo] = React.useState<boolean>(false)

  return (
    <>
      <Button
        title="Info"
        key="app-info"
        icon={<Help size={iconSize} color="text" />}
        hoverIndicator
        alignSelf="center"
        onClick={() => setShowInfo(!showInfo)}
      />
      { showInfo &&
        <Layer
          modal
          onClickOutside={() => setShowInfo(false)}
          onEsc={() => setShowInfo(false)}
        >
          <Box fill background="white" pad={{bottom: "medium", horizontal: "medium"}}>
            <Box border="bottom">
              {children}
            </Box>
            <AppInfo />
          </Box>
        </Layer>
      }
    </>
  )
}

const AppInfo = () =>
  <Box margin={{top: "medium"}}>
    <Text color="palette-default-5" weight="bold">Made with TypeScript, React, Firebase, Grommet, and Paper.js.</Text>
    <Text css="display: inline-flex; align-items: center;">Code on <Anchor target="_blank" href="https://github.com/carolineartz/share-a-sketch" color="text" icon={<Github />} />.</Text>
  </Box>

export default Info

