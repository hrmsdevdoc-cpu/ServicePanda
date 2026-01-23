import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PawPrint } from "lucide-react";

// Helper component for consistent section formatting
const TermsSection = ({ number, title, children }: { number: number; title: string; children: React.ReactNode }) => (
  <section className="mb-10 pb-8 border-b border-gray-200 last:border-b-0">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
        <span className="text-primary font-bold text-lg">{number}</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
    </div>
    <div className="space-y-4 text-gray-700 ml-14">
      {children}
    </div>
  </section>
);

// Helper component for subsection items
const SubItem = ({ number, children }: { number: string; children: React.ReactNode }) => (
  <div className="leading-relaxed text-base">
    <span className="font-semibold text-gray-900 mr-2">{number}</span>
    {children}
  </div>
);

const ListItem = ({ children }: { children: React.ReactNode }) => (
  <ul className="list-disc list-inside ml-6 space-y-2 text-gray-700 leading-relaxed">
    {children}
  </ul>
);

export default function TermsAndConditions() {
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
                  <PawPrint className="h-10 w-10 text-white" />
                </div>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white">
                ServicePanda
              </div>
            </div>
            
            {/* Main Title - H1 for SEO */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Terms and Conditions
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-6">
              Please read these terms carefully before using our platform
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
                <p className="text-gray-800 mb-4 leading-relaxed text-base">
                  These Terms and Conditions ("<strong>Terms</strong>") govern your access to and use of the ServicePanda platform, including any website, mobile application, software, tools, or services operated by ServicePanda ("<strong>ServicePanda</strong>", "<strong>we</strong>", "<strong>our</strong>", or "<strong>us</strong>").
                </p>
                <p className="text-gray-800 mb-4 leading-relaxed text-base">
                  By accessing, registering with, or using ServicePanda in any manner, you confirm that you have read, understood, and agree to be legally bound by these Terms, together with all applicable policies, guidelines, and notices published by ServicePanda from time to time.
                </p>
                <p className="text-gray-900 font-semibold text-lg leading-relaxed">
                  If you do not agree to these Terms, you must not use the ServicePanda platform.
                </p>
              </div>

              <TermsSection number={1} title="About ServicePanda">
                <SubItem number="1.1">ServicePanda operates a digital marketplace that facilitates introductions between individuals or businesses seeking services ("<strong>Customers</strong>") and independent service providers offering services ("<strong>Service Providers</strong>").</SubItem>
                <SubItem number="1.2">ServicePanda is not a service provider, contractor, employer, agent, or representative of any Customer or Service Provider.</SubItem>
                <SubItem number="1.3">Any agreement for services is formed directly and exclusively between the Customer and the Service Provider.</SubItem>
              </TermsSection>

              <TermsSection number={2} title="Eligibility and Accounts">
                <SubItem number="2.1">You must be at least 18 years of age to create an account or use the ServicePanda platform.</SubItem>
                <SubItem number="2.2">Users must register using accurate, current, and complete information and must keep account details up to date at all times.</SubItem>
                <SubItem number="2.3">ServicePanda reserves the right to approve, refuse, suspend, restrict, or terminate any account at its sole discretion, including where a User:</SubItem>
                <ListItem>
                  <li>breaches these Terms;</li>
                  <li>provides false or misleading information;</li>
                  <li>engages in conduct that may harm other Users or ServicePanda; or</li>
                  <li>poses legal, reputational, or operational risk.</li>
                </ListItem>
                <SubItem number="2.4">Each account is personal and must not be sold, transferred, shared, or sublicensed.</SubItem>
              </TermsSection>

              <TermsSection number={3} title="Role of ServicePanda">
                <SubItem number="3.1">ServicePanda provides a technology platform that enables:</SubItem>
                <ListItem>
                  <li>Customers to post service requests or make bookings; and</li>
                  <li>Service Providers to offer, quote, and deliver services.</li>
                </ListItem>
                <SubItem number="3.2">ServicePanda does not:</SubItem>
                <ListItem>
                  <li>guarantee the quality, legality, safety, or suitability of any service;</li>
                  <li>verify licenses, qualifications, or insurance unless expressly stated; or</li>
                  <li>supervise, manage, or control the performance of services.</li>
                </ListItem>
                <SubItem number="3.3">Users acknowledge that they engage with other Users entirely at their own risk.</SubItem>
              </TermsSection>

              <TermsSection number={4} title="Service Requests, Bookings, and Contracts">
                <SubItem number="4.1">A service request or booking constitutes an invitation to receive offers, not a binding agreement.</SubItem>
                <SubItem number="4.2">A binding service contract is formed only when:</SubItem>
                <ListItem>
                  <li>a Customer accepts an offer from a Service Provider through the platform; and</li>
                  <li>payment (if required) is successfully processed in accordance with the platform flow.</li>
                </ListItem>
                <SubItem number="4.3">The terms of the service contract include:</SubItem>
                <ListItem>
                  <li>the agreed scope of work;</li>
                  <li>the agreed price;</li>
                  <li>timing and location; and</li>
                  <li>these Terms, to the extent applicable.</li>
                </ListItem>
                <SubItem number="4.4">Any variation to a service agreement must be agreed between the Customer and Service Provider through ServicePanda's approved communication channels.</SubItem>
              </TermsSection>

              <TermsSection number={5} title="Payments and Platform Fees">
                <SubItem number="5.1">ServicePanda may facilitate payments between Customers and Service Providers using third-party payment processors.</SubItem>
                <SubItem number="5.2">Customers may be required to pre-authorise or prepay amounts prior to service commencement.</SubItem>
                <SubItem number="5.3">ServicePanda charges platform fees for use of the service, which may include:</SubItem>
                <ListItem>
                  <li>customer service fees; and/or</li>
                  <li>service provider commissions.</li>
                </ListItem>
                <SubItem number="5.4">All fees are displayed prior to confirmation and are inclusive of applicable taxes unless stated otherwise.</SubItem>
                <SubItem number="5.5">Platform fees are generally non-refundable except where required by law.</SubItem>
              </TermsSection>

              <TermsSection number={6} title="Completion, Confirmation, and Release of Funds">
                <SubItem number="6.1">Upon completion of the service, the Service Provider must notify the Customer through the platform.</SubItem>
                <SubItem number="6.2">Customers are required to confirm completion or raise any issues within the timeframe specified by ServicePanda.</SubItem>
                <SubItem number="6.3">If no action is taken within the specified timeframe, ServicePanda may, at its discretion:</SubItem>
                <ListItem>
                  <li>release payment to the Service Provider; or</li>
                  <li>cancel the booking and return funds in accordance with platform rules.</li>
                </ListItem>
                <SubItem number="6.4">ServicePanda reserves the right to withhold or delay payments where disputes, investigations, or compliance checks are ongoing.</SubItem>
              </TermsSection>

              <TermsSection number={7} title="Cancellations and Refunds">
                <SubItem number="7.1">Cancellation rights and consequences depend on:</SubItem>
                <ListItem>
                  <li>the timing of cancellation;</li>
                  <li>responsibility for cancellation; and</li>
                  <li>any specific cancellation terms agreed between the parties.</li>
                </ListItem>
                <SubItem number="7.2">ServicePanda may apply cancellation charges or administrative fees.</SubItem>
                <SubItem number="7.3">Refunds, where applicable, may be issued as:</SubItem>
                <ListItem>
                  <li>original payment method refunds; or</li>
                  <li>ServicePanda credits.</li>
                </ListItem>
                <SubItem number="7.4">ServicePanda credits are non-transferable, non-cash redeemable, and subject to expiry.</SubItem>
              </TermsSection>

              <TermsSection number={8} title="User Obligations">
                <SubItem number="8.1">All Users must:</SubItem>
                <ListItem>
                  <li>comply with applicable laws and regulations;</li>
                  <li>act honestly and in good faith;</li>
                  <li>provide accurate information; and</li>
                  <li>communicate respectfully.</li>
                </ListItem>
                <SubItem number="8.2">Users must not:</SubItem>
                <ListItem>
                  <li>request or make payments outside the platform unless expressly permitted;</li>
                  <li>post misleading, unlawful, offensive, or harmful content;</li>
                  <li>misuse platform features; or</li>
                  <li>interfere with platform security or operations.</li>
                </ListItem>
                <SubItem number="8.3">Service Providers are solely responsible for:</SubItem>
                <ListItem>
                  <li>holding required licences and permits;</li>
                  <li>maintaining appropriate insurance; and</li>
                  <li>meeting tax and regulatory obligations.</li>
                </ListItem>
              </TermsSection>

              <TermsSection number={9} title="Content and Intellectual Property">
                <SubItem number="9.1">Users retain ownership of their content but grant ServicePanda:</SubItem>
                <ListItem>
                  <li>a worldwide, royalty-free licence;</li>
                  <li>the right to use content for platform operation;</li>
                  <li>marketing and promotional purposes; and</li>
                  <li>platform improvement.</li>
                </ListItem>

                <SubItem number="9.2">ServicePanda retains all rights to:</SubItem>
                <ListItem>
                  <li>its platform and software;</li>
                  <li>branding and trademarks; and</li>
                  <li>all proprietary materials.</li>
                </ListItem>

                <SubItem number="9.3">Users must not:</SubItem>
                <ListItem>
                  <li>reproduce ServicePanda content;</li>
                  <li>exploit platform materials; or</li>
                  <li>use proprietary content without written consent.</li>
                </ListItem>
              </TermsSection>

              <TermsSection number={10} title="Verification and Badges">
                <SubItem number="10.1">ServicePanda may offer:</SubItem>
                <ListItem>
                  <li>optional verification processes; and</li>
                  <li>badges or indicators.</li>
                </ListItem>

                <SubItem number="10.2">Verifications:</SubItem>
                <ListItem>
                  <li>are limited in scope;</li>
                  <li>do not constitute endorsements; and</li>
                  <li>do not guarantee service quality.</li>
                </ListItem>

                <SubItem number="10.3">Users rely on verification:</SubItem>
                <ListItem>
                  <li>at their own discretion; and</li>
                  <li>at their own risk.</li>
                </ListItem>
              </TermsSection>

              <TermsSection number={11} title="Insurance">
                <SubItem number="11.1">ServicePanda may:</SubItem>
                <ListItem>
                  <li>facilitate access to third-party insurance products.</li>
                </ListItem>

                <SubItem number="11.2">ServicePanda does not:</SubItem>
                <ListItem>
                  <li>guarantee insurance suitability; or</li>
                  <li>guarantee coverage adequacy.</li>
                </ListItem>

                <SubItem number="11.3">Service Providers are responsible for:</SubItem>
                <ListItem>
                  <li>obtaining appropriate insurance; and</li>
                  <li>maintaining valid coverage.</li>
                </ListItem>
              </TermsSection>

              <TermsSection number={12} title="Disclaimers">
                <SubItem number="12.1">The platform is provided:</SubItem>
                <ListItem>
                  <li>on an "as is" basis; and</li>
                  <li>on an "as available" basis.</li>
                </ListItem>

                <SubItem number="12.2">ServicePanda disclaims:</SubItem>
                <ListItem>
                  <li>all express warranties;</li>
                  <li>all implied warranties;</li>
                  <li>fitness for purpose; and</li>
                  <li>non-infringement.</li>
                </ListItem>
              </TermsSection>

              <TermsSection number={13} title="Limitation of Liability">
                <SubItem number="13.1">ServicePanda is not liable for:</SubItem>
                <ListItem>
                  <li>service performance or outcomes;</li>
                  <li>User conduct; or</li>
                  <li>indirect or consequential losses.</li>
                </ListItem>

                <SubItem number="13.2">Where liability cannot be excluded:</SubItem>
                <ListItem>
                  <li>it is limited to platform fees paid;</li>
                  <li>within the previous 12 months.</li>
                </ListItem>
              </TermsSection>

              <TermsSection number={14} title="Dispute Resolution">
                <SubItem number="14.1">Users are encouraged to:</SubItem>
                <ListItem>
                  <li>resolve disputes directly.</li>
                </ListItem>

                <SubItem number="14.2">ServicePanda may:</SubItem>
                <ListItem>
                  <li>assist with dispute resolution;</li>
                  <li>without guaranteeing outcomes.</li>
                </ListItem>

                <SubItem number="14.3">ServicePanda may:</SubItem>
                <ListItem>
                  <li>make determinations on payment handling;</li>
                  <li>while disputes are ongoing.</li>
                </ListItem>
              </TermsSection>

              <TermsSection number={15} title="Privacy">
                <SubItem number="15.1">Personal information is handled:</SubItem>
                <ListItem>
                  <li>in accordance with the Privacy Policy.</li>
                </ListItem>

                <SubItem number="15.2">Users consent to:</SubItem>
                <ListItem>
                  <li>collection of personal information;</li>
                  <li>use of personal information; and</li>
                  <li>disclosure as required for platform operation.</li>
                </ListItem>
              </TermsSection>

              <TermsSection number={16} title="Modifications">
                <SubItem number="16.1">ServicePanda may:</SubItem>
                <ListItem>
                  <li>amend these Terms at any time.</li>
                </ListItem>

                <SubItem number="16.2">Continued use:</SubItem>
                <ListItem>
                  <li>constitutes acceptance of updated Terms.</li>
                </ListItem>
              </TermsSection>

              <TermsSection number={17} title="Termination">
                <SubItem number="17.1">Users may:</SubItem>
                <ListItem>
                  <li>close their accounts at any time.</li>
                </ListItem>

                <SubItem number="17.2">ServicePanda may:</SubItem>
                <ListItem>
                  <li>suspend accounts;</li>
                  <li>terminate accounts immediately;</li>
                  <li>to protect Users, the platform, or legal compliance.</li>
                </ListItem>
              </TermsSection>

              <TermsSection number={18} title="General">
                <SubItem number="18.1">These Terms are governed by:</SubItem>
                <ListItem>
                  <li>laws of the applicable jurisdiction.</li>
                </ListItem>

                <SubItem number="18.2">If any provision is unenforceable:</SubItem>
                <ListItem>
                  <li>remaining provisions continue in effect.</li>
                </ListItem>

                <SubItem number="18.3">These Terms constitute:</SubItem>
                <ListItem>
                  <li>the entire agreement between Users and ServicePanda.</li>
                </ListItem>
              </TermsSection>

            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
