import { useState, useEffect } from "react";
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
  
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': token || '',
    },
    body: data ? JSON.stringify(data) : undefined,
  });
  
  if (!response.ok) {
    const errorText = await response.text();
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

  // Local state for settings - will be updated when data loads
  const [localSettings, setLocalSettings] = useState({
    pricingModel: 'uniform' as 'uniform' | 'category',
    uniformUniquePrice: 0,
    uniformSharePrice: 0,
    uniqueOfferWindow: 0,
    maxProvidersPerArea: 0,
    minProviderRating: 0,
    providerRestrictionsActive: false,
  });

  // Fetch current lead settings
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['/api/admin/lead-settings'],
    queryFn: async () => {
      const response = await adminApiRequest('GET', '/api/admin/lead-settings');
      const data = await response.json();
      return data;
    }
  });

  // Update local settings when data is loaded
  useEffect(() => {
    if (settings) {
      setLocalSettings({
        pricingModel: settings.pricingModel || 'uniform',
        uniformUniquePrice: settings.uniformUniquePrice || 0,
        uniformSharePrice: settings.uniformSharePrice || 0,
        uniqueOfferWindow: settings.uniqueOfferWindow || 0,
        maxProvidersPerArea: settings.maxProvidersPerArea || 0,
        minProviderRating: settings.minProviderRating || 0,
        providerRestrictionsActive: settings.providerRestrictionsActive || false,
      });
    }
  }, [settings]);

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

  const handleCategoryPricingToggle = (categoryId: number, categoryName: string, hasCustomPrice: boolean) => {
    setHasChanges(true);
    
    // Get current category pricing or create new array
    const currentCategoryPricing = settings?.categoryPricing || [];
    
    let updatedCategoryPricing;
    if (hasCustomPrice) {
      // Enable custom pricing - add or update category
      const existingIndex = currentCategoryPricing.findIndex((cat: any) => cat.categoryId === categoryId);
      if (existingIndex >= 0) {
        // Update existing
        updatedCategoryPricing = currentCategoryPricing.map((cat: any) =>
          cat.categoryId === categoryId ? { ...cat, hasCustomPrice: true } : cat
        );
      } else {
        // Add new with default values from uniform pricing
        updatedCategoryPricing = [...currentCategoryPricing, {
          categoryId,
          categoryName,
          uniquePrice: localSettings.uniformUniquePrice,
          sharePrice: localSettings.uniformSharePrice,
          hasCustomPrice: true
        }];
      }
    } else {
      // Disable custom pricing - mark as not custom
      updatedCategoryPricing = currentCategoryPricing.map((cat: any) =>
        cat.categoryId === categoryId ? { ...cat, hasCustomPrice: false } : cat
      );
    }
    
    // Update both local and server state
    const newSettings = { ...settings, categoryPricing: updatedCategoryPricing };
    queryClient.setQueryData(['/api/admin/lead-settings'], newSettings);
  };

  const handleCategoryPriceChange = (categoryId: number, priceType: 'uniquePrice' | 'sharePrice', value: number) => {
    setHasChanges(true);
    
    // Get current category pricing
    const currentCategoryPricing = settings?.categoryPricing || [];
    
    // Update the specific category price
    const updatedCategoryPricing = currentCategoryPricing.map((cat: any) =>
      cat.categoryId === categoryId ? { ...cat, [priceType]: value } : cat
    );
    
    // Update server state
    const newSettings = { ...settings, categoryPricing: updatedCategoryPricing };
    queryClient.setQueryData(['/api/admin/lead-settings'], newSettings);
  };

  const handleSave = () => {
    // Combine local settings with updated category pricing from server state
    const settingsToSave = {
      ...localSettings,
      categoryPricing: settings?.categoryPricing || []
    };
    saveMutation.mutate(settingsToSave);
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
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900 dark:text-white">Uniform Pricing (All Categories)</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Default pricing for all categories without custom pricing</p>
              </div>
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

            <Separator />

            {/* Category-Specific Pricing Overrides */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900 dark:text-white">Category Pricing Overrides</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Set custom pricing for specific categories</p>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {categories.map((category: any) => {
                  const categorySettings = settings?.categoryPricing?.find((cat: any) => cat.categoryId === category.id) || {
                    categoryId: category.id,
                    categoryName: category.name,
                    uniquePrice: localSettings.uniformUniquePrice,
                    sharePrice: localSettings.uniformSharePrice,
                    hasCustomPrice: false
                  };
                  
                  return (
                    <div key={category.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                              {category.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 dark:text-white">{category.name}</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {categorySettings.hasCustomPrice ? 
                                `Custom: $${categorySettings.uniquePrice}/$${categorySettings.sharePrice}` : 
                                `Using uniform: $${localSettings.uniformUniquePrice}/$${localSettings.uniformSharePrice}`
                              }
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`custom-${category.id}`} className="text-sm">Custom Pricing</Label>
                          <Switch
                            id={`custom-${category.id}`}
                            checked={categorySettings.hasCustomPrice}
                            onCheckedChange={(checked) => handleCategoryPricingToggle(category.id, category.name, checked)}
                          />
                        </div>
                      </div>
                      
                      {categorySettings.hasCustomPrice && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <div className="space-y-2">
                            <Label htmlFor={`unique-${category.id}`}>Unique Lead Price</Label>
                            <div className="relative">
                              <span className="absolute left-3 top-3 text-gray-500">$</span>
                              <Input
                                id={`unique-${category.id}`}
                                type="number"
                                value={categorySettings.uniquePrice}
                                className="pl-8"
                                onChange={(e) => handleCategoryPriceChange(category.id, 'uniquePrice', parseFloat(e.target.value) || 0)}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`share-${category.id}`}>3-Share Lead Price</Label>
                            <div className="relative">
                              <span className="absolute left-3 top-3 text-gray-500">$</span>
                              <Input
                                id={`share-${category.id}`}
                                type="number"
                                value={categorySettings.sharePrice}
                                className="pl-8"
                                onChange={(e) => handleCategoryPriceChange(category.id, 'sharePrice', parseFloat(e.target.value) || 0)}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
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




      </div>
    </div>
  );
}