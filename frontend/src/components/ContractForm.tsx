import React, { useState } from 'react';
import { contractAPI } from '../services/api';
import { addContractOffline } from '../db/indexedDB';

interface ContractFormData {
  title: string;
  parties: string;
  object: string;
  startDate: string;
  endDate: string;
  amount: string;
  type: string;
}

const ContractForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<ContractFormData>({
    title: '',
    parties: '',
    object: '',
    startDate: '',
    endDate: '',
    amount: '',
    type: 'service'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      parties: formData.parties.split(',').map(p => p.trim()),
      amount: parseFloat(formData.amount)
    };

    try {
      await contractAPI.createContract(data);
      onSuccess();
    } catch (error) {
      // Offline: save to IndexedDB
      await addContractOffline({
        ...data,
        status: 'active',
        createdBy: 'user', // Placeholder
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        history: [{ date: new Date().toISOString(), action: 'created', details: 'Created offline' }]
      });
      onSuccess();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4" role="form" aria-labelledby="contract-form-title">
      <h2 id="contract-form-title" className="sr-only">Create New Contract</h2>
      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Title"
        required
        className="border p-2 w-full"
        aria-label="Contract Title"
      />
      <input
        name="parties"
        value={formData.parties}
        onChange={handleChange}
        placeholder="Parties (comma separated)"
        required
        className="border p-2 w-full"
        aria-label="Contract Parties"
      />
      <textarea
        name="object"
        value={formData.object}
        onChange={handleChange}
        placeholder="Object"
        required
        className="border p-2 w-full"
        aria-label="Contract Object"
      />
      <input
        name="startDate"
        type="date"
        value={formData.startDate}
        onChange={handleChange}
        required
        className="border p-2 w-full"
        aria-label="Start Date"
      />
      <input
        name="endDate"
        type="date"
        value={formData.endDate}
        onChange={handleChange}
        required
        className="border p-2 w-full"
        aria-label="End Date"
      />
      <input
        name="amount"
        type="number"
        value={formData.amount}
        onChange={handleChange}
        placeholder="Amount"
        required
        className="border p-2 w-full"
        aria-label="Contract Amount"
      />
      <select
        name="type"
        value={formData.type}
        onChange={handleChange}
        className="border p-2 w-full"
        aria-label="Contract Type"
      >
        <option value="service">Service</option>
        <option value="sales">Sales</option>
        <option value="lease">Lease</option>
        <option value="other">Other</option>
      </select>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded" aria-label="Submit Contract Form">
        Create Contract
      </button>
    </form>
  );
};

export default ContractForm;