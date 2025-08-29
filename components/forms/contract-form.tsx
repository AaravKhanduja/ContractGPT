'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PromptInput from './prompt-input';

export default function ContractForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (input: string, contractName: string) => {
    setLoading(true);

    try {
      // Use development API (Ollama) in development, production API (OpenAI) in production
      const apiEndpoint =
        process.env.NODE_ENV === 'development'
          ? '/api/generate-contract-dev'
          : '/api/generate-contract';

      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      if (!data.contract) {
        throw new Error('No contract content received');
      }

      if (process.env.NODE_ENV === 'development') {
        // Development: Use localStorage only
        const contractId = 'contract-' + Date.now();
        localStorage.setItem(
          `dev-contract-${contractId}`,
          JSON.stringify({
            title: contractName,
            type: 'Service Agreement',
            content: data.contract,
            createdAt: new Date().toISOString(),
          })
        );
        localStorage.setItem(`dev-contract-${contractId}-prompt`, input);
        router.push(`/contract/${contractId}`);
      } else {
        // Production: Save to Supabase only (no localStorage)
        const saveResponse = await fetch('/api/contracts/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: contractName,
            content: data.contract,
            prompt: input,
          }),
        });

        const saveData = await saveResponse.json();

        if (!saveResponse.ok) {
          throw new Error(saveData.error || 'Failed to save contract');
        }

        router.push(`/contract/${saveData.contract.id}`);
      }
    } catch (error) {
      alert('Failed to generate contract. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PromptInput onGenerate={handleGenerate} loading={loading} />
    </div>
  );
}
