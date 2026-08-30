interface TransactionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  txHash: string;
  title: string;
  message: string;
}

export const TransactionSuccessModal = ({
  isOpen,
  onClose,
  txHash,
  title,
  message,
}: TransactionSuccessModalProps) => {
  if (!isOpen) return null;

  const stellarExpertUrl = `https://stellar.expert/explorer/testnet/tx/${txHash}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(txHash);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-custom-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-gray-600 text-center mb-6">{message}</p>

        {/* Transaction Hash */}
        <div className="bg-gray-50 rounded-custom p-4 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transaction Hash
          </label>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs bg-white px-3 py-2 rounded border border-gray-200 overflow-x-auto text-gray-800 font-mono">
              {txHash}
            </code>
            <button
              onClick={copyToClipboard}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              title="Copy to clipboard"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={stellarExpertUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-custom font-medium hover:bg-indigo-700 transition-colors"
          >
            View on Stellar Expert
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
          <button
            onClick={onClose}
            className="px-4 py-3 bg-gray-100 text-gray-700 rounded-custom font-medium hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
