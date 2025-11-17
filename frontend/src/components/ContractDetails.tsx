import React, { useEffect, useState } from 'react';
import { contractAPI } from '../services/api';
import { Contract } from '../db/indexedDB';
import SupplementForm from './SupplementForm';
import SupplementHistory from './SupplementHistory';
import DocumentUpload from './DocumentUpload';
import DocumentList from './DocumentList';

interface Props {
  contractId: string;
}

const ContractDetails: React.FC<Props> = ({ contractId }) => {
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    loadContract();
  }, [contractId]);

  const loadContract = async () => {
    try {
      const response = await contractAPI.getContract(contractId);
      setContract(response.data);
    } catch (error) {
      // Handle offline or error
      console.error('Error loading contract');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!contract) return <div>Contract not found</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{contract.title}</h2>
      <p><strong>Parties:</strong> {contract.parties.join(', ')}</p>
      <p><strong>Object:</strong> {contract.object}</p>
      <p><strong>Start Date:</strong> {contract.startDate}</p>
      <p><strong>End Date:</strong> {contract.endDate}</p>
      <p><strong>Amount:</strong> ${contract.amount}</p>
      <p><strong>Status:</strong> {contract.status}</p>
      <p><strong>Type:</strong> {contract.type}</p>
      <h3 className="text-xl font-semibold mt-4">History</h3>
      <ul>
        {contract.history.map((entry, index) => (
          <li key={index}>{entry.date}: {entry.action} - {entry.details}</li>
        ))}
      </ul>

      <h3 className="text-xl font-semibold mt-4">Documents</h3>
      <DocumentUpload contractId={contractId} onUploadSuccess={() => setRefreshTrigger(prev => prev + 1)} />
      <DocumentList contractId={contractId} refreshTrigger={refreshTrigger} />

      <SupplementForm contractId={contractId} onSupplementAdded={loadContract} />
      <SupplementHistory contractId={contractId} />
    </div>
  );
};

export default ContractDetails;