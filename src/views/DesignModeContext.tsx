import React from "react"

const defaultMode: DesignMode = "color" as DesignMode

export const DesignModeContext = React.createContext<DesignModeContextType>({
  mode: defaultMode,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setMode: _mode => {},
})

type Props = {
  children: React.ReactNode
}

export const Provider = ({ children }: Props): JSX.Element => {
  const [mode, setMode]: [DesignMode, React.Dispatch<React.SetStateAction<DesignMode>>] = React.useState(defaultMode) // prettier-ignore

  return <DesignModeContext.Provider value={{ mode, setMode }}>{children}</DesignModeContext.Provider>
}

export const useDesignMode = (): DesignModeContextType => React.useContext(DesignModeContext)
