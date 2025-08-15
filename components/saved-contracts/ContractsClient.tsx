'use client';

import { useEffect, useState } from 'react';
import ContractCard from './ContractCard';
import ContractStats from './ContractStats';
import EmptyState from './EmptyState';
import { SavedContract } from './Types';
import { generateContractPDF } from '@/utils/pdf-utils';

export default function ContractsClient() {
  const [contracts, setContracts] = useState<SavedContract[]>([]);

  useEffect(() => {
    const loadedContracts: SavedContract[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('contract-') && !key.includes('-prompt')) {
        const value = localStorage.getItem(key);
        const promptData = localStorage.getItem(`${key}-prompt`);

        if (value) {
          try {
            const contract = JSON.parse(value);
            if (contract && typeof contract === 'object') {
              loadedContracts.push({
                id: key.replace('contract-', ''),
                ...contract,
              });
            }
          } catch (error) {
            // Invalid JSON, removing from localStorage
            localStorage.removeItem(key);
          }
        }
      }
    }

    loadedContracts.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setContracts(loadedContracts);
  }, []);

  const handleDelete = (contractId: string) => {
    if (confirm('Are you sure you want to delete this contract?')) {
      localStorage.removeItem(`contract-${contractId}`);
      localStorage.removeItem(`contract-${contractId}-prompt`);
      setContracts(contracts.filter((c) => c.id !== contractId));
    }
  };

  const handleDownload = (contract: SavedContract) => {
    generateContractPDF({
      title: contract.title,
      type: contract.type,
      content: contract.content,
      prompt: contract.prompt,
    });
  };

  if (contracts.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {contracts.map((contract) => (
          <ContractCard
            key={contract.id}
            contract={contract}
            onDelete={() => handleDelete(contract.id)}
            onDownload={() => handleDownload(contract)}
          />
        ))}
      </div>
      <ContractStats contracts={contracts} />
    </>
  );
}
