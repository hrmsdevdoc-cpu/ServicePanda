import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { HelpCircle } from "lucide-react";

// Helper component for FAQ category
const FAQCategory = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-12 pb-8 border-b border-gray-200 last:border-b-0">
    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
        <HelpCircle className="w-5 h-5 text-primary" />
      </div>
      {title}
    </h2>
    <div className="space-y-2">
      {children}
    </div>
  </section>
);

// Helper component for individual FAQ item with accordion
const FAQItem = ({ number, question, answer, value }: { number: number; question: string; answer: string; value: string }) => (
  <AccordionItem value={value} className="border border-gray-200 rounded-lg mb-2 px-4 bg-white hover:bg-gray-50 transition-colors">
    <AccordionTrigger className="hover:no-underline py-4">
      <div className="flex items-start gap-4 w-full text-left">
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <span className="text-primary font-bold text-sm">{number}</span>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 pr-4">{question}</h3>
        </div>
      </div>
    </AccordionTrigger>
    <AccordionContent className="pb-4">
      <div className="ml-12 pr-4">
        <p className="text-gray-700 leading-relaxed">{answer}</p>
      </div>
    </AccordionContent>
  </AccordionItem>
);

export default function FAQs() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

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
                  <HelpCircle className="h-10 w-10 text-white" />
                </div>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white">
                ServicePanda
              </div>
            </div>
            
            {/* Main Title - H1 for SEO */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-6">
              Find answers to common questions about using ServicePanda
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

        {/* Content */}
        <Card className="shadow-xl border-0">
          <CardContent className="pt-10 pb-12 px-8 md:px-12">
            <div className="max-w-none">
              {/* Introduction */}
              <div className="bg-blue-50 border-l-4 border-primary p-6 rounded-r-lg mb-10">
                <p className="text-gray-800 leading-relaxed text-base">
                  Welcome to the ServicePanda FAQ page. Here you'll find answers to the most commonly asked questions about our platform, services, and how to get started. If you can't find what you're looking for, please don't hesitate to <a href="/#contact" className="text-primary hover:underline font-semibold">contact our support team</a>.
                </p>
              </div>

              <FAQCategory title="General Questions">
                <Accordion type="single" collapsible className="w-full">
                  <FAQItem 
                    number={1}
                    question="What is ServicePanda?"
                    answer="ServicePanda is an online marketplace that allows customers to find, compare, and book trusted service providers for a wide range of services in one convenient place."
                    value="item-1"
                  />
                  <FAQItem 
                    number={2}
                    question="Who can use ServicePanda as a customer?"
                    answer="Any individual or business seeking professional services can use ServicePanda to browse providers, request quotes, and make bookings."
                    value="item-2"
                  />
                  <FAQItem 
                    number={3}
                    question="Do I need to create an account to use ServicePanda?"
                    answer="Yes. Creating an account enables you to request services, communicate with providers, manage bookings, and receive updates."
                    value="item-3"
                  />
                  <FAQItem 
                    number={4}
                    question="Is there any cost to use ServicePanda?"
                    answer="Browsing services and creating an account is free for customers. Any service charges will be clearly displayed before you confirm a booking or accept a quote."
                    value="item-4"
                  />
                </Accordion>
              </FAQCategory>

              <FAQCategory title="Finding & Booking Services">
                <Accordion type="single" collapsible className="w-full">
                  <FAQItem 
                    number={5}
                    question="How do I find a service provider?"
                    answer="You can search by service category, location, and other filters. Each provider profile includes service details, pricing (where applicable), and customer reviews to assist your decision."
                    value="item-5"
                  />
                  <FAQItem 
                    number={6}
                    question="How do I request a quote?"
                    answer="Once you select a service provider, you can submit a quote request directly through the platform by providing details of your requirements."
                    value="item-6"
                  />
                  <FAQItem 
                    number={7}
                    question="Can I book a service instantly?"
                    answer="Some providers offer instant booking, while others may require confirmation after reviewing your request. This will be clearly indicated on the provider's profile."
                    value="item-7"
                  />
                  <FAQItem 
                    number={8}
                    question="How do I communicate with a service provider?"
                    answer="All communication is handled securely through ServicePanda's messaging system after you submit a request or booking."
                    value="item-8"
                  />
                </Accordion>
              </FAQCategory>

              <FAQCategory title="Pricing & Payments">
                <Accordion type="single" collapsible className="w-full">
                  <FAQItem 
                    number={9}
                    question="How are service prices determined?"
                    answer="Pricing is set by individual service providers and may vary based on the scope, location, and timing of the job."
                    value="item-9"
                  />
                  <FAQItem 
                    number={10}
                    question="Are there any hidden fees?"
                    answer="No. All applicable fees and charges are disclosed before you confirm your booking or accept a quote."
                    value="item-10"
                  />
                  <FAQItem 
                    number={11}
                    question="How do I make a payment?"
                    answer="Payment methods and timing will be clearly outlined during the booking process, depending on the provider's payment terms."
                    value="item-11"
                  />
                </Accordion>
              </FAQCategory>

              <FAQCategory title="Reviews & Trust">
                <Accordion type="single" collapsible className="w-full">
                  <FAQItem 
                    number={12}
                    question="How can I check if a service provider is reliable?"
                    answer="You can review provider profiles, ratings, and verified customer reviews to assess reliability and service quality."
                    value="item-12"
                  />
                  <FAQItem 
                    number={13}
                    question="Can I leave a review after the service is completed?"
                    answer="Yes. Customers are encouraged to leave honest feedback after a service has been completed to help other users make informed decisions."
                    value="item-13"
                  />
                </Accordion>
              </FAQCategory>

              <FAQCategory title="Cancellations & Changes">
                <Accordion type="single" collapsible className="w-full">
                  <FAQItem 
                    number={14}
                    question="Can I cancel or reschedule a booking?"
                    answer="Yes, subject to the service provider's cancellation and rescheduling policy. These terms are displayed before booking."
                    value="item-14"
                  />
                  <FAQItem 
                    number={15}
                    question="What happens if a service provider cancels?"
                    answer="If a provider cancels, you will be notified promptly and supported in finding an alternative provider where possible."
                    value="item-15"
                  />
                </Accordion>
              </FAQCategory>

              <FAQCategory title="Support & Safety">
                <Accordion type="single" collapsible className="w-full">
                  <FAQItem 
                    number={16}
                    question="What if I have an issue with a service?"
                    answer="If you experience an issue, you can contact customer support through the platform. ServicePanda will assist in reviewing and addressing the concern."
                    value="item-16"
                  />
                  <FAQItem 
                    number={17}
                    question="Is my personal information secure?"
                    answer="Yes. ServicePanda applies appropriate security measures to protect your personal and account information."
                    value="item-17"
                  />
                  <FAQItem 
                    number={18}
                    question="How do I contact ServicePanda support?"
                    answer='You can reach customer support via the "Contact Us" or "Help" section on the website for assistance with bookings, payments, or general enquiries.'
                    value="item-18"
                  />
                </Accordion>
              </FAQCategory>

              <FAQCategory title="Using ServicePanda Effectively">
                <Accordion type="single" collapsible className="w-full">
                  <FAQItem 
                    number={19}
                    question="Can I compare multiple service providers?"
                    answer="Yes. You can compare providers based on pricing, reviews, service offerings, and availability before making a decision."
                    value="item-19"
                  />
                  <FAQItem 
                    number={20}
                    question="Can I use ServicePanda for urgent or same-day services?"
                    answer="Availability for urgent or same-day services depends on individual providers. You can filter or enquire directly to confirm availability."
                    value="item-20"
                  />
                </Accordion>
              </FAQCategory>

            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
