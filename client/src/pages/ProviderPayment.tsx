import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ProviderSidebar from "@/components/ProviderSidebar";
import StripeCardForm from "@/components/StripeCardForm";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import {
  CreditCard,
  Plus,
  Star,
  Trash2,
  AlertCircle,
  CheckCircle,
  Menu,
  X,
} from "lucide-react";

// Initialize Stripe
let stripePromise: Promise<any> | null = null;

const getStripe = async () => {
  if (!stripePromise) {
    try {
      // Get Stripe public key from backend
      const response = await fetch('/api/config/stripe');
      const config = await response.json();
      
      if (config.publicKey && config.configured) {
        stripePromise = loadStripe(config.publicKey);
      } else {
        console.error('Stripe public key not configured');
        return null;
      }
    } catch (error) {
      console.error('Failed to load Stripe configuration:', error);
      return null;
    }
  }
  return stripePromise;
};

export default function ProviderPayment() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [showAddCard, setShowAddCard] = useState(false);
  const [stripeReady, setStripeReady] = useState(false);
  const [stripe, setStripe] = useState<any>(null);
  
  // Dashboard-style navigation state
  const [activeMenuItem, setActiveMenuItem] = useState("payment");
  const [expandedMenus, setExpandedMenus] = useState(["leads", "settings"]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initialize Stripe
  useEffect(() => {
    getStripe().then((stripeInstance) => {
      if (stripeInstance) {
        setStripe(stripeInstance);
        setStripeReady(true);
      }
    });
  }, []);

  // Get provider ID from localStorage
  const providerId = localStorage.getItem('providerId');

  // Fetch provider profile data
  const { data: provider } = useQuery<any>({
    queryKey: ["/api/provider/profile"],
    retry: false,
  });

  // Fetch leads for new leads count
  const { data: leads = [] } = useQuery<any[]>({
    queryKey: ["/api/provider/leads"],
    retry: false,
  });

  const newLeadsCount = leads.filter((l: any) => l.status === 'new').length;

  // Fetch provider payment methods
  const { data: paymentMethods = [], isLoading: loadingPayments } = useQuery({
    queryKey: ["/api/provider/payment-methods"],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/provider/${providerId}/payment-methods`);
      return await response.json();
    },
    retry: false,
    enabled: !!providerId,
  });

  // Set primary payment method mutation
  const setPrimaryMutation = useMutation({
    mutationFn: async (paymentMethodId: number) => {
      const response = await apiRequest("PUT", `/api/provider/${providerId}/payment-methods/${paymentMethodId}/primary`);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Primary payment method updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/provider/payment-methods"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update primary payment method.",
        variant: "destructive",
      });
    },
  });

  // Delete payment method mutation
  const deletePaymentMethodMutation = useMutation({
    mutationFn: async (paymentMethodId: number) => {
      const response = await apiRequest("DELETE", `/api/provider/${providerId}/payment-methods/${paymentMethodId}`);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Payment method removed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/provider/payment-methods"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove payment method.",
        variant: "destructive",
      });
    },
  });

  const handleAddCardSuccess = () => {
    setShowAddCard(false);
  };

  const handleAddCardCancel = () => {
    setShowAddCard(false);
  };

  const formatCardBrand = (brand: string) => {
    switch (brand?.toLowerCase()) {
      case 'visa': return 'Visa';
      case 'mastercard': return 'Mastercard';
      case 'amex': return 'American Express';
      case 'discover': return 'Discover';
      default: return brand;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-sm border-b p-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Payment Methods</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <ProviderSidebar
          provider={provider}
          activeMenuItem={activeMenuItem}
          setActiveMenuItem={setActiveMenuItem}
          expandedMenus={expandedMenus}
          setExpandedMenus={setExpandedMenus}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          newLeadsCount={newLeadsCount}
          navigate={navigate}
        />

        {/* Main Content */}
        <div className="flex-1 md:ml-64">
          <div className="p-6 max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Methods</h1>
              <p className="text-gray-600">
                Manage your payment methods for receiving leads. Your payment method will be charged when you accept a lead.
              </p>
            </div>

            {/* Payment Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Payment Methods</p>
                      <p className="text-2xl font-bold text-gray-900">{paymentMethods.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Status</p>
                      <p className="text-lg font-bold text-green-600">
                        {paymentMethods.length > 0 ? 'Ready' : 'Setup Required'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <AlertCircle className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Free Leads</p>
                      <p className="text-2xl font-bold text-orange-600">3</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Methods List */}
            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Your Payment Methods</CardTitle>
                <Button
                  onClick={() => setShowAddCard(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={!stripeReady}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </CardHeader>
              <CardContent>
                {loadingPayments ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading payment methods...</p>
                  </div>
                ) : paymentMethods.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No payment methods</h3>
                    <p className="text-gray-600 mb-4">
                      Add a payment method to start receiving leads.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paymentMethods.map((method: any) => (
                      <div
                        key={method.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <CreditCard className="h-8 w-8 text-gray-600" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {formatCardBrand(method.cardBrand)} **** **** **** {method.cardLastFour}
                            </p>
                            <p className="text-sm text-gray-600">
                              Expires {method.cardExpMonth}/{method.cardExpYear}
                            </p>
                          </div>
                          {method.isPrimary && (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <Star className="h-3 w-3 mr-1" />
                              Primary
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {!method.isPrimary && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPrimaryMutation.mutate(method.id)}
                              disabled={setPrimaryMutation.isPending}
                            >
                              Set Primary
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deletePaymentMethodMutation.mutate(method.id)}
                            disabled={deletePaymentMethodMutation.isPending}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Add New Card Form with Stripe Elements */}
            {showAddCard && (
              <Card>
                <CardHeader>
                  <CardTitle>Add New Payment Method</CardTitle>
                  <p className="text-sm text-gray-600">
                    Your card information is securely processed by Stripe and never stored on our servers.
                  </p>
                </CardHeader>
                <CardContent>
                  {stripeReady && stripe && providerId ? (
                    <Elements stripe={stripe}>
                      <StripeCardForm
                        providerId={providerId}
                        onSuccess={handleAddCardSuccess}
                        onCancel={handleAddCardCancel}
                      />
                    </Elements>
                  ) : (
                    <div className="text-center py-8">
                      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                      <p className="text-gray-600 mt-2">Loading secure payment form...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Information Section */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">How Billing Works</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Your first 3 leads are completely FREE</li>
                      <li>• After that, you're charged only when you accept a lead</li>
                      <li>• Pricing varies by service category and location</li>
                      <li>• Charges are processed using your primary payment method</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Security & Privacy</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• All payments processed securely by Stripe</li>
                      <li>• Your card details are never stored on our servers</li>
                      <li>• Industry-standard encryption protects your data</li>
                      <li>• PCI DSS compliant payment processing</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}