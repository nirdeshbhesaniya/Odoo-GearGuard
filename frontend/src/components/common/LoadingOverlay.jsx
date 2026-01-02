import Spinner from './Spinner';

const LoadingOverlay = ({ message = 'Loading...', transparent = false }) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${transparent ? 'bg-black/20' : 'bg-white/90 dark:bg-gray-900/90'
        }`}
    >
      <div className="flex flex-col items-center space-y-4">
        <Spinner size="xl" />
        {message && (
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingOverlay;
