import * as React from "react"
import "styled-components/macro"

import { useMediaQuery } from 'react-responsive'
import { Button, ResponsiveContext, Drop } from "grommet"

import { IconProps } from "grommet-icons"
import { ToolMenuContext } from "./"

type ToolMenuItemProps = {
  title: string
  icon: {
    icon: React.ComponentType<IconProps & React.SVGProps<SVGSVGElement>>
    color?: string
    activeColor?: string
    plain?: boolean
  }
}

type ToolMenuToolSelectItemProps = ToolMenuItemProps & {
  onSelect: () => void
  onDeselect?: () => void
  isActive: boolean // highlighted
  isSelected: boolean // in use
  children?: React.ReactNode
}

export const ToolMenuItem = ({ onSelect, isActive, icon, title, children, isSelected, onDeselect }: ToolMenuToolSelectItemProps) => {
  const screenWidth = React.useContext(ResponsiveContext)
  const isShortDesktop = useMediaQuery({ query: '(max-height: 450px)' })
  const isShortMobile = useMediaQuery({ query: '(max-device-height: 450px)' })
  const isMediumHeightDesktop = useMediaQuery({ query: '(max-height: 640px)' })
  const isMediumHeightMobile = useMediaQuery({ query: '(max-device-height: 640px)' })
  const isMediumHeight = isMediumHeightDesktop || isMediumHeightMobile
  const isShort = isShortDesktop || isShortMobile
  const isNarrow = screenWidth === "small"

  const { toolMenuDisplay, setToolMenuDisplay, displayMode } = ToolMenuContext.useToolMenuDisplay()!

  const menuItemRef = React.useRef<HTMLButtonElement>(null)

  const resetMenuDisplay = function() {
    if (displayMode === "autohide") {
      setToolMenuDisplay("minimize")
    } else {
      setToolMenuDisplay("maximize")
    }
    onDeselect && onDeselect()
  }

  return (
    <>
      <Button
        key={`tool-menu-item-${title}`}
        onClick={() => {
          setToolMenuDisplay("maximize") // clear any submenus open?

          if (children) {
            onSelect()
            setToolMenuDisplay("submenu")
          } else if (displayMode === "autohide") {
            onSelect()
            setToolMenuDisplay("minimize")
          } else {
            onSelect()
          }
        }}
        css={`
          text-align: center;
          width: 100%;
        `}
        title={title}
        hoverIndicator
        active={isActive}
        ref={menuItemRef}
        icon={
          <icon.icon
            size={isShort ? "small" : isNarrow || isMediumHeight ? "medium" : "large"}
            color={icon.plain ? "plain" : isActive ? icon.activeColor || "white" : icon.color || "text"}
          />
        }
      />
      {toolMenuDisplay === "submenu" && isSelected && menuItemRef && menuItemRef.current &&
        <Drop
          key={`tool-menu-item-${title}-submenu`}
          align={{ top: "top", left: "right" }}
          target={menuItemRef.current}
          onClickOutside={resetMenuDisplay}
          onEsc={resetMenuDisplay}
        >
          {children}
        </Drop>
      }
    </>
  )
}
