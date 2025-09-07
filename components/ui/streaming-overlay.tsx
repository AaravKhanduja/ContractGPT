import { X, CheckCircle, Circle, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface StreamingOverlayProps {
  stage: string;
  progress: number;
  content: string;
  onClose?: () => void;
}

const checkpoints = [
  { id: 'init', label: 'Initializing AI', threshold: 0 },
  { id: 'analyze', label: 'Analyzing request', threshold: 10 },
  { id: 'title', label: 'Creating title', threshold: 30 },
  { id: 'parties', label: 'Defining parties', threshold: 40 },
  { id: 'services', label: 'Outlining services', threshold: 50 },
  { id: 'payment', label: 'Setting payment terms', threshold: 60 },
  { id: 'timeline', label: 'Establishing timeline', threshold: 70 },
  { id: 'terms', label: 'Adding legal terms', threshold: 80 },
  { id: 'finalize', label: 'Finalizing contract', threshold: 90 },
  { id: 'save', label: 'Saving contract', threshold: 95 },
  { id: 'complete', label: 'Contract ready!', threshold: 100 },
];

export default function StreamingOverlay({
  stage,
  progress,
  content,
  onClose,
}: StreamingOverlayProps) {
  const getCheckpointStatus = (threshold: number) => {
    if (progress >= threshold) {
      return 'completed';
    } else if (progress >= threshold - 5) {
      return 'active';
    }
    return 'pending';
  };

  const getIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'active':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Circle className="w-4 h-4 text-gray-300" />;
    }
  };

  const getTextColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'active':
        return 'text-blue-600 font-medium';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Generating Contract</h2>
              <p className="text-sm text-gray-600">{stage}</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Left Panel - Progress */}
          <div className="w-1/3 p-6 border-r border-gray-200 overflow-y-auto">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-bold text-blue-600">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Checkpoints */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Generation Steps</h3>
              {checkpoints.map((checkpoint, index) => {
                const status = getCheckpointStatus(checkpoint.threshold);
                const isLast = index === checkpoints.length - 1;

                return (
                  <div key={checkpoint.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">{getIcon(status)}</div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${getTextColor(status)}`}>{checkpoint.label}</p>
                      {!isLast && (
                        <div
                          className={`w-px h-4 ml-2 mt-1 ${
                            status === 'completed' ? 'bg-green-200' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel - Live Preview */}
          <div className="flex-1 p-6 overflow-y-auto">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Live Preview</h3>
            {content ? (
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">{children}</h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-gray-700 mb-3 leading-relaxed">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside space-y-1 mb-4 text-gray-700">
                        {children}
                      </ul>
                    ),
                    li: ({ children }) => <li className="text-gray-700">{children}</li>,
                    strong: ({ children }) => (
                      <strong className="font-semibold text-gray-900">{children}</strong>
                    ),
                    em: ({ children }) => <em className="italic text-gray-600">{children}</em>,
                    hr: () => <hr className="my-6 border-gray-200" />,
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-500">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
                  <p className="text-sm">Waiting for content...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
