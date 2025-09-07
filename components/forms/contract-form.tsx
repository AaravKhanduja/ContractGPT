'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PromptInput from './prompt-input';
import StreamingOverlay from '@/components/ui/streaming-overlay';

export default function ContractForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [streamingProgress, setStreamingProgress] = useState({
    stage: '',
    progress: 0,
    content: '',
  });

  const handleGenerate = async (input: string, contractName: string) => {
    setLoading(true);
    setStreamingProgress({
      stage: 'Initializing AI...',
      progress: 0,
      content: '',
    });
    console.log('Starting generation with streaming progress...');

    try {
      // Use streaming mode for real-time generation
      const response = await fetch('/api/generate-contract-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to start streaming generation');
      }

      setStreamingProgress({
        stage: 'AI is analyzing your request...',
        progress: 10,
        content: '',
      });

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      let contractContent = '';
      let wordCount = 0;

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
                  wordCount += data.content.split(' ').length;

                  // Update progress based on content
                  let stage = 'Generating contract...';
                  let progress = 20;

                  if (contractContent.includes('# ')) {
                    stage = 'Creating contract title...';
                    progress = 30;
                  }
                  if (contractContent.includes('## Parties')) {
                    stage = 'Defining parties...';
                    progress = 40;
                  }
                  if (contractContent.includes('## Services')) {
                    stage = 'Outlining services...';
                    progress = 50;
                  }
                  if (contractContent.includes('## Payment')) {
                    stage = 'Setting payment terms...';
                    progress = 60;
                  }
                  if (contractContent.includes('## Timeline')) {
                    stage = 'Establishing timeline...';
                    progress = 70;
                  }
                  if (contractContent.includes('## Terms')) {
                    stage = 'Adding legal terms...';
                    progress = 80;
                  }
                  if (wordCount > 200) {
                    stage = 'Finalizing contract...';
                    progress = 90;
                  }

                  setStreamingProgress({
                    stage,
                    progress,
                    content: contractContent,
                  });
                  console.log(`Progress: ${progress}% - ${stage}`);
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

      setStreamingProgress({
        stage: 'Saving contract...',
        progress: 95,
        content: contractContent,
      });

      if (contractContent) {
        if (process.env.NODE_ENV === 'development') {
          // Development: Use localStorage only
          const contractId = 'contract-' + Date.now();
          localStorage.setItem(
            `dev-contract-${contractId}`,
            JSON.stringify({
              title: contractName,
              type: 'Service Agreement',
              content: contractContent,
              createdAt: new Date().toISOString(),
            })
          );
          localStorage.setItem(`dev-contract-${contractId}-prompt`, input);

          setStreamingProgress({
            stage: 'Contract ready!',
            progress: 100,
            content: contractContent,
          });

          // Small delay to show completion
          setTimeout(() => {
            router.push(`/contract/${contractId}`);
          }, 500);
        } else {
          // Production: Save to Supabase only (no localStorage)
          const saveResponse = await fetch('/api/contracts/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: contractName,
              content: contractContent,
              prompt: input,
            }),
          });

          const saveData = await saveResponse.json();

          if (!saveResponse.ok) {
            throw new Error(saveData.error || 'Failed to save contract');
          }

          setStreamingProgress({
            stage: 'Contract ready!',
            progress: 100,
            content: contractContent,
          });

          // Small delay to show completion
          setTimeout(() => {
            router.push(`/contract/${saveData.contract.id}`);
          }, 500);
        }
      } else {
        throw new Error('No contract content received from stream');
      }
    } catch (error) {
      console.error('Streaming generation error:', error);
      setStreamingProgress({
        stage: 'Error occurred',
        progress: 0,
        content: '',
      });
      alert('Failed to generate contract. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PromptInput
        onGenerate={handleGenerate}
        loading={loading}
        showStreamingProgress={streamingProgress.stage !== ''}
      />

      {/* Streaming Overlay */}
      {loading && (
        <StreamingOverlay
          stage={streamingProgress.stage}
          progress={streamingProgress.progress}
          content={streamingProgress.content}
        />
      )}
    </div>
  );
}
