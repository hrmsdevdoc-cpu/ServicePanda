import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Key, Save, Shield, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function AdminStripeConfig() {
  const { toast } = useToast();
  const [stripeKeys, setStripeKeys] = useState({
    secretKey: "",
    publicKey: "",
  });

  // Fetch current settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/admin/settings"],
    retry: false,
  });

  const updateKeysMutation = useMutation({
    mutationFn: async (data: { stripeSecretKey: string; stripePublicKey: string }) => {
      const response = await apiRequest("PUT", "/api/setup/stripe", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({
        title: "Stripe Keys Updated",
        description: "API keys have been securely saved to the database.",
      });
      setStripeKeys({ secretKey: "", publicKey: "" });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripeKeys.secretKey.trim() || !stripeKeys.publicKey.trim()) {
      toast({
        title: "Missing Keys",
        description: "Both Stripe keys are required.",
        variant: "destructive",
      });
      return;
    }

    if (!stripeKeys.secretKey.startsWith('sk_')) {
      toast({
        title: "Invalid Secret Key",
        description: "Stripe Secret Key must start with 'sk_'",
        variant: "destructive",
      });
      return;
    }

    if (!stripeKeys.publicKey.startsWith('pk_')) {
      toast({
        title: "Invalid Public Key", 
        description: "Stripe Public Key must start with 'pk_'",
        variant: "destructive",
      });
      return;
    }

    console.log('Submitting Stripe keys to backend...');
    updateKeysMutation.mutate({
      stripeSecretKey: stripeKeys.secretKey.trim(),
      stripePublicKey: stripeKeys.publicKey.trim(),
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading configuration...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Stripe Configuration</h1>
          <p className="mt-2 text-gray-600">
            Configure Stripe payment processing for ServicePanda
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Key Configuration
            </CardTitle>
            <CardDescription>
              Enter your Stripe API keys. Keys are encrypted before storage.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Keys are encrypted using AES-256 before being stored in the database.
                {settings?.stripeConfigured 
                  ? " ✓ Stripe is currently configured and active."
                  : " ⚠ Stripe is not yet configured."
                }
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="secretKey">Stripe Secret Key</Label>
                <Textarea
                  id="secretKey"
                  value={stripeKeys.secretKey}
                  onChange={(e) => setStripeKeys(prev => ({ ...prev, secretKey: e.target.value }))}
                  placeholder="sk_test_... or sk_live_..."
                  className="font-mono text-sm"
                  rows={3}
                />
                <p className="text-sm text-gray-500">
                  Used for server-side payment processing. Must start with sk_test_ or sk_live_
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="publicKey">Stripe Publishable Key</Label>
                <Textarea
                  id="publicKey"
                  value={stripeKeys.publicKey}
                  onChange={(e) => setStripeKeys(prev => ({ ...prev, publicKey: e.target.value }))}
                  placeholder="pk_test_... or pk_live_..."
                  className="font-mono text-sm"
                  rows={3}
                />
                <p className="text-sm text-gray-500">
                  Used for client-side forms. Must start with pk_test_ or pk_live_
                </p>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button 
                  type="submit" 
                  disabled={updateKeysMutation.isPending}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {updateKeysMutation.isPending ? "Saving..." : "Save Configuration"}
                </Button>
              </div>
            </form>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">How to get your Stripe API keys:</h3>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Go to <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="underline">dashboard.stripe.com/apikeys</a></li>
                <li>2. Copy your "Publishable key" (starts with pk_)</li>
                <li>3. Click "Reveal" next to your "Secret key" and copy it (starts with sk_)</li>
                <li>4. Paste both keys above and click Save Configuration</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}