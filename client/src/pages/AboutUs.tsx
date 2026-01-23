import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { 
  Users, 
  Target, 
  Heart, 
  Award,
  TrendingUp,
  Shield,
  Globe,
  Zap
} from "lucide-react";

export default function AboutUs() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Content with fade-in animation */}
      <div className="animate-in fade-in duration-500">

      {/* Banner/Hero Section */}
      <div className="relative bg-gradient-to-br from-primary via-blue-600 to-blue-700 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center">
            {/* Logo and Title */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <Users className="h-10 w-10 text-white" />
                </div>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white">
                ServicePanda
              </div>
            </div>
            
            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              About Us
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-6">
              Connecting customers with trusted service providers across Australia
            </p>
            
            {/* Decorative Line */}
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-1 bg-white/30 rounded-full"></div>
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="w-24 h-1 bg-white rounded-full"></div>
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="w-16 h-1 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </div>
        
        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 text-gray-50" fill="currentColor" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0 C300,120 900,0 1200,60 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-6">
        
        {/* Our Story Section */}
        <Card className="shadow-xl border-0 mb-8">
          <CardContent className="pt-10 pb-12 px-8 md:px-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                Our Story
              </h2>
              <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                <p>
                  ServicePanda was founded in 2020 with a simple yet powerful vision: to make finding and booking professional services as easy as ordering food online. We recognized that customers were spending too much time searching for reliable service providers, while qualified professionals struggled to reach potential customers.
                </p>
                <p>
                  What started as a small team in Melbourne has grown into Australia's leading service marketplace, connecting thousands of customers with trusted service providers across the country. We've built a platform that prioritizes quality, trust, and convenience for everyone.
                </p>
                <p>
                  Today, ServicePanda serves customers and service providers in major cities across Australia, from Sydney to Perth, Brisbane to Adelaide. We're committed to revolutionizing how Australians access professional services, one booking at a time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Our Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="shadow-xl border-0">
            <CardContent className="pt-10 pb-12 px-8 md:px-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                To empower Australians by providing a seamless, trustworthy platform that connects customers with the best local service providers. We strive to make professional services accessible, affordable, and reliable for everyone, while helping service providers grow their businesses and reach new customers.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0">
            <CardContent className="pt-10 pb-12 px-8 md:px-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                To become Australia's most trusted service marketplace, where every customer finds the perfect service provider and every service provider thrives. We envision a future where accessing professional services is as simple and reliable as turning on a light switch.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Our Values */}
        <Card className="shadow-xl border-0 mb-8">
          <CardContent className="pt-10 pb-12 px-8 md:px-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-primary" />
              </div>
              Our Values
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Trust</h3>
                <p className="text-sm text-gray-600">
                  We verify all service providers and maintain the highest standards of quality and reliability.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Customer First</h3>
                <p className="text-sm text-gray-600">
                  Every decision we make prioritizes the needs and satisfaction of our customers and service providers.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Innovation</h3>
                <p className="text-sm text-gray-600">
                  We continuously improve our platform with cutting-edge technology and user-friendly features.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Community</h3>
                <p className="text-sm text-gray-600">
                  We build strong relationships within our community and support local businesses across Australia.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why Choose Us */}
        <Card className="shadow-xl border-0 mb-8">
          <CardContent className="pt-10 pb-12 px-8 md:px-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-primary" />
              </div>
              Why Choose ServicePanda?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <h3 className="font-semibold text-gray-900 mb-3">Verified Professionals</h3>
                <p className="text-sm text-gray-600">
                  All service providers on our platform are verified, licensed, and insured. We conduct thorough background checks to ensure your safety and peace of mind.
                </p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-6 border border-green-100">
                <h3 className="font-semibold text-gray-900 mb-3">Easy Booking</h3>
                <p className="text-sm text-gray-600">
                  Book services in minutes with our intuitive platform. Compare prices, read reviews, and schedule appointments all in one place.
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-6 border border-purple-100">
                <h3 className="font-semibold text-gray-900 mb-3">24/7 Support</h3>
                <p className="text-sm text-gray-600">
                  Our dedicated support team is available around the clock to help with any questions or concerns you may have.
                </p>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-6 border border-orange-100">
                <h3 className="font-semibold text-gray-900 mb-3">Transparent Pricing</h3>
                <p className="text-sm text-gray-600">
                  No hidden fees or surprises. See upfront pricing from multiple providers and choose the best option for your budget.
                </p>
              </div>
              
              <div className="bg-pink-50 rounded-lg p-6 border border-pink-100">
                <h3 className="font-semibold text-gray-900 mb-3">Customer Reviews</h3>
                <p className="text-sm text-gray-600">
                  Read authentic reviews from real customers to make informed decisions about which service provider to choose.
                </p>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-100">
                <h3 className="font-semibold text-gray-900 mb-3">Wide Range of Services</h3>
                <p className="text-sm text-gray-600">
                  From home repairs to professional services, we offer a comprehensive range of services to meet all your needs.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Section */}
        <Card className="shadow-xl border-0 mb-8">
          <CardContent className="pt-10 pb-12 px-8 md:px-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              ServicePanda by the Numbers
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">50,000+</div>
                <div className="text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">5,000+</div>
                <div className="text-gray-600">Verified Providers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">100+</div>
                <div className="text-gray-600">Service Categories</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">4.8/5</div>
                <div className="text-gray-600">Average Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="shadow-xl border-0">
          <CardContent className="pt-10 pb-12 px-8 md:px-12">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Get in Touch
              </h2>
              <p className="text-gray-600 mb-6">
                Have questions or want to learn more about ServicePanda? We'd love to hear from you!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/get-support"
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white rounded-lg font-semibold transition-all transform hover:-translate-y-0.5"
                >
                  Contact Us
                </a>
                <a 
                  href="mailto:info@servicepanda.com.au"
                  className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-all"
                >
                  Email Us
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      </div>
      
      <Footer />
    </div>
  );
}
