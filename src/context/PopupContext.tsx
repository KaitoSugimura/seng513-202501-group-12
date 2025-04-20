import { createContext, useContext, useState, ReactNode } from "react";

type PopupContextType = {
  setContent: (content: ReactNode) => void;
  clearContent: () => void;
};

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error("usePopup must be used within a PopupProvider");
  }
  return context;
};

export const PopupProvider = ({ children }: { children: ReactNode }) => {
  const [popupContent, setPopupContent] = useState<ReactNode>(null);

  const setContent = (content: ReactNode) => {
    setPopupContent(content);
  };

  const clearContent = () => {
    setPopupContent(null);
  };

  return (
    <PopupContext.Provider value={{ setContent, clearContent }}>
      {children}
      {popupContent && (
        popupContent
      )}
    </PopupContext.Provider>
  );
};