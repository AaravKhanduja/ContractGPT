import Link from 'next/link';
import { FileText } from 'lucide-react';
import NavigationClient from './navigation-client';

interface NavigationProps {
  isAuthenticated?: boolean;
}

export default function Navigation({ isAuthenticated = false }: NavigationProps) {
  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">ContractGPT</span>
            </Link>
          </div>

          {isAuthenticated && <NavigationClient />}
        </div>
      </div>
    </nav>
  );
}
