import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminSidebar } from "@/components/AdminSidebar";
import { useQuery, useMutation } from "@tanstack/react-query";
import { adminApiRequest } from "@/lib/adminAuth";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import {
  Mail,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Send,
} from "lucide-react";

export default function AdminMailgunSettings() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [showKeys, setShowKeys] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [formData, setFormData] = useState({
    apiKey: '',
    domain: '',
    domainSendingKey: '',
  });

  // Check admin authentication
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin-login');
    }
  }, [navigate]);

  // Get Mailgun settings
  const { data: mailgunSettings, isLoading } = useQuery({
    queryKey: ['/api/admin/mailgun-settings'],
    queryFn: async () => {
      const response = await adminApiRequest('GET', '/api/admin/mailgun-settings');
      if (!response.ok) {
        throw new Error('Failed to fetch Mailgun settings');
      }
      return response.json();
    },
  });

  // Update form data when settings load
  useEffect(() => {
    if (mailgunSettings) {
      setFormData({
        apiKey: mailgunSettings.apiKey || '',
        domain: mailgunSettings.domain || '',
        domainSendingKey: mailgunSettings.domainSendingKey || '',
      });
    }
  }, [mailgunSettings]);

  // Save Mailgun settings mutation
  const saveSettingsMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await adminApiRequest('POST', '/api/admin/mailgun-settings', data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save settings');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Settings Saved",
        description: "Mailgun API settings have been updated successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/mailgun-settings'] });
    },
    onError: (error) => {
      toast({
        title: "Save Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Test email mutation
  const testEmailMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await adminApiRequest('POST', '/api/admin/test-email', { email });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send test email');
      }
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Test Email Sent",
          description: "Check your inbox for the test email.",
          variant: "default",
        });
      } else {
        toast({
          title: "Email Test Failed",
          description: data.message || "Failed to send test email",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Test Failed",
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
    if (!formData.apiKey || !formData.domain || !formData.domainSendingKey) {
      toast({
        title: "Validation Error",
        description: "All three fields are required for Mailgun configuration.",
        variant: "destructive",
      });
      return;
    }

    saveSettingsMutation.mutate(formData);
  };

  const handleTestEmail = () => {
    if (!testEmail) {
      toast({
        title: "Email Required",
        description: "Please enter an email address to test.",
        variant: "destructive",
      });
      return;
    }

    testEmailMutation.mutate(testEmail);
  };

  const isConfigured = mailgunSettings?.isConfigured || false;

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
              <Mail className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Mailgun API Settings
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Configure Mailgun email service integration
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
                      Mailgun Integration Active
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                      Mailgun Integration Required
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  {isConfigured 
                    ? "Mailgun is properly configured and ready to send emails."
                    : "Please configure your Mailgun API keys to enable email functionality."
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
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-medium text-orange-900 mb-2">How to get your Mailgun API keys:</h4>
                      <ol className="text-sm text-orange-800 space-y-1">
                        <li>1. Go to your Mailgun dashboard at mailgun.com</li>
                        <li>2. Navigate to Settings → API Keys</li>
                        <li>3. Copy your API Key and Domain</li>
                        <li>4. Get your Domain Sending Key from Domain Settings</li>
                      </ol>
                    </div>

                    {/* API Key */}
                    <div>
                      <Label htmlFor="apiKey">Mailgun API Key</Label>
                      <div className="relative">
                        <Input
                          id="apiKey"
                          type={showKeys ? "text" : "password"}
                          placeholder="key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                          value={formData.apiKey}
                          onChange={(e) => handleInputChange('apiKey', e.target.value)}
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
                    </div>

                    {/* Domain */}
                    <div>
                      <Label htmlFor="domain">Mailgun Domain</Label>
                      <Input
                        id="domain"
                        type="text"
                        placeholder="mg.yourdomain.com"
                        value={formData.domain}
                        onChange={(e) => handleInputChange('domain', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    {/* Domain Sending Key */}
                    <div>
                      <Label htmlFor="domainSendingKey">Domain Sending Key</Label>
                      <div className="relative">
                        <Input
                          id="domainSendingKey"
                          type={showKeys ? "text" : "password"}
                          placeholder="Domain sending authentication key"
                          value={formData.domainSendingKey}
                          onChange={(e) => handleInputChange('domainSendingKey', e.target.value)}
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
                          setFormData({ apiKey: '', domain: '', domainSendingKey: '' });
                        }}
                      >
                        Clear
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Test Email */}
            {isConfigured && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Send className="h-5 w-5 mr-2" />
                    Test Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    <Input
                      type="email"
                      placeholder="test@example.com"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleTestEmail}
                      disabled={testEmailMutation.isPending}
                    >
                      {testEmailMutation.isPending ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        'Send Test'
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Note: Sandbox domains require the email to be in your authorized recipients list.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}