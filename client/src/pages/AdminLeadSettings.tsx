import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Settings, Clock, DollarSign, Users, Star } from "lucide-react";
import { AdminSidebar } from "@/components/AdminSidebar";

// Admin API request helper with proper token handling
const adminApiRequest = async (method: string, url: string, data?: any) => {
  const token = localStorage.getItem('adminToken');
  console.log('Admin token:', token ? `${token.substring(0, 10)}...` : 'null');
  
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': token || '',
    },
    body: data ? JSON.stringify(data) : undefined,
  });
  
  console.log('Response status:', response.status);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error:', errorText);
    throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
  }
  
  return response;
};

interface LeadSettings {
  // Pricing Model
  pricingModel: 'uniform' | 'category'; // uniform for all leads, category for per-category pricing
  uniformUniquePrice: number;
  uniformSharePrice: number;
  
  // Timing Settings
  uniqueOfferWindow: number; // minutes for unique lead offer
  
  // Provider Selection Rules
  providerRestrictionsActive: boolean; // Enable/disable provider restrictions
  maxProvidersPerArea: number;
  minProviderRating: number;
  
  // Category-specific pricing (when pricingModel is 'category')
  categoryPricing: {
    categoryId: number;
    categoryName: string;
    uniquePrice: number;
    sharePrice: number;
    hasCustomPrice: boolean; // Track if category has custom pricing
  }[];
}

export default function AdminLeadSettings() {
  const { toast } = useToast();
  const [hasChanges, setHasChanges] = useState(false);

  // Local state for settings
  const [localSettings, setLocalSettings] = useState({
    pricingModel: 'uniform' as 'uniform' | 'category',
    uniformUniquePrice: 25.00,
    uniformSharePrice: 12.00,
    uniqueOfferWindow: 2,
    maxProvidersPerArea: 10,
    minProviderRating: 3.0,
    providerRestrictionsActive: false,
  });

  // Fetch current lead settings
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['/api/admin/lead-settings'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/lead-settings');
      const data = await response.json();
      setLocalSettings(data); // Update local state when data is fetched
      return data;
    }
  });

  // Fetch service categories for category-based pricing
  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ['/api/service-categories'],
  });

  // Mutation to save lead settings
  const saveMutation = useMutation({
    mutationFn: async (updatedSettings: any) => {
      const response = await adminApiRequest('PUT', '/api/admin/lead-settings', updatedSettings);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Settings Saved",
        description: "Lead management settings have been updated successfully.",
      });
      setHasChanges(false);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/lead-settings'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Save Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSettingChange = (field: string, value: any) => {
    setHasChanges(true);
    
    // Update local settings
    const newLocalSettings = { ...localSettings, [field]: value };
    setLocalSettings(newLocalSettings);
    
    // Special handling for uniform price changes - auto-update categories without custom pricing
    if (field === 'uniformUniquePrice' || field === 'uniformSharePrice') {
      if (settings?.categoryPricing) {
        const newCategoryPricing = settings.categoryPricing.map((cat: any) => {
          if (!cat.hasCustomPrice) {
            return {
              ...cat,
              uniquePrice: field === 'uniformUniquePrice' ? parseFloat(value) : cat.uniquePrice,
              sharePrice: field === 'uniformSharePrice' ? parseFloat(value) : cat.sharePrice,
            };
          }
          return cat;
        });
        
        // Update the settings data with new category pricing
        queryClient.setQueryData(['/api/admin/lead-settings'], {
          ...settings,
          ...newLocalSettings,
          categoryPricing: newCategoryPricing,
        });
      }
    }
  };

  const handleSave = () => {
    saveMutation.mutate(localSettings);
  };

  if (settingsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        <AdminSidebar onLogout={() => {}} />
        <div className="flex-1 p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <AdminSidebar onLogout={() => {}} />
      <div className="flex-1 p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Lead Management Settings</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Configure automated lead distribution, pricing, and provider selection rules
            </p>
          </div>
          {hasChanges && (
            <Button 
              onClick={handleSave} 
              disabled={saveMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {saveMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </div>

        {/* Lead Pricing Model */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <CardTitle>Lead Pricing Model</CardTitle>
            </div>
            <CardDescription>
              Set pricing structure for unique leads and 3-share leads
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Pricing Model</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose between uniform pricing for all leads or category-specific pricing
                </p>
              </div>
              <Select defaultValue="uniform" onValueChange={(value) => handleSettingChange('pricingModel', value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uniform">Uniform Pricing</SelectItem>
                  <SelectItem value="category">Category-Based Pricing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Uniform Pricing Section */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Uniform Pricing (All Categories)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="uniquePrice">Unique Lead Price</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <Input
                      id="uniquePrice"
                      type="number"
                      value={localSettings.uniformUniquePrice}
                      className="pl-8"
                      onChange={(e) => handleSettingChange('uniformUniquePrice', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Price for exclusive leads (2-minute window)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sharePrice">3-Share Lead Price</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <Input
                      id="sharePrice"
                      type="number"
                      value={localSettings.uniformSharePrice}
                      className="pl-8"
                      onChange={(e) => handleSettingChange('uniformSharePrice', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Price when shared with up to 3 providers
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lead Distribution Timing */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <CardTitle>Lead Distribution Timing</CardTitle>
            </div>
            <CardDescription>
              Configure time windows for lead offers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="uniqueWindow">Unique Lead Offer Window</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="uniqueWindow"
                    type="number"
                    value={localSettings.uniqueOfferWindow}
                    min="1"
                    max="10"
                    onChange={(e) => handleSettingChange('uniqueOfferWindow', parseInt(e.target.value) || 1)}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">minutes</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Time providers have to accept unique leads before they become 3-share leads
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Provider Selection Rules */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <CardTitle>Provider Selection Rules</CardTitle>
            </div>
            <CardDescription>
              Configure how providers are selected for lead offers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Provider Restrictions Toggle */}
            <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="space-y-1">
                <Label className="text-base font-medium">Provider Restrictions</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enable provider limits and rating requirements. Keep disabled initially since providers start with zero ratings.
                </p>
              </div>
              <Switch
                checked={localSettings.providerRestrictionsActive}
                onCheckedChange={(checked) => handleSettingChange('providerRestrictionsActive', checked)}
              />
            </div>
            
            {/* Provider Restrictions Settings - Only show when active */}
            {localSettings.providerRestrictionsActive && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxProviders">Max Providers Per Service Area</Label>
                  <Input
                    id="maxProviders"
                    type="number"
                    value={localSettings.maxProvidersPerArea}
                    min="1"
                    max="50"
                    onChange={(e) => handleSettingChange('maxProvidersPerArea', parseInt(e.target.value) || 1)}
                  />
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Maximum number of providers to consider for each lead
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minRating">Minimum Provider Rating</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="minRating"
                      type="number"
                      value={localSettings.minProviderRating}
                      min="1.0"
                      max="5.0"
                      step="0.1"
                      onChange={(e) => handleSettingChange('minProviderRating', parseFloat(e.target.value) || 1.0)}
                    />
                    <Star className="h-4 w-4 text-yellow-500" />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Minimum rating required for providers to receive lead offers
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category-Specific Pricing (conditionally shown) */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              <CardTitle>Category-Specific Pricing</CardTitle>
            </div>
            <CardDescription>
              Set different prices for each service category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.map((category: any) => (
                <div key={category.id} className="p-4 border rounded-lg space-y-3">
                  <h4 className="font-medium">{category.name}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Unique Lead Price</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-500">$</span>
                        <Input
                          type="number"
                          placeholder="25.00"
                          className="pl-8"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>3-Share Lead Price</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-500">$</span>
                        <Input
                          type="number"
                          placeholder="12.00"
                          className="pl-8"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lead Distribution Algorithm */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-blue-600" />
              <CardTitle>Lead Distribution Algorithm</CardTitle>
            </div>
            <CardDescription>
              How the system distributes leads to providers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg space-y-3">
              <h4 className="font-medium text-blue-900 dark:text-blue-100">Distribution Process</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <li>New lead comes in and matches providers in the service area</li>
                <li>Providers are ranked by rating (highest first)</li>
                <li>Top-rated providers receive unique lead offer notification</li>
                <li>2-minute window for providers to accept unique lead</li>
                <li>If not accepted, lead becomes 3-share at reduced price</li>
                <li>Up to 3 providers can purchase the 3-share lead</li>
                <li>Lead is considered served when unique OR 3 providers accept</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}