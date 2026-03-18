import { createContext, useContext } from "react"

export const context = createContext();

export const useUpdateGreenRoofContext = () => useContext(context);

export default function ContextProvider({ children, ...props }) {
  return (
    <context.Provider value={{...props}}>
      {children}
    </context.Provider>
  )
}