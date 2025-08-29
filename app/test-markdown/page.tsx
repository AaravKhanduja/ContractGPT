'use client';

import ReactMarkdown from 'react-markdown';

export default function TestMarkdownPage() {
  const testContent = `# Test Contract Agreement

## Parties
- **Client:** Test Client Company
- **Service Provider:** Test Provider Company

## Services and Deliverables
- Website development
- Content creation
- SEO optimization

## Payment Terms
- **Total Fee:** $5,000
- **Payment Schedule:** 50% upfront, 50% on completion
- **Payment Method:** Bank transfer
- **Late Payment Policy:** 5% late fee after 30 days

## Timeline
- **Project Kickoff:** Upon receipt of initial payment
- **Delivery Timeline:** 4-6 weeks
- **Revision Policy:** 2 rounds of revisions included

## Terms and Conditions
- **Confidentiality:** Both parties agree to maintain confidentiality
- **Intellectual Property:** Client owns final deliverables
- **Termination:** 30 days written notice required
- **Governing Law:** California law applies`;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Markdown Test Page</h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold mb-6">Test Content:</h2>
          <pre className="bg-gray-100 p-4 rounded mb-8 text-sm overflow-x-auto">{testContent}</pre>

          <h2 className="text-2xl font-semibold mb-6">Rendered Output:</h2>
          <div className="border border-gray-200 rounded p-6">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-gray-900 mb-8 pb-4 border-b-2 border-blue-600 leading-tight">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-6 flex items-center">
                    <span className="w-1 h-6 bg-blue-500 rounded-full mr-3"></span>
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4 flex items-center">
                    <span className="w-1 h-4 bg-gray-400 rounded-full mr-2"></span>
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-gray-700 mb-6 leading-relaxed text-base">{children}</p>
                ),
                ul: ({ children }) => <ul className="list-none space-y-3 mb-6 pl-4">{children}</ul>,
                li: ({ children }) => (
                  <li className="text-gray-700 flex items-start leading-relaxed">
                    <span className="mr-3 mt-2 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                    <span className="text-base">{children}</span>
                  </li>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-gray-900">{children}</strong>
                ),
              }}
            >
              {testContent}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
