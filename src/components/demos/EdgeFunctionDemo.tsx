import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Zap, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface HealthResponse {
  status: string;
  timestamp: string;
  message: string;
}

export const EdgeFunctionDemo = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const callEdgeFunction = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('hello-world');

      if (fnError) {
        throw fnError;
      }

      setResponse(data);
      toast.success('Edge function responded!');
    } catch (err: any) {
      setError(err.message || 'Failed to call edge function');
      toast.error('Edge function call failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Edge Functions
        </CardTitle>
        <CardDescription>
          Serverless functions running at the edge
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={callEdgeFunction} disabled={loading} className="gradient-bg">
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Zap className="h-4 w-4 mr-2" />
          )}
          Call Edge Function
        </Button>

        {response && (
          <div className="p-4 rounded-lg bg-success/10 border border-success/20 animate-scale-in">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span className="font-medium text-success">Success</span>
            </div>
            <pre className="text-sm overflow-x-auto p-2 bg-card rounded">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 animate-scale-in">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-5 w-5 text-destructive" />
              <span className="font-medium text-destructive">Error</span>
            </div>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          <p>Edge functions can:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Handle API integrations securely</li>
            <li>Process webhooks</li>
            <li>Run server-side logic</li>
            <li>Access environment secrets</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
