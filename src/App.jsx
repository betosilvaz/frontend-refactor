import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Suspense, lazy } from 'react';
import { Toaster } from 'react-hot-toast';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import LoadingPage from "@components/loading-page/LoadingPage";

const queryClient = new QueryClient();

// Lazy loading de todas as páginas e componentes grandes
const Home = lazy(() => import('@pages/Home'));
const About = lazy(() => import('@pages/About'));
const Login = lazy(() => import('@pages/auth/login/Login'));
const Register = lazy(() => import('@pages/auth/register/Register'));
const ForgotPassword = lazy(() => import('@pages/auth/forgot-password/ForgotPassword'));
const SearchGreenRoof = lazy(() => import('@pages/search/green-roof/SearchGreenRoof'));
const GreenRoofDetails = lazy(() => import('@pages/green-roof/details/GreenRoofDetails'));
const CreateGreenRoof = lazy(() => import('@pages/green-roof/create/CreateGreenRoof'));
const UpdateGreenRoof = lazy(() => import('@pages/green-roof/update/UpdateGreenRoof'));
const Profile = lazy(() => import('@pages/user/profile/Profile'));
const Reports = lazy(() => import('@pages/user/reports/Reports'));
const Notifications = lazy(() => import('@pages/user/notifications/Notifications'));
const Unauthorized = lazy(() => import('@pages/auth/unauthorized/Unauthorized'));
const ResetPassword = lazy(() => import('@pages/auth/reset-password/ResetPassword'));
const ProtectedRoutes = lazy(() => import('@components/protected-routes/ProtectedRoutes'));
const AuthProvider = lazy(() => import('@providers/AuthProvider'));

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      {/* Suspense único para toda a app */}
      <Suspense fallback={<LoadingPage />}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/loading" element={<LoadingPage />} />
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/search" element={<SearchGreenRoof />} />
              <Route path="/green-roof/:id" element={<GreenRoofDetails />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route element={<ProtectedRoutes allowedRoles={['gestor']} />}>
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/green-roof/create" element={<CreateGreenRoof />} />
                <Route path="/green-roof/update/:id" element={<UpdateGreenRoof />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/notifications" element={<Notifications />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </Suspense>
    </QueryClientProvider>
  );
}