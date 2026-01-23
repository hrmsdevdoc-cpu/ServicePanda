import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { 
  CheckCircle2, 
  Mail, 
  Home,
  MessageSquare
} from "lucide-react";

export default function ThankYou() {
  const [, navigate] = useLocation();

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
      <div className="relative bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center">
            {/* Success Icon */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-6 border-4 border-white/30">
                  <CheckCircle2 className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>
            
            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Thank You!
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto mb-6">
              Your message has been sent successfully. We'll get back to you as soon as possible.
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-6">
        <Card className="shadow-xl border-0">
          <CardContent className="pt-10 pb-12 px-8 md:px-12">
            <div className="text-center space-y-6">
              {/* Success Message */}
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900">
                  Message Received Successfully
                </h2>
                
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  We've received your message and our support team will get back to you within 24 hours. 
                  A confirmation email has been sent to your email address.
                </p>
              </div>

              {/* What Happens Next */}
              <div className="mt-10 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  What happens next?
                </h3>
                
                <div className="grid md:grid-cols-3 gap-6 text-left">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Mail className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Check Your Email</h4>
                      <p className="text-sm text-gray-600">
                        We've sent a confirmation email to your inbox. Please check your spam folder if you don't see it.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">We'll Review</h4>
                      <p className="text-sm text-gray-600">
                        Our support team will review your message and respond within 24 hours during business days.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Get Response</h4>
                      <p className="text-sm text-gray-600">
                        You'll receive a detailed response via email addressing all your questions and concerns.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('/')}
                  className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5 h-12 px-8 text-base font-semibold"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Back to Home
                </Button>
                
                <Button
                  onClick={() => navigate('/get-support')}
                  variant="outline"
                  className="h-12 px-8 text-base font-semibold border-2"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Send Another Message
                </Button>
              </div>

              {/* Contact Information */}
              <div className="mt-10 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-4">
                  Need immediate assistance?
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm">
                  <a 
                    href="mailto:support@servicepanda.com.au" 
                    className="text-primary hover:text-primary/80 font-medium flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    support@servicepanda.com.au
                  </a>
                  <span className="text-gray-400">•</span>
                  <a 
                    href="tel:0756060808" 
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    07 5606 0808
                  </a>
                </div>
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
