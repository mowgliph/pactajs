import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Contract } from '../entities/Contract';
import { ContractHistory } from '../entities/ContractHistory';
import { User } from '../entities/User';
import { FindOptionsWhere } from 'typeorm';

interface AuthRequest extends Request {
  user?: any;
}

// Get all contracts for the user or all if admin
export const getContracts = async (req: AuthRequest, res: Response) => {
  try {
    const contractRepository = AppDataSource.getRepository(Contract);
    const where: FindOptionsWhere<Contract> = req.user?.role === 'admin' ? {} : { createdById: req.user?.id };
    
    const contracts = await contractRepository.find({
        where,
        relations: ['history', 'supplements', 'documents'],
        order: { createdAt: 'DESC' }
    });
    res.json(contracts);
  } catch (error) {
    console.error('Error fetching contracts:', error);
    res.status(500).send('Error fetching contracts');
  }
};

// Get a single contract
export const getContract = async (req: AuthRequest, res: Response) => {
  try {
    const contractRepository = AppDataSource.getRepository(Contract);
    const where: FindOptionsWhere<Contract> = req.user?.role === 'admin' 
        ? { id: req.params.id } 
        : { id: req.params.id, createdById: req.user?.id };
        
    const contract = await contractRepository.findOne({
        where,
        relations: ['history', 'supplements', 'documents', 'createdBy']
    });
    
    if (!contract) return res.status(404).send('Contract not found');
    res.json(contract);
  } catch (error) {
    console.error('Error fetching contract:', error);
    res.status(500).send('Error fetching contract');
  }
};

// Create a new contract
export const createContract = async (req: AuthRequest, res: Response) => {
  try {
    const { title, parties, object, startDate, endDate, amount, type } = req.body;
    const contractRepository = AppDataSource.getRepository(Contract);
    const historyRepository = AppDataSource.getRepository(ContractHistory);
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOneBy({ id: req.user?.id });
    if (!user) return res.status(400).send('User not found');

    const contract = new Contract();
    contract.title = title;
    contract.parties = parties;
    contract.object = object;
    contract.startDate = new Date(startDate);
    contract.endDate = new Date(endDate);
    contract.amount = amount;
    contract.type = type;
    contract.createdBy = user;
    
    await contractRepository.save(contract);

    // Create initial history
    const history = new ContractHistory();
    history.contract = contract;
    history.action = 'created';
    history.details = 'Contract created';
    history.date = new Date();
    
    await historyRepository.save(history);
    
    // Fetch complete contract to return
    const savedContract = await contractRepository.findOne({
        where: { id: contract.id },
        relations: ['history']
    });

    res.status(201).json(savedContract);
  } catch (error) {
    console.error('Error creating contract:', error);
    res.status(400).send('Error creating contract');
  }
};

// Update a contract
export const updateContract = async (req: AuthRequest, res: Response) => {
  try {
    const contractRepository = AppDataSource.getRepository(Contract);
    const historyRepository = AppDataSource.getRepository(ContractHistory);

    const where: FindOptionsWhere<Contract> = req.user?.role === 'admin' 
        ? { id: req.params.id } 
        : { id: req.params.id, createdById: req.user?.id };

    const contract = await contractRepository.findOne({ where });
    if (!contract) return res.status(404).send('Contract not found');

    const updates = req.body;
    contractRepository.merge(contract, updates);
    
    await contractRepository.save(contract);

    const history = new ContractHistory();
    history.contract = contract;
    history.action = 'updated';
    history.details = JSON.stringify(updates);
    history.date = new Date();
    await historyRepository.save(history);

    const updatedContract = await contractRepository.findOne({
        where: { id: contract.id },
        relations: ['history']
    });

    res.json(updatedContract);
  } catch (error) {
    console.error('Error updating contract:', error);
    res.status(400).send('Error updating contract');
  }
};

// Delete a contract
export const deleteContract = async (req: AuthRequest, res: Response) => {
  try {
    const contractRepository = AppDataSource.getRepository(Contract);
    const where: FindOptionsWhere<Contract> = req.user?.role === 'admin' 
        ? { id: req.params.id } 
        : { id: req.params.id, createdById: req.user?.id };

    const contract = await contractRepository.findOne({ where });
    if (!contract) return res.status(404).send('Contract not found');

    await contractRepository.remove(contract);
    res.send('Contract deleted');
  } catch (error) {
    console.error('Error deleting contract:', error);
    res.status(500).send('Error deleting contract');
  }
};

// Search and filter contracts
export const searchContracts = async (req: AuthRequest, res: Response) => {
  try {
    const { status, type, party } = req.query;
    const contractRepository = AppDataSource.getRepository(Contract);
    
    const queryBuilder = contractRepository.createQueryBuilder("contract");

    if (req.user?.role !== 'admin') {
        queryBuilder.where("contract.createdById = :userId", { userId: req.user?.id });
    }

    if (status) {
        queryBuilder.andWhere("contract.status = :status", { status });
    }
    if (type) {
        queryBuilder.andWhere("contract.type = :type", { type });
    }
    if (party) {
        // Using JSON_CONTAINS for MariaDB/MySQL
        // Note: The value must be a valid JSON string, so we stringify the party string.
        queryBuilder.andWhere(`JSON_CONTAINS(contract.parties, :party)`, { party: JSON.stringify(party) });
    }

    const contracts = await queryBuilder.getMany();
    res.json(contracts);
  } catch (error) {
    console.error('Error searching contracts:', error);
    res.status(500).send('Error searching contracts');
  }
};