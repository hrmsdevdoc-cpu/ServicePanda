import { Link } from "wouter";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="font-bold text-xl">
            <Link href="/">
              <a className="hover:opacity-90">ServicePanda</a>
            </Link>
          </div>
          <nav className="text-sm text-gray-600 flex gap-4">
            <Link href="/terms">
              <a className="hover:text-gray-900">Terms</a>
            </Link>
            <Link href="/privacy-policy">
              <a className="hover:text-gray-900">Privacy</a>
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: February 2026</p>

        <p className="mt-6 text-gray-700 leading-relaxed">
          These Terms of Service govern your use of the ServicePanda app and website. By accessing or using
          ServicePanda, you agree to these terms.
        </p>

        <section className="mt-8 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Eligibility</h2>
            <p className="mt-3 text-gray-700 leading-relaxed">
              You must be at least 18 years old to create an account and use the platform.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">Service requests and providers</h2>
            <p className="mt-3 text-gray-700 leading-relaxed">
              ServicePanda connects customers with independent service providers. Providers are responsible for
              the services they offer and perform. Customers are responsible for providing accurate request
              information.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">Payments</h2>
            <p className="mt-3 text-gray-700 leading-relaxed">
              Where applicable, payments are processed through our payment partners. You agree to provide
              accurate payment information and authorize charges for services you purchase.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">Prohibited use</h2>
            <ul className="mt-3 list-disc pl-6 text-gray-700 space-y-2">
              <li>Illegal activities or misuse of the platform</li>
              <li>Harassment, hate speech, or abusive content</li>
              <li>Attempting to access systems or data without authorization</li>
              <li>Spam, fraud, or deceptive practices</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">Limitation of liability</h2>
            <p className="mt-3 text-gray-700 leading-relaxed">
              To the maximum extent permitted by law, ServicePanda is not liable for indirect, incidental, or
              consequential damages arising from your use of the platform.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
            <p className="mt-3 text-gray-700 leading-relaxed">
              Questions about these terms? Contact us at{" "}
              <a className="text-primary underline" href="mailto:support@servicepanda.com.au">
                support@servicepanda.com.au
              </a>
              .
            </p>
          </div>
        </section>

        <div className="mt-10">
          <Link href="/">
            <a className="text-primary underline">Back to ServicePanda</a>
          </Link>
        </div>
      </main>
    </div>
  );
}

