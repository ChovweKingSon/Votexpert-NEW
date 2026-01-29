import { APP_NAME, APP_TAGLINE } from '@/lib/constants';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Badge,
  Spinner,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui';
import { Vote, Shield, Users } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-primary">{APP_NAME}</h1>
          <p className="text-muted-foreground">{APP_TAGLINE}</p>
        </header>

        {/* Status badges */}
        <div className="flex flex-wrap justify-center gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Active</Badge>
          <Badge variant="warning">Pending</Badge>
          <Badge variant="info">Ongoing</Badge>
          <Badge variant="destructive">Cancelled</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Vote className="h-5 w-5 text-primary" />
                <CardTitle>Secure Voting</CardTitle>
              </div>
              <CardDescription>
                Cast your vote with confidence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Multi-factor authentication including face verification ensures
                only authorized voters can participate.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Admin Control</CardTitle>
              </div>
              <CardDescription>Full election management</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create elections, manage candidates, upload voter lists, and
                monitor real-time statistics.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>Live Results</CardTitle>
              </div>
              <CardDescription>Real-time vote counting</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Watch results unfold in real-time with detailed analytics and
                voter turnout statistics.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Form Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Component Showcase</CardTitle>
            <CardDescription>
              Tailwind CSS + shadcn/ui components configured and ready
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Input Demo */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="voter@example.com"
              />
            </div>

            {/* Button Variants */}
            <div className="space-y-2">
              <Label>Button Variants</Label>
              <div className="flex flex-wrap gap-2">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>

            {/* Button Sizes */}
            <div className="space-y-2">
              <Label>Button Sizes</Label>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">
                  <Vote className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Avatar + Spinner */}
            <div className="space-y-2">
              <Label>Avatar & Spinner</Label>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>AB</AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2">
                  <Spinner size="sm" />
                  <Spinner size="md" />
                  <Spinner size="lg" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Setup Checklist */}
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="text-primary">Setup Complete</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Tailwind CSS v4 with Vite plugin
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> shadcn/ui components (Button, Input, Card, Badge, Avatar, Spinner)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Lucide React icons
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> CSS variables for theming
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> VoteXpert dark theme configured
              </li>
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              Next: TanStack Router setup
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
