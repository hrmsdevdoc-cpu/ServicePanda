import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { ServiceCard } from "@/components/ServiceCard";
import { useQuery } from "@tanstack/react-query";
import API_BASE_URL from "@/lib/apiConfig";
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
  X,
  Search,
  Snowflake,
  Paintbrush,
  ShieldCheck,
  Waves,
  Square,
  Settings,
  Sun,
  TreePine,
  ChevronDown
} from "lucide-react";

const serviceIcons = {
  "home": Home,
  "key": Key,
  "sofa": Sofa,
  "bug": Bug,
  "sprout": Sprout,
  "truck": Truck,
  "wrench": Wrench,
  "zap": Zap,
  "snowflake": Snowflake,
  "paintbrush": Paintbrush,
  "shield-check": ShieldCheck,
  "waves": Waves,
  "square": Square,
  "settings": Settings,
  "sun": Sun,
  "tree-pine": TreePine,
};

export default function Landing() {
  const [, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllServices, setShowAllServices] = useState(false);
  const [joinDropdownOpen, setJoinDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(['hero']));
  
  const heroRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);
  const customerAppRef = useRef<HTMLDivElement>(null);
  const providerAppRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!joinDropdownOpen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const dropdown = document.querySelector('.join-us-dropdown');
      const button = target.closest('button');
      
      // Don't close if clicking the button (toggle handles it) or inside dropdown
      if (button?.textContent?.includes('Join Us')) return;
      if (dropdown?.contains(target)) return;
      
      setJoinDropdownOpen(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [joinDropdownOpen]);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('data-section');
          if (sectionId) {
            setVisibleSections((prev) => new Set(prev).add(sectionId));
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const sections = [
      { ref: heroRef, id: 'hero' },
      { ref: servicesRef, id: 'services' },
      { ref: trustRef, id: 'trust' },
      { ref: customerAppRef, id: 'customer-app' },
      { ref: providerAppRef, id: 'provider-app' },
      { ref: ctaRef, id: 'cta' },
      { ref: testimonialsRef, id: 'testimonials' }
    ];

    sections.forEach(({ ref }) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      sections.forEach(({ ref }) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ["/api/service-categories"],
  });

  // Filter categories based on search term
  const filteredCategories = (categories as any[]).filter((category: any) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Split categories into popular and others
  const popularCategories = filteredCategories.filter((cat: any) => cat.popular);
  const otherCategories = filteredCategories.filter((cat: any) => !cat.popular);
  
  // Determine which categories to show
  const categoriesToShow = showAllServices ? filteredCategories : popularCategories;

  const handleBookJob = () => {
    navigate("/auth");
  };

  const handleJoinAsPartner = () => {
    navigate("/provider-signup");
  };

  const getSectionAnimation = (sectionId: string) => {
    const isVisible = visibleSections.has(sectionId);
    return `transition-all duration-1000 ${
      isVisible 
        ? 'opacity-100 translate-y-0' 
        : 'opacity-0 translate-y-10'
    }`;
  };

  const handlePartnerLogin = () => {
    // TODO: Create provider login page
    navigate("/provider-login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-white shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center cursor-pointer group" onClick={() => navigate('/')}>
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
              <a href="#services" className="text-gray-700 hover:text-primary px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-primary/5">
                Services
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-primary px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-primary/5">
                How it Works
              </a>
              <a href="#testimonials" className="text-gray-700 hover:text-primary px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-primary/5">
                Reviews
              </a>
              <a href="#contact" className="text-gray-700 hover:text-primary px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-primary/5">
                Support
              </a>
              
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
              <Button onClick={handleBookJob} className="w-full mt-2">
                Book a Job
              </Button>
              <Button onClick={handleJoinAsPartner} className="w-full mt-2 bg-green-600 hover:bg-green-700">
                Join us as a Partner
              </Button>
              <Button onClick={handlePartnerLogin} className="w-full mt-2" variant="outline">
                Partner Login
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section with Slider */}
      <section 
        ref={heroRef}
        data-section="hero"
        className={`bg-gradient-to-br from-primary to-blue-700 text-white py-16 relative overflow-hidden min-h-[550px] flex items-center ${getSectionAnimation('hero')}`}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.15
          }}></div>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/95 to-blue-700/95"></div>
        </div>
        
        {/* Background Pattern/Image */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        {/* Animated Background Decorative Elements */}
        <div 
          className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl transition-transform duration-1000"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        ></div>
        <div 
          className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl transition-transform duration-1000"
          style={{
            transform: `translate(${-mousePosition.x * 0.01}px, ${-mousePosition.y * 0.01}px)`
          }}
        ></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-bounce" style={{animationDuration: '3s', animationDelay: '0s'}}>
          <div className="w-16 h-16 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20"></div>
        </div>
        <div className="absolute top-40 right-20 animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}>
          <div className="w-12 h-12 bg-white/10 rounded-full backdrop-blur-sm border border-white/20"></div>
        </div>
        <div className="absolute bottom-32 right-40 animate-bounce" style={{animationDuration: '3.5s', animationDelay: '0.5s'}}>
          <div className="w-20 h-20 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 rotate-12"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Quality Home Services<br />
                <span className="text-blue-200">At Your Fingertips</span>
            </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                Get instant access to Australia's most trusted and verified service providers. From home cleaning to plumbing repairs, we've got the perfect professional for every job.
            </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                size="lg"
                onClick={handleBookJob}
                className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-4"
              >
                Book a Job
              </Button>
              <Button
                size="lg"
                onClick={handleJoinAsPartner}
                className="bg-green-600 hover:bg-green-700 text-lg px-8 py-4"
              >
                Join us as a Partner
              </Button>
            </div>
              {/* Stats with Animation */}
              <div className="grid grid-cols-3 gap-6 mt-12">
                <div className="group cursor-default">
                  <div className="text-4xl font-bold mb-1 group-hover:scale-110 transition-transform">2,500+</div>
                  <div className="text-blue-200 text-sm">Verified Providers</div>
          </div>
                <div className="group cursor-default">
                  <div className="text-4xl font-bold mb-1 group-hover:scale-110 transition-transform">15,000+</div>
                  <div className="text-blue-200 text-sm">Jobs Completed</div>
        </div>
                <div className="group cursor-default">
                  <div className="text-4xl font-bold mb-1 group-hover:scale-110 transition-transform">4.9★</div>
                  <div className="text-blue-200 text-sm">Average Rating</div>
                </div>
              </div>
            </div>
            
            {/* Right Image/Visual */}
            <div className="relative hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                <div className="space-y-4">
                  {/* Service Preview Cards */}
                  {(categories as any[]).slice(0, 3).map((category: any, index: number) => {
                    const IconComponent = serviceIcons[category.icon as keyof typeof serviceIcons] || Home;
                    return (
                      <div key={category.id} className="bg-white rounded-lg p-4 flex items-center gap-4 shadow-lg transform hover:scale-105 transition-all" style={{animation: `slideIn 0.5s ease-out ${index * 0.2}s both`}}>
                        {category.imageUrl ? (
                          <img 
                            src={`${API_BASE_URL}${category.imageUrl}`}
                            alt={category.name}
                            className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.removeAttribute('style');
                            }}
                          />
                        ) : null}
                        <div className={`w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center ${category.imageUrl ? 'hidden' : ''}`}>
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{category.name}</div>
                          <div className="text-sm text-gray-500">{category.description?.substring(0, 30)}...</div>
                        </div>
                        <Badge className="bg-green-500">Popular</Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <style>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}</style>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-14 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get your job done in three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-20 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary via-green-500 to-orange-500 opacity-20"></div>
            
            {/* Step 1 */}
            <div className="relative text-center">
              <div className="relative inline-block mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-primary to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform">
                  <Search className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-3 -right-3 w-14 h-14 bg-white border-4 border-primary rounded-full flex items-center justify-center text-primary font-bold text-2xl shadow-lg">
                  1
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Choose Your Service</h3>
              <p className="text-gray-600">Browse our wide range of professional home services and select what you need</p>
            </div>
            
            {/* Step 2 */}
            <div className="relative text-center">
              <div className="relative inline-block mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform">
                  <Star className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-3 -right-3 w-14 h-14 bg-white border-4 border-green-600 rounded-full flex items-center justify-center text-green-600 font-bold text-2xl shadow-lg">
                  2
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Get Matched Instantly</h3>
              <p className="text-gray-600">Receive competitive quotes from verified professionals in your area within hours</p>
            </div>
            
            {/* Step 3 */}
            <div className="relative text-center">
              <div className="relative inline-block mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform">
                  <ShieldCheck className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-3 -right-3 w-14 h-14 bg-white border-4 border-orange-600 rounded-full flex items-center justify-center text-orange-600 font-bold text-2xl shadow-lg">
                  3
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Book & Relax</h3>
              <p className="text-gray-600">Choose your provider, book the service, and enjoy peace of mind with our guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section 
        ref={servicesRef}
        data-section="services"
        id="services" 
        className={`py-14 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-50 relative overflow-hidden ${getSectionAnimation('services')}`}
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary"></div>
              <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-semibold">
                ⚡ Our Services
              </Badge>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary"></div>
            </div>
            
            {/* Title */}
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Browse Professional Services
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              From home cleaning to emergency repairs, find trusted professionals for every job across Australia
            </p>
            
            {/* Search Bar - Enhanced */}
            <div className="max-w-2xl mx-auto mb-10">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="relative flex items-center bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-200 overflow-hidden">
                  <Search className="absolute left-5 text-gray-400 h-5 w-5 z-10" />
                <Input
                  type="text"
                    placeholder="Search for services... (e.g., plumbing, cleaning, electrical)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-14 pr-4 py-6 text-base border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Service Type Toggle - Enhanced */}
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              <button
                onClick={() => setShowAllServices(false)}
                className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  !showAllServices
                    ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg shadow-primary/30 scale-105'
                    : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-primary/30 hover:shadow-md'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                Most Popular ({popularCategories.length})
                </span>
              </button>
              <button
                onClick={() => setShowAllServices(true)}
                className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  showAllServices
                    ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg shadow-primary/30 scale-105'
                    : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-primary/30 hover:shadow-md'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                All Services ({filteredCategories.length})
                </span>
              </button>
            </div>
            
            {/* Results count */}
            <p className="text-sm text-gray-500 mt-4">
              {searchTerm ? (
                <>Showing {categoriesToShow.length} results for "{searchTerm}"</>
              ) : (
                <>Showing {categoriesToShow.length} services</>
              )}
            </p>
          </div>
          
          {/* Categories Grid with Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoriesToShow.map((category: any) => {
              const IconComponent = serviceIcons[category.icon as keyof typeof serviceIcons] || Home;
              const hasImage = category.imageUrl;
              
              return (
                <Card 
                key={category.id}
                  className="cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group border-gray-200 bg-white"
                onClick={() => handleBookJob()}
                >
                  <CardContent className="p-0">
                    {/* Service Image/Icon Container */}
                    <div className="relative h-48 bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
                      {hasImage ? (
                        <>
                          <img 
                            src={`${API_BASE_URL}${category.imageUrl}`}
                            alt={category.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling;
                              if (fallback) {
                                (fallback as HTMLElement).classList.remove('hidden');
                              }
                            }}
                          />
                          {/* Fallback icon if image fails */}
                          <div className="hidden absolute inset-0 bg-gradient-to-br from-primary/10 to-blue-100 flex flex-col items-center justify-center">
                            <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                              <IconComponent className="w-10 h-10 text-primary" />
          </div>
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-blue-100 flex flex-col items-center justify-center">
                          <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <IconComponent className="w-10 h-10 text-primary" />
                          </div>
                        </div>
                      )}
                      
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Popular Badge */}
                      {category.popular && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-orange-500 text-white border-0 shadow-lg px-3 py-1 text-xs font-semibold">
                            🔥 Popular
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    {/* Service Info */}
                    <div className="p-5 bg-white">
                      <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4 min-h-[40px]">
                        {category.description || 'Professional service delivered by verified providers'}
                      </p>
                      
                      {/* Action Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <span className="text-xs text-gray-500 font-medium">Available 24/7</span>
                        <div className="flex items-center text-sm text-primary font-semibold group-hover:text-blue-700 transition-colors">
                          <span>Book Now</span>
                          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {/* If no services match search */}
          {categoriesToShow.length === 0 && !searchTerm && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-600 text-lg font-medium mb-2">No services available yet</p>
              <p className="text-gray-500 text-sm">We're working on adding more services for you!</p>
            </div>
          )}
          
          {/* No Results Message */}
          {filteredCategories.length === 0 && searchTerm && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No services found for "{searchTerm}"</p>
              <Button 
                variant="link" 
                onClick={() => setSearchTerm("")}
                className="mt-2"
              >
                Clear search
              </Button>
            </div>
          )}
          
          {/* Other Categories Section */}
          {!showAllServices && otherCategories.length > 0 && !searchTerm && (
            <div className="mt-12">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">More Services</h3>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAllServices(true)}
                  className="mb-4"
                >
                  View All {(categories as any[]).length} Services
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Trust Section */}
      <section 
        ref={trustRef}
        data-section="trust"
        className={`py-14 bg-white ${getSectionAnimation('trust')}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose ServicePanda?</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Verified Professionals</h3>
              <p className="text-gray-600">All service providers are licensed, insured, and police checked for your safety and peace of mind</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Booking</h3>
              <p className="text-gray-600">Get matched with qualified providers instantly and receive competitive quotes within hours</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quality Guarantee</h3>
              <p className="text-gray-600">100% satisfaction guarantee with every booking or your money back, no questions asked</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer App Section */}
      <section 
        ref={customerAppRef}
        data-section="customer-app"
        className={`py-16 bg-gradient-to-br from-blue-50 to-white relative overflow-hidden ${getSectionAnimation('customer-app')}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5">
                  📱 Customer App
                </Badge>
            </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Book Services <br/>
                <span className="text-primary">On The Go</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Download our mobile app and get instant access to thousands of trusted service providers. Book, track, and manage all your home services from your phone.
              </p>
              
              {/* Features List */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Verified Providers</h4>
                    <p className="text-sm text-gray-600">All professionals are background checked and verified</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Real-Time Tracking</h4>
                    <p className="text-sm text-gray-600">Track your service requests and get instant updates</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Star className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Easy Payments</h4>
                    <p className="text-sm text-gray-600">Secure in-app payments with multiple options</p>
                  </div>
                </div>
              </div>
              
              {/* App Store Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#" className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all transform hover:-translate-y-1 shadow-lg">
                  <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="text-lg font-semibold -mt-1">App Store</div>
                  </div>
                </a>
                <a href="#" className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all transform hover:-translate-y-1 shadow-lg">
                  <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">GET IT ON</div>
                    <div className="text-lg font-semibold -mt-1">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
            
            {/* Right - Phone Mockup */}
            <div className="relative">
              <div className="relative z-10 max-w-sm mx-auto">
                <div className="bg-gradient-to-br from-primary to-blue-600 rounded-[3rem] p-4 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="bg-white rounded-[2.5rem] overflow-hidden">
                    <div className="h-[600px] bg-white flex flex-col relative">
                      {/* Blue Header */}
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 px-4 py-4 pb-6 rounded-t-[2.5rem]">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                              A
                            </div>
                            <div>
                              <div className="text-white text-xs font-medium mb-0.5">Welcome back!</div>
                              <div className="text-white text-base font-bold leading-none">Alice B Thompson</div>
                            </div>
                          </div>
                          <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center relative">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">4</div>
                          </button>
                        </div>
                        <div className="text-white text-sm mb-3">What service do you need today?</div>
                        
                        {/* Stats Bar */}
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 flex items-center justify-around">
          <div className="text-center">
                            <div className="text-white text-2xl font-bold">156</div>
                            <div className="text-white/80 text-xs">Services</div>
            </div>
                          <div className="w-px h-8 bg-white/20"></div>
                          <div className="text-center">
                            <div className="text-white text-2xl font-bold">4.9</div>
                            <div className="text-white/80 text-xs">Rating</div>
                          </div>
                          <div className="w-px h-8 bg-white/20"></div>
                          <div className="text-center">
                            <div className="text-white text-2xl font-bold">59</div>
                            <div className="text-white/80 text-xs">Active</div>
                          </div>
                        </div>
                      </div>

                      {/* Action Cards Grid */}
                      <div className="px-4 py-4 flex-1">
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          {/* Request Service */}
                          <div className="bg-blue-50 rounded-2xl p-4 flex flex-col items-center justify-center">
                            <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center mb-3">
                              <Wrench className="w-7 h-7 text-white" />
                            </div>
                            <div className="text-sm font-bold text-gray-900 mb-1">Request Service</div>
                            <div className="text-xs text-gray-500 text-center">Get quotes from providers</div>
                          </div>

                          {/* Track Request */}
                          <div className="bg-green-50 rounded-2xl p-4 flex flex-col items-center justify-center">
                            <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center mb-3">
                              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                              </svg>
                            </div>
                            <div className="text-sm font-bold text-gray-900 mb-1">Track Request</div>
                            <div className="text-xs text-gray-500 text-center">Monitor your requests</div>
                          </div>

                          {/* Reviews */}
                          <div className="bg-orange-50 rounded-2xl p-4 flex flex-col items-center justify-center">
                            <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center mb-3">
                              <Star className="w-7 h-7 text-white fill-white" />
                            </div>
                            <div className="text-sm font-bold text-gray-900 mb-1">Reviews</div>
                            <div className="text-xs text-gray-500 text-center">View your reviews</div>
                          </div>

                          {/* Profile */}
                          <div className="bg-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center">
                            <div className="w-14 h-14 bg-gray-500 rounded-full flex items-center justify-center mb-3">
                              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div className="text-sm font-bold text-gray-900 mb-1">Profile</div>
                            <div className="text-xs text-gray-500 text-center">Manage your account</div>
                          </div>
                        </div>

                        {/* Featured Services */}
                        <div className="mb-3">
                          <div className="text-base font-bold text-gray-900 mb-2">Featured Services</div>
                          <div className="bg-gray-200 rounded-2xl h-24 overflow-hidden">
                            <img 
                              src="https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=200&fit=crop"
                              alt="Plumbing"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Bottom Navigation */}
                      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 flex justify-between items-center rounded-b-[2.5rem]">
                        <div className="flex flex-col items-center gap-0.5 flex-1">
                          <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                          </svg>
                          <span className="text-[9px] font-medium text-blue-500">Home</span>
                        </div>
                        <div className="flex flex-col items-center gap-0.5 flex-1 opacity-50">
                          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-[9px] font-medium text-gray-600">Requests</span>
                        </div>
                        <div className="flex flex-col items-center -mt-6">
                          <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                          <span className="text-[9px] font-medium text-blue-500 mt-1">Add</span>
                        </div>
                        <div className="flex flex-col items-center gap-0.5 flex-1 opacity-50">
                          <Star className="w-6 h-6 text-gray-600" />
                          <span className="text-[9px] font-medium text-gray-600">Review</span>
                        </div>
                        <div className="flex flex-col items-center gap-0.5 flex-1 opacity-50">
                          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="text-[9px] font-medium text-gray-600">Profile</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Provider App Section */}
      <section 
        ref={providerAppRef}
        data-section="provider-app"
        className={`py-16 bg-gradient-to-br from-green-50 to-white relative overflow-hidden ${getSectionAnimation('provider-app')}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left - Phone Mockup */}
            <div className="relative order-2 md:order-1">
              <div className="relative z-10 max-w-sm mx-auto">
                <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-[3rem] p-4 shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="bg-white rounded-[2.5rem] overflow-hidden">
                    <div className="h-[600px] bg-white p-3 flex flex-col relative">
                      {/* Header Bar */}
                      <div className="bg-primary rounded-t-[2rem] px-4 py-3 flex items-center justify-between mb-4">
                        <button className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                          </svg>
                        </button>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-white/20 rounded flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="text-left">
                            <div className="text-white text-sm font-bold leading-none">ServicePanda</div>
                            <div className="text-blue-100 text-[10px] leading-none">Partners</div>
                          </div>
                        </div>
                        <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center relative shadow-md">
                          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">21</div>
                        </button>
                      </div>

                      {/* Welcome Section with Hand */}
                      <div className="px-4 mb-4 relative">
                        <div className="text-xs text-gray-500 mb-0.5">Welcome back!</div>
                        <div className="text-2xl font-black text-gray-900 mb-1">JOHN</div>
                        <div className="text-[11px] text-gray-500 leading-tight pr-16">Here's what's happening with your<br/>business today</div>
                        <div className="absolute right-4 top-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl">
                          👋
                        </div>
                      </div>

                      {/* Stats Cards */}
                      <div className="px-4 mb-3">
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div className="bg-white rounded-2xl p-3 shadow-md border border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                                <span className="text-[10px] font-bold text-blue-600">NEW</span>
                              </div>
                              <div className="bg-blue-500 text-white text-[9px] font-bold px-2 py-0.5 rounded">NEW</div>
                            </div>
                            <div className="text-3xl font-black text-gray-900 mb-1">57</div>
                            <div className="text-[11px] text-gray-600 font-medium mb-2">New Leads Available</div>
                            <div className="text-[10px] text-green-600 font-medium flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
                              📈 +12% this week
                            </div>
                          </div>
                          
                          <div className="bg-white rounded-2xl p-3 shadow-md border border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                              <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center text-lg">
                                ⚡
                              </div>
                              <div className="bg-blue-500 text-white text-[9px] font-bold px-2 py-0.5 rounded">ACTIVE</div>
                            </div>
                            <div className="text-3xl font-black text-gray-900 mb-1">4</div>
                            <div className="text-[11px] text-gray-600 font-medium mb-2">Active Leads</div>
                            <div className="text-[10px] text-orange-600 font-medium flex items-center gap-1 bg-orange-50 px-2 py-1 rounded">
                              🔥 4 in progress
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white rounded-2xl p-3 shadow-md border border-gray-100">
                            <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center mb-2 text-lg">
                              💳
                            </div>
                            <div className="text-2xl font-black text-gray-900 mb-1">$0.00</div>
                            <div className="text-[11px] text-gray-600 font-medium mb-2">Credit Balance</div>
                            <div className="text-[10px] text-green-600 font-medium flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
                              💰 Add credit
                            </div>
                          </div>
                          
                          <div className="bg-white rounded-2xl p-3 shadow-md border border-gray-100">
                            <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center mb-2">
                              ⭐
                            </div>
                            <div className="text-2xl font-black text-gray-900 mb-0.5 flex items-center">
                              4.8
                            </div>
                            <div className="flex gap-0.5 mb-2">
                              {[1,2,3,4,5].map((i) => (
                                <span key={i} className="text-yellow-400 text-xs">⭐</span>
                              ))}
                            </div>
                            <div className="text-[11px] text-gray-600 font-medium mb-1">Customer Rating</div>
                            <div className="text-[10px] text-blue-600 font-medium flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                              👥 25 reviews
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Recent Activity */}
                      <div className="px-4 mt-2">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                            🏠
                          </div>
                          <span className="text-sm font-bold text-gray-900">Recent Activity</span>
                        </div>
                      </div>

                      {/* Bottom Navigation */}
                      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex justify-between items-center rounded-b-[2rem]">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                          </div>
                          <span className="text-[9px] font-medium text-blue-600">Home</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 opacity-50">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-[9px] font-medium text-gray-600">Leads</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 opacity-50">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-[9px] font-medium text-gray-600">Credits</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 opacity-50">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          <span className="text-[9px] font-medium text-gray-600">Billing</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 opacity-50">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="text-[9px] font-medium text-gray-600">Profile</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-500/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-green-400/10 rounded-full blur-3xl"></div>
            </div>
            
            {/* Right - Content */}
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 mb-4">
                <Badge className="bg-green-100 text-green-700 border-green-200 px-4 py-1.5">
                  💼 Provider App
                </Badge>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Grow Your Business <br/>
                <span className="text-green-600">Reach More Customers</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Join thousands of successful service providers. Get matched with customers in your area, manage bookings, and grow your business with our powerful tools.
              </p>
              
              {/* Features List */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Earn More</h4>
                    <p className="text-sm text-gray-600">Set your own rates and keep more of what you earn</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Manage Jobs</h4>
                    <p className="text-sm text-gray-600">Easy-to-use dashboard to manage all your bookings</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Instant Notifications</h4>
                    <p className="text-sm text-gray-600">Get notified immediately when new jobs match your skills</p>
                  </div>
                </div>
              </div>
              
              {/* App Store Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#" className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all transform hover:-translate-y-1 shadow-lg">
                  <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="text-lg font-semibold -mt-1">App Store</div>
                  </div>
                </a>
                <a href="#" className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all transform hover:-translate-y-1 shadow-lg">
                  <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">GET IT ON</div>
                    <div className="text-lg font-semibold -mt-1">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        ref={ctaRef}
        data-section="cta"
        className={`py-16 bg-gradient-to-br from-primary via-blue-600 to-blue-700 text-white relative overflow-hidden ${getSectionAnimation('cta')}`}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-block mb-4">
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-1.5">
              🚀 Start Today
            </Badge>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Ready to Experience <br/>
            <span className="text-blue-200">Quality Service?</span>
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of satisfied Australians. Book your first service in minutes or start earning as a verified professional today!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <Button
              size="lg"
              onClick={handleBookJob}
              className="bg-white text-primary hover:bg-gray-100 text-lg px-12 py-7 shadow-2xl shadow-black/20 hover:shadow-black/30 transition-all transform hover:-translate-y-1 font-bold"
            >
              <Search className="w-5 h-5 mr-2" />
              Book a Service Now
            </Button>
            <Button
              size="lg"
              onClick={handleJoinAsPartner}
              className="bg-green-600 hover:bg-green-700 text-lg px-12 py-7 border-3 border-white/50 shadow-2xl hover:shadow-white/20 transition-all transform hover:-translate-y-1 font-bold"
            >
              <Shield className="w-5 h-5 mr-2" />
              Become a Provider
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-blue-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-sm">Verified Professionals</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm">Instant Booking</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
              <span className="text-sm">4.9/5 Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section 
        ref={testimonialsRef}
        data-section="testimonials"
        id="testimonials" 
        className={`py-14 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden ${getSectionAnimation('testimonials')}`}
      >
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary"></div>
              <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-semibold">
                ⭐ Customer Reviews
              </Badge>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Loved by Thousands
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied customers across Australia
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-500"></div>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400 animate-pulse" style={{animationDelay: `${i * 0.1}s`}} />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic text-base leading-relaxed">"Fantastic service! Found a brilliant cleaner within minutes. The whole process was smooth and professional. Highly recommend ServicePanda!"</p>
                <div className="flex items-center pt-4 border-t border-gray-100">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                    SM
                  </div>
                  <div className="ml-4">
                    <div className="font-bold text-gray-900">Sarah Mitchell</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      Sydney, NSW
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400 animate-pulse" style={{animationDelay: `${i * 0.1}s`}} />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic text-base leading-relaxed">"Our plumbing emergency was resolved quickly thanks to ServicePanda. The plumber was professional and the pricing was fair. Will definitely use again!"</p>
                <div className="flex items-center pt-4 border-t border-gray-100">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                    JD
                  </div>
                  <div className="ml-4">
                    <div className="font-bold text-gray-900">James Davidson</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      Melbourne, VIC
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-600"></div>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400 animate-pulse" style={{animationDelay: `${i * 0.1}s`}} />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic text-base leading-relaxed">"Best platform for finding reliable tradies! Used it for electrical work and landscaping. Both providers were excellent. Five stars!"</p>
                <div className="flex items-center pt-4 border-t border-gray-100">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                    LP
                  </div>
                  <div className="ml-4">
                    <div className="font-bold text-gray-900">Lisa Patterson</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      Brisbane, QLD
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Logos Section */}
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-3 text-gray-600 border-gray-300 px-4 py-1.5">
              ✓ Trusted & Verified
            </Badge>
            <p className="text-sm text-gray-600 font-medium">
              Trusted by <span className="font-bold text-primary">15,000+</span> Australian Homeowners & Professionals
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6">
            <div className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 cursor-pointer hover:-translate-y-1">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span className="font-bold text-gray-700">ACCC</span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 cursor-pointer hover:-translate-y-1">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="font-bold text-gray-700">Fair Trading</span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 cursor-pointer hover:-translate-y-1">
              <Star className="w-5 h-5 text-orange-500" />
              <span className="font-bold text-gray-700">BBB Accredited</span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md hover:border-green-300 transition-all duration-300 cursor-pointer hover:-translate-y-1">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-bold text-gray-700">Verified</span>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 cursor-pointer hover:-translate-y-1">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="font-bold text-gray-700">Secure</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
                  <PawPrint className="h-10 w-10 text-primary relative z-10" />
                </div>
                <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                  ServicePanda
                </span>
              </div>
              <p className="text-gray-400 mb-6">
                Australia's most trusted platform connecting homeowners with verified service professionals.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-full flex items-center justify-center transition-all transform hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-full flex items-center justify-center transition-all transform hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-full flex items-center justify-center transition-all transform hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-full flex items-center justify-center transition-all transform hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#services" className="text-gray-400 hover:text-primary transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Browse Services
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-gray-400 hover:text-primary transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="text-gray-400 hover:text-primary transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Customer Reviews
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-primary transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-primary transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    About Us
                  </a>
                </li>
              </ul>
            </div>

            {/* For Providers */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">For Providers</h3>
              <ul className="space-y-3">
                <li>
                  <a href="/provider-signup" className="text-gray-400 hover:text-green-400 transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Join as Partner
                  </a>
                </li>
                <li>
                  <a href="/provider-login" className="text-gray-400 hover:text-green-400 transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Provider Login
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-green-400 transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Partner Benefits
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-green-400 transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Success Stories
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-green-400 transition-colors flex items-center group">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Provider Resources
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact & Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Contact & Support</h3>
              <ul className="space-y-3">
                <li className="flex items-start text-gray-400">
                  <svg className="w-5 h-5 mr-2 mt-0.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:support@servicepanda.com.au" className="hover:text-primary transition-colors">
                    support@servicepanda.com.au
                  </a>
                </li>
                <li className="flex items-start text-gray-400">
                  <svg className="w-5 h-5 mr-2 mt-0.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:1300123456" className="hover:text-primary transition-colors">
                    1300 123 456
                  </a>
                </li>
                <li className="flex items-start text-gray-400">
                  <svg className="w-5 h-5 mr-2 mt-0.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>
                    Sydney, Melbourne,<br />Brisbane & Australia-wide
                  </span>
                </li>
              </ul>
              <div className="mt-6">
                <a href="#" className="text-gray-400 hover:text-primary transition-colors text-sm flex items-center group">
                  Help Center
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors text-sm flex items-center group mt-2">
                  FAQs
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2025 ServicePanda. All rights reserved. ABN: XX XXX XXX XXX
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <a href="/privacy-policy" className="text-gray-400 hover:text-primary transition-colors">Privacy Policy</a>
                <a href="/terms" className="text-gray-400 hover:text-primary transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">Cookie Policy</a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">Sitemap</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
