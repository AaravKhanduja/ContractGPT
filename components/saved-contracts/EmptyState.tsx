'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';

export default function EmptyState() {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No contracts yet</h3>
        <p className="text-muted-foreground mb-6">Create your first contract to get started</p>
        <Link href="/">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Contract
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
