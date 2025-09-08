import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './email-auth/authcontext';
import { ProtectedRoute } from './email-auth/protected-route';


import Pokedex from './pokedex/Pokedex';
import HomeMenu from './home/HomeMenu';
import AuthMenu from './email-auth/AuthMenu';
import ServerIpMenu from './networking/ServerIpMenu';



import { useWebSocket, WebSocketProvider } from './email-auth/WebSocketProvider';

function App() {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <AppContent />
      </WebSocketProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  const { serverIp, isConnected } = useWebSocket();


  if (loading) {
    return <div>Loading...</div>;
  }

  if (!serverIp || !isConnected) {
    return <ServerIpMenu />;
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
              <Route path="*" element={<AuthMenu />} />
              
            )}
          </Routes>
        </BrowserRouter>
  ); 
}

export default App;