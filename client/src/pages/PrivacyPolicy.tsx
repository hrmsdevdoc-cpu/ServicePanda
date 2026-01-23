import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PawPrint } from "lucide-react";

// Helper component for consistent section formatting
const PrivacySection = ({ number, title, children }: { number: number; title: string; children: React.ReactNode }) => (
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

export default function PrivacyPolicy() {
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
              Privacy Policy
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-6">
              How we collect, use, and protect your personal information
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
                  This Privacy Policy explains how we collect, use, store, disclose, and protect personal information in accordance with applicable privacy and data protection laws. It also outlines the rights and choices available to individuals in relation to their personal data.
                </p>
                <p className="text-gray-800 mb-4 leading-relaxed text-base">
                  The specific company details are provided in the Contact Us section at the end of this Privacy Policy.
                </p>
                <p className="text-gray-800 mb-4 leading-relaxed text-base">
                  This Privacy Policy applies to our website, mobile applications, and all related services (collectively, the "<strong>Services</strong>").
                </p>
                <p className="text-gray-800 mb-4 leading-relaxed text-base">
                  By accessing or using the Services, you acknowledge that you have read, understood, and agree to the collection, use, and disclosure of your personal data as described in this Privacy Policy and in accordance with our Terms and Conditions. If you do not agree, you must not use the Services. Use of the Services is restricted to individuals aged 18 years or over.
                </p>
              </div>

              <PrivacySection number={1} title="Scope and Purpose of This Privacy Policy">
                <SubItem number="">This Privacy Policy describes:</SubItem>
                <ListItem>
                  <li>the types of personal data we collect;</li>
                  <li>how and why we use that data;</li>
                  <li>how personal data is shared and transferred;</li>
                  <li>how we protect personal data;</li>
                  <li>how long personal data is retained; and</li>
                  <li>the rights available to individuals under applicable privacy laws.</li>
                </ListItem>
              </PrivacySection>

              <PrivacySection number={2} title="Collection of Personal Data">
                <SubItem number="2.1">Personal Data Collected Directly from You</SubItem>
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  We collect personal data when you interact with the Services, including when you pre-register, register, create an account, post tasks, submit bids, communicate with other users, or contact us.
                </p>
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  This may include, but is not limited to:
                </p>
                <SubItem number="Identity and Contact Information:">Full name, residential or business address, email address, telephone number, date of birth, and gender.</SubItem>
                <SubItem number="Account and Profile Information:">Username, password, profile photo or video (where enabled), biography, preferences, ratings, reviews, and feedback.</SubItem>
                <SubItem number="Professional and Task-Related Information:">Occupation, work experience, skills, qualifications, licences, education history, resumes, task history, bids, earnings preferences, and related content.</SubItem>
                <SubItem number="Payment and Financial Information:">Credit card details, bank account details, and transaction records. Payment information is processed by authorised third-party payment providers and is not stored directly by us except where required for reconciliation, compliance, or dispute resolution.</SubItem>
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  Failure to provide required personal data may prevent us from providing the Services or fulfilling contractual obligations.
                </p>
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  You are responsible for ensuring that the information you provide is accurate, complete, and kept up to date.
                </p>

                <SubItem number="2.2">Information Collected Automatically</SubItem>
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  When you access or use the Services, we automatically collect certain technical and usage information, including through cookies and similar technologies:
                </p>
                <ListItem>
                  <li>IP address and approximate geographic location;</li>
                  <li>device identifiers, operating system, browser type, and settings;</li>
                  <li>referral URLs and access timestamps;</li>
                  <li>pages viewed, features used, time spent on the Services, and interaction patterns;</li>
                  <li>communication engagement data, such as email opens and click-through activity.</li>
                </ListItem>
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  Where permitted by your device or system settings, we may collect precise location data, including GPS coordinates, to improve service matching and platform functionality.
                </p>

                <SubItem number="2.3">Information Obtained from Third Parties</SubItem>
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  We may receive personal data from third parties, including:
                </p>
                <ListItem>
                  <li>social media platforms where you link your account;</li>
                  <li>identity verification, police check, or background screening providers;</li>
                  <li>payment processors and fraud prevention services;</li>
                  <li>analytics, marketing, and advertising partners;</li>
                  <li>publicly available sources, including court or regulatory records; and</li>
                  <li>affiliated companies within our corporate group.</li>
                </ListItem>
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  We may combine this information with data already held to improve accuracy, compliance, and service quality.
                </p>
              </PrivacySection>

              <PrivacySection number={3} title="Publicly Available Information and User Visibility">
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  Certain information you provide is visible to other users and, in some cases, to the public, including:
                </p>
                <ListItem>
                  <li>your user ID, profile, ratings, and reviews;</li>
                  <li>tasks posted, bids made, comments, and feedback; and</li>
                  <li>communications posted in public forums.</li>
                </ListItem>
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  You acknowledge that any information you voluntarily disclose in public areas of the Services may be accessed, indexed, and used by third parties beyond our control. We are not responsible for the use or misuse of such information by others.
                </p>
              </PrivacySection>

              <PrivacySection number={4} title="How We Use Personal Data">
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  We use personal data for the following purposes, where permitted by law:
                </p>
                <ListItem>
                  <li>to verify identity and authenticate users;</li>
                  <li>to provide, operate, and maintain the Services;</li>
                  <li>to facilitate transactions and contractual relationships between users;</li>
                  <li>to process payments, fees, and refunds;</li>
                  <li>to prevent fraud, misuse, and unauthorised access;</li>
                  <li>to customise content, recommendations, and advertising;</li>
                  <li>to improve existing features and develop new services;</li>
                  <li>to conduct analytics, research, and service optimisation;</li>
                  <li>to communicate administrative, legal, or service-related notices;</li>
                  <li>to send marketing communications where consent has been provided;</li>
                  <li>to comply with legal, regulatory, and law enforcement obligations; and</li>
                  <li>to protect the rights, safety, and property of users and the Company.</li>
                </ListItem>
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  We do not use sensitive personal information for profiling or marketing analytics unless required or permitted by law.
                </p>
              </PrivacySection>

              <PrivacySection number={5} title="Legal Basis for Processing">
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  Depending on your jurisdiction, we process personal data on one or more of the following legal grounds:
                </p>
                <ListItem>
                  <li>performance of a contract;</li>
                  <li>compliance with legal obligations;</li>
                  <li>legitimate business interests;</li>
                  <li>protection of vital interests; and</li>
                  <li>consent, where required.</li>
                </ListItem>
              </PrivacySection>

              <PrivacySection number={6} title="Cookies and Similar Technologies">
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  We use cookies and similar technologies to enhance functionality, security, analytics, and advertising effectiveness.
                </p>
                <SubItem number="Types of Cookies Used:">Strictly Necessary Cookies: Required for core platform functionality and security.</SubItem>
                <SubItem number="">Functionality Cookies: Enable personalisation and preference retention.</SubItem>
                <SubItem number="">Performance and Analytics Cookies: Measure usage and improve services.</SubItem>
                <SubItem number="">Advertising Cookies: Deliver relevant and interest-based advertising.</SubItem>
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  You may manage cookie preferences through your browser or device settings. Disabling cookies may affect platform functionality.
                </p>
              </PrivacySection>

              <PrivacySection number={7} title="Sharing and Disclosure of Personal Data">
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  We may disclose personal data to:
                </p>
                <ListItem>
                  <li>affiliated companies;</li>
                  <li>third-party service providers and contractors;</li>
                  <li>analytics and advertising partners;</li>
                  <li>other users where required to facilitate services;</li>
                  <li>professional advisers, auditors, and insurers;</li>
                  <li>law enforcement, regulators, or courts where required by law;</li>
                  <li>parties involved in a business sale, merger, or restructuring; and</li>
                  <li>third parties with your consent.</li>
                </ListItem>
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  We do not sell personal data to third parties for their own direct marketing purposes.
                </p>
              </PrivacySection>

              <PrivacySection number={8} title="International Data Transfers">
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  Personal data may be transferred to and processed in countries outside your jurisdiction, including Australia. Where required, we implement safeguards such as standard contractual clauses to ensure appropriate protection.
                </p>
              </PrivacySection>

              <PrivacySection number={9} title="Marketing Communications">
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  You may opt in or opt out of marketing communications at any time through account settings or unsubscribe links. Administrative and service-related communications will continue regardless of marketing preferences.
                </p>
              </PrivacySection>

              <PrivacySection number={10} title="Data Security">
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  We implement reasonable technical and organisational measures to protect personal data. However, no system is completely secure, and transmission of data occurs at your own risk. You are responsible for maintaining the confidentiality of your account credentials.
                </p>
              </PrivacySection>

              <PrivacySection number={11} title="Data Retention">
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  Personal data is retained only for as long as necessary to fulfil the purposes outlined in this Privacy Policy, comply with legal obligations, and resolve disputes. Data is securely deleted, anonymised, or archived when no longer required.
                </p>
              </PrivacySection>

              <PrivacySection number={12} title="Your Rights">
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  Depending on your location, you may have rights to:
                </p>
                <ListItem>
                  <li>access your personal data;</li>
                  <li>correct or update information;</li>
                  <li>request deletion or restriction of processing;</li>
                  <li>withdraw consent;</li>
                  <li>object to processing; and</li>
                  <li>lodge a complaint with a data protection authority.</li>
                </ListItem>
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  Requests may be subject to legal and operational limitations.
                </p>
              </PrivacySection>

              <PrivacySection number={13} title="Contact Us">
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  For privacy-related enquiries, requests, or complaints, please contact us via the details provided on the Services.
                </p>
              </PrivacySection>

            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
