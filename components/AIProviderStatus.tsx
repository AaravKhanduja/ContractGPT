'use client';

import { useEffect, useState } from 'react';

export default function AIProviderStatus() {
  const [provider, setProvider] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkProvider = async () => {
      try {
        const response = await fetch('/api/ai-status');
        const data = await response.json();
        setProvider(data.provider);
      } catch {
        setProvider('unknown');
      } finally {
        setIsLoading(false);
      }
    };

    checkProvider();
  }, []);

  if (isLoading) {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
        Loading AI provider...
      </div>
    );
  }

  const getProviderInfo = (provider: string) => {
    switch (provider) {
      case 'ollama':
        return {
          name: 'Ollama',
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: '🟢',
          description: 'Local (Free)',
        };
      case 'openai':
        return {
          name: 'OpenAI',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: '🔵',
          description: 'Cloud',
        };
      case 'anthropic':
        return {
          name: 'Anthropic',
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: '🟣',
          description: 'Cloud',
        };
      case 'mock':
        return {
          name: 'Mock',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: '🟡',
          description: 'Test Mode',
        };
      default:
        return {
          name: 'Unknown',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: '❓',
          description: 'Unknown',
        };
    }
  };

  const info = getProviderInfo(provider);

  return (
    <div
      className={`fixed bottom-4 right-4 ${info.color} border px-3 py-1 rounded-full text-xs font-medium shadow-sm`}
    >
      {info.icon} {info.name} - {info.description}
    </div>
  );
}
