import { Route } from 'react-router'

import Home from '@pages/Home.jsx'
import Login from '@pages/auth/login/Login'
import Register from '@pages/auth/register/Register'
import ForgotPassword from '@pages/auth/forgot-password/ForgotPassword'
import SearchGreenRoof from '@pages/search/greenroofs/SearchGreenRoof'
import GreenRoofDetails from '@pages/greenroof/details/GreenRoofDetails'

export default function PublicRoutes() {
  return (
    <>
      <Route to="/" element={<Home/>}/>
      <Route to="/login" element={<Login/>}/>
      <Route to="/register" element={<Register/>}/>
      <Route to="/forgot-password" element={<ForgotPassword/>}/>
      <Route to="/search" element={<SearchGreenRoof/>}/>
      <Route to="/roofs/:id" element={<GreenRoofDetails/>}/>
    </>
  )
}