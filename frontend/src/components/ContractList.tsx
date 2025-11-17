import React, { useEffect, useState } from 'react';
import { contractAPI } from '../services/api';
import { getContractsOffline } from '../db/indexedDB';
import { Contract } from '../db/indexedDB';

const ContractList: React.FC<{ onViewDetails: (id: string) => void }> = ({ onViewDetails }) => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    try {
      // Try online first
      const response = await contractAPI.getContracts();
      setContracts(response.data);
    } catch (error) {
      // Fallback to offline
      const offlineContracts = await getContractsOffline();
      setContracts(offlineContracts);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Contracts</h2>
      <ul className="space-y-2">
        {contracts.map((contract) => (
          <li key={contract._id || contract.id} className="border p-4 rounded">
            <h3 className="font-semibold">{contract.title}</h3>
            <p>Status: {contract.status}</p>
            <p>Type: {contract.type}</p>
            <p>Amount: ${contract.amount}</p>
            <button onClick={() => onViewDetails(contract._id || contract.id?.toString() || '')} className="bg-blue-500 text-white p-1 rounded">View Details</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContractList;