import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CreditCard,
  Plus,
  ArrowLeft,
  Star,
  Trash2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const addCardSchema = z.object({
  cardNumber: z.string().min(16, "Card number must be at least 16 digits").max(19, "Card number is too long"),
  expiryMonth: z.string().min(2, "Month required").max(2, "Invalid month"),
  expiryYear: z.string().min(4, "Year required").max(4, "Invalid year"),
  cvv: z.string().min(3, "CVV must be at least 3 digits").max(4, "CVV is too long"),
  cardholderName: z.string().min(2, "Cardholder name is required"),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions"
  }),
});

type AddCardFormData = z.infer<typeof addCardSchema>;

export default function ProviderPayment() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [showAddCard, setShowAddCard] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<AddCardFormData>({
    resolver: zodResolver(addCardSchema),
    defaultValues: {
      agreeToTerms: false,
    },
  });

  const agreeToTerms = watch("agreeToTerms");

  // Fetch provider payment methods
  const { data: paymentMethods = [], isLoading: loadingPayments } = useQuery({
    queryKey: ["/api/provider/payment-methods"],
    retry: false,
  });

  // Add payment method mutation
  const addPaymentMethodMutation = useMutation({
    mutationFn: async (data: AddCardFormData) => {
      const response = await apiRequest("POST", "/api/provider/payment-methods", {
        cardNumber: data.cardNumber,
        expiryMonth: data.expiryMonth,
        expiryYear: data.expiryYear,
        cvv: data.cvv,
        cardholderName: data.cardholderName,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Payment method added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/provider/payment-methods"] });
      setShowAddCard(false);
      reset();
      setIsAddingCard(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add payment method.",
        variant: "destructive",
      });
      setIsAddingCard(false);
    },
  });

  // Set primary payment method mutation
  const setPrimaryMutation = useMutation({
    mutationFn: async (paymentMethodId: number) => {
      await apiRequest("PUT", `/api/provider/payment-methods/${paymentMethodId}/primary`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Primary payment method updated.",
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
      await apiRequest("DELETE", `/api/provider/payment-methods/${paymentMethodId}`);
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

  const onSubmit = async (data: AddCardFormData) => {
    setIsAddingCard(true);
    addPaymentMethodMutation.mutate(data);
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setValue("cardNumber", formatted);
  };

  const getCardBrand = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\D/g, '');
    if (cleaned.startsWith('4')) return 'Visa';
    if (cleaned.startsWith('5') || cleaned.startsWith('2')) return 'Mastercard';
    if (cleaned.startsWith('3')) return 'Amex';
    return 'Card';
  };

  const maskCardNumber = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\D/g, '');
    return `**** **** **** ${cleaned.slice(-4)}`;
  };

  if (loadingPayments) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment methods...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => navigate("/provider-dashboard")}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
                <p className="text-sm text-gray-600">Manage your credit card details and billing information</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Existing Payment Methods */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Your Payment Methods
                </CardTitle>
                <Button
                  onClick={() => setShowAddCard(true)}
                  className="bg-red-600 hover:bg-red-700"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Card
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {paymentMethods.length === 0 ? (
                <div className="text-center py-12">
                  <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Payment Methods</h3>
                  <p className="text-gray-500 mb-4">Add a credit card to start receiving leads</p>
                  <Button
                    onClick={() => setShowAddCard(true)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Card
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {paymentMethods.map((method: any) => (
                    <div
                      key={method.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center">
                        <CreditCard className="h-6 w-6 text-gray-400 mr-3" />
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium">{getCardBrand(method.cardNumber)}</span>
                            <span className="ml-2 text-gray-600">{maskCardNumber(method.cardNumber)}</span>
                            {method.isPrimary && (
                              <Badge className="ml-3 bg-green-100 text-green-800">
                                <Star className="h-3 w-3 mr-1" />
                                Primary
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {method.cardholderName} • Expires {method.expiryMonth}/{method.expiryYear}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {!method.isPrimary && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPrimaryMutation.mutate(method.id)}
                            disabled={setPrimaryMutation.isPending}
                          >
                            Make Primary
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

          {/* Add New Card Form */}
          {showAddCard && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Card Number */}
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      {...register("cardNumber")}
                      onChange={handleCardNumberChange}
                      className={errors.cardNumber ? "border-red-500" : ""}
                    />
                    {errors.cardNumber && (
                      <p className="text-sm text-red-600">{errors.cardNumber.message}</p>
                    )}
                  </div>

                  {/* Cardholder Name */}
                  <div className="space-y-2">
                    <Label htmlFor="cardholderName">Cardholder Name *</Label>
                    <Input
                      id="cardholderName"
                      placeholder="John Smith"
                      {...register("cardholderName")}
                      className={errors.cardholderName ? "border-red-500" : ""}
                    />
                    {errors.cardholderName && (
                      <p className="text-sm text-red-600">{errors.cardholderName.message}</p>
                    )}
                  </div>

                  {/* Expiry and CVV */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryMonth">Month *</Label>
                      <Input
                        id="expiryMonth"
                        placeholder="MM"
                        maxLength={2}
                        {...register("expiryMonth")}
                        className={errors.expiryMonth ? "border-red-500" : ""}
                      />
                      {errors.expiryMonth && (
                        <p className="text-sm text-red-600">{errors.expiryMonth.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiryYear">Year *</Label>
                      <Input
                        id="expiryYear"
                        placeholder="YYYY"
                        maxLength={4}
                        {...register("expiryYear")}
                        className={errors.expiryYear ? "border-red-500" : ""}
                      />
                      {errors.expiryYear && (
                        <p className="text-sm text-red-600">{errors.expiryYear.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        maxLength={4}
                        {...register("cvv")}
                        className={errors.cvv ? "border-red-500" : ""}
                      />
                      {errors.cvv && (
                        <p className="text-sm text-red-600">{errors.cvv.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 max-h-40 overflow-y-auto">
                      <h4 className="font-medium mb-2">Terms and Conditions</h4>
                      <div className="text-sm text-gray-700 space-y-2">
                        <p>
                          <strong>Payment Terms:</strong> By adding your payment method, you agree to be charged for leads according to our pricing structure.
                        </p>
                        <p>
                          <strong>Lead Pricing:</strong> You will be charged per lead based on the service category and location. Your first 3 leads are FREE.
                        </p>
                        <p>
                          <strong>Billing:</strong> Charges will be processed automatically using your primary payment method when you accept a lead.
                        </p>
                        <p>
                          <strong>Refunds:</strong> Lead charges are non-refundable unless the lead is determined to be fraudulent or duplicate.
                        </p>
                        <p>
                          <strong>Security:</strong> Your payment information is securely processed and stored using industry-standard encryption.
                        </p>
                        <p>
                          <strong>Updates:</strong> You can update or remove payment methods at any time from your dashboard.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="agreeToTerms"
                        checked={agreeToTerms}
                        onCheckedChange={(checked) => setValue("agreeToTerms", !!checked)}
                      />
                      <div className="space-y-1">
                        <Label htmlFor="agreeToTerms" className="text-sm font-medium">
                          I agree to the above terms and conditions *
                        </Label>
                        {errors.agreeToTerms && (
                          <p className="text-sm text-red-600">{errors.agreeToTerms.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowAddCard(false);
                        reset();
                      }}
                      disabled={isAddingCard}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-red-600 hover:bg-red-700"
                      disabled={isAddingCard || !agreeToTerms}
                    >
                      {isAddingCard ? "Adding..." : "Add Payment Method"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Important Notice */}
          <Card className="mt-8 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Important Information</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Remember, your first 3 leads are completely FREE! After that, you'll only be charged when you choose to accept a lead.
                    You can manage your payment methods and view billing history anytime from this page.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}