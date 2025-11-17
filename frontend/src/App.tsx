import React, { useState, useEffect } from 'react';
import ContractList from './components/ContractList';
import ContractForm from './components/ContractForm';
import ContractDetails from './components/ContractDetails';
import Dashboard from './components/Dashboard';
import Profile from './pages/Profile';
import AdminUsers from './pages/AdminUsers';
import { syncContracts } from './db/indexedDB';

function App() {
  const [view, setView] = useState<'list' | 'form' | 'details' | 'dashboard' | 'profile' | 'admin'>('dashboard');
  const [selectedContractId, setSelectedContractId] = useState<string>('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleOnline = () => syncContracts();
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleViewDetails = (id: string) => {
    setSelectedContractId(id);
    setView('details');
  };

  const handleCreate = () => {
    setView('form');
  };

  const handleSuccess = () => {
    setView('list');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <button onClick={() => setView('dashboard')} className="mr-4">Dashboard</button>
        <button onClick={() => setView('list')} className="mr-4">Contracts</button>
        <button onClick={handleCreate} className="mr-4">Create Contract</button>
        <button onClick={() => setView('profile')} className="mr-4">Profile</button>
        {user?.role === 'admin' && <button onClick={() => setView('admin')} className="mr-4">Admin Users</button>}
      </nav>
      {view === 'dashboard' && <Dashboard />}
      {view === 'list' && <ContractList onViewDetails={handleViewDetails} />}
      {view === 'form' && <ContractForm onSuccess={handleSuccess} />}
      {view === 'details' && <ContractDetails contractId={selectedContractId} />}
      {view === 'profile' && <Profile />}
      {view === 'admin' && user?.role === 'admin' && <AdminUsers />}
    </div>
  );
}

export default App;