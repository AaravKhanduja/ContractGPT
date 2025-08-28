'use client';

import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
            <h1 className="text-3xl font-bold text-foreground mb-6">Terms of Service</h1>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-muted-foreground mb-6">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-muted-foreground mb-4">
                  By accessing and using ContractGPT, you accept and agree to be bound by the terms
                  and provision of this agreement.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">2. Use License</h2>
                <p className="text-muted-foreground mb-4">
                  Permission is granted to temporarily use ContractGPT for personal, non-commercial
                  transitory viewing only.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">3. Disclaimer</h2>
                <p className="text-muted-foreground mb-4">
                  The materials on ContractGPT are provided on an &apos;as is&apos; basis.
                  ContractGPT makes no warranties, expressed or implied, and hereby disclaims and
                  negates all other warranties including without limitation, implied warranties or
                  conditions of merchantability, fitness for a particular purpose, or
                  non-infringement of intellectual property or other violation of rights.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">4. Limitations</h2>
                <p className="text-muted-foreground mb-4">
                  In no event shall ContractGPT or its suppliers be liable for any damages
                  (including, without limitation, damages for loss of data or profit, or due to
                  business interruption) arising out of the use or inability to use the materials on
                  ContractGPT.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  5. Revisions and Errata
                </h2>
                <p className="text-muted-foreground mb-4">
                  The materials appearing on ContractGPT could include technical, typographical, or
                  photographic errors. ContractGPT does not warrant that any of the materials on its
                  website are accurate, complete or current.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">6. Links</h2>
                <p className="text-muted-foreground mb-4">
                  ContractGPT has not reviewed all of the sites linked to its website and is not
                  responsible for the contents of any such linked site. The inclusion of any link
                  does not imply endorsement by ContractGPT of the site.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">7. Modifications</h2>
                <p className="text-muted-foreground mb-4">
                  ContractGPT may revise these terms of service for its website at any time without
                  notice. By using this website you are agreeing to be bound by the then current
                  version of these Terms and Conditions of Use.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">8. Governing Law</h2>
                <p className="text-muted-foreground mb-4">
                  Any claim relating to ContractGPT shall be governed by the laws of the
                  jurisdiction in which the service is provided without regard to its conflict of
                  law provisions.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
