import { Request, Response } from 'express';
import Contract from '../models/Contract.js';
import { createNotification } from './notifications.js';

interface AuthRequest extends Request {
  user?: any;
}

// Create a supplement for a contract
export const createSupplement = async (req: AuthRequest, res: Response) => {
  try {
    const { contractId } = req.params;
    const { modifiedFields, effectiveDate, reason } = req.body;

    const query = req.user?.role === 'admin' ? { _id: contractId } : { _id: contractId, createdBy: req.user?.id };
    const contract = await Contract.findOne(query);
    if (!contract) return res.status(404).send('Contract not found');

    // Validate modifiedFields
    if (!modifiedFields || !Array.isArray(modifiedFields) || modifiedFields.length === 0) {
      return res.status(400).send('Modified fields are required');
    }

    // Apply changes to contract
    for (const change of modifiedFields) {
      if (contract.hasOwnProperty(change.field)) {
        contract[change.field] = change.newValue;
      }
    }

    // Create supplement entry
    const supplement = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      modifiedFields,
      effectiveDate: new Date(effectiveDate),
      createdAt: new Date(),
      reason
    };

    contract.supplements.push(supplement);
    contract.history.push({
      action: 'supplement_added',
      details: `Supplement added: ${reason}`
    });

    await contract.save();

    // Check if supplement affects expiration, trigger notification
    const endDateChanged = modifiedFields.some((f: any) => f.field === 'endDate');
    if (endDateChanged) {
      await createNotification(contract.createdBy.toString(), contractId, 'contract_updated', 'Contract Updated', `Supplement added to contract "${contract.title}": ${reason}`);
    }

    res.status(201).json(supplement);
  } catch (error) {
    res.status(400).send('Error creating supplement');
  }
};

// Get supplements for a contract
export const getSupplements = async (req: AuthRequest, res: Response) => {
  try {
    const { contractId } = req.params;
    const query = req.user?.role === 'admin' ? { _id: contractId } : { _id: contractId, createdBy: req.user?.id };
    const contract = await Contract.findOne(query);
    if (!contract) return res.status(404).send('Contract not found');

    res.json(contract.supplements);
  } catch (error) {
    res.status(500).send('Error fetching supplements');
  }
};

// Search supplements across contracts (by date, field, etc.)
export const searchSupplements = async (req: AuthRequest, res: Response) => {
  try {
    const { date, field } = req.query;
    const query = req.user?.role === 'admin' ? {} : { createdBy: req.user?.id };
    const contracts = await Contract.find(query);

    let supplements: any[] = [];
    for (const contract of contracts) {
      const filtered = contract.supplements.filter((supp: any) => {
        if (date && new Date(supp.effectiveDate).toDateString() !== new Date(date as string).toDateString()) return false;
        if (field && !supp.modifiedFields.some((f: any) => f.field === field)) return false;
        return true;
      });
      supplements.push(...filtered.map((s: any) => ({ ...s, contractId: contract._id, contractTitle: contract.title })));
    }

    res.json(supplements);
  } catch (error) {
    res.status(500).send('Error searching supplements');
  }
};