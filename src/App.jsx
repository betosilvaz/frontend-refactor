import { BrowserRouter, Routes, Route } from 'react-router'
import { Navigate } from 'react-router'

import Home from '@pages/Home'
import Login from '@pages/auth/login/Login'
import Register from '@pages/auth/register/Register'
import ForgotPassword from '@pages/auth/forgot-password/ForgotPassword'
import SearchGreenRoof from '@pages/search/green-roof/SearchGreenRoof'
import GreenRoofDetails from '@pages/green-roof/details/GreenRoofDetails'
import CreateGreenRoof from '@pages/green-roof/create/CreateGreenRoof'
import UpdateGreenRoof from '@pages/green-roof/update/UpdateGreenRoof'
import Profile from '@pages/user/profile/Profile'
import Reports from '@pages/user/reports/Reports'
import Notifications from '@pages/user/notifications/Notifications'
import Unauthorized from '@pages/auth/unauthorized/Unauthorized'
import ResetPassword from '@pages/auth/reset-password/ResetPassword'

import ProtectedRoutes from '@components/protected-routes/ProtectedRoutes'

import AuthProvider from '@providers/AuthProvider'
import { Toaster } from 'react-hot-toast'

export default function App() {
  return (
    <>
      <Toaster />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/search" element={<SearchGreenRoof />} />
            <Route path="/green-roof/:id" element={<GreenRoofDetails />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route element={<ProtectedRoutes allowedRoles={["gestor"]} />}>
              <Route path="/green-roof/create" element={<CreateGreenRoof />} />
              <Route path="/green-roof/update" element={<UpdateGreenRoof />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/notifications" element={<Notifications />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}
