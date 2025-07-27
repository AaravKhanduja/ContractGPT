'use client';

import Navigation from '@/components/navigation';
import ContractForm from '@/components/forms/contract-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NewContractPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      <Navigation isAuthenticated={true} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" className="mb-4 hover:bg-accent" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Generate New Contract</h1>
            </div>

            <p className="text-muted-foreground text-lg">
              Paste your client's request below and let AI transform it into a professional
              contract.
            </p>
          </div>

          {/* Main Form UI */}
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Left: Input + Preview */}
            <div className="lg:col-span-4">
              <ContractForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
