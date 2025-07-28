'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Eye, Trash2, Download } from 'lucide-react';
import { SavedContract } from '@/components/saved-contracts/Types';

interface ContractCardProps {
  contract: SavedContract;
  onDelete: () => void;
  onDownload: () => void;
}

export default function ContractCard({ contract, onDelete, onDownload }: ContractCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold truncate">{contract.title}</CardTitle>
            <CardDescription className="mt-1">
              <Badge variant="secondary" className="text-xs">
                {contract.type}
              </Badge>
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p className="line-clamp-3">{contract.prompt || 'No description available'}</p>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="w-3 h-3 mr-1" />
            Created {contract.createdAt}
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center space-x-2">
              <Link href={`/contract/${contract.id}`}>
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={onDownload}>
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
