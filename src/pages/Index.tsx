import { useAuth, AuthProvider } from '@/hooks/useAuth';
import { AuthForm } from '@/components/AuthForm';
import { NotesDemo } from '@/components/demos/NotesDemo';
import { RealtimeDemo } from '@/components/demos/RealtimeDemo';
import { StorageDemo } from '@/components/demos/StorageDemo';
import { EdgeFunctionDemo } from '@/components/demos/EdgeFunctionDemo';
import { FeatureCard } from '@/components/FeatureCard';
import { Button } from '@/components/ui/button';
import { 
  Database, 
  Shield, 
  Radio, 
  HardDrive, 
  Zap, 
  LogOut,
  Cloud,
  Loader2
} from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Authentication',
    description: 'Email/password auth with automatic session management and RLS protection.',
  },
  {
    icon: Database,
    title: 'PostgreSQL Database',
    description: 'Full CRUD operations with Row Level Security policies.',
  },
  {
    icon: Radio,
    title: 'Realtime Subscriptions',
    description: 'Live updates pushed to all connected clients instantly.',
  },
  {
    icon: HardDrive,
    title: 'File Storage',
    description: 'Secure bucket storage for images and documents.',
  },
  {
    icon: Zap,
    title: 'Edge Functions',
    description: 'Serverless TypeScript functions running at the edge.',
  },
];

const DashboardContent = () => {
  const { user, signOut, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        {/* Hero Section */}
        <header className="w-full py-6 px-4">
          <div className="container flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cloud className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Cloud Demo</span>
            </div>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-4 pb-16">
          <div className="text-center mb-8 max-w-2xl animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Lovable Cloud</span>
              <br />
              Integration Demo
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore authentication, database, realtime, storage, and edge functions
              all in one place.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 max-w-6xl mb-12">
            {features.map((feature, index) => (
              <div key={feature.title} style={{ animationDelay: `${index * 100}ms` }}>
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>

          {/* Auth Form */}
          <AuthForm />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="w-full py-4 px-4 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="h-6 w-6 text-primary" />
            <span className="font-bold">Cloud Demo</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user.email}
            </span>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, <span className="gradient-text">{user.email?.split('@')[0]}</span>
          </h1>
          <p className="text-muted-foreground">
            Explore the interactive demos below to see each feature in action.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NotesDemo />
          <RealtimeDemo />
          <StorageDemo />
          <EdgeFunctionDemo />
        </div>
      </main>
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
};

export default Index;
