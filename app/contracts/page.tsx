import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Navigation from '@/components/navigation';
import ContractsClient from '@/components/saved-contracts/ContractsClient';

export default function ContractsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation isAuthenticated={true} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Contracts</h1>
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
