'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FileText, Plus, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NavigationClient() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'New Contract', icon: Plus },
    { href: '/contracts', label: 'My Contracts', icon: FileText },
  ];

  return (
    <>
      <div className="hidden md:block">
        <div className="ml-10 flex items-baseline space-x-4">
          {navItems.map((item) => {
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
      </div>

      {/* Mobile menu */}
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
    </>
  );
}
