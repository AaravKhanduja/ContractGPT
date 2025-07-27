'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FileText, Plus, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  isAuthenticated?: boolean;
}

export default function Navigation({ isAuthenticated = false }: NavigationProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'New Contract', icon: Plus },
    { href: '/contracts', label: 'My Contracts', icon: FileText },
  ];

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

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {isAuthenticated &&
                navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-primary hover:bg-accent',
                        pathname === item.href ? 'text-primary bg-accent' : 'text-muted-foreground'
                      )}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
                <Button variant="ghost" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Link href="/auth">Login</Link>
                </Button>
                <Link href="/auth">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isAuthenticated && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors hover:text-primary hover:bg-accent',
                      pathname === item.href ? 'text-primary bg-accent' : 'text-muted-foreground'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
