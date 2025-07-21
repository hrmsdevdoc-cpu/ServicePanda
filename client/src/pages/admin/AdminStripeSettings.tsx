import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminSidebar } from "@/components/AdminSidebar";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
  CreditCard,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export default function AdminStripeSettings() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [showKeys, setShowKeys] = useState(false);
  const [formData, setFormData] = useState({
    publicKey: '',
    secretKey: '',
  });

  // Check admin authentication
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin-login');
    }
  }, [navigate]);

  // Get Stripe settings
  const { data: stripeSettings, isLoading } = useQuery({
    queryKey: ['/api/admin/stripe-settings'],
    queryFn: async () => {
      const response = await fetch('/api/admin/stripe-settings', {
        headers: {
          'x-admin-token': localStorage.getItem('adminToken') || '',
        },
      });
      return response.json();
    },
  });

  // Update form data when settings load
  useEffect(() => {
    if (stripeSettings) {
      setFormData({
        publicKey: stripeSettings.publicKey || '',
        secretKey: stripeSettings.secretKey || '',
      });
    }
  }, [stripeSettings]);

  // Save Stripe settings mutation
  const saveSettingsMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest('POST', '/api/admin/stripe-settings', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Settings Saved",
        description: "Stripe API settings have been updated successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stripe-settings'] });
    },
    onError: (error) => {
      toast({
        title: "Save Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!formData.publicKey || !formData.secretKey) {
      toast({
        title: "Validation Error",
        description: "Both public key and secret key are required.",
        variant: "destructive",
      });
      return;
    }

    saveSettingsMutation.mutate(formData);
  };

  const isConfigured = stripeSettings?.isConfigured || false;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <AdminSidebar onLogout={handleLogout} />
      
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow border-b border-gray-200 dark:border-gray-700">
          <div className="px-8 py-6">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Stripe API Settings
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Configure Stripe payment processing integration
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="px-8 py-8">
          <div className="max-w-2xl">
            {/* Status Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  {isConfigured ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      Stripe Integration Active
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                      Stripe Integration Required
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  {isConfigured 
                    ? "Stripe is properly configured and ready to process payments."
                    : "Please configure your Stripe API keys to enable payment processing."
                  }
                </p>
              </CardContent>
            </Card>

            {/* Configuration Form */}
            <Card>
              <CardHeader>
                <CardTitle>API Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                    <p className="mt-2 text-gray-500">Loading settings...</p>
                  </div>
                ) : (
                  <>
                    {/* Instructions */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">How to get your Stripe API keys:</h4>
                      <ol className="text-sm text-blue-800 space-y-1">
                        <li>1. Go to <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="underline">https://dashboard.stripe.com/apikeys</a></li>
                        <li>2. Copy your "Publishable key" (starts with pk_) for the Public Key field</li>
                        <li>3. Copy your "Secret key" (starts with sk_) for the Secret Key field</li>
                      </ol>
                    </div>

                    {/* Public Key */}
                    <div>
                      <Label htmlFor="publicKey">Stripe Public Key</Label>
                      <Input
                        id="publicKey"
                        type="text"
                        placeholder="pk_test_..."
                        value={formData.publicKey}
                        onChange={(e) => handleInputChange('publicKey', e.target.value)}
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        This key is safe to be public and used in the frontend
                      </p>
                    </div>

                    {/* Secret Key */}
                    <div>
                      <Label htmlFor="secretKey">Stripe Secret Key</Label>
                      <div className="relative">
                        <Input
                          id="secretKey"
                          type={showKeys ? "text" : "password"}
                          placeholder="sk_test_..."
                          value={formData.secretKey}
                          onChange={(e) => handleInputChange('secretKey', e.target.value)}
                          className="mt-1 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowKeys(!showKeys)}
                          className="absolute right-0 top-1 h-8 px-3"
                        >
                          {showKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Keep this key secret and secure
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-4">
                      <Button 
                        onClick={handleSave}
                        disabled={saveSettingsMutation.isPending}
                        className="flex-1"
                      >
                        {saveSettingsMutation.isPending ? (
                          <>
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          'Save Settings'
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setFormData({ publicKey: '', secretKey: '' });
                        }}
                      >
                        Clear
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-sm">Security Notice</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-600">
                  API keys are encrypted and stored securely. Never share your secret key or commit it to version control.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}