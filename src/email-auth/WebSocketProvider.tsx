import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { useAuth } from "./authcontext";

declare global {
  interface Window {
    __TAURI__?: {
      core: {
        invoke: typeof invoke;
      }
    };
  }
}

interface WebSocketContextType {
  sendMessage: (message: string) => Promise<void>;
  serverIp: string | null;
  setServerIp: (ip: string | null) => void;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isConnected: boolean;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  lastMessage: string | null;
  error: string | null;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [serverIp, setServerIp] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();

  const handleDisconnection = useCallback(() => {
    console.log('🔌 WebSocket disconnected. Logging out and resetting.');
    setIsConnected(false);
    setConnectionStatus('disconnected');
    logout();
    setServerIp(null); // Navigate back to the IP menu
  }, [logout]);

  // Set up event listeners for WebSocket messages
  useEffect(() => {
    const setupListeners = async () => {
      try {
        const unlistenMessage = await listen('websocket-message', (event) => {
          console.log('📨 Received WebSocket message:', event.payload);
          setLastMessage(event.payload as string);
        });

        const unlistenDisconnect = await listen('websocket-disconnected', handleDisconnection);

        return () => {
          unlistenMessage();
          unlistenDisconnect();
        };
      } catch (e) {
        console.error('Failed to set up WebSocket event listeners:', e);
      }
    };

    setupListeners();
  }, [handleDisconnection]);

  const connect = useCallback(async () => {
    if (!serverIp) {
      setError("Server IP is not set");
      return;
    }
    if (isConnected) return;

    try {
      setConnectionStatus('connecting');
      setError(null);
      const result = await invoke<string>("connect_to_server", { ip: serverIp });
      console.log("✅ Connection result:", result);
      setIsConnected(true);
      setConnectionStatus('connected');
    } catch (e) {
      console.error("❌ Failed to connect via Rust backend:", e);
      setIsConnected(false);
      setConnectionStatus('error');
      setError(e as string);
    }
  }, [serverIp, isConnected]);

  const disconnect = useCallback(async () => {
    try {
      await invoke<string>("disconnect");
      handleDisconnection(); // Use our centralized handler
    } catch (e) {
      console.error("❌ Failed to disconnect:", e);
      handleDisconnection(); // Still treat as a disconnection
    }
  }, [handleDisconnection]);

  const sendMessage = useCallback(async (message: string): Promise<void> => {
    if (!isConnected) {
      const errorMsg = "Cannot send message, not connected.";
      console.warn(errorMsg);
      setError(errorMsg);
      throw new Error(errorMsg);
    }
    try {
      await invoke<string>("send_websocket_message", { message });
    } catch (e) {
      console.error("❌ Failed to send message via Rust backend:", e);
      setError(e as string);
      throw e;
    }
  }, [isConnected]);

  // Auto-connect when serverIp is set
  useEffect(() => {
    if (serverIp && !isConnected && connectionStatus === 'disconnected') {
      connect();
    }
  }, [serverIp, isConnected, connectionStatus, connect]);

  const value: WebSocketContextType = {
    sendMessage,
    serverIp,
    setServerIp,
    connect,
    disconnect,
    isConnected,
    connectionStatus,
    lastMessage,
    error
  };

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
};