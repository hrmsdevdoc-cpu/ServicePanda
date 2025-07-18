import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ServiceCard } from "@/components/ServiceCard";
import { useQuery } from "@tanstack/react-query";
import { 
  Home, 
  Key, 
  Sofa, 
  Bug, 
  Sprout, 
  Truck, 
  Wrench, 
  Zap, 
  PawPrint, 
  Shield, 
  Clock, 
  Star,
  Menu,
  X
} from "lucide-react";

const serviceIcons = {
  "domestic-cleaning": Home,
  "bond-cleaning": Key,
  "carpet-cleaning": Sofa,
  "pest-control": Bug,
  "gardening": Sprout,
  "removals": Truck,
  "handyman": Wrench,
  "electrician": Zap,
};

export default function Landing() {
  const [, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/service-categories"],
  });

  const handleSignIn = () => {
    navigate("/auth");
  };

  const handleJoinProvider = () => {
    navigate("/provider-signup");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <PawPrint className="h-8 w-8 text-primary mr-2" />
                <span className="text-xl font-bold text-gray-900">ServicePanda</span>
              </div>
            </div>
            
            <div className="hidden sm:flex sm:items-center sm:space-x-4">
              <a href="#" className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium">
                How it Works
              </a>
              <a href="#" className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium">
                Pricing
              </a>
              <a href="#" className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium">
                Support
              </a>
              <Button onClick={handleSignIn} className="bg-primary hover:bg-primary/90">
                Sign In
              </Button>
              <Button onClick={handleJoinProvider} className="bg-green-600 hover:bg-green-700">
                Join as Provider
              </Button>
            </div>
            
            <div className="sm:hidden flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#" className="block px-3 py-2 text-gray-600 hover:text-primary">
                How it Works
              </a>
              <a href="#" className="block px-3 py-2 text-gray-600 hover:text-primary">
                Pricing
              </a>
              <a href="#" className="block px-3 py-2 text-gray-600 hover:text-primary">
                Support
              </a>
              <Button onClick={handleSignIn} className="w-full mt-2">
                Sign In
              </Button>
              <Button onClick={handleJoinProvider} className="w-full mt-2 bg-green-600 hover:bg-green-700">
                Join as Provider
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Professional Home Services<br />
              <span className="text-blue-200">Made Simple</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Connect with trusted, verified service providers across Australia. From cleaning to plumbing, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Button
                size="lg"
                onClick={handleSignIn}
                className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-4"
              >
                Find Services
              </Button>
              <Button
                size="lg"
                onClick={handleJoinProvider}
                className="bg-green-600 hover:bg-green-700 text-lg px-8 py-4"
              >
                Become a Provider
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional services delivered by verified providers across Australia
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category: any) => (
              <ServiceCard
                key={category.id}
                title={category.name}
                description={category.description}
                icon={serviceIcons[category.name.toLowerCase().replace(' ', '-')] || Home}
                onClick={() => handleSignIn()}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose ServicePanda?</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Verified Professionals</h3>
              <p className="text-gray-600">All service providers are licensed, insured, and police checked</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Booking</h3>
              <p className="text-gray-600">Get quotes within hours and book services instantly</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quality Guarantee</h3>
              <p className="text-gray-600">100% satisfaction guarantee on all services</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <PawPrint className="h-8 w-8 text-primary mr-2" />
              <span className="text-xl font-bold">ServicePanda</span>
            </div>
            <p className="text-gray-400">Professional Home Services Made Simple</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
