import * as React from 'react';
import { cn } from '@/lib/utils';
import { Logo, Avatar, AvatarFallback } from '@/components/atoms';
import { getInitials } from '@/lib/utils';
import { LogOut, User, Vote } from 'lucide-react';

interface VoterLayoutProps {
  children: React.ReactNode;
  voterName?: string;
  voterEmail?: string;
  electionName?: string;
  onLogout?: () => void;
  className?: string;
}

export function VoterLayout({
  children,
  voterName,
  voterEmail,
  electionName,
  onLogout,
  className,
}: VoterLayoutProps) {
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo and election name */}
          <div className="flex items-center gap-4">
            <Logo size="sm" />
            {electionName && (
              <>
                <span className="text-border">|</span>
                <div className="flex items-center gap-2 text-sm">
                  <Vote className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground hidden sm:inline">
                    {electionName}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* User menu */}
          {voterName && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {getInitials(voterName)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-foreground hidden sm:inline">
                  {voterName}
                </span>
              </button>

              {/* Dropdown menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-background border border-border rounded-lg shadow-lg py-1">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-medium text-foreground">{voterName}</p>
                    {voterEmail && (
                      <p className="text-xs text-muted-foreground truncate">{voterEmail}</p>
                    )}
                  </div>
                  <div className="py-1">
                    <button
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      onClick={() => {
                        setShowUserMenu(false);
                      }}
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </button>
                    {onLogout && (
                      <button
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                        onClick={() => {
                          setShowUserMenu(false);
                          onLogout();
                        }}
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className={cn('flex-1 container mx-auto px-4 py-8', className)}>
        {children}
      </main>

      {/* Footer */}
      <footer className="py-4 px-4 border-t border-border">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} VoteXpert. Secure E-Voting Platform.</p>
        </div>
      </footer>
    </div>
  );
}
