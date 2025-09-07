'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Zap, Clock, Shield, Rocket } from 'lucide-react';

type GenerationMode = 'instant' | 'template' | 'fast' | 'streaming' | 'standard';

export default function OptimizedContractForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [generationMode, setGenerationMode] = useState<GenerationMode>('instant');
  const [prompt, setPrompt] = useState('');
  const [contractName, setContractName] = useState('');
  const [showLoadingSkeleton, setShowLoadingSkeleton] = useState(false);

  const generationModes = [
    {
      id: 'instant' as GenerationMode,
      name: 'Instant',
      description: 'Lightning fast - No AI needed',
      icon: Rocket,
      color: 'bg-emerald-500',
      speed: '<1 second',
    },
    {
      id: 'template' as GenerationMode,
      name: 'Template',
      description: 'AI-powered template filling',
      icon: Zap,
      color: 'bg-green-500',
      speed: '~2-3 seconds',
    },
    {
      id: 'fast' as GenerationMode,
      name: 'Fast',
      description: 'Optimized AI generation',
      icon: Clock,
      color: 'bg-blue-500',
      speed: '~5-8 seconds',
    },
    {
      id: 'streaming' as GenerationMode,
      name: 'Streaming',
      description: 'Real-time generation with progress',
      icon: FileText,
      color: 'bg-purple-500',
      speed: '~8-12 seconds',
    },
    {
      id: 'standard' as GenerationMode,
      name: 'Standard',
      description: 'Full quality, comprehensive generation',
      icon: Shield,
      color: 'bg-orange-500',
      speed: '~10-15 seconds',
    },
  ];

  const getApiEndpoint = (mode: GenerationMode) => {
    switch (mode) {
      case 'instant':
        return '/api/generate-contract-instant';
      case 'template':
        return '/api/generate-contract-template';
      case 'fast':
        return '/api/generate-contract-fast';
      case 'streaming':
        return '/api/generate-contract-stream';
      default:
        return process.env.NODE_ENV === 'development'
          ? '/api/generate-contract-dev'
          : '/api/generate-contract';
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || !contractName.trim()) {
      alert('Please fill in both the contract description and name.');
      return;
    }

    setLoading(true);
    setShowLoadingSkeleton(true);

    try {
      if (generationMode === 'streaming') {
        await handleStreamingGeneration();
      } else {
        await handleStandardGeneration();
      }
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate contract. Please try again.');
    } finally {
      setLoading(false);
      setShowLoadingSkeleton(false);
    }
  };

  const handleStandardGeneration = async () => {
    const apiEndpoint = getApiEndpoint(generationMode);

    const res = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || `HTTP ${res.status}`);
    }

    if (!data.contract) {
      throw new Error('No contract content received');
    }

    await saveContract(data.contract);
  };

  const handleStreamingGeneration = async () => {
    const response = await fetch('/api/generate-contract-stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error('Failed to start streaming generation');
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    let contractContent = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                contractContent += data.content;
                // You could update UI here to show progress
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    if (contractContent) {
      await saveContract(contractContent);
    } else {
      throw new Error('No contract content received from stream');
    }
  };

  const saveContract = async (contract: string) => {
    if (process.env.NODE_ENV === 'development') {
      // Development: Use localStorage
      const contractId = 'contract-' + Date.now();
      localStorage.setItem(
        `dev-contract-${contractId}`,
        JSON.stringify({
          title: contractName,
          type: 'Service Agreement',
          content: contract,
          createdAt: new Date().toISOString(),
        })
      );
      localStorage.setItem(`dev-contract-${contractId}-prompt`, prompt);
      router.push(`/contract/${contractId}`);
    } else {
      // Production: Save to Supabase
      const saveResponse = await fetch('/api/contracts/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: contractName,
          content: contract,
          prompt: prompt,
        }),
      });

      const saveData = await saveResponse.json();

      if (!saveResponse.ok) {
        throw new Error(saveData.error || 'Failed to save contract');
      }

      router.push(`/contract/${saveData.contract.id}`);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Generate Contract
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Generation Mode Selection */}
          <div className="space-y-3">
            <Label className="heading-4">Generation Speed</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {generationModes.map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setGenerationMode(mode.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      generationMode === mode.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full ${mode.color} flex items-center justify-center`}
                      >
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{mode.name}</div>
                        <div className="ui-text text-muted-foreground">{mode.description}</div>
                        <Badge variant="secondary" className="mt-1 caption-text">
                          {mode.speed}
                        </Badge>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contract Name */}
          <div className="space-y-2">
            <Label htmlFor="contractName">Contract Name</Label>
            <Input
              id="contractName"
              placeholder="e.g., Website Development Agreement"
              value={contractName}
              onChange={(e) => setContractName(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Contract Description */}
          <div className="space-y-2">
            <Label htmlFor="prompt">Contract Description</Label>
            <Textarea
              id="prompt"
              placeholder="Describe the services, deliverables, timeline, and any specific requirements..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={6}
              disabled={loading}
            />
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim() || !contractName.trim()}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                <span>Generating Contract...</span>
              </div>
            ) : (
              `Generate ${generationModes.find((m) => m.id === generationMode)?.name} Contract`
            )}
          </Button>

          {/* Loading Skeleton */}
          {showLoadingSkeleton && (
            <div className="mt-6 space-y-4">
              <div className="text-center text-sm text-muted-foreground">
                {generationMode === 'instant'
                  ? 'Preparing your contract...'
                  : 'AI is generating your contract...'}
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-3/5" />
                <Skeleton className="h-4 w-2/5" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
