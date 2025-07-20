import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Mail, ArrowLeft, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";

export default function AdminMailgunConfig() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [mailgunData, setMailgunData] = useState({
    apiKey: "",
    domain: "",
    domainSendingKey: ""
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [showDomainKey, setShowDomainKey] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch admin settings to check if Mailgun is configured
  const { data: adminSettings, isLoading } = useQuery({
    queryKey: ["/api/admin/settings"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/settings");
      return response.json();
    },
  });

  // Update Mailgun configuration mutation
  const updateMailgunMutation = useMutation({
    mutationFn: async (data: { apiKey: string; domain: string; domainSendingKey: string }) => {
      const response = await apiRequest("POST", "/api/admin/mailgun-config", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Mailgun Configuration Updated",
        description: "Your Mailgun settings have been saved successfully.",
        variant: "default",
      });
      setIsEditing(false);
      setMailgunData({ apiKey: "", domain: "", domainSendingKey: "" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
    },
    onError: (error: any) => {
      toast({
        title: "Configuration Failed",
        description: error.message || "Failed to save Mailgun configuration.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mailgunData.apiKey || !mailgunData.domain || !mailgunData.domainSendingKey) {
      toast({
        title: "Missing Information",
        description: "Please provide API key, domain, and domain sending key.",
        variant: "destructive",
      });
      return;
    }

    updateMailgunMutation.mutate(mailgunData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isConfigured = adminSettings?.mailgunConfigured;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin')}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin Dashboard
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <Mail className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">Mailgun Configuration</h1>
          </div>
          <p className="text-gray-600">
            Configure Mailgun settings for sending password reset emails and notifications
          </p>
        </div>

        {/* Configuration Status */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              {isConfigured ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-700 font-medium">Mailgun is configured and ready</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  <span className="text-amber-700 font-medium">Mailgun configuration required</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Configuration Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {isConfigured ? "Update Mailgun Configuration" : "Set Up Mailgun"}
              {isConfigured && !isEditing && (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  size="sm"
                >
                  Edit Configuration
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(!isConfigured || isEditing) ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* API Key Field */}
                <div>
                  <Label htmlFor="apiKey">Mailgun API Key *</Label>
                  <div className="relative mt-2">
                    <Input
                      id="apiKey"
                      type={showApiKey ? "text" : "password"}
                      value={mailgunData.apiKey}
                      onChange={(e) => setMailgunData(prev => ({ ...prev, apiKey: e.target.value }))}
                      placeholder="Your Mailgun API key"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Your private API key from Mailgun dashboard
                  </p>
                </div>

                {/* Domain Field */}
                <div>
                  <Label htmlFor="domain">Mailgun Domain *</Label>
                  <Input
                    id="domain"
                    type="text"
                    value={mailgunData.domain}
                    onChange={(e) => setMailgunData(prev => ({ ...prev, domain: e.target.value }))}
                    placeholder="mg.yourdomain.com or sandboxXXX.mailgun.org"
                    required
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Your verified sending domain from Mailgun
                  </p>
                </div>

                {/* Domain Sending Key Field */}
                <div>
                  <Label htmlFor="domainSendingKey">Domain Sending Key *</Label>
                  <div className="relative mt-2">
                    <Input
                      id="domainSendingKey"
                      type={showDomainKey ? "text" : "password"}
                      value={mailgunData.domainSendingKey}
                      onChange={(e) => setMailgunData(prev => ({ ...prev, domainSendingKey: e.target.value }))}
                      placeholder="Your domain sending key"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowDomainKey(!showDomainKey)}
                    >
                      {showDomainKey ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Your domain sending key from Mailgun dashboard
                  </p>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Getting Your Mailgun Credentials:</h4>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Log in to your Mailgun dashboard</li>
                    <li>Go to <strong>Settings → API Keys</strong> for your API key</li>
                    <li>Go to <strong>Sending → Domains</strong> for your domain</li>
                    <li>Use your sandbox domain for testing or add your own domain</li>
                  </ol>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button 
                    type="submit" 
                    disabled={updateMailgunMutation.isPending}
                    className="flex-1"
                  >
                    {updateMailgunMutation.isPending ? "Saving..." : "Save Configuration"}
                  </Button>
                  
                  {isEditing && (
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setMailgunData({ apiKey: "", domain: "", domainSendingKey: "" });
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Mailgun is Configured</h3>
                <p className="text-gray-600 mb-4">
                  Your Mailgun settings are saved and emails are ready to be sent.
                </p>
                <p className="text-sm text-gray-500">
                  Password reset emails and notifications will be delivered through Mailgun.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Information */}
        <div className="mt-6 text-sm text-gray-600">
          <h4 className="font-medium mb-2">About Mailgun Integration:</h4>
          <ul className="space-y-1 list-disc list-inside">
            <li>Mailgun credentials are encrypted and stored securely</li>
            <li>Used for password reset emails and system notifications</li>
            <li>You can update your configuration anytime</li>
            <li>Test your configuration with the forgot password feature</li>
          </ul>
        </div>
      </div>
    </div>
  );
}