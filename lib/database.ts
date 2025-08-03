import { getSupabaseClient } from './supabase';
import type { Database } from './supabase';

export type Contract = Database['public']['Tables']['contracts']['Row'];
export type ContractInsert = Database['public']['Tables']['contracts']['Insert'];
export type ContractUpdate = Database['public']['Tables']['contracts']['Update'];

export class ContractService {
  static async createContract(
    data: Omit<ContractInsert, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Contract> {
    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) {
      throw new Error('Supabase not configured');
    }

    const { data: contract, error } = await supabaseClient
      .from('contracts')
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create contract: ${error.message}`);
    }

    return contract as Contract;
  }

  static async getContract(id: string): Promise<Contract | null> {
    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) {
      throw new Error('Supabase not configured');
    }

    const { data: contract, error } = await supabaseClient
      .from('contracts')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to get contract: ${error.message}`);
    }

    return contract as Contract | null;
  }

  static async updateContract(id: string, data: Partial<ContractUpdate>): Promise<Contract> {
    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) {
      throw new Error('Supabase not configured');
    }

    const { data: contract, error } = await supabaseClient
      .from('contracts')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update contract: ${error.message}`);
    }

    return contract as Contract;
  }

  static async deleteContract(id: string): Promise<void> {
    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) {
      throw new Error('Supabase not configured');
    }

    const { error } = await supabaseClient.from('contracts').delete().eq('id', id);

    if (error) {
      throw new Error(`Failed to delete contract: ${error.message}`);
    }
  }

  static async getUserContracts(userId: string): Promise<Contract[]> {
    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) {
      throw new Error('Supabase not configured');
    }

    const { data: contracts, error } = await supabaseClient
      .from('contracts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to get user contracts: ${error.message}`);
    }

    return (contracts as Contract[]) || [];
  }
}

// Fallback to localStorage for development
export class LocalStorageService {
  private static STORAGE_KEY = 'contracts';

  static saveContracts(contracts: Contract[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(contracts));
    }
  }

  static getContracts(): Contract[] {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  }

  static addContract(contract: Contract): void {
    const contracts = this.getContracts();
    contracts.unshift(contract);
    this.saveContracts(contracts);
  }

  static updateContract(id: string, updatedContract: Partial<Contract>): void {
    const contracts = this.getContracts();
    const index = contracts.findIndex((c) => c.id === id);
    if (index !== -1) {
      contracts[index] = { ...contracts[index], ...updatedContract };
      this.saveContracts(contracts);
    }
  }

  static deleteContract(id: string): void {
    const contracts = this.getContracts();
    const filtered = contracts.filter((c) => c.id !== id);
    this.saveContracts(filtered);
  }
}
