/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react"

export const ShapeSettingsContext = React.createContext<ShapeSettingsContextType>({
  mode: "rotate",
  setMode: _mode => {},
})

type Props = {
  children: React.ReactNode
}

export const Provider = ({ children }: Props): JSX.Element => {
  const [mode, setMode] = React.useState<ShapeMode>("rotate") // prettier-ignore

  return <ShapeSettingsContext.Provider value={{ mode, setMode }}>{children}</ShapeSettingsContext.Provider>
}

export const useShapeSettings = (): ShapeSettingsContextType => React.useContext(ShapeSettingsContext)
