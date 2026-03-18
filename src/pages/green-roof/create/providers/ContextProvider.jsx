import { createContext, useContext } from "react";

export const context = createContext();

export const useCreateGreenRoofContext = () => useContext(context);

export default function ContextProvider({ children, ...props }) {
  return (
    <context.Provider value={{...props}}>
      {children}
    </context.Provider>
  )
}