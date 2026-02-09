import { Link } from "wouter";

export default function PrivacyPolicy() {
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
        <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: February 2026</p>

        <p className="mt-6 text-gray-700 leading-relaxed">
          ServicePanda (“we”, “us”, “our”) is committed to protecting your privacy. This Privacy Policy explains
          what information we collect, how we use it, and the choices you have when using the ServicePanda app
          and website.
        </p>

        <section className="mt-8 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Information we collect</h2>
            <ul className="mt-3 list-disc pl-6 text-gray-700 space-y-2">
              <li>Account and contact details (e.g., name, email, phone number)</li>
              <li>Service request details you provide (e.g., descriptions, postcode/suburb, preferred date)</li>
              <li>Photos or documents you choose to upload as part of requests or job documentation</li>
              <li>Usage and diagnostic data to help us improve performance and reliability</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">How we use information</h2>
            <ul className="mt-3 list-disc pl-6 text-gray-700 space-y-2">
              <li>Provide and operate the ServicePanda platform</li>
              <li>Match service requests with service providers</li>
              <li>Send service updates and notifications you request</li>
              <li>Customer support and security / fraud prevention</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">Sharing</h2>
            <p className="mt-3 text-gray-700 leading-relaxed">
              We do not sell your personal information. We may share information with service providers involved
              in fulfilling your request, and with trusted vendors who help us operate the service (for example,
              infrastructure, messaging/notifications, and payment processing).
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">Location, camera, and photos</h2>
            <p className="mt-3 text-gray-700 leading-relaxed">
              If you grant permission, we may use location while you use the app to help match services and show
              relevant requests near you. Camera and photo library access is used only to let you take or select
              images you choose to attach to requests or documentation.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">Your choices</h2>
            <ul className="mt-3 list-disc pl-6 text-gray-700 space-y-2">
              <li>You can update your account information in-app</li>
              <li>You can control notifications and device permissions in iOS Settings</li>
              <li>You can request help or deletion by contacting us</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
            <p className="mt-3 text-gray-700 leading-relaxed">
              Questions about privacy? Contact us at{" "}
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

