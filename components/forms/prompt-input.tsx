'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PromptInputProps {
  onGenerate: (input: string, contractName: string) => void;
  loading: boolean;
}

const examplePrompts = [
  'I need a website for my bakery with online ordering, payment integration, and a blog. Budget is $5000, timeline is 6 weeks.',
  'Design a mobile app for fitness tracking with social features. I want it done in 3 months for $8000.',
  'Create a brand identity package including logo, business cards, and website. Budget flexible, need it ASAP.',
];

export default function PromptInput({ onGenerate, loading }: PromptInputProps) {
  const [input, setInput] = useState('');
  const [contractName, setContractName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onGenerate(input.trim(), contractName.trim() || 'Untitled Contract');
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-primary" />
          <span>Client Request</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contract-name" className="label-text">
              Contract Name
            </Label>
            <Input
              id="contract-name"
              placeholder="e.g., Website Development Contract, Logo Design Agreement..."
              value={contractName}
              onChange={(e) => setContractName(e.target.value)}
              className="ui-text-large"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client-input" className="label-text">
              Paste client&apos;s message or brief
            </Label>
            <Textarea
              id="client-input"
              placeholder="e.g., I need a website for my bakery with online ordering and payment integration. My budget is around $5000 and I need it done in 6 weeks..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[150px] sm:min-h-[200px] body-base leading-relaxed resize-none"
              disabled={loading}
            />
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2 ui-text text-muted-foreground">
              <span>Be as detailed as possible for best results</span>
              <span>{input.length} characters</span>
            </div>
          </div>

          <Button type="submit" disabled={!input.trim() || loading}>
            {loading ? 'Generating…' : 'Generate Contract'}
          </Button>
        </form>

        {loading && (
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center space-x-2 text-muted-foreground mb-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            </div>
            <p className="ui-text">
              AI is analyzing your request and generating a professional contract...
            </p>
          </div>
        )}

        <div className="space-y-3">
          <h4 className="font-medium ui-text">Quick Examples:</h4>
          <div className="space-y-2">
            {examplePrompts.map((prompt, index) => (
              <div key={index} className="border-b border-border last:border-b-0 pb-3 last:pb-0">
                <button
                  type="button"
                  className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setInput(prompt)}
                  disabled={loading}
                >
                  <Badge variant="secondary" className="mb-2 caption-text">
                    Example {index + 1}
                  </Badge>
                  <p className="ui-text text-muted-foreground leading-relaxed">
                    {prompt.length > 120 ? `${prompt.substring(0, 120)}...` : prompt}
                  </p>
                </button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
