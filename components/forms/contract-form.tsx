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

      const contractId = 'contract-' + Date.now();
      const envPrefix = process.env.NODE_ENV === 'development' ? 'dev-' : 'prod-';

      localStorage.setItem(
        `${envPrefix}contract-${contractId}`,
        JSON.stringify({
          title: contractName,
          type: 'Service Agreement',
          content: data.contract,
        })
      );
      localStorage.setItem(`${envPrefix}contract-${contractId}-prompt`, input);

      router.push(`/contract/${contractId}`);
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
