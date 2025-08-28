'use client';

import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
            <FileText className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">ContractGPT</span>
        </Link>
        <div className="text-sm text-muted-foreground">AI-Powered Contract Generation</div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-primary hover:underline font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>

          {/* Content */}
          <div className="bg-card/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/50 p-8">
            <h1 className="text-3xl font-bold text-foreground mb-6">Privacy Policy</h1>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-muted-foreground mb-6">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  1. Information We Collect
                </h2>
                <p className="text-muted-foreground mb-4">
                  We collect information you provide directly to us, such as when you create an
                  account, use our services, or contact us for support. This may include your name,
                  email address, and any other information you choose to provide.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  2. How We Use Your Information
                </h2>
                <p className="text-muted-foreground mb-4">
                  We use the information we collect to provide, maintain, and improve our services,
                  to communicate with you, and to develop new features and services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  3. Information Sharing
                </h2>
                <p className="text-muted-foreground mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third
                  parties without your consent, except as described in this privacy policy or as
                  required by law.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">4. Data Security</h2>
                <p className="text-muted-foreground mb-4">
                  We implement appropriate security measures to protect your personal information
                  against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  5. Cookies and Tracking
                </h2>
                <p className="text-muted-foreground mb-4">
                  We use cookies and similar tracking technologies to enhance your experience on our
                  website and to collect information about how you use our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  6. Third-Party Services
                </h2>
                <p className="text-muted-foreground mb-4">
                  Our services may contain links to third-party websites or services. We are not
                  responsible for the privacy practices of these third parties.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  7. Children&apos;s Privacy
                </h2>
                <p className="text-muted-foreground mb-4">
                  Our services are not intended for children under the age of 13. We do not
                  knowingly collect personal information from children under 13.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  8. Changes to This Policy
                </h2>
                <p className="text-muted-foreground mb-4">
                  We may update this privacy policy from time to time. We will notify you of any
                  changes by posting the new privacy policy on this page.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">9. Contact Us</h2>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about this privacy policy, please contact us through our
                  website or support channels.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
