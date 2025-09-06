'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Navigation from '@/components/navigation';
import ContractsClient from '@/components/saved-contracts/ContractsClient';
import { useAuth } from '@/lib/AuthContext';

export default function ContractsPage() {
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
    <div className="min-h-screen bg-background">
      <Navigation isAuthenticated={isDevMode || !!user} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="heading-1 text-foreground">My Contracts</h1>
              <p className="text-muted-foreground mt-2">View and manage your generated contracts</p>
            </div>
            <Link href="/">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Contract
              </Button>
            </Link>
          </div>

          {/* Contracts List */}
          <ContractsClient />
        </div>
      </div>
    </div>
  );
}
