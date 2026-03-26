import TextileChatbot from './components/TextileChatbot';
import { BrowserRouter, Navigate, Route, Routes, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderPage from './pages/OrderPage';
import CollectionsPage from './pages/CollectionsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminMaterialsPage from './pages/AdminMaterialsPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <TextileChatbot groqApiKey={import.meta.env.VITE_GROQ_API_KEY} />
          <Routes>
            {/* Admin Login Route */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={(
                <ProtectedRoute adminOnly>
                  <AdminLayout />
                </ProtectedRoute>
              )}
            >
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="materials" element={<AdminMaterialsPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* Client Routes */}
            <Route
              path="/"
              element={(
                <div className="min-h-screen bg-background text-foreground flex flex-col">
                  <Navbar />
                  <main className="flex-1 pt-24 pb-10">
                    <Outlet />
                  </main>
                  <Footer />
                </div>
              )}
            >
              {/* Home requires login — opens login page first when not authenticated */}
              <Route
                index
                element={(
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                )}
              />
              <Route path="collections" element={<CollectionsPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />

              <Route
                path="profile"
                element={(
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                )}
              />
              <Route
                path="orders"
                element={(
                  <ProtectedRoute>
                    <MyOrdersPage />
                  </ProtectedRoute>
                )}
              />
              <Route
                path="order/:materialId"
                element={(
                  <ProtectedRoute>
                    <OrderPage />
                  </ProtectedRoute>
                )}
              />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

