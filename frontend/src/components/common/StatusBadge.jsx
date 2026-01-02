const statusStyles = {
  New: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-300',
    icon: '📋',
  },
  'In Progress': {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-300',
    icon: '⚙️',
  },
  Repaired: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300',
    icon: '✅',
  },
  Scrap: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300',
    icon: '🗑️',
  },
};

const StatusBadge = ({ status, showIcon = true, className = '' }) => {
  const style = statusStyles[status] || {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-300',
    icon: '•',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${style.bg
        } ${style.text} ${style.border} ${className}`}
    >
      {showIcon && <span>{style.icon}</span>}
      {status}
    </span>
  );
};

export default StatusBadge;