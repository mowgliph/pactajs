import React, { useState } from 'react';
import { supplementAPI } from '../services/api';
import { addSupplementOffline } from '../db/indexedDB';

interface Props {
  contractId: string;
  onSupplementAdded: () => void;
}

const SupplementForm: React.FC<Props> = ({ contractId, onSupplementAdded }) => {
  const [modifiedFields, setModifiedFields] = useState<{ field: string; oldValue: any; newValue: any }[]>([]);
  const [effectiveDate, setEffectiveDate] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const addField = () => {
    setModifiedFields([...modifiedFields, { field: '', oldValue: '', newValue: '' }]);
  };

  const updateField = (index: number, key: string, value: any) => {
    const updated = [...modifiedFields];
    updated[index][key as keyof typeof updated[0]] = value;
    setModifiedFields(updated);
  };

  const removeField = (index: number) => {
    setModifiedFields(modifiedFields.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modifiedFields.length === 0 || !effectiveDate || !reason) return;

    setLoading(true);
    try {
      const supplement = {
        modifiedFields,
        effectiveDate,
        reason,
        createdAt: new Date().toISOString(),
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
      };

      // Try online first
      try {
        await supplementAPI.createSupplement(contractId, supplement);
      } catch (error) {
        // Offline: save to IndexedDB
        await addSupplementOffline(contractId, supplement);
      }

      onSupplementAdded();
      setModifiedFields([]);
      setEffectiveDate('');
      setReason('');
    } catch (error) {
      console.error('Error adding supplement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded mb-4">
      <h3 className="text-lg font-semibold mb-4">Add Supplement</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Modified Fields</label>
        {modifiedFields.map((field, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Field name"
              value={field.field}
              onChange={(e) => updateField(index, 'field', e.target.value)}
              className="flex-1 p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Old value"
              value={field.oldValue}
              onChange={(e) => updateField(index, 'oldValue', e.target.value)}
              className="flex-1 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="New value"
              value={field.newValue}
              onChange={(e) => updateField(index, 'newValue', e.target.value)}
              className="flex-1 p-2 border rounded"
              required
            />
            <button
              type="button"
              onClick={() => removeField(index)}
              className="px-3 py-2 bg-red-500 text-white rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addField}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add Field
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Effective Date</label>
        <input
          type="date"
          value={effectiveDate}
          onChange={(e) => setEffectiveDate(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Reason</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full p-2 border rounded"
          rows={3}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Adding...' : 'Add Supplement'}
      </button>
    </form>
  );
};

export default SupplementForm;