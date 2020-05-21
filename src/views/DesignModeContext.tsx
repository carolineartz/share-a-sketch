/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react"

const defaultMode: DesignMode = "color" as DesignMode

export const DesignModeContext = React.createContext<DesignModeContextType>({
  mode: defaultMode,
  setMode: _mode => {},
})

type Props = {
  children: React.ReactNode
}

export const Provider = ({ children }: Props) => {
  const [mode, setMode]: [DesignMode, React.Dispatch<React.SetStateAction<DesignMode>>] = React.useState(defaultMode) // prettier-ignore

  return <DesignModeContext.Provider value={{ mode, setMode }}>{children}</DesignModeContext.Provider>
}

export const useDesignMode = () => React.useContext(DesignModeContext)
