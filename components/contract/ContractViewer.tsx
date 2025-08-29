import ReactMarkdown from 'react-markdown';

export default function ContractViewer({ content }: { content: string }) {
  return (
    <div className="contract-viewer bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-4xl mx-auto">
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
          ol: ({ children }) => (
            <ol className="list-decimal space-y-3 mb-6 pl-6 text-gray-700">{children}</ol>
          ),
          hr: () => (
            <hr className="my-10 border-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          ),
          em: ({ children }) => <em className="text-gray-600 italic font-medium">{children}</em>,
          strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-6 py-4 my-6 bg-blue-50 rounded-r-lg">
              <div className="text-gray-700 italic">{children}</div>
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">
              {children}
            </code>
          ),
        }}
      >
        {content}
      </ReactMarkdown>

      {/* Signature Section */}
      <div className="mt-16 pt-8 border-t-2 border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-8 flex items-center">
          <span className="w-1 h-6 bg-blue-500 rounded-full mr-3"></span>
          Signatures
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="signature-field">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Client Signature
            </label>
            <div className="border-b-2 border-gray-300 h-12 w-full"></div>
            <p className="text-xs text-gray-500 mt-1">Client Name</p>
          </div>

          <div className="signature-field">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Service Provider Signature
            </label>
            <div className="border-b-2 border-gray-300 h-12 w-full"></div>
            <p className="text-xs text-gray-500 mt-1">Service Provider Name</p>
          </div>

          <div className="signature-field md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
            <div className="border-b-2 border-gray-300 h-12 w-32"></div>
            <p className="text-xs text-gray-500 mt-1">MM/DD/YYYY</p>
          </div>
        </div>
      </div>
    </div>
  );
}
