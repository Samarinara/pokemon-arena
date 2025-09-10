import { createContext, useCallback, useContext, useEffect, useState, ReactNode, useRef } from "react";

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
/*   const { logout } = useAuth();
 */  const webSocketRef = useRef<WebSocket | null>(null);

/*   const handleDisconnection = useCallback(() => {
    console.log('🔌 WebSocket disconnected.');
    if (webSocketRef.current) {
      webSocketRef.current.close();
      webSocketRef.current = null;
    }
    setIsConnected(false);
    setConnectionStatus('disconnected');
    logout();
    setServerIp(null); 
  }, [logout, setServerIp]); */

  const connect = useCallback(async () => {
    if (!serverIp) {
      setError("Server IP is not set");
      return;
    }
    if (webSocketRef.current) return;

    setConnectionStatus('connecting');
    setError(null);

    const wsUrl = `ws://${serverIp}/ws`;
    console.log(`Attempting to connect to ${wsUrl}`);
    const ws = new WebSocket(wsUrl);
    webSocketRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket connection established");
      setIsConnected(true);
      setConnectionStatus('connected');
    };

    ws.onmessage = (event) => {
      console.log('📨 Received WebSocket message:', event.data);
      setLastMessage(event.data);
    };

    ws.onclose = (event) => {
      console.log('❌ WebSocket connection closed:', event.code, event.reason);
      setIsConnected(false);
      setConnectionStatus('disconnected');
      if (!event.wasClean) {
        setError(`Connection closed unexpectedly: ${event.reason || 'Unknown error'}`);
      }
      webSocketRef.current = null;
    };

    ws.onerror = (event) => {
      console.error("❌ WebSocket error:", event);
      setIsConnected(false);
      setConnectionStatus('error');
      setError("Failed to connect to the WebSocket server.");
      webSocketRef.current = null;
    };

  }, [serverIp]);

  const disconnect = useCallback(async () => {
    if (webSocketRef.current) {
      webSocketRef.current.close();
    }
  }, []);

  const sendMessage = useCallback(async (message: string): Promise<void> => {
    if (!webSocketRef.current || webSocketRef.current.readyState !== WebSocket.OPEN) {
      const errorMsg = "Cannot send message, not connected.";
      console.warn(errorMsg);
      setError(errorMsg);
      throw new Error(errorMsg);
    }
    try {
      webSocketRef.current.send(message);
    } catch (e) {
      console.error("❌ Failed to send message:", e);
      setError(e as string);
      throw e;
    }
  }, [setError]);

  // Auto-connect when serverIp is set
  useEffect(() => {
    if (serverIp && !isConnected && connectionStatus === 'disconnected') {
      connect();
    }
  }, [serverIp, isConnected, connectionStatus, connect]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }
    };
  }, []);

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