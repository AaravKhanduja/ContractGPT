import { getSupabaseClient } from './supabase';
import { getContractService } from './service-factory';
import type { Contract, ContractInsert, ContractUpdate } from './database';

export interface ContractWithUser extends Contract {
  user_id: string;
}

export class ContractService {
  private static getService() {
    return getContractService();
  }

  static async createContract(
    data: Omit<ContractInsert, 'id' | 'created_at' | 'updated_at' | 'user_id'>,
    userId: string
  ): Promise<Contract> {
    const service = this.getService();
    const contractData = {
      ...data,
      user_id: userId,
    };

    const result = await service.createContract(contractData);
    return result as unknown as Contract;
  }

  static async getContract(id: string, userId?: string): Promise<Contract | null> {
    const service = this.getService();
    const contract = await service.getContract(id);

    if (!contract) return null;

    // If userId is provided, ensure the contract belongs to the user
    if (userId && typeof contract === 'object' && contract !== null && 'user_id' in contract) {
      const contractWithUser = contract as { user_id: string };
      if (contractWithUser.user_id !== userId) {
        return null;
      }
    }

    return contract as unknown as Contract;
  }

  static async updateContract(
    id: string,
    data: Partial<ContractUpdate>,
    userId?: string
  ): Promise<Contract> {
    const service = this.getService();

    // If userId is provided, verify ownership first
    if (userId) {
      const existingContract = await this.getContract(id, userId);
      if (!existingContract) {
        throw new Error('Contract not found or access denied');
      }
    }

    const result = await service.updateContract(id, data);
    return result as unknown as Contract;
  }

  static async deleteContract(id: string, userId?: string): Promise<void> {
    const service = this.getService();

    // If userId is provided, verify ownership first
    if (userId) {
      const existingContract = await this.getContract(id, userId);
      if (!existingContract) {
        throw new Error('Contract not found or access denied');
      }
    }

    await service.deleteContract(id);
  }

  static async getUserContracts(userId: string): Promise<Contract[]> {
    const service = this.getService();
    const contracts = await service.getUserContracts(userId);
    return contracts as unknown as Contract[];
  }

  static async getAllContracts(): Promise<Contract[]> {
    const service = this.getService();
    // For localStorage fallback, we don't have user separation
    const contracts = await service.getUserContracts('');
    return contracts as unknown as Contract[];
  }
}
