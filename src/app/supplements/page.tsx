
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import { Supplement, SupplementStatus, Contract } from '@/types';
import { getSupplements, setSupplements, getContracts, getCurrentUser } from '@/lib/storage';
import { addAuditLog } from '@/lib/audit';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import AppLayout from '@/components/layout/AppLayout';
import Link from 'next/link';

export default function SupplementsPage() {
  const [supplements, setSupplementsState] = useState<Supplement[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSupplement, setEditingSupplement] = useState<Supplement | undefined>();
  const [formData, setFormData] = useState({
    contractId: '',
    supplementNumber: '',
    description: '',
    effectiveDate: '',
    modifications: '',
    status: 'draft' as SupplementStatus,
  });
  const { hasPermission } = useAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    loadData();
    const action = searchParams.get('action');
    const contractId = searchParams.get('contractId');
    if (action === 'create') {
      setShowForm(true);
      if (contractId) {
        setFormData(prev => ({ ...prev, contractId }));
      }
    }
  }, [searchParams]);

  const loadData = () => {
    setSupplementsState(getSupplements());
    setContracts(getContracts());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = getCurrentUser();
    if (!user) return;

    const allSupplements = getSupplements();

    if (editingSupplement) {
      const updated: Supplement = {
        ...editingSupplement,
        ...formData,
        updatedAt: new Date().toISOString(),
      };
      const newSupplements = allSupplements.map(s => s.id === updated.id ? updated : s);
      setSupplements(newSupplements);
      addAuditLog(formData.contractId, 'Supplement Updated', `Supplement ${updated.supplementNumber} was updated`);
      toast.success('Supplement updated successfully');
    } else {
      const newSupplement: Supplement = {
        ...formData,
        id: Date.now().toString(),
        createdBy: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setSupplements([...allSupplements, newSupplement]);
      addAuditLog(formData.contractId, 'Supplement Created', `Supplement ${newSupplement.supplementNumber} was created`);
      toast.success('Supplement created successfully');
    }

    resetForm();
    loadData();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingSupplement(undefined);
    setFormData({
      contractId: '',
      supplementNumber: '',
      description: '',
      effectiveDate: '',
      modifications: '',
      status: 'draft',
    });
  };

  const handleEdit = (supplement: Supplement) => {
    if (!hasPermission('editor')) {
      toast.error('You do not have permission to edit supplements');
      return;
    }
    setEditingSupplement(supplement);
    setFormData({
      contractId: supplement.contractId,
      supplementNumber: supplement.supplementNumber,
      description: supplement.description,
      effectiveDate: supplement.effectiveDate,
      modifications: supplement.modifications,
      status: supplement.status,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (!hasPermission('manager')) {
      toast.error('You do not have permission to delete supplements');
      return;
    }

    const allSupplements = getSupplements();
    const supplement = allSupplements.find(s => s.id === id);
    const newSupplements = allSupplements.filter(s => s.id !== id);
    setSupplements(newSupplements);
    
    if (supplement) {
      addAuditLog(supplement.contractId, 'Supplement Deleted', `Supplement ${supplement.supplementNumber} was deleted`);
    }
    
    toast.success('Supplement deleted successfully');
    loadData();
  };

  const getStatusBadge = (status: SupplementStatus) => {
    const variants: Record<SupplementStatus, 'default' | 'secondary' | 'outline'> = {
      draft: 'secondary',
      approved: 'default',
      active: 'default',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getContractInfo = (contractId: string) => {
    const contract = contracts.find(c => c.id === contractId);
    return contract ? `${contract.contractNumber} - ${contract.title}` : 'Unknown';
  };

  if (showForm) {
    return (
      <AppLayout>
        <Card>
          <CardHeader>
            <CardTitle>{editingSupplement ? 'Edit Supplement' : 'Add New Supplement'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contractId">Parent Contract *</Label>
                <Select 
                  value={formData.contractId} 
                  onValueChange={(value) => setFormData({ ...formData, contractId: value })}
                  disabled={!!editingSupplement}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select contract" />
                  </SelectTrigger>
                  <SelectContent>
                    {contracts.map((contract) => (
                      <SelectItem key={contract.id} value={contract.id}>
                        {contract.contractNumber} - {contract.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplementNumber">Supplement Number *</Label>
                  <Input
                    id="supplementNumber"
                    value={formData.supplementNumber}
                    onChange={(e) => setFormData({ ...formData, supplementNumber: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="effectiveDate">Effective Date *</Label>
                  <Input
                    id="effectiveDate"
                    type="date"
                    value={formData.effectiveDate}
                    onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as SupplementStatus })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modifications">Modifications Summary *</Label>
                <Textarea
                  id="modifications"
                  value={formData.modifications}
                  onChange={(e) => setFormData({ ...formData, modifications: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingSupplement ? 'Update Supplement' : 'Create Supplement'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Manage contract supplements and amendments
          </p>
          {hasPermission('editor') && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Supplement
            </Button>
          )}
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplement Number</TableHead>
                  <TableHead>Parent Contract</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Effective Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {supplements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No supplements found
                    </TableCell>
                  </TableRow>
                ) : (
                  supplements.map((supplement) => (
                    <TableRow key={supplement.id}>
                      <TableCell className="font-medium">{supplement.supplementNumber}</TableCell>
                      <TableCell>
                        <Link href={`/contracts/${supplement.contractId}`} className="text-blue-600 hover:underline">
                          {getContractInfo(supplement.contractId)}
                        </Link>
                      </TableCell>
                      <TableCell>{supplement.description}</TableCell>
                      <TableCell>{new Date(supplement.effectiveDate).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(supplement.status)}</TableCell>
                      <TableCell>{new Date(supplement.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {hasPermission('editor') && (
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(supplement)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {hasPermission('manager') && (
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(supplement.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
