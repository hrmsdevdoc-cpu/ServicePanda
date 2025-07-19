import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ReactNode, useEffect, useState } from 'react';
import { apiRequest } from '@/lib/queryClient';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_mock');

interface StripeWrapperProps {
  children: ReactNode;
}

export function StripeWrapper({ children }: StripeWrapperProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  return (
    <Elements 
      stripe={stripePromise} 
      options={{ 
        mode: 'setup',
        currency: 'aud',
        setupFutureUsage: 'off_session'
      }}
    >
      {children}
    </Elements>
  );
}