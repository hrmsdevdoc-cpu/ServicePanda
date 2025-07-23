import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { adminApiRequest, queryClient } from "@/lib/queryClient";
import { Gift, Plus, Edit, Trash2, Users, DollarSign, Calendar, Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const voucherSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters").max(50, "Code too long"),
  value: z.string().min(1, "Value is required"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  usageLimit: z.string().optional(),
  expiresAt: z.string().optional(),
  isActive: z.boolean().default(true),
});

interface Voucher {
  id: number;
  code: string;
  value: string;
  description: string;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
  expiresAt?: string;
  createdBy: string;
  createdAt: string;
}

export default function AdminVoucherManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof voucherSchema>>({
    resolver: zodResolver(voucherSchema),
    defaultValues: {
      code: "",
      value: "",
      description: "",
      usageLimit: "",
      expiresAt: "",
      isActive: true,
    },
  });

  // Fetch vouchers
  const { data: vouchers = [], isLoading } = useQuery({
    queryKey: ['/api/admin/vouchers'],
    queryFn: async () => {
      const response = await adminApiRequest('GET', '/api/admin/vouchers');
      return response.json();
    },
  });

  // Create voucher mutation
  const createVoucherMutation = useMutation({
    mutationFn: async (data: z.infer<typeof voucherSchema>) => {
      const payload = {
        ...data,
        value: parseFloat(data.value),
        usageLimit: data.usageLimit ? parseInt(data.usageLimit) : null,
        expiresAt: data.expiresAt || null,
      };
      const response = await adminApiRequest('POST', '/api/admin/vouchers', payload);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Voucher Created",
        description: "New voucher has been created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/vouchers'] });
      setIsCreateDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create Voucher",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update voucher mutation
  const updateVoucherMutation = useMutation({
    mutationFn: async (data: { id: number } & z.infer<typeof voucherSchema>) => {
      const payload = {
        ...data,
        value: parseFloat(data.value),
        usageLimit: data.usageLimit ? parseInt(data.usageLimit) : null,
        expiresAt: data.expiresAt || null,
      };
      const response = await adminApiRequest('PUT', `/api/admin/vouchers/${data.id}`, payload);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Voucher Updated",
        description: "Voucher has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/vouchers'] });
      setEditingVoucher(null);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Update Voucher",
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
      toast({
        title: "Voucher Deleted",
        description: "Voucher has been deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/vouchers'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Delete Voucher",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof voucherSchema>) => {
    if (editingVoucher) {
      updateVoucherMutation.mutate({ ...data, id: editingVoucher.id });
    } else {
      createVoucherMutation.mutate(data);
    }
  };

  const openEditDialog = (voucher: Voucher) => {
    setEditingVoucher(voucher);
    form.reset({
      code: voucher.code,
      value: voucher.value,
      description: voucher.description,
      usageLimit: voucher.usageLimit?.toString() || "",
      expiresAt: voucher.expiresAt ? new Date(voucher.expiresAt).toISOString().split('T')[0] : "",
      isActive: voucher.isActive,
    });
  };

  const closeDialog = () => {
    setIsCreateDialogOpen(false);
    setEditingVoucher(null);
    form.reset();
  };

  const isDialogOpen = isCreateDialogOpen || !!editingVoucher;

  const totalVoucherValue = vouchers.reduce((sum: number, voucher: Voucher) => 
    sum + (parseFloat(voucher.value) * voucher.usageCount), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Voucher Management</h1>
          <p className="text-gray-600">
            Create and manage vouchers that customers can give to providers for credit
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) closeDialog();
          else setIsCreateDialogOpen(true);
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Voucher
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingVoucher ? 'Edit Voucher' : 'Create New Voucher'}
              </DialogTitle>
              <DialogDescription>
                {editingVoucher 
                  ? 'Update the voucher details below' 
                  : 'Create a new voucher that customers can give to providers for credit'
                }
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Voucher Code</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., CUSTOMER50" {...field} />
                        </FormControl>
                        <FormDescription>
                          Unique code customers will share with providers
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Credit Value ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="50.00" {...field} />
                        </FormControl>
                        <FormDescription>
                          Dollar amount providers receive
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Customer referral discount - $50 credit for new providers"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Description of what this voucher is for
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="usageLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Usage Limit (optional)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="100" {...field} />
                        </FormControl>
                        <FormDescription>
                          Max redemptions (leave empty for unlimited)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="expiresAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date (optional)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription>
                          When voucher expires (leave empty for no expiry)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active Status</FormLabel>
                        <FormDescription>
                          Whether this voucher can be redeemed
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={closeDialog}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createVoucherMutation.isPending || updateVoucherMutation.isPending}
                  >
                    {createVoucherMutation.isPending || updateVoucherMutation.isPending 
                      ? "Saving..." 
                      : editingVoucher ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vouchers</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vouchers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vouchers</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vouchers.filter((v: Voucher) => v.isActive).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Redemptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {vouchers.reduce((sum: number, v: Voucher) => sum + v.usageCount, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credits Distributed</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalVoucherValue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Vouchers List */}
      <Card>
        <CardHeader>
          <CardTitle>All Vouchers</CardTitle>
          <CardDescription>
            Manage vouchers that customers can give to providers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading vouchers...</p>
            </div>
          ) : vouchers.length === 0 ? (
            <div className="text-center py-8">
              <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No vouchers yet</h3>
              <p className="text-gray-500 mb-4">
                Create your first voucher to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {vouchers.map((voucher: Voucher) => (
                <div 
                  key={voucher.id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium">{voucher.code}</h3>
                        <Badge variant={voucher.isActive ? "default" : "secondary"}>
                          {voucher.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">
                          ${voucher.value}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-2">{voucher.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>
                          Used: {voucher.usageCount}
                          {voucher.usageLimit ? `/${voucher.usageLimit}` : ' (unlimited)'}
                        </span>
                        {voucher.expiresAt && (
                          <span>
                            Expires: {new Date(voucher.expiresAt).toLocaleDateString()}
                          </span>
                        )}
                        <span>
                          Created: {new Date(voucher.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(voucher)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteVoucherMutation.mutate(voucher.id)}
                        disabled={deleteVoucherMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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