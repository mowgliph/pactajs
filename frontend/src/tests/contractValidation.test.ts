import { Contract } from '../db/indexedDB';

export const validateContract = (contract: Partial<Contract>): string[] => {
  const errors: string[] = [];
  if (!contract.title || contract.title.trim() === '') errors.push('Title is required');
  if (!contract.parties || contract.parties.length === 0) errors.push('At least one party is required');
  if (!contract.object || contract.object.trim() === '') errors.push('Object is required');
  if (!contract.startDate) errors.push('Start date is required');
  if (!contract.endDate) errors.push('End date is required');
  if (contract.startDate && contract.endDate && new Date(contract.startDate) > new Date(contract.endDate)) {
    errors.push('End date must be after start date');
  }
  if (!contract.amount || contract.amount <= 0) errors.push('Amount must be positive');
  if (!contract.type) errors.push('Type is required');
  return errors;
};

describe('Contract Validation', () => {
  it('should validate a correct contract', () => {
    const contract: Partial<Contract> = {
      title: 'Test Contract',
      parties: ['Party A', 'Party B'],
      object: 'Service provision',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      amount: 1000,
      type: 'service'
    };
    expect(validateContract(contract)).toEqual([]);
  });

  it('should return errors for invalid contract', () => {
    const contract: Partial<Contract> = {
      title: '',
      parties: [],
      object: '',
      startDate: '2023-12-31',
      endDate: '2023-01-01',
      amount: -100,
      type: ''
    };
    const errors = validateContract(contract);
    expect(errors).toContain('Title is required');
    expect(errors).toContain('At least one party is required');
    expect(errors).toContain('Object is required');
    expect(errors).toContain('End date must be after start date');
    expect(errors).toContain('Amount must be positive');
    expect(errors).toContain('Type is required');
  });
});