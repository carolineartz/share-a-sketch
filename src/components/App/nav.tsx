import React from "react"

import "styled-components/macro"
import { Box, ResponsiveContext } from "grommet"
import { Cube, Brush } from "grommet-icons"
import { EndButton } from "@components/buttonGroup"
import { brand } from "../../theme"
import { DesignView } from "~/react-app-env"

type NavProps = {
  view: DesignView
  setView: (view: DesignView) => void
}

export const Nav = ({ view, setView }: NavProps): JSX.Element => {
  const screenWidth = React.useContext(ResponsiveContext)

  return (
    <Box
      justify="center"
      align="center"
      round={screenWidth === "small" ? "large" : "medium"}
      direction="row"
      background="white"
      elevation="large"
      margin={{ top: "medium" }}
      css={`
        position: absolute;
        display: inline-flex;
        left: 50%;
        transform: translateX(-50%);
        user-select: none;
      `}
    >
      <NavButton
        isActive={view === "shapes"}
        side="left"
        size={screenWidth === "small" ? "medium" : "large"}
        iconClass={Cube}
        label="Shapes"
        onClick={() => setView("shapes")}
      />
      <NavButton
        isActive={view === "draw"}
        side="right"
        size={screenWidth === "small" ? "medium" : "large"}
        iconClass={Brush}
        label="Draw"
        onClick={() => setView("draw")}
      />
    </Box>
  )
}

type NavButtonProps = {
  isActive: boolean
  side: "left" | "right"
  size: "small" | "medium" | "large"
  iconClass: any
  label: string
  onClick: any
}

const NavButton = (props: NavButtonProps) => (
  <EndButton
    color={ props.isActive ? "white" : "brand"}
    side={props.side}
    size={props.size}
    active={ props.isActive}
    icon={<props.iconClass color={ props.isActive ? "white" : "text"} />}
    hoverIndicator
    label={props.label}
    onClick={props.onClick}
    css={`
      width: 8em;
      border-color: ${brand};
      &:focus {
        box-shadow: none;
      }
    `}
  />
)
