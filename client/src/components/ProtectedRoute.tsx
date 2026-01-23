import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApiRequest } from '@/lib/adminAuth';
import { useLocation } from 'wouter';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPermissions = [], 
  fallback = <div>Access Denied</div> 
}) => {
  const [, setLocation] = useLocation();

  // Fetch current user's role and permissions
  const { data: currentUser, isLoading: userLoading } = useQuery({
    queryKey: ['adminUser'],
    queryFn: async () => {
      const response = await adminApiRequest("GET", "/api/admin/current-user");
      return response.json();
    },
  });

  // Fetch all roles to get permissions for current user's role
  const { data: roles, isLoading: rolesLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const response = await adminApiRequest("GET", "/api/admin/roles");
      return response.json();
    },
  });

  // Check if user has required permissions
  const hasRequiredPermissions = () => {
    if (!currentUser || !roles || requiredPermissions.length === 0) {
      return true; // No specific permissions required
    }
    
    // Special case for super_admin - give all permissions
    if (currentUser.role === 'super_admin') {
      return true; // Super admin has access to everything
    }
    
    const userRole = roles.find((role: any) => role.name === currentUser.role);
    if (!userRole) return false;
    
    const userPermissions = userRole.permissions || [];
    
    // Map permission names to IDs (this should match the database)
    const permissionMap: { [key: string]: number } = {
      'dashboard': 1,
      'providers': 2,
      'leads': 5,
      'potential_customers': 7,
      'potential_providers': 8,
      'vouchers': 9,
      'email': 10,
      'sms': 11,
      'reports': 12,
      'settings': 14,
      'admin_users': 15,
      'departments': 16,
      'role_and_permissions': 17,
      'mailgun_settings': 18,
      'lead_settings': 19,
      'terms_and_conditions': 20,
      'service_type': 21,
      'change_password': 22,
      'stripe_settings': 23,
    };

    // Check if user has all required permissions
    return requiredPermissions.every(permission => {
      const permissionId = permissionMap[permission];
      return permissionId ? userPermissions.includes(permissionId) : false;
    });
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('adminToken');
    return !!token && !!currentUser;
  };

  // Debug logging
  console.log('ProtectedRoute Debug:', {
    currentUser: currentUser?.role,
    requiredPermissions,
    hasRequiredPermissions: hasRequiredPermissions(),
    isAuthenticated: isAuthenticated()
  });

  // Loading state
  if (userLoading || rolesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated()) {
    setLocation('/admin-login');
    return null;
  }

  // Authenticated but doesn't have required permissions
  if (!hasRequiredPermissions()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-sm text-gray-500 mb-4">
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => setLocation('/admin')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // User has required permissions - render children
  return <>{children}</>;
};

export default ProtectedRoute;
