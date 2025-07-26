'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navigation from '@/components/navigation';
import ContractPrompt from '@/components/contract/ContractPrompt';
import ContractViewer from '@/components/contract/ContractViewer';

export default function ContractDetailPage() {
  const params = useParams();
  const [contract, setContract] = useState<{ title: string; type: string; content: string } | null>(
    null
  );
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    const id = params.id as string;
    const data = localStorage.getItem(`contract-${id}`);
    const promptData = localStorage.getItem(`contract-${id}-prompt`);
    if (data) setContract(JSON.parse(data));
    if (promptData) setPrompt(promptData);
  }, [params.id]);

  if (!contract) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading contract...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation isAuthenticated={true} />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <ContractPrompt prompt={prompt} />
        <ContractViewer content={contract.content} />
      </main>
    </div>
  );
}
