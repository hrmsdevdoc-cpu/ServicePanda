import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { CreditCard, Gift, History, DollarSign } from "lucide-react";

interface CreditTransaction {
  id: number;
  transactionType: string;
  amount: string;
  balanceBefore: string;
  balanceAfter: string;
  description: string;
  voucherCode?: string;
  createdAt: string;
}

interface Voucher {
  id: number;
  code: string;
  value: string;
  description: string;
  usageLimit?: number;
  usageCount: number;
}

export default function ProviderCreditSystem() {
  const [voucherCode, setVoucherCode] = useState("");
  const { toast } = useToast();

  // Fetch credit balance
  const { data: balanceData, isLoading: balanceLoading } = useQuery({
    queryKey: ['/api/provider/credit/balance'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/provider/credit/balance');
      return response.json();
    },
  });

  // Fetch transactions
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['/api/provider/credit/transactions'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/provider/credit/transactions');
      return response.json();
    },
  });

  // Fetch available vouchers
  const { data: vouchers = [], isLoading: vouchersLoading } = useQuery({
    queryKey: ['/api/provider/vouchers/available'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/provider/vouchers/available');
      return response.json();
    },
  });

  // Redeem voucher mutation
  const redeemVoucherMutation = useMutation({
    mutationFn: async (voucherCode: string) => {
      const response = await apiRequest('POST', '/api/provider/credit/redeem-voucher', { voucherCode });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Voucher Redeemed Successfully!",
          description: data.message,
          variant: "default",
        });
        setVoucherCode("");
        queryClient.invalidateQueries({ queryKey: ['/api/provider/credit/balance'] });
        queryClient.invalidateQueries({ queryKey: ['/api/provider/credit/transactions'] });
      } else {
        toast({
          title: "Voucher Redemption Failed",
          description: data.message,
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Redemption Error",
        description: error.message || "Failed to redeem voucher",
        variant: "destructive",
      });
    },
  });

  const handleRedeemVoucher = () => {
    if (!voucherCode.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a voucher code",
        variant: "destructive",
      });
      return;
    }
    redeemVoucherMutation.mutate(voucherCode.trim());
  };

  const formatTransactionType = (type: string) => {
    switch (type) {
      case 'voucher_redemption': return 'Voucher Redeemed';
      case 'free_lead': return 'Free Lead Used';
      case 'debit': return 'Lead Purchase';
      case 'credit': return 'Credit Added';
      default: return type;
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'voucher_redemption': return <Gift className="h-4 w-4 text-green-600" />;
      case 'free_lead': return <DollarSign className="h-4 w-4 text-blue-600" />;
      case 'debit': return <CreditCard className="h-4 w-4 text-red-600" />;
      default: return <History className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Credit Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Credit Balance
          </CardTitle>
          <CardDescription>
            Your current credit balance and free leads status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {balanceLoading ? (
            <div className="h-8 bg-gray-200 animate-pulse rounded" />
          ) : (
            <div className="text-3xl font-bold text-green-600">
              ${balanceData?.balance?.toFixed(2) || '0.00'}
            </div>
          )}
          <p className="text-sm text-muted-foreground mt-2">
            Use credits to purchase leads at discounted rates
          </p>
        </CardContent>
      </Card>

      {/* Voucher Redemption Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Redeem Voucher
          </CardTitle>
          <CardDescription>
            Enter a voucher code to add credit to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter voucher code (e.g., WELCOME50)"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleRedeemVoucher}
              disabled={redeemVoucherMutation.isPending || !voucherCode.trim()}
            >
              {redeemVoucherMutation.isPending ? "Redeeming..." : "Redeem"}
            </Button>
          </div>

          {/* Available Vouchers */}
          {!vouchersLoading && vouchers.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium mb-3">Available Vouchers:</h4>
              <div className="grid gap-2">
                {vouchers.map((voucher: Voucher) => (
                  <div 
                    key={voucher.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                  >
                    <div>
                      <div className="font-medium">{voucher.code}</div>
                      <div className="text-sm text-muted-foreground">
                        {voucher.description}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">${voucher.value}</Badge>
                      {voucher.usageLimit && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {voucher.usageCount}/{voucher.usageLimit} used
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction History Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Transaction History
          </CardTitle>
          <CardDescription>
            Recent credit transactions and lead purchases
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactionsLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 animate-pulse rounded" />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No transactions yet. Redeem a voucher to get started!
            </p>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction: CreditTransaction) => (
                <div 
                  key={transaction.id}
                  className="flex items-start gap-3 p-3 border rounded-lg"
                >
                  {getTransactionIcon(transaction.transactionType)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">
                        {formatTransactionType(transaction.transactionType)}
                      </div>
                      <div className={`font-medium ${
                        parseFloat(transaction.amount) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {parseFloat(transaction.amount) >= 0 ? '+' : ''}${transaction.amount}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.description}
                    </div>
                    {transaction.voucherCode && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        {transaction.voucherCode}
                      </Badge>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(transaction.createdAt).toLocaleString()} • 
                      Balance: ${transaction.balanceAfter}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}