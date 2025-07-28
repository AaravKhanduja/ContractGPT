'use client';

import { Card, CardContent } from '@/components/ui/card';
import { SavedContract } from '@/components/saved-contracts/Types';

interface ContractStatsProps {
  contracts: SavedContract[];
}

export default function ContractStats({ contracts }: ContractStatsProps) {
  const thisWeek = contracts.filter((c) => {
    const createdDate = new Date(c.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return createdDate >= weekAgo;
  }).length;

  return (
    <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-2xl font-bold text-foreground">{contracts.length}</div>
          <div className="text-sm text-muted-foreground">Total Contracts</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-2xl font-bold text-foreground">
            {new Set(contracts.map((c) => c.type)).size}
          </div>
          <div className="text-sm text-muted-foreground">Contract Types</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-2xl font-bold text-foreground">{thisWeek}</div>
          <div className="text-sm text-muted-foreground">This Week</div>
        </CardContent>
      </Card>
    </div>
  );
}
