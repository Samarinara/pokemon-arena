import { useState, useEffect } from 'react';
import { useWebSocket } from '../email-auth/WebSocketProvider';
import { Button, Card, Input } from 'pixel-retroui';

interface ServerIpMenuProps {
  onConnectionSuccess?: () => void; // Callback for when connection is successful
}

export default function ServerIpMenu({ onConnectionSuccess }: ServerIpMenuProps) {
  const [ip, setIp] = useState('127.0.0.1:8080');
  const { 
    setServerIp, 
    isConnected, 
    connectionStatus, 
    error, 
    disconnect,
    serverIp,
    connect
  } = useWebSocket();

  // Watch for successful connection
  useEffect(() => {
    if (isConnected && connectionStatus === 'connected' && onConnectionSuccess) {
      console.log('Connection successful, calling onConnectionSuccess callback');
      onConnectionSuccess();
    }
  }, [isConnected, connectionStatus, onConnectionSuccess]);

  const handleSubmit = async () => {
    // Basic validation
    if (ip.trim()) {
      console.log('Setting server IP to:', ip.trim());
      setServerIp(ip.trim());
      
      // If we're setting the same IP and already connected, call success immediately
      if (ip.trim() === serverIp && isConnected) {
        onConnectionSuccess?.();
      }
    } else {
      alert('Please enter a valid server IP address.');
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      console.log('Disconnected successfully');
    } catch (e) {
      console.error('Failed to disconnect:', e);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isConnected && connectionStatus !== 'connecting') {
      handleSubmit();
    }
  };

  const handleRetry = async () => {
    console.log('Retrying connection...');
    try {
      await connect();
    } catch (e) {
      console.error('Retry failed:', e);
    }
  };

  const getStatusMessage = () => {
    switch (connectionStatus) {
      case 'connecting':
        return '🔄 Connecting to server...';
      case 'connected':
        return `✅ Connected to ${serverIp}`;
      case 'error':
        return `❌ Connection failed${error ? `: ${error}` : ''}`;
      case 'disconnected':
      default:
        return '⚪ Ready to connect';
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connecting': return 'text-orange-600';
      case 'connected': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'disconnected':
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#d0fefe] gap-8 text-center">
      <Card className="flex items-center justify-center flex-col w-[70vw] h-[70vh] p-[1vh]" bg="#fefcd0">
        <h2 className="text-2xl font-bold text-center mb-4">Connect to Server</h2>
        
        {/* Connection Status */}
        <div className={`mb-4 text-sm font-medium ${getStatusColor()}`}>
          {getStatusMessage()}
        </div>
        
        {/* Error Display with Retry Option */}
        {error && connectionStatus === 'error' && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm max-w-xs">
            <div className="mb-2">
              <strong>Connection Failed:</strong> {error}
            </div>
            <Button 
              onClick={handleRetry}
              className="w-full text-xs py-1 bg-red-500 hover:bg-red-600 text-white"
            >
              Retry Connection
            </Button>
          </div>
        )}
        
        <p className="mb-4">
          {isConnected 
            ? "Successfully connected! You can disconnect or change server."
            : "Enter the IP address of the WebSocket server to continue."
          }
        </p>
        
        <div className="w-full max-w-xs">
          <Input
            placeholder="e.g., 127.0.0.1:8080"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={connectionStatus === 'connecting'}
            className="mb-4"
          />
          
          <div className="flex flex-col gap-2">
            {!isConnected ? (
              <Button 
                onClick={handleSubmit} 
                className="w-full"
                disabled={
                  connectionStatus === 'connecting' || 
                  !ip.trim()
                }
              >
                {connectionStatus === 'connecting' ? 'Connecting...' : 'Connect to Server'}
              </Button>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="text-green-600 text-sm font-medium mb-2">
                  🎉 Ready to proceed!
                </div>
                
                <Button 
                  onClick={handleDisconnect} 
                  className="w-full bg-red-500 hover:bg-red-600"
                >
                  Disconnect
                </Button>
                
                {/* Show reconnect option if IP changed */}
                {ip.trim() !== serverIp && (
                  <Button 
                    onClick={handleSubmit} 
                    className="w-full bg-blue-500 hover:bg-blue-600"
                  >
                    Connect to {ip.trim()}
                  </Button>
                )}
              </div>
            )}
          </div>
          
          {/* Current connection info */}
          {serverIp && (
            <div className="mt-4 text-xs text-gray-600">
              Current server: {serverIp}
            </div>
          )}
        </div>
        
        {/* Debug info (optional - remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-xs">
            <summary className="cursor-pointer">Debug Info</summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-left overflow-auto max-w-xs">
              {JSON.stringify({
                ip,
                serverIp,
                isConnected,
                connectionStatus,
                error
              }, null, 2)}
            </pre>
          </details>
        )}
      </Card>
    </div>
  );
}