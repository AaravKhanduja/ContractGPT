import { CheckCircle, Circle, Loader2 } from 'lucide-react';

interface StreamingProgressProps {
  stage: string;
  progress: number;
  content: string;
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

export default function StreamingProgress({ stage, progress, content }: StreamingProgressProps) {
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
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      {/* Progress Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Generating Contract</h3>
          <span className="text-sm font-medium text-gray-600">{progress}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Current Stage */}
        <p className="text-sm text-gray-600">{stage}</p>
      </div>

      {/* Checkpoints */}
      <div className="space-y-3">
        {checkpoints.map((checkpoint, index) => {
          const status = getCheckpointStatus(checkpoint.threshold);
          const isLast = index === checkpoints.length - 1;

          return (
            <div key={checkpoint.id} className="flex items-center space-x-3">
              <div className="flex-shrink-0">{getIcon(status)}</div>
              <div className="flex-1">
                <p className={`text-sm ${getTextColor(status)}`}>{checkpoint.label}</p>
              </div>
              {!isLast && (
                <div className="flex-shrink-0">
                  <div
                    className={`w-px h-6 ${
                      status === 'completed' ? 'bg-green-200' : 'bg-gray-200'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Live Content Preview */}
      {content && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Live Preview</h4>
          <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
            <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">{content}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
