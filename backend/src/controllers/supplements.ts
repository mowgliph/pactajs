import { Request, Response } from 'express';
import { AppDataSource } from '../data-source.js';
import { Contract } from '../entities/Contract.js';
import { ContractSupplement } from '../entities/ContractSupplement.js';
import { ContractHistory } from '../entities/ContractHistory.js';
import { createNotification } from './notifications.js';

interface AuthRequest extends Request {
  user?: any;
}

// Create a supplement for a contract
export const createSupplement = async (req: AuthRequest, res: Response) => {
  try {
    const { contractId } = req.params;
    const { modifiedFields, effectiveDate, reason } = req.body;

    const contractRepository = AppDataSource.getRepository(Contract);
    const supplementRepository = AppDataSource.getRepository(ContractSupplement);
    const historyRepository = AppDataSource.getRepository(ContractHistory);

    const query: any = { id: contractId };
    if (req.user?.role !== 'admin') {
      query.createdById = req.user?.id;
    }

    const contract = await contractRepository.findOne({ where: query });
    if (!contract) return res.status(404).send('Contract not found');

    // Validate modifiedFields
    if (!modifiedFields || !Array.isArray(modifiedFields) || modifiedFields.length === 0) {
      return res.status(400).send('Modified fields are required');
    }

    // Apply changes to contract
    for (const change of modifiedFields) {
      if (change.field in contract) {
        (contract as any)[change.field] = change.newValue;
      }
    }

    // Create supplement entry
    const supplement = supplementRepository.create({
      contractId: contract.id,
      modifiedFields,
      effectiveDate: new Date(effectiveDate),
      reason
    });

    await supplementRepository.save(supplement);

    // Create history entry
    const history = historyRepository.create({
      contractId: contract.id,
      date: new Date(),
      action: 'supplement_added',
      details: `Supplement added: ${reason}`
    });

    await historyRepository.save(history);
    await contractRepository.save(contract);

    // Check if supplement affects expiration, trigger notification
    const endDateChanged = modifiedFields.some((f: any) => f.field === 'endDate');
    if (endDateChanged) {
      await createNotification(contract.createdById, contractId, 'contract_updated', 'Contract Updated', `Supplement added to contract "${contract.title}": ${reason}`);
    }

    res.status(201).json(supplement);
  } catch (error) {
    console.error('Error creating supplement:', error);
    res.status(400).send('Error creating supplement');
  }
};

// Get supplements for a contract
export const getSupplements = async (req: AuthRequest, res: Response) => {
  try {
    const { contractId } = req.params;
    const contractRepository = AppDataSource.getRepository(Contract);
    const supplementRepository = AppDataSource.getRepository(ContractSupplement);

    const query: any = { id: contractId };
    if (req.user?.role !== 'admin') {
      query.createdById = req.user?.id;
    }

    const contract = await contractRepository.findOne({ where: query });
    if (!contract) return res.status(404).send('Contract not found');

    const supplements = await supplementRepository.find({
      where: { contractId },
      order: { createdAt: 'DESC' }
    });

    res.json(supplements);
  } catch (error) {
    console.error('Error fetching supplements:', error);
    res.status(500).send('Error fetching supplements');
  }
};

// Search supplements across contracts (by date, field, etc.)
export const searchSupplements = async (req: AuthRequest, res: Response) => {
  try {
    const { date, field } = req.query;
    const contractRepository = AppDataSource.getRepository(Contract);
    const supplementRepository = AppDataSource.getRepository(ContractSupplement);

    const contractQuery: any = {};
    if (req.user?.role !== 'admin') {
      contractQuery.createdById = req.user?.id;
    }

    const contracts = await contractRepository.find({ where: contractQuery });
    const contractIds = contracts.map(c => c.id);

    if (contractIds.length === 0) {
      return res.json([]);
    }

    const supplements = await supplementRepository
      .createQueryBuilder('supplement')
      .leftJoinAndSelect('supplement.contract', 'contract')
      .where('supplement.contractId IN (:...contractIds)', { contractIds })
      .getMany();

    const filteredSupplements = supplements.filter(supp => {
      if (date && new Date(supp.effectiveDate).toDateString() !== new Date(date as string).toDateString()) return false;
      if (field && !supp.modifiedFields.some((f: any) => f.field === field)) return false;
      return true;
    });

    const result = filteredSupplements.map(s => ({
      ...s,
      contractId: s.contractId,
      contractTitle: s.contract.title
    }));

    res.json(result);
  } catch (error) {
    console.error('Error searching supplements:', error);
    res.status(500).send('Error searching supplements');
  }
};