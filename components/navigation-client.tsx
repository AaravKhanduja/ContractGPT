'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FileText, Plus, User, LogOut, Menu, X } from 'lucide-react';
import { cn } from '@/utils';
import { useAuth } from '@/lib/AuthContext';
import { useState } from 'react';
import ProfileOverlay from './ProfileOverlay';

export default function NavigationClient() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut, user } = useAuth();
  const [showProfileOverlay, setShowProfileOverlay] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/generate', label: 'New Contract', icon: Plus },
    { href: '/contracts', label: 'My Contracts', icon: FileText },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/auth/signin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3 py-2 rounded-md ui-text font-medium transition-colors hover:text-primary hover:bg-accent',
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

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => setShowProfileOverlay(true)}>
            <User className="w-4 h-4 mr-2" />
            Profile
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Mobile Hamburger Button */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
          <div className="flex flex-col h-full">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="text-responsive-lg font-semibold">Menu</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Mobile Menu Items */}
            <div className="flex-1 px-4 py-6 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center space-x-3 px-4 py-3 rounded-lg ui-text-large font-medium transition-colors hover:text-primary hover:bg-accent',
                      pathname === item.href ? 'text-primary bg-accent' : 'text-muted-foreground'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <div className="pt-4 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowProfileOverlay(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start px-4 py-3 h-auto"
                >
                  <User className="w-5 h-5 mr-3" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start px-4 py-3 h-auto"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Overlay */}
      {showProfileOverlay && (
        <ProfileOverlay
          user={user}
          onClose={() => setShowProfileOverlay(false)}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}
