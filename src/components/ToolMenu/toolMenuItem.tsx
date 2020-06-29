import * as React from "react"
import "styled-components/macro"

import { useMediaQuery } from 'react-responsive'
import { Button, ResponsiveContext, Drop } from "grommet"

import { IconProps } from "grommet-icons"

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
  isActive: boolean
  subMenu?: {
    show: boolean
    setShow: (show: boolean) => void
  }
  children?: React.ReactNode
}

export const ToolMenuItem = ({ onSelect, isActive, icon, title, subMenu, children }: ToolMenuToolSelectItemProps) => {
  const screenWidth = React.useContext(ResponsiveContext)
  const isShort = useMediaQuery({ query: '(max-device-height: 450px)' })
  const isNarrow = screenWidth === "small"

  const menuItemRef =  React.useRef<HTMLButtonElement>(null)

  return (
    <>
      <Button
        key={`tool-menu-item-${title}`}
        onClick={() => {
          if (subMenu) {
            subMenu.setShow(true)
            onSelect()
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
            size={isShort ? "small" : isNarrow ? "medium" : "large"}
            color={icon.plain ? "plain" : isActive ? icon.activeColor || "white" : icon.color || "text"}
          />
        }
      />
      {subMenu && subMenu.show && menuItemRef && menuItemRef.current &&
        <Drop
          key={`tool-menu-item-${title}-submenu`}
          align={{ top: "top", left: "right" }}
          target={menuItemRef.current}
          onClickOutside={() => subMenu.setShow(false)}
          onEsc={() => subMenu.setShow(false)}
        >
          { children }
        </Drop>
      }
    </>
  )
}
