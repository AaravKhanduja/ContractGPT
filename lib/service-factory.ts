import { env, isSupabaseConfigured } from './env';
import { ContractService } from './database';
import { LocalStorageService } from './database';

export interface IContractService {
  createContract(data: Record<string, unknown>): Promise<Record<string, unknown>>;
  getContract(id: string): Promise<Record<string, unknown> | null>;
  updateContract(id: string, data: Record<string, unknown>): Promise<Record<string, unknown>>;
  deleteContract(id: string): Promise<void>;
  getUserContracts(userId: string): Promise<Record<string, unknown>[]>;
}

class SupabaseContractService implements IContractService {
  async createContract(data: Record<string, unknown>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ContractService.createContract(data as any);
  }

  async getContract(id: string) {
    return ContractService.getContract(id);
  }

  async updateContract(id: string, data: Record<string, unknown>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ContractService.updateContract(id, data as any);
  }

  async deleteContract(id: string) {
    return ContractService.deleteContract(id);
  }

  async getUserContracts(userId: string) {
    return ContractService.getUserContracts(userId);
  }
}

class LocalStorageContractService implements IContractService {
  async createContract(data: Record<string, unknown>) {
    const contract = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    LocalStorageService.addContract(contract as any);
    return contract;
  }

  async getContract(id: string) {
    const contracts = LocalStorageService.getContracts();
    return contracts.find((c) => c.id === id) || null;
  }

  async updateContract(id: string, data: Record<string, unknown>) {
    const contract = await this.getContract(id);
    if (!contract) {
      throw new Error('Contract not found');
    }
    const updatedContract = { ...contract, ...data, updated_at: new Date().toISOString() };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    LocalStorageService.updateContract(id, updatedContract as any);
    return updatedContract;
  }

  async deleteContract(id: string) {
    LocalStorageService.deleteContract(id);
  }

  async getUserContracts() {
    // In localStorage mode, we don't have user separation
    // This is a simplified version for development
    return LocalStorageService.getContracts();
  }
}

export function getContractService(): IContractService {
  const isProduction = env.NODE_ENV === 'production';
  const hasSupabaseConfig = isSupabaseConfigured();

  if (isProduction && hasSupabaseConfig) {
    return new SupabaseContractService();
  }

  // Fallback to localStorage for development or when Supabase is not configured
  return new LocalStorageContractService();
}
