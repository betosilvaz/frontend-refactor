import { BrowserRouter, Routes } from 'react-router'
import PublicRoutes from '@routes/PublicRoutes'
import ProtectedRoutes from '@routes/ProtectedRoutes'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <PublicRoutes/>
        <ProtectedRoutes/>
      </Routes>
    </BrowserRouter>
  )
}
