import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft, MapPin, Calendar as CalendarIconLucide, FileText, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function RequestService() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    categoryId: "",
    postcode: "",
    suburb: "",
    preferredDate: undefined as Date | undefined,
    description: "",
  });
  
  const [step, setStep] = useState(1);
  const [postcodeSearch, setPostcodeSearch] = useState("");

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/service-categories"],
  });

  const { data: suburbs = [] } = useQuery({
    queryKey: [`/api/suburbs/${postcodeSearch}`],
    enabled: postcodeSearch.length >= 4,
  });

  const createServiceRequestMutation = useMutation({
    mutationFn: async (requestData: any) => {
      const response = await apiRequest("POST", "/api/service-requests", requestData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Service Request Created!",
        description: "We're finding service providers in your area.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/service-requests"] });
      navigate("/");
    },
    onError: (error: any) => {
      toast({
        title: "Request Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!user) {
      toast({
        title: "Please Sign In",
        description: "You need to be signed in to request services.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!formData.categoryId || !formData.postcode || !formData.suburb || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createServiceRequestMutation.mutate({
      customerId: user.id,
      categoryId: parseInt(formData.categoryId),
      postcode: formData.postcode,
      suburb: formData.suburb,
      preferredDate: formData.preferredDate?.toISOString(),
      description: formData.description,
      status: "open",
    });
  };

  const selectedCategory = categories.find((cat: any) => cat.id.toString() === formData.categoryId);

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Request a Service</h1>
            <p className="text-gray-600 mt-2">Tell us what you need help with</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                What type of service do you need?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((category: any) => (
                  <Button
                    key={category.id}
                    variant={formData.categoryId === category.id.toString() ? "default" : "outline"}
                    className="h-auto p-4 text-left justify-start"
                    onClick={() => {
                      setFormData({ ...formData, categoryId: category.id.toString() });
                      setStep(2);
                    }}
                  >
                    <div>
                      <div className="font-semibold">{category.name}</div>
                      <div className="text-sm text-gray-500 mt-1">{category.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setStep(1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Service Selection
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Request Details</h1>
          <p className="text-gray-600 mt-2">
            Service: <span className="font-semibold text-primary">{selectedCategory?.name}</span>
          </p>
        </div>

        <div className="space-y-6">
          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="postcode">Postcode *</Label>
                <Input
                  id="postcode"
                  value={postcodeSearch}
                  onChange={(e) => {
                    setPostcodeSearch(e.target.value);
                    setFormData({ ...formData, postcode: e.target.value, suburb: "" });
                  }}
                  placeholder="Enter postcode (e.g., 2000)"
                  maxLength={4}
                />
              </div>
              
              {suburbs.length > 0 && (
                <div>
                  <Label htmlFor="suburb">Suburb *</Label>
                  <Select
                    value={formData.suburb}
                    onValueChange={(value) => setFormData({ ...formData, suburb: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select suburb" />
                    </SelectTrigger>
                    <SelectContent>
                      {suburbs.map((suburb: any) => (
                        <SelectItem key={suburb.id} value={suburb.suburb}>
                          {suburb.suburb}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preferred Date */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIconLucide className="h-5 w-5 mr-2 text-primary" />
                Preferred Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.preferredDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.preferredDate ? (
                      format(formData.preferredDate, "PPP")
                    ) : (
                      <span>Pick a date (optional)</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.preferredDate}
                    onSelect={(date) => setFormData({ ...formData, preferredDate: date })}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-primary" />
                Service Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="description">Please explain what you need done *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your service requirements in detail..."
                rows={5}
                className="mt-2"
              />
              <p className="text-sm text-gray-500 mt-2">
                Be as specific as possible to help providers give you accurate quotes
              </p>
            </CardContent>
          </Card>

          {/* Submit */}
          <Card>
            <CardContent className="pt-6">
              <Button
                onClick={handleSubmit}
                disabled={createServiceRequestMutation.isPending}
                className="w-full"
                size="lg"
              >
                {createServiceRequestMutation.isPending ? (
                  <>
                    <Search className="mr-2 h-4 w-4 animate-spin" />
                    Finding Providers...
                  </>
                ) : (
                  "Submit Service Request"
                )}
              </Button>
              <p className="text-sm text-gray-500 text-center mt-3">
                We'll match you with qualified service providers in your area
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}