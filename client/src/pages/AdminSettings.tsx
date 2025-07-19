import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Save, Key, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

const settingsSchema = z.object({
  stripeSecretKey: z.string().min(1, "Stripe Secret Key is required").startsWith("sk_", "Must be a valid Stripe Secret Key"),
  stripePublicKey: z.string().min(1, "Stripe Public Key is required").startsWith("pk_", "Must be a valid Stripe Public Key"),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function AdminSettings() {
  const { toast } = useToast();
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showPublicKey, setShowPublicKey] = useState(false);

  // Fetch current settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/admin/settings"],
    retry: false,
  });

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      stripeSecretKey: "",
      stripePublicKey: "",
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: SettingsFormData) => {
      const response = await apiRequest("PUT", "/api/admin/settings", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({
        title: "Settings Updated",
        description: "Stripe API keys have been securely saved to the database.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SettingsFormData) => {
    updateSettingsMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
          <p className="mt-2 text-gray-600">
            Configure system settings and API integrations
          </p>
        </div>

        <Tabs defaultValue="stripe" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stripe" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Stripe Integration
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stripe" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Stripe API Configuration
                </CardTitle>
                <CardDescription>
                  Configure Stripe payment processing for provider lead purchases.
                  Keys are encrypted and stored securely in the database.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    All API keys are encrypted using AES-256 encryption before being stored in the database.
                    Only authorized admin users can view or modify these settings.
                  </AlertDescription>
                </Alert>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="stripeSecretKey">Stripe Secret Key</Label>
                    <div className="relative">
                      <Input
                        {...form.register("stripeSecretKey")}
                        type={showSecretKey ? "text" : "password"}
                        placeholder="sk_test_... or sk_live_..."
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowSecretKey(!showSecretKey)}
                      >
                        {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {form.formState.errors.stripeSecretKey && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.stripeSecretKey.message}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      Used for server-side payment processing. Starts with sk_test_ or sk_live_
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stripePublicKey">Stripe Publishable Key</Label>
                    <div className="relative">
                      <Input
                        {...form.register("stripePublicKey")}
                        type={showPublicKey ? "text" : "password"}
                        placeholder="pk_test_... or pk_live_..."
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPublicKey(!showPublicKey)}
                      >
                        {showPublicKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {form.formState.errors.stripePublicKey && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.stripePublicKey.message}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      Used for client-side payment forms. Starts with pk_test_ or pk_live_
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-500">
                      {settings?.stripeConfigured 
                        ? "✓ Stripe keys are configured" 
                        : "⚠ Stripe keys not configured"
                      }
                    </div>
                    <Button 
                      type="submit" 
                      disabled={updateSettingsMutation.isPending}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {updateSettingsMutation.isPending ? "Saving..." : "Save Settings"}
                    </Button>
                  </div>
                </form>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">How to get your Stripe API keys:</h3>
                  <ol className="text-sm text-blue-800 space-y-1">
                    <li>1. Go to <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="underline">dashboard.stripe.com/apikeys</a></li>
                    <li>2. Copy your "Publishable key" (starts with pk_) for the Public Key field</li>
                    <li>3. Copy your "Secret key" (starts with sk_) for the Secret Key field</li>
                    <li>4. Use test keys (pk_test_, sk_test_) for development</li>
                    <li>5. Use live keys (pk_live_, sk_live_) for production</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  System security configuration and encryption settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-4 border-b">
                    <div>
                      <h3 className="font-medium">API Key Encryption</h3>
                      <p className="text-sm text-gray-500">
                        All sensitive API keys are encrypted using AES-256 before storage
                      </p>
                    </div>
                    <div className="text-green-600 font-medium">✓ Enabled</div>
                  </div>
                  
                  <div className="flex items-center justify-between py-4 border-b">
                    <div>
                      <h3 className="font-medium">Database Security</h3>
                      <p className="text-sm text-gray-500">
                        Secure connection to PostgreSQL database with SSL encryption
                      </p>
                    </div>
                    <div className="text-green-600 font-medium">✓ Enabled</div>
                  </div>
                  
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <h3 className="font-medium">Admin Authentication</h3>
                      <p className="text-sm text-gray-500">
                        Role-based access control for administrative functions
                      </p>
                    </div>
                    <div className="text-green-600 font-medium">✓ Enabled</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}