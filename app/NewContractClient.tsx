'use client';

import Navigation from '@/components/navigation';
import ContractForm from '@/components/forms/contract-form';
import { Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function NewContractClient() {
  const { user, loading } = useAuth();
  const isDevMode = process.env.NODE_ENV === 'development';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/10">
      <Navigation isAuthenticated={isDevMode || !!user} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mt-4 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Generate New Contract</h1>
            </div>

            <p className="text-muted-foreground text-lg">
              Paste your client&apos;s request below and let AI transform it into a professional
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
