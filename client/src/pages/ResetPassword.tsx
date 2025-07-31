import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PawPrint, ArrowLeft, CheckCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [isReset, setIsReset] = useState(false);

  // Get token from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get('token');
    if (!resetToken) {
      toast({
        title: "Invalid Reset Link",
        description: "This password reset link is invalid or expired.",
        variant: "destructive",
      });
      setLocation('/auth');
      return;
    }
    setToken(resetToken);
  }, []);

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ password, token }: { password: string; token: string }) => {
      const response = await apiRequest("POST", "/api/auth/reset-password", { 
        newPassword: password, 
        token 
      });
      return response.json();
    },
    onSuccess: () => {
      setIsReset(true);
      toast({
        title: "Password reset successful!",
        description: "Your password has been updated. You can now sign in with your new password.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Reset failed",
        description: error.message || "Failed to reset password. The link may be expired.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim() || !confirmPassword.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both password fields",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    resetPasswordMutation.mutate({ password, token });
  };

  if (isReset) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          variant="simple"
          showBackButton={false}
          showNavigation={false}
          title="Password Reset Complete"
        />
        
        <div className="flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Password Reset Complete</CardTitle>
              <CardDescription>
                Your password has been successfully updated
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setLocation('/auth')}
                className="w-full"
              >
                Sign In Now
              </Button>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        variant="simple"
        showBackButton={true}
        backButtonText="Back to Login"
        backButtonPath="/auth"
        showNavigation={false}
        title="Reset Password"
      />
      
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

        <Card>
          <CardHeader>
            <CardTitle>Reset your password</CardTitle>
            <CardDescription>
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                  required
                />
                <p className="text-xs text-gray-600 mt-1">
                  Password must be at least 8 characters long
                </p>
              </div>
              
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={resetPasswordMutation.isPending}
              >
                {resetPasswordMutation.isPending ? "Updating password..." : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}