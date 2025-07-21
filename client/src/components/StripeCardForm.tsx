import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';

interface StripeCardFormProps {
  providerId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
      padding: '12px',
    },
    invalid: {
      color: '#9e2146',
    },
  },
  hidePostalCode: true,
};

export default function StripeCardForm({ providerId, onSuccess, onCancel }: StripeCardFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardholderName, setCardholderName] = useState('');

  const addPaymentMethodMutation = useMutation({
    mutationFn: async (paymentMethodId: string) => {
      const response = await apiRequest("POST", `/api/provider/${providerId}/stripe-payment-methods`, {
        paymentMethodId
      });
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Payment method added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/provider/payment-methods"] });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add payment method.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!cardholderName.trim()) {
      toast({
        title: "Error",
        description: "Please enter the cardholder name.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setIsProcessing(false);
      return;
    }

    try {
      // Create payment method with Stripe
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: cardholderName,
        },
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to create payment method.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      // Save payment method to our backend
      if (paymentMethod) {
        addPaymentMethodMutation.mutate(paymentMethod.id);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-2">
          Cardholder Name *
        </label>
        <input
          id="cardholderName"
          type="text"
          placeholder="John Smith"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Information *
        </label>
        <div className="border border-gray-300 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

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
            <strong>Security:</strong> Your payment information is securely processed by Stripe and never stored on our servers.
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!stripe || isProcessing}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isProcessing ? 'Processing...' : 'Add Payment Method'}
        </Button>
      </div>
    </form>
  );
}