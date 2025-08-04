import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './email-auth/authcontext';
import { ProtectedRoute } from './email-auth/protected-route';

import AuthMenu from './email-auth/AuthMenu';
import Pokedex from './pokedex/Pokedex';
import HomeMenu from './home/HomeMenu';



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
        <BrowserRouter>
          <Routes>
            {user ? (
              <>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<ProtectedRoute><HomeMenu /></ProtectedRoute>} />
                <Route path="/pokedex" element={<ProtectedRoute><Pokedex /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/pokedex" replace />} />
              </>
            ) : (
              <Route path="*" element={<HomeMenu />} />
            )}
          </Routes>
        </BrowserRouter>
  ); 
}

export default App;