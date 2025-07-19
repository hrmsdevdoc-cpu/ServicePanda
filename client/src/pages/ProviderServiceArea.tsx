import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { LocationServiceAreaForm } from "@/components/LocationServiceAreaForm";

export default function ProviderServiceArea() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [serviceAreas, setServiceAreas] = useState([]);

  // Fetch provider profile for initial address
  const { data: providerProfileData } = useQuery({
    queryKey: ["/api/provider/profile"],
    retry: false,
  });

  const handleServiceAreasChange = (areas: any[]) => {
    setServiceAreas(areas);
  };

  if (!providerProfileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading provider information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Service Areas</h1>
            <p className="text-lg text-gray-600 mt-2">
              Define your service locations with coverage radius
            </p>
          </div>
        </div>

        {/* Exact replication of Step 3 from registration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              <h2 className="text-2xl font-bold mb-2">Service Areas</h2>
              <p className="text-gray-600 font-normal">
                Define your service locations with coverage radius
              </p>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <LocationServiceAreaForm
              providerId={parseInt(localStorage.getItem('providerId') || '0')}
              initialAddress={providerProfileData?.address || ""}
              onServiceAreasChange={handleServiceAreasChange}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}