import { createRoute, Link } from '@tanstack/react-router';
import { Vote, Shield } from 'lucide-react';
import { APP_NAME, APP_TAGLINE } from '@/lib/constants';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { rootRoute } from './__root';

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">
          {APP_NAME}
        </h1>
        <p className="text-muted-foreground text-lg">{APP_TAGLINE}</p>
      </header>

      {/* Mode Selection */}
      <div className="grid md:grid-cols-2 gap-6 max-w-2xl w-full">
        {/* Voter Card */}
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Vote className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Voter Portal</CardTitle>
            <CardDescription>
              Cast your vote securely with multi-factor authentication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" size="lg">
              <Link to="/voter/login">Login as Voter</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Admin Card */}
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Admin Portal</CardTitle>
            <CardDescription>
              Manage elections, candidates, and monitor results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="secondary" className="w-full" size="lg">
              <Link to="/admin/login">Login as Admin</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>Secure E-Voting Platform for Organizations</p>
      </footer>
    </div>
  );
}
