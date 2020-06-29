import * as React from "react"

type ToolMenuDisplay = "minimize" | "maximize" | "submenu"
type ToolMenuDisplayMode = "show" | "autohide"
type ToolMenuDisplayContextType = {
  displayMode: ToolMenuDisplayMode
  setDisplayMode: (mode: ToolMenuDisplayMode) => void
  toolMenuDisplay: ToolMenuDisplay
  setToolMenuDisplay: (display: ToolMenuDisplay) => void
}

const ToolMenuDisplayContext = React.createContext<ToolMenuDisplayContextType | undefined>(undefined);

type Props = {
  children: React.ReactNode;
};

export const Provider = ({ children }: Props) => {
  const [toolMenuDisplay, setToolMenuDisplay] = React.useState<ToolMenuDisplay>("maximize");
  const [displayMode, setDisplayMode] = React.useState<ToolMenuDisplayMode>("autohide")

  return (
    <ToolMenuDisplayContext.Provider value={{
      toolMenuDisplay,
      setToolMenuDisplay,
      displayMode,
      setDisplayMode
    }}>
      {children}
    </ToolMenuDisplayContext.Provider>
  );
};

export const useToolMenuDisplay = () => React.useContext(ToolMenuDisplayContext);
