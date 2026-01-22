import { Route } from 'react-router'

import CreateGreenRoof from '@pages/greenroof/create/CreateGreenRoof'
import UpdateGreenRoof from '@pages/greenroof/update/UpdateGreenRoof'
import Profile from '@pages/user/profile/Profile'
import Notifications from '@pages/user/notifications/Notifications'
import Reports from '@pages/user/reports/Reports'

export default function ProtectedRoutes() {
  return (
    <>
      <Route to="/greenroofs/create" element={<CreateGreenRoof/>}/>
      <Route to="/greenroofs/update/:id" element={<UpdateGreenRoof/>}/>
      <Route to="/profile" element={<Profile/>}/>
      <Route to="/notifications" element={<Notifications/>}/>
      <Route to="/reports" element={<Reports/>}/>
    </>
  )
}