import React, { useEffect, useState } from 'react';
import { supplementAPI } from '../services/api';
import { getSupplementsOffline } from '../db/indexedDB';

interface Supplement {
  id: string;
  modifiedFields: { field: string; oldValue: any; newValue: any }[];
  effectiveDate: string;
  createdAt: string;
  reason: string;
}

interface Props {
  contractId: string;
}

const SupplementHistory: React.FC<Props> = ({ contractId }) => {
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSupplements();
  }, [contractId]);

  const loadSupplements = async () => {
    try {
      // Try online first
      const response = await supplementAPI.getSupplements(contractId);
      setSupplements(response.data);
    } catch (error) {
      // Offline: load from IndexedDB
      const offlineSupplements = await getSupplementsOffline(contractId);
      setSupplements(offlineSupplements);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading supplements...</div>;

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">Supplement History</h3>
      {supplements.length === 0 ? (
        <p>No supplements found.</p>
      ) : (
        <div className="space-y-4">
          {supplements.map((supp) => (
            <div key={supp.id} className="border rounded p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">Supplement #{supp.id.slice(-8)}</h4>
                <span className="text-sm text-gray-500">
                  Created: {new Date(supp.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm mb-2">
                <strong>Effective Date:</strong> {new Date(supp.effectiveDate).toLocaleDateString()}
              </p>
              <p className="text-sm mb-3">
                <strong>Reason:</strong> {supp.reason}
              </p>
              <div>
                <strong>Modified Fields:</strong>
                <ul className="list-disc list-inside mt-1">
                  {supp.modifiedFields.map((field, index) => (
                    <li key={index} className="text-sm">
                      <strong>{field.field}:</strong> {field.oldValue || 'N/A'} → {field.newValue}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SupplementHistory;