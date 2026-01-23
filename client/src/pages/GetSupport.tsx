import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { getApiUrl } from "@/lib/apiConfig";
import { 
  PawPrint, 
  Mail, 
  Phone, 
  Clock,
  Send,
  MessageSquare
} from "lucide-react";

export default function GetSupport() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Apply character limits
    let processedValue = value;
    if (name === 'name' && value.length > 50) {
      processedValue = value.slice(0, 50);
    } else if (name === 'phone') {
      // For phone, only allow digits and limit to 12 digits
      const digits = value.replace(/\D/g, '');
      if (digits.length > 12) {
        processedValue = digits.slice(0, 12);
      } else {
        processedValue = digits;
      }
    } else if (name === 'message' && value.length > 300) {
      processedValue = value.slice(0, 300);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Clear error message when user starts typing
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage("");

    // Client-side validation
    if (formData.name.trim().length > 50) {
      setErrorMessage("Name must be 50 characters or less");
      setSubmitStatus("error");
      setIsSubmitting(false);
      return;
    }

    if (formData.phone.replace(/\D/g, '').length > 12) {
      setErrorMessage("Phone number must be 12 digits or less");
      setSubmitStatus("error");
      setIsSubmitting(false);
      return;
    }

    if (formData.message.trim().length > 300) {
      setErrorMessage("Message must be 300 characters or less");
      setSubmitStatus("error");
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('Submitting contact form:', formData);
      
      const response = await fetch(getApiUrl('/api/contact'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      
      // Read response as text first, then parse as JSON
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
        console.log('Response data:', data);
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        console.error('Raw response text:', responseText);
        throw new Error('Invalid response from server');
      }

      if (response.ok && data.success) {
        // Navigate to thank you page on success
        navigate('/thank-you');
      } else {
        setSubmitStatus("error");
        setErrorMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus("error");
      
      // Provide more specific error messages
      if (error.message === 'Failed to fetch' || error.message === 'NetworkError') {
        setErrorMessage("Network error. Please check your connection and try again.");
      } else if (error.message === 'Invalid response from server') {
        setErrorMessage("Server error. Please try again later.");
      } else {
        setErrorMessage(error.message || "Failed to send message. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
                  <MessageSquare className="h-10 w-10 text-white" />
                </div>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white">
                ServicePanda
              </div>
            </div>
            
            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Get Support
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-6">
              We're here to help! Reach out to us and we'll get back to you as soon as possible.
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-6">
        {/* Contact Information Section */}
        <Card className="shadow-xl border-0 mb-8">
          <CardContent className="pt-8 pb-8 px-8 md:px-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              Contact Information
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Email ID */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email ID</h3>
                  </div>
                </div>
                <a 
                  href="mailto:support@servicepanda.com.au" 
                  className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                >
                  support@servicepanda.com.au
                </a>
              </div>

              {/* Phone Number */}
              <div className="bg-green-50 rounded-lg p-6 border border-green-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone Number</h3>
                    <p className="text-xs text-gray-500">Landline</p>
                  </div>
                </div>
                <a 
                  href="tel:0756060808" 
                  className="text-green-600 hover:text-green-700 transition-colors text-sm font-medium"
                >
                  07 5606 0808
                </a>
              </div>

              {/* Working Hours */}
              <div className="bg-purple-50 rounded-lg p-6 border border-purple-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Working Hours</h3>
                  </div>
                </div>
                <div className="text-sm text-gray-700 space-y-1">
                  <p className="font-medium">Monday - Friday</p>
                  <p>9:00 AM - 6:00 PM</p>
                  <p className="text-gray-500 mt-2">Saturday</p>
                  <p>10:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card className="shadow-xl border-0">
          <CardContent className="pt-10 pb-12 px-8 md:px-12">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                Send us a Message
              </h2>
              <p className="text-gray-600 mb-8 ml-14">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 font-medium">
                    Enter Name <span className="text-red-500">*</span>
                    <span className="text-gray-500 text-sm font-normal ml-2">
                      ({formData.name.length}/50)
                    </span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    maxLength={50}
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    className="h-12 text-base"
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    className="h-12 text-base"
                  />
                </div>

                {/* Phone Number Field */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700 font-medium">
                    Phone Number <span className="text-red-500">*</span>
                    <span className="text-gray-500 text-sm font-normal ml-2">
                      ({formData.phone.length}/12)
                    </span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      // Prevent non-numeric characters
                      if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Enter phone number (digits only)"
                    className="h-12 text-base"
                  />
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-gray-700 font-medium">
                    Message <span className="text-red-500">*</span>
                    <span className={`text-sm font-normal ml-2 ${
                      formData.message.length > 300 
                        ? 'text-red-500' 
                        : formData.message.length > 250 
                        ? 'text-orange-500' 
                        : 'text-gray-500'
                    }`}>
                      ({formData.message.length}/300)
                    </span>
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    maxLength={300}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us how we can help you..."
                    className="min-h-[150px] text-base resize-y"
                    rows={6}
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5 h-12 text-base font-semibold"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Mail
                      </>
                    )}
                  </Button>
                </div>

                {/* Error Messages */}
                {submitStatus === "error" && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                    <p className="font-medium">
                      {errorMessage || "Oops! Something went wrong. Please try again later."}
                    </p>
                  </div>
                )}
              </form>
            </div>
          </CardContent>
        </Card>
      </div>

      </div>
      
      <Footer />
    </div>
  );
}
