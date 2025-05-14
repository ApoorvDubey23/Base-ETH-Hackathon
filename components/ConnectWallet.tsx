import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useState } from 'react';

export function WalletComponents() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const [selectedConnectorId, setSelectedConnectorId] = useState("");

  const handleConnect = () => {
    const selectedConnector = connectors.find(c => c.id === selectedConnectorId);
    if (selectedConnector) {
      connect({ connector: selectedConnector });
    }
  };

  return (
    <div className="flex flex-col gap-2 text-sm">
      {isConnected ? (
        <div className="flex items-center gap-3">
          <span className="text-green-400 font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
          <button
            onClick={() => disconnect()}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div className='flex items-center gap-3'>
          <select
            value={selectedConnectorId}
            onChange={(e) => setSelectedConnectorId(e.target.value)}
            className="p-2 rounded border bg-gray-800 text-white"
          >
            <option value="">Select Wallet</option>
            {connectors.map((connector) => (
              <option key={connector.id} value={connector.id}>
                {connector.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleConnect}
            disabled={!selectedConnectorId }
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
           Connect
          </button>
        </div>
      )}
    </div>
  );
}
