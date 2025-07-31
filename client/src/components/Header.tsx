import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { PawPrint, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  showNavigation?: boolean;
  showBackButton?: boolean;
  backButtonText?: string;
  backButtonPath?: string;
  title?: string;
  variant?: "default" | "simple" | "provider";
}

export function Header({ 
  showNavigation = true, 
  showBackButton = false,
  backButtonText = "Back",
  backButtonPath = "/",
  title,
  variant = "default"
}: HeaderProps) {
  const [, navigate] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const getBrandText = () => {
    switch (variant) {
      case "provider":
        return "ServicePanda Partners";
      default:
        return "ServicePanda";
    }
  };

  const getNavigationItems = () => {
    if (!showNavigation) return [];
    
    switch (variant) {
      case "provider":
        return [
          { label: "Provider Login", path: "/provider-login" },
          { label: "Join as Partner", path: "/provider-signup" },
          { label: "Customer Site", path: "/" }
        ];
      default:
        return [
          { label: "How it Works", path: "#how-it-works" },
          { label: "Pricing", path: "#pricing" },
          { label: "Support", path: "#support" },
          ...(isAuthenticated 
            ? [{ label: "Dashboard", path: "/dashboard" }]
            : [
                { label: "Sign In", path: "/auth" },
                { label: "Join as Partner", path: "/provider-signup" }
              ]
          )
        ];
    }
  };

  const navigationItems = getNavigationItems();

  if (variant === "simple") {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {showBackButton && (
                <Button
                  variant="ghost"
                  onClick={() => navigate(backButtonPath)}
                  className="mr-4"
                >
                  ← {backButtonText}
                </Button>
              )}
              <div className="flex items-center">
                <PawPrint className="h-8 w-8 text-primary mr-2" />
                <span className="text-xl font-bold text-gray-900">{getBrandText()}</span>
              </div>
            </div>
            {title && (
              <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {showBackButton && (
              <Button
                variant="ghost"
                onClick={() => navigate(backButtonPath)}
                className="mr-4"
              >
                ← {backButtonText}
              </Button>
            )}
            <div 
              className="flex-shrink-0 flex items-center cursor-pointer"
              onClick={() => navigate("/")}
            >
              <PawPrint className="h-8 w-8 text-primary mr-2" />
              <span className="text-xl font-bold text-gray-900">{getBrandText()}</span>
            </div>
          </div>

          {title && (
            <div className="flex items-center">
              <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            </div>
          )}
          
          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {navigationItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                onClick={() => handleNavigate(item.path)}
                className="text-gray-600 hover:text-primary"
              >
                {item.label}
              </Button>
            ))}
            
            {!isAuthenticated && variant === "default" && (
              <Button 
                onClick={() => navigate("/auth")} 
                className="bg-primary hover:bg-primary/90"
              >
                Book a Job
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  onClick={() => handleNavigate(item.path)}
                  className="w-full text-left justify-start text-gray-600 hover:text-primary"
                >
                  {item.label}
                </Button>
              ))}
              
              {!isAuthenticated && variant === "default" && (
                <Button 
                  onClick={() => handleNavigate("/auth")} 
                  className="w-full bg-primary hover:bg-primary/90 mt-2"
                >
                  Book a Job
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}