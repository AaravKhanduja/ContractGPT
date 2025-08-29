'use client';

import { useEffect, useState } from 'react';
import ContractCard from './ContractCard';
import ContractStats from './ContractStats';
import EmptyState from './EmptyState';
import { SavedContract } from './Types';
import { generateContractPDF } from '@/utils/pdf-utils';

export default function ContractsClient() {
  const [contracts, setContracts] = useState<SavedContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isDevMode = process.env.NODE_ENV === 'development';

  useEffect(() => {
    const loadContracts = async () => {
      if (isDevMode) {
        // Development mode: Load from localStorage
        const loadedContracts: SavedContract[] = [];

        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('dev-contract-') && !key.includes('-prompt')) {
            const value = localStorage.getItem(key);

            if (value) {
              try {
                const contract = JSON.parse(value);
                if (contract && typeof contract === 'object') {
                  loadedContracts.push({
                    id: key.replace('dev-contract-', ''),
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
      } else {
        // Production mode: Fetch from Supabase
        try {
          const response = await fetch('/api/contracts/list');
          const data = await response.json();

          if (response.ok && data.contracts) {
            const formattedContracts: SavedContract[] = data.contracts.map(
              (contract: {
                id: string;
                title: string;
                created_at: string;
                updated_at: string;
              }) => ({
                id: contract.id,
                title: contract.title,
                type: 'Service Agreement',
                content: '', // We don't load full content in the list view
                createdAt: contract.created_at,
                updatedAt: contract.updated_at,
              })
            );
            setContracts(formattedContracts);
          }
        } catch (error) {
          setError('Failed to load contracts');
        }
      }
      setLoading(false);
    };

    loadContracts();
  }, [isDevMode]);

  const handleDelete = async (contractId: string) => {
    if (!confirm('Are you sure you want to delete this contract?')) {
      return;
    }

    if (isDevMode) {
      // Development: Remove from localStorage only
      localStorage.removeItem(`dev-contract-${contractId}`);
      localStorage.removeItem(`dev-contract-${contractId}-prompt`);
      setContracts(contracts.filter((c) => c.id !== contractId));
    } else {
      // Production: Delete from Supabase only
      try {
        const response = await fetch('/api/contracts/delete', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contractId }),
        });

        if (response.ok) {
          setContracts(contracts.filter((c) => c.id !== contractId));
        }
      } catch (error) {
        // Handle error silently for now
      }
    }
  };

  const handleDownload = async (contract: SavedContract) => {
    if (isDevMode) {
      // Development: Use localStorage data
      generateContractPDF({
        title: contract.title,
        type: contract.type,
        content: contract.content,
        prompt: contract.prompt,
      });
    } else {
      // Production: Fetch full contract content from Supabase
      try {
        const response = await fetch(`/api/contracts/${contract.id}`);
        const data = await response.json();

        if (response.ok && data.contract) {
          generateContractPDF({
            title: data.contract.title,
            type: 'Service Agreement',
            content: data.contract.content,
            prompt: data.contract.prompt,
          });
        }
      } catch (error) {
        console.error('Failed to fetch contract for download:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading contracts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
