import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import AuthPage from "@/pages/AuthPage";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import CustomerDashboard from "@/pages/CustomerDashboard";
import ProviderSignup from "@/pages/ProviderSignup";
import ProviderLogin from "@/pages/ProviderLogin";
import ProviderForgotPassword from "@/pages/ProviderForgotPassword";
import ProviderResetPassword from "@/pages/ProviderResetPassword";
import AdminLogin from "@/pages/AdminLogin";
import ProviderDashboard from "@/pages/ProviderDashboard";
import ProviderPayment from "@/pages/ProviderPayment";
import ProviderServices from "@/pages/ProviderServices";
import ProviderServiceArea from "@/pages/ProviderServiceArea";
import ProviderDocuments from "@/pages/ProviderDocuments";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminSettings from "@/pages/AdminSettings";
import AdminStripeConfig from "@/pages/AdminStripeConfig";
import AdminMailgunConfig from "@/pages/AdminMailgunConfig";
import SimpleAdminDashboard from "@/pages/SimpleAdminDashboard";
// New Admin Pages
import AdminPendingProviders from "@/pages/admin/AdminPendingProviders";
import AdminViewProviders from "@/pages/admin/AdminViewProviders";
import AdminViewUsers from "@/pages/admin/AdminViewUsers";
import AdminLeads from "@/pages/AdminLeads";
import AdminLeadSettings from "@/pages/AdminLeadSettings";
import AdminUserReports from "@/pages/admin/AdminUserReports";
import AdminProviderReports from "@/pages/admin/AdminProviderReports";
import AdminDailyReports from "@/pages/admin/AdminDailyReports";
import AdminStripeSettings from "@/pages/admin/AdminStripeSettings";
import AdminMailgunSettings from "@/pages/admin/AdminMailgunSettings";
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
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/provider-signup" component={ProviderSignup} />
      <Route path="/provider-login" component={ProviderLogin} />
      <Route path="/provider-forgot-password" component={ProviderForgotPassword} />
      <Route path="/provider-reset-password" component={ProviderResetPassword} />
      <Route path="/admin-login" component={AdminLogin} />
      
      {/* Provider routes - accessible with provider authentication */}
      <Route path="/provider-dashboard" component={ProviderDashboard} />
      <Route path="/provider-payment" component={ProviderPayment} />
      <Route path="/provider-services" component={ProviderServices} />
      <Route path="/provider-service-area" component={ProviderServiceArea} />
      <Route path="/provider-documents" component={ProviderDocuments} />
      
      {/* Admin routes - accessible with admin authentication */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin-dashboard" component={AdminDashboard} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route path="/admin/stripe-config" component={AdminStripeConfig} />
      <Route path="/admin/mailgun-config" component={AdminMailgunConfig} />
      
      {/* New Admin Routes with Sidebar Layout */}
      <Route path="/admin/providers/pending" component={AdminPendingProviders} />
      <Route path="/admin/providers" component={AdminViewProviders} />
      <Route path="/admin/users" component={AdminViewUsers} />
      <Route path="/admin/leads" component={AdminLeads} />
      <Route path="/admin/lead-settings" component={AdminLeadSettings} />
      <Route path="/admin/reports/users" component={AdminUserReports} />
      <Route path="/admin/reports/providers" component={AdminProviderReports} />
      <Route path="/admin/reports/daily" component={AdminDailyReports} />
      <Route path="/admin/settings/stripe" component={AdminStripeSettings} />
      <Route path="/admin/settings/mailgun" component={AdminMailgunSettings} />
      
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
