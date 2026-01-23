import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PawPrint } from "lucide-react";

// Helper component for consistent section formatting
const CodeSection = ({ number, title, children }: { number: number; title: string; children: React.ReactNode }) => (
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

export default function CodeOfConduct() {
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
              Code of Conduct
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-6">
              Standards of behaviour and professionalism for Service Providers
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
                  This Code of Conduct outlines the standards of behaviour, professionalism, and compliance expected of all service providers who access or use the ServicePanda platform ("<strong>Platform</strong>"). It is designed to ensure a safe, reliable, lawful, and high-quality experience for customers, service providers, and all other users of the Platform.
                </p>
                <p className="text-gray-800 mb-4 leading-relaxed text-base">
                  By registering as, or acting in the capacity of, a service provider on ServicePanda, you acknowledge that you have read, understood, and agree to comply with this Code of Conduct, in addition to the ServicePanda Terms and Conditions, Privacy Policy, and all applicable laws and regulations. Failure to comply may result in disciplinary action, including suspension or termination of access to the Platform.
                </p>
              </div>

              <CodeSection number={1} title="Scope and Application">
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  This Code of Conduct applies to all individuals and entities who offer, provide, or perform services through the ServicePanda Platform ("<strong>Service Providers</strong>"), whether registered as individuals, sole traders, contractors, or businesses.
                </p>
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  This Code governs conduct relating to:
                </p>
                <ListItem>
                  <li>interactions with customers;</li>
                  <li>interactions with other service providers;</li>
                  <li>use of the Platform and its features; and</li>
                  <li>performance of services arranged through the Platform.</li>
                </ListItem>
              </CodeSection>

              <CodeSection number={2} title="Professional Standards and Behaviour">
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  Service Providers must, at all times:
                </p>
                <ListItem>
                  <li>act honestly, professionally, and in good faith;</li>
                  <li>communicate respectfully, clearly, and promptly with customers and ServicePanda representatives;</li>
                  <li>refrain from abusive, discriminatory, harassing, threatening, or inappropriate behaviour;</li>
                  <li>present themselves in a courteous and professional manner, including appropriate language, attire, and conduct; and</li>
                  <li>uphold the reputation, integrity, and trust associated with the ServicePanda Platform.</li>
                </ListItem>
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  Any form of harassment, intimidation, hate speech, or misconduct will not be tolerated.
                </p>
              </CodeSection>

              <CodeSection number={3} title="Compliance with Laws and Regulations">
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  Service Providers are solely responsible for ensuring that they:
                </p>
                <ListItem>
                  <li>comply with all applicable local, state, national, and international laws and regulations;</li>
                  <li>hold all required licences, permits, registrations, accreditations, and qualifications relevant to the services offered;</li>
                  <li>comply with workplace health and safety obligations;</li>
                  <li>meet all tax, employment, and insurance requirements; and</li>
                  <li>adhere to consumer protection and fair trading laws.</li>
                </ListItem>
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  ServicePanda does not provide legal, regulatory, or tax advice and does not assume responsibility for a Service Provider's compliance obligations.
                </p>
              </CodeSection>

              <CodeSection number={4} title="Accuracy of Information">
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  Service Providers must ensure that all information provided on the Platform is:
                </p>
                <ListItem>
                  <li>accurate, complete, and truthful;</li>
                  <li>kept up to date at all times; and</li>
                  <li>not misleading or deceptive.</li>
                </ListItem>
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  This includes, but is not limited to:
                </p>
                <ListItem>
                  <li>personal and business details;</li>
                  <li>qualifications, licences, and experience;</li>
                  <li>service descriptions and pricing;</li>
                  <li>availability; and</li>
                  <li>representations made in profiles, bids, quotes, and communications.</li>
                </ListItem>
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  Providing false, misleading, or outdated information may result in immediate action.
                </p>
              </CodeSection>

              <CodeSection number={5} title="Service Delivery Standards">
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  When providing services through ServicePanda, Service Providers must:
                </p>
                <ListItem>
                  <li>perform services with reasonable care, skill, and diligence;</li>
                  <li>deliver services as described, agreed, and within the specified timeframe;</li>
                  <li>use appropriate tools, equipment, and materials;</li>
                  <li>comply with any agreed scope of work and pricing; and</li>
                  <li>notify customers promptly of any delays, changes, or issues affecting service delivery.</li>
                </ListItem>
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  Service Providers must not commence additional work or charge additional fees without clear customer agreement.
                </p>
              </CodeSection>

              <CodeSection number={6} title="Safety and Property Respect">
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  Service Providers must:
                </p>
                <ListItem>
                  <li>take reasonable steps to ensure the safety of customers, occupants, and third parties;</li>
                  <li>follow all applicable safety standards and guidelines;</li>
                  <li>respect customer property and belongings;</li>
                  <li>avoid damage, misuse, or unauthorised access to property; and</li>
                  <li>promptly report any incidents, accidents, or damage to the customer and ServicePanda.</li>
                </ListItem>
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  Any deliberate or negligent damage to property may result in liability and disciplinary action.
                </p>
              </CodeSection>

              <CodeSection number={7} title="Payments and Financial Conduct">
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  Service Providers must:
                </p>
                <ListItem>
                  <li>adhere strictly to ServicePanda's payment processes and policies;</li>
                  <li>provide transparent and accurate pricing;</li>
                  <li>refrain from engaging in fraudulent, deceptive, or misleading financial practices; and</li>
                  <li>cooperate in any investigation relating to payments, disputes, or chargebacks.</li>
                </ListItem>
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  Circumventing platform fees or systems is strictly prohibited.
                </p>
              </CodeSection>

              <CodeSection number={8} title="Platform Integrity and Fair Use">
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  Service Providers must not:
                </p>
                <ListItem>
                  <li>misuse or manipulate the Platform, including ratings, reviews, or bidding systems;</li>
                  <li>engage in spam, solicitation, or unauthorised advertising;</li>
                  <li>attempt to access accounts, data, or systems without authorisation;</li>
                  <li>interfere with the operation, security, or performance of the Platform; or</li>
                  <li>encourage customers to transact outside the Platform to avoid fees or oversight.</li>
                </ListItem>
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  All use of the Platform must be lawful, ethical, and in accordance with ServicePanda policies.
                </p>
              </CodeSection>

              <CodeSection number={9} title="Confidentiality and Data Protection">
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  Service Providers must:
                </p>
                <ListItem>
                  <li>treat all customer information as confidential;</li>
                  <li>use personal data only for the purpose of delivering agreed services;</li>
                  <li>comply with applicable privacy and data protection laws; and</li>
                  <li>not retain, disclose, sell, or misuse customer data without lawful authority or consent.</li>
                </ListItem>
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  Any data breach or suspected unauthorized access must be reported to ServicePanda immediately.
                </p>
              </CodeSection>

              <CodeSection number={10} title="Reviews, Feedback, and Disputes">
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  Service Providers must:
                </p>
                <ListItem>
                  <li>engage with reviews and feedback in a professional and respectful manner;</li>
                  <li>refrain from retaliatory, misleading, or coercive behaviour relating to reviews;</li>
                  <li>cooperate in dispute resolution processes facilitated by ServicePanda; and</li>
                  <li>provide accurate information when responding to complaints or investigations.</li>
                </ListItem>
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  Abuse of the review system is strictly prohibited.
                </p>
              </CodeSection>

              <CodeSection number={11} title="Conflicts of Interest">
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  Service Providers must disclose any actual or potential conflicts of interest that may affect their ability to provide services fairly and independently.
                </p>
              </CodeSection>

              <CodeSection number={12} title="Monitoring, Enforcement, and Consequences">
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  ServicePanda reserves the right to:
                </p>
                <ListItem>
                  <li>monitor compliance with this Code of Conduct;</li>
                  <li>investigate complaints, reports, or suspected breaches;</li>
                  <li>request supporting documentation or information; and</li>
                  <li>take appropriate action, including warnings, suspension, limitation of access, or permanent removal from the Platform.</li>
                </ListItem>
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  Decisions made by ServicePanda in relation to enforcement are final, subject to applicable law.
                </p>
              </CodeSection>

              <CodeSection number={13} title="Updates to This Code of Conduct">
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  ServicePanda may update this Code of Conduct from time to time. Continued use of the Platform after updates constitutes acceptance of the revised Code.
                </p>
              </CodeSection>

              <CodeSection number={14} title="Contact and Reporting">
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  Service Providers may contact ServicePanda via the Platform for:
                </p>
                <ListItem>
                  <li>clarification of obligations;</li>
                  <li>reporting breaches or concerns; or</li>
                  <li>lodging complaints or enquiries related to this Code of Conduct.</li>
                </ListItem>
              </CodeSection>

            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
