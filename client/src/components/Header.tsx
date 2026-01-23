import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { 
  PawPrint, 
  Search, 
  Menu, 
  X, 
  ChevronDown,
  Shield,
  Key
} from "lucide-react";

export default function Header() {
  const [, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [joinDropdownOpen, setJoinDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!joinDropdownOpen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const dropdown = document.querySelector('.join-us-dropdown');
      const button = target.closest('button');
      
      if (button?.textContent?.includes('Join Us')) return;
      if (dropdown?.contains(target)) return;
      
      setJoinDropdownOpen(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [joinDropdownOpen]);

  const handleBookJob = () => {
    navigate("/auth");
  };

  const handleJoinAsPartner = () => {
    navigate("/provider-signup");
  };

  const handlePartnerLogin = () => {
    navigate("/provider-login");
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    
    // Check if we're on the landing page
    const currentPath = window.location.pathname;
    if (currentPath !== '/' && currentPath !== '') {
      // If not on landing page, navigate to landing page first
      navigate('/');
      // Wait for navigation and page render, then scroll
      setTimeout(() => {
        scrollToSection(hash);
      }, 300);
    } else {
      // Already on landing page, scroll immediately
      scrollToSection(hash);
    }
    
    // Close mobile menu if open
    setMobileMenuOpen(false);
  };

  const scrollToSection = (hash: string) => {
    const elementId = hash.replace('#', '');
    const element = document.getElementById(elementId);
    
    if (element) {
      const headerHeight = 80; // Height of sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else {
      // If element not found, try again after a short delay (for dynamic content)
      setTimeout(() => {
        const retryElement = document.getElementById(elementId);
        if (retryElement) {
          const headerHeight = 80;
          const elementPosition = retryElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 200);
    }
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg' 
        : 'bg-white shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <div 
              className="flex-shrink-0 flex items-center cursor-pointer group" 
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'instant' });
                navigate('/');
                // Ensure scroll to top after navigation
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 100);
              }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all"></div>
                <PawPrint className="h-10 w-10 text-primary relative z-10 transform group-hover:scale-110 transition-transform" />
              </div>
              <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                ServicePanda
              </span>
            </div>
          </div>
          
          <div className="hidden sm:flex sm:items-center sm:space-x-2">
            <a 
              href="/#how-it-works" 
              onClick={(e) => handleSmoothScroll(e, '#how-it-works')}
              className="text-gray-700 hover:text-primary px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-primary/5"
            >
              How it Works
            </a>
            <button 
              onClick={() => navigate('/services')}
              className="text-gray-700 hover:text-primary px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-primary/5"
            >
              Services
            </button>
            <button 
              onClick={() => navigate('/reviews')}
              className="text-gray-700 hover:text-primary px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-primary/5"
            >
              Reviews
            </button>
            <button 
              onClick={() => navigate('/about-us')}
              className="text-gray-700 hover:text-primary px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-primary/5"
            >
              About Us
            </button>
            <button 
              onClick={() => navigate('/get-support')}
              className="text-gray-700 hover:text-primary px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-primary/5"
            >
              Support
            </button>
            
            <div className="h-8 w-px bg-gray-200 mx-2"></div>
            
            <Button 
              onClick={handleBookJob} 
              className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5"
            >
              <Search className="w-4 h-4 mr-2" />
              Book a Job
            </Button>
            
            {/* Join Us Dropdown */}
            <div className="relative">
              <Button 
                variant="outline"
                onClick={() => setJoinDropdownOpen(!joinDropdownOpen)}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-0 shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-600/30 transition-all transform hover:-translate-y-0.5"
              >
                Join Us
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${joinDropdownOpen ? 'rotate-180' : ''}`} />
              </Button>
              
              {joinDropdownOpen && (
                <div className="join-us-dropdown absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        handleJoinAsPartner();
                        setJoinDropdownOpen(false);
                      }}
                      className="flex w-full px-5 py-4 text-left hover:bg-gradient-to-r hover:from-green-50 hover:to-green-50/50 transition-all group"
                    >
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-green-200 transition-colors">
                        <Shield className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">Join as a Partner</div>
                        <div className="text-sm text-gray-500">Start earning today</div>
                      </div>
                    </button>
                    <hr className="border-gray-100 my-1" />
                    <button
                      onClick={() => {
                        handlePartnerLogin();
                        setJoinDropdownOpen(false);
                      }}
                      className="flex w-full px-5 py-4 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-50/50 transition-all group"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                        <Key className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Partner Login</div>
                        <div className="text-sm text-gray-500">Access dashboard</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="sm:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-gray-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a 
              href="/#how-it-works" 
              onClick={(e) => handleSmoothScroll(e, '#how-it-works')}
              className="block px-3 py-2 text-gray-700 hover:text-primary hover:bg-primary/5 rounded-md text-base font-medium"
            >
              How it Works
            </a>
            <button 
              onClick={() => {
                navigate('/services');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left block px-3 py-2 text-gray-700 hover:text-primary hover:bg-primary/5 rounded-md text-base font-medium"
            >
              Services
            </button>
            <button 
              onClick={() => {
                navigate('/reviews');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left block px-3 py-2 text-gray-700 hover:text-primary hover:bg-primary/5 rounded-md text-base font-medium"
            >
              Reviews
            </button>
            <button 
              onClick={() => {
                navigate('/about-us');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left block px-3 py-2 text-gray-700 hover:text-primary hover:bg-primary/5 rounded-md text-base font-medium"
            >
              About Us
            </button>
            <button 
              onClick={() => {
                navigate('/get-support');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left block px-3 py-2 text-gray-700 hover:text-primary hover:bg-primary/5 rounded-md text-base font-medium"
            >
              Support
            </button>
            <Button 
              onClick={handleBookJob} 
              className="w-full mt-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white"
            >
              <Search className="w-4 h-4 mr-2" />
              Book a Job
            </Button>
            <Button 
              onClick={handleJoinAsPartner} 
              variant="outline"
              className="w-full mt-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-0"
            >
              Join as Partner
            </Button>
            <Button 
              onClick={handlePartnerLogin} 
              variant="outline"
              className="w-full mt-2"
            >
              Partner Login
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
