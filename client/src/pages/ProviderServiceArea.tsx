import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Save,
  ArrowLeft,
  MapPin,
  Plus,
  X,
  AlertCircle,
  Loader2,
  Check
} from "lucide-react";

export default function ProviderServiceArea() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedSuburbs, setSelectedSuburbs] = useState<any[]>([]);
  const [centerAddress, setCenterAddress] = useState("");
  const [radiusKm, setRadiusKm] = useState("20");

  // Fetch states
  const { data: states = [], isLoading: statesLoading } = useQuery({
    queryKey: ["/api/states"],
    retry: false,
  });

  // Fetch regions for selected state
  const { data: regions = [], isLoading: regionsLoading } = useQuery({
    queryKey: ["/api/regions/state", selectedState],
    enabled: !!selectedState,
    retry: false,
  });

  // Fetch suburbs for selected region
  const { data: suburbs = [], isLoading: suburbsLoading } = useQuery({
    queryKey: ["/api/regions", selectedRegion, "suburbs"],
    enabled: !!selectedRegion,
    retry: false,
  });

  // Fetch provider's existing service areas
  const { data: serviceAreas = [], isLoading: serviceAreasLoading } = useQuery({
    queryKey: ["/api/provider/service-areas"],
    retry: false,
  });

  // Fetch provider profile for business address
  const { data: provider } = useQuery({
    queryKey: ["/api/provider/profile"],
    retry: false,
  });

  // Set initial data when service areas load
  useEffect(() => {
    if (serviceAreas.length > 0) {
      const area = serviceAreas[0];
      setSelectedSuburbs(area.suburbs || []);
      setCenterAddress(area.centerAddress || "");
      setRadiusKm(area.radiusKm?.toString() || "20");
    }
  }, [serviceAreas]);

  // Auto-populate center address from provider profile
  useEffect(() => {
    if (provider && !centerAddress) {
      const address = `${provider.businessAddress}, ${provider.businessSuburb}, ${provider.businessState} ${provider.businessPostcode}`;
      setCenterAddress(address);
    }
  }, [provider, centerAddress]);

  const updateServiceAreaMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("PUT", "/api/provider/service-areas", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/provider/service-areas"] });
      toast({
        title: "Service Area Updated",
        description: "Your service coverage area has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update service area.",
        variant: "destructive",
      });
    },
  });

  const addAllSuburbsMutation = useMutation({
    mutationFn: async (regionId: string) => {
      const res = await apiRequest("POST", `/api/provider/service-areas/add-region/${regionId}`);
      return res.json();
    },
    onSuccess: (data) => {
      setSelectedSuburbs(data.suburbs);
      queryClient.invalidateQueries({ queryKey: ["/api/provider/service-areas"] });
      toast({
        title: "Suburbs Added",
        description: `Added ${data.suburbs.length} suburbs to your service area.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Add Suburbs",
        description: error.message || "Failed to add suburbs.",
        variant: "destructive",
      });
    },
  });

  const handleSuburbToggle = (suburb: any) => {
    setSelectedSuburbs(prev => {
      const exists = prev.find(s => s.id === suburb.id);
      if (exists) {
        return prev.filter(s => s.id !== suburb.id);
      } else {
        return [...prev, suburb];
      }
    });
  };

  const handleAddAllSuburbs = () => {
    if (!selectedRegion) return;
    addAllSuburbsMutation.mutate(selectedRegion);
  };

  const handleSave = () => {
    if (selectedSuburbs.length === 0) {
      toast({
        title: "No Service Area Selected",
        description: "Please select at least one suburb to service.",
        variant: "destructive",
      });
      return;
    }

    const data = {
      suburbs: selectedSuburbs,
      centerAddress,
      radiusKm: parseInt(radiusKm) || 20,
    };

    updateServiceAreaMutation.mutate(data);
  };

  if (statesLoading || serviceAreasLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading service area settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-6">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/provider-dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Service Areas</h1>
              <p className="text-lg text-gray-600 mt-2">
                Define where you provide services to customers
              </p>
            </div>
            <Badge variant="outline" className="text-sm">
              Step 3 of 4
            </Badge>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>Registration Progress</span>
            <span>75% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-red-600 h-2 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Area Selection */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Service Center & Radius
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="centerAddress">Business Address (Service Center)</Label>
                  <Input
                    id="centerAddress"
                    value={centerAddress}
                    onChange={(e) => setCenterAddress(e.target.value)}
                    placeholder="Enter your business address"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This will be the center point for your service radius
                  </p>
                </div>

                <div>
                  <Label htmlFor="radiusKm">Service Radius (kilometers)</Label>
                  <Select value={radiusKm} onValueChange={setRadiusKm}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select radius" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 km</SelectItem>
                      <SelectItem value="10">10 km</SelectItem>
                      <SelectItem value="15">15 km</SelectItem>
                      <SelectItem value="20">20 km</SelectItem>
                      <SelectItem value="25">25 km</SelectItem>
                      <SelectItem value="30">30 km</SelectItem>
                      <SelectItem value="40">40 km</SelectItem>
                      <SelectItem value="50">50 km</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location Selection</CardTitle>
                <p className="text-sm text-gray-600">
                  Choose specific suburbs you want to service
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>State</Label>
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state: any) => (
                        <SelectItem key={state.id} value={state.id.toString()}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedState && (
                  <div>
                    <Label>Region</Label>
                    {regionsLoading ? (
                      <div className="mt-1 p-2 text-sm text-gray-500">Loading regions...</div>
                    ) : (
                      <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          {regions.map((region: any) => (
                            <SelectItem key={region.id} value={region.id.toString()}>
                              {region.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                )}

                {selectedRegion && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Available Suburbs</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleAddAllSuburbs}
                        disabled={addAllSuburbsMutation.isPending}
                      >
                        {addAllSuburbsMutation.isPending ? (
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        ) : (
                          <Plus className="h-3 w-3 mr-1" />
                        )}
                        Add All Suburbs
                      </Button>
                    </div>
                    
                    {suburbsLoading ? (
                      <div className="p-4 text-sm text-gray-500 text-center">Loading suburbs...</div>
                    ) : suburbs.length === 0 ? (
                      <div className="p-4 text-sm text-gray-500 text-center">No suburbs found</div>
                    ) : (
                      <div className="max-h-64 overflow-y-auto border rounded-md p-2 space-y-1">
                        {suburbs.map((suburb: any) => {
                          const isSelected = selectedSuburbs.find(s => s.id === suburb.id);
                          return (
                            <div
                              key={suburb.id}
                              className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                                isSelected ? 'bg-red-50 border border-red-200' : 'hover:bg-gray-50'
                              }`}
                              onClick={() => handleSuburbToggle(suburb)}
                            >
                              <span className="text-sm">{suburb.name} ({suburb.postcode})</span>
                              {isSelected && <Check className="h-4 w-4 text-red-600" />}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Selected Areas */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Selected Service Areas</CardTitle>
                <p className="text-sm text-gray-600">
                  {selectedSuburbs.length} suburb{selectedSuburbs.length !== 1 ? 's' : ''} selected
                </p>
              </CardHeader>
              <CardContent>
                {selectedSuburbs.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Areas Selected</h3>
                    <p className="text-gray-500">
                      Select suburbs from the left panel to define your service area.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {selectedSuburbs.map((suburb) => (
                      <div
                        key={suburb.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <span className="font-medium">{suburb.name}</span>
                          <span className="text-sm text-gray-500 ml-2">({suburb.postcode})</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSuburbToggle(suburb)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Service Summary */}
                {selectedSuburbs.length > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Service Coverage Summary</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>• Service Center: {centerAddress || "Not set"}</p>
                      <p>• Service Radius: {radiusKm} kilometers</p>
                      <p>• Specific Areas: {selectedSuburbs.length} suburb{selectedSuburbs.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/provider-dashboard")}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    onClick={handleSave}
                    disabled={selectedSuburbs.length === 0 || updateServiceAreaMutation.isPending}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {updateServiceAreaMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Service Area
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}