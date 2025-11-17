import { Request, Response } from 'express';
import Contract from '../models/Contract.js';
import { authenticate } from '../middleware/auth.js';

interface AuthRequest extends Request {
  user?: any;
}

// Get all contracts for the user or all if admin
export const getContracts = async (req: AuthRequest, res: Response) => {
  try {
    const query = req.user?.role === 'admin' ? {} : { createdBy: req.user?.id };
    const contracts = await Contract.find(query);
    res.json(contracts);
  } catch (error) {
    res.status(500).send('Error fetching contracts');
  }
};

// Get a single contract
export const getContract = async (req: AuthRequest, res: Response) => {
  try {
    const query = req.user?.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, createdBy: req.user?.id };
    const contract = await Contract.findOne(query);
    if (!contract) return res.status(404).send('Contract not found');
    res.json(contract);
  } catch (error) {
    res.status(500).send('Error fetching contract');
  }
};

// Create a new contract
export const createContract = async (req: AuthRequest, res: Response) => {
  try {
    const { title, parties, object, startDate, endDate, amount, type } = req.body;
    const contract = new Contract({
      title,
      parties,
      object,
      startDate,
      endDate,
      amount,
      type,
      createdBy: req.user?.id,
      history: [{ action: 'created', details: 'Contract created' }]
    });
    await contract.save();
    res.status(201).json(contract);
  } catch (error) {
    res.status(400).send('Error creating contract');
  }
};

// Update a contract
export const updateContract = async (req: AuthRequest, res: Response) => {
  try {
    const query = req.user?.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, createdBy: req.user?.id };
    const contract = await Contract.findOne(query);
    if (!contract) return res.status(404).send('Contract not found');

    const updates = req.body;
    Object.assign(contract, updates);
    contract.history.push({ action: 'updated', details: JSON.stringify(updates) });
    await contract.save();
    res.json(contract);
  } catch (error) {
    res.status(400).send('Error updating contract');
  }
};

// Delete a contract
export const deleteContract = async (req: AuthRequest, res: Response) => {
  try {
    const query = req.user?.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, createdBy: req.user?.id };
    const contract = await Contract.findOneAndDelete(query);
    if (!contract) return res.status(404).send('Contract not found');
    res.send('Contract deleted');
  } catch (error) {
    res.status(500).send('Error deleting contract');
  }
};

// Search and filter contracts
export const searchContracts = async (req: AuthRequest, res: Response) => {
  try {
    const { status, type, party } = req.query;
    const query: any = req.user?.role === 'admin' ? {} : { createdBy: req.user?.id };
    if (status) query.status = status;
    if (type) query.type = type;
    if (party) query.parties = { $in: [party] };
    const contracts = await Contract.find(query);
    res.json(contracts);
  } catch (error) {
    res.status(500).send('Error searching contracts');
  }
};