import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import "./App.css";
import AuthMenu from './email-auth/AuthMenu';
import { AuthProvider, useAuth } from './email-auth/authcontext';
import { ProtectedRoute } from './email-auth/protected-route';
import "nes.css/css/nes.min.css";

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>
        <BrowserRouter>
          <Routes>
            {user ? (
              <>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<ProtectedRoute><div>Home</div></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/home" replace />} />
              </>
            ) : (
              <Route path="*" element={<AuthMenu />} />
            )}
          </Routes>
        </BrowserRouter>
      </div>
      <div className="grid-bg"></div>
    </>
  );
}

export default App;
