import { STATUS_COLORS, PRIORITY_COLORS } from '../../config/constants';

export const StatusBadge = ({ status }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[status]}`}
    >
      {status.replace('_', ' ').toUpperCase()}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${PRIORITY_COLORS[priority]}`}
    >
      {priority.toUpperCase()}
    </span>
  );
};
