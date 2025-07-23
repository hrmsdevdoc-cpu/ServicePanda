import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { adminApiRequest, queryClient } from "@/lib/queryClient";
import { Gift, Plus, Users, DollarSign, Trash2, RotateCcw } from "lucide-react";

interface Voucher {
  id: number;
  code: string;
  value: string;
  description: string;
  status: 'active' | 'closed';
  redeemedBy?: number;
  redeemedAt?: string;
  createdBy: string;
  createdAt: string;
}

export default function AdminVoucherManagement() {
  const [bulkCount, setBulkCount] = useState("50");
  const [bulkValue, setBulkValue] = useState("50");
  const { toast } = useToast();

  // Fetch vouchers
  const { data: vouchers = [], isLoading } = useQuery({
    queryKey: ['/api/admin/vouchers'],
    queryFn: async () => {
      const response = await adminApiRequest('GET', '/api/admin/vouchers');
      return response.json();
    },
  });

  // Generate 6-digit alphanumeric code
  const generateVoucherCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Create bulk vouchers mutation
  const createBulkVouchersMutation = useMutation({
    mutationFn: async ({ count, value }: { count: number; value: number }) => {
      const vouchers = [];
      for (let i = 0; i < count; i++) {
        vouchers.push({
          code: generateVoucherCode(),
          value,
          description: `$${value} credit voucher - Bulk created`,
        });
      }
      
      const response = await adminApiRequest('POST', '/api/admin/vouchers/bulk', { vouchers });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/vouchers'] });
      toast({
        title: "Vouchers Created Successfully",
        description: `Created ${data.count} vouchers with $${bulkValue} each`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error Creating Vouchers",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete voucher mutation
  const deleteVoucherMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await adminApiRequest('DELETE', `/api/admin/vouchers/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/vouchers'] });
      toast({
        title: "Voucher Deleted",
        description: "Voucher has been removed successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Deleting Voucher",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Reset voucher status mutation (for testing)
  const resetVoucherMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await adminApiRequest('PUT', `/api/admin/vouchers/${id}/reset`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/vouchers'] });
      toast({
        title: "Voucher Reset",
        description: "Voucher has been reset to active status",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Resetting Voucher",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateBulkVouchers = () => {
    const count = parseInt(bulkCount);
    const value = parseFloat(bulkValue);
    
    if (count < 1 || count > 1000) {
      toast({
        title: "Invalid Count",
        description: "Please enter a count between 1 and 1000",
        variant: "destructive",
      });
      return;
    }
    
    if (value < 1 || value > 10000) {
      toast({
        title: "Invalid Value",
        description: "Please enter a value between $1 and $10,000",
        variant: "destructive",
      });
      return;
    }

    createBulkVouchersMutation.mutate({ count, value });
  };

  const activeVouchers = vouchers.filter((v: Voucher) => v.status === 'active');
  const redeemedVouchers = vouchers.filter((v: Voucher) => v.status === 'closed');

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Voucher Management</h1>
          <p className="text-gray-600">Create and manage provider vouchers</p>
        </div>
      </div>

      {/* Bulk Creation Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Create New Vouchers
          </CardTitle>
          <CardDescription>
            Generate multiple vouchers with unique 6-digit codes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="bulkCount">Number of Vouchers</Label>
              <Input
                id="bulkCount"
                type="number"
                value={bulkCount}
                onChange={(e) => setBulkCount(e.target.value)}
                placeholder="50"
                min="1"
                max="1000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bulkValue">Value per Voucher ($)</Label>
              <Input
                id="bulkValue"
                type="number"
                value={bulkValue}
                onChange={(e) => setBulkValue(e.target.value)}
                placeholder="50"
                min="1"
                max="10000"
              />
            </div>
            <Button 
              onClick={handleCreateBulkVouchers}
              disabled={createBulkVouchersMutation.isPending}
              className="w-full"
            >
              {createBulkVouchersMutation.isPending ? (
                "Creating..."
              ) : (
                <>
                  <Gift className="h-4 w-4 mr-2" />
                  Create {bulkCount} Vouchers for ${bulkValue} each
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vouchers</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vouchers.length}</div>
            <p className="text-xs text-muted-foreground">
              All created vouchers
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vouchers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeVouchers.length}</div>
            <p className="text-xs text-muted-foreground">
              Available for redemption
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Redeemed Vouchers</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{redeemedVouchers.length}</div>
            <p className="text-xs text-muted-foreground">
              Successfully used
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Vouchers List */}
      <Card>
        <CardHeader>
          <CardTitle>All Vouchers</CardTitle>
          <CardDescription>
            Manage existing vouchers and view redemption status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {vouchers.length === 0 ? (
            <div className="text-center py-8">
              <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No vouchers created</h3>
              <p className="text-gray-600 mb-4">Create your first batch of vouchers to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 border-b pb-2">
                <div className="col-span-2">Code</div>
                <div className="col-span-2">Value</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-3">Created</div>
                <div className="col-span-2">Redeemed</div>
                <div className="col-span-1">Actions</div>
              </div>
              {vouchers.map((voucher: Voucher) => (
                <div key={voucher.id} className="grid grid-cols-12 gap-4 items-center py-2 border-b border-gray-100">
                  <div className="col-span-2">
                    <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                      {voucher.code}
                    </code>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">${voucher.value}</span>
                  </div>
                  <div className="col-span-2">
                    <Badge variant={voucher.status === 'active' ? 'default' : 'secondary'}>
                      {voucher.status === 'active' ? 'Active' : 'Closed'}
                    </Badge>
                  </div>
                  <div className="col-span-3 text-sm text-gray-600">
                    {new Date(voucher.createdAt).toLocaleDateString()}
                    <br />
                    <span className="text-xs">by {voucher.createdBy}</span>
                  </div>
                  <div className="col-span-2 text-sm text-gray-600">
                    {voucher.redeemedAt ? (
                      <>
                        {new Date(voucher.redeemedAt).toLocaleDateString()}
                        <br />
                        <span className="text-xs">Provider ID: {voucher.redeemedBy}</span>
                      </>
                    ) : (
                      <span className="text-gray-400">Not redeemed</span>
                    )}
                  </div>
                  <div className="col-span-1 flex space-x-1">
                    {voucher.status === 'closed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => resetVoucherMutation.mutate(voucher.id)}
                        disabled={resetVoucherMutation.isPending}
                      >
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteVoucherMutation.mutate(voucher.id)}
                      disabled={deleteVoucherMutation.isPending}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
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