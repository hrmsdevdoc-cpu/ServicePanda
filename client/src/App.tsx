import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import AuthPage from "@/pages/AuthPage";
import CustomerDashboard from "@/pages/CustomerDashboard";
import ProviderSignup from "@/pages/ProviderSignup";
import ProviderLogin from "@/pages/ProviderLogin";
import AdminLogin from "@/pages/AdminLogin";
import ProviderDashboard from "@/pages/ProviderDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import SimpleAdminDashboard from "@/pages/SimpleAdminDashboard";
import RequestService from "@/pages/RequestService";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <Switch>
      {/* Public routes - available to everyone */}
      <Route path="/auth" component={AuthPage} />
      <Route path="/provider-signup" component={ProviderSignup} />
      <Route path="/provider-login" component={ProviderLogin} />
      <Route path="/admin-login" component={AdminLogin} />
      
      {/* Provider routes - accessible with provider authentication */}
      <Route path="/provider-dashboard" component={ProviderDashboard} />
      
      {/* Admin routes - accessible with admin authentication */}
      <Route path="/admin" component={AdminDashboard} />
      
      {/* Customer routes based on authentication */}
      {!isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={CustomerDashboard} />
          <Route path="/request-service" component={RequestService} />
        </>
      )}
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
