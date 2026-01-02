import { useState } from 'react';
import KanbanCard from './KanbanCard';

const statusColors = {
  New: 'bg-blue-100 border-blue-300',
  'In Progress': 'bg-yellow-100 border-yellow-300',
  Repaired: 'bg-green-100 border-green-300',
  Scrap: 'bg-red-100 border-red-300',
};

const statusIcons = {
  New: '📋',
  'In Progress': '⚙️',
  Repaired: '✅',
  Scrap: '🗑️',
};

const KanbanColumn = ({ status, requests, count, isDragDisabled = false, onDragStart, onDrop, draggedRequestId }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const requestId = e.dataTransfer.getData('requestId');
    if (requestId && onDrop) {
      onDrop(requestId, status);
    }
  };

  return (
    <div className="flex-1 min-w-[300px] max-w-[350px]">
      {/* Column Header */}
      <div className={`p-4 rounded-t-lg border-2 ${statusColors[status]}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{statusIcons[status]}</span>
            <h3 className="font-semibold text-gray-800">{status}</h3>
          </div>
          <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-700">
            {count}
          </span>
        </div>
      </div>

      {/* Droppable Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`p-3 space-y-3 min-h-[500px] border-2 border-t-0 rounded-b-lg transition-colors ${isDragOver
            ? 'bg-blue-50 border-blue-300'
            : 'bg-gray-50 border-gray-200'
          }`}
      >
        {requests && requests.length > 0 ? (
          requests.map((request) => (
            <KanbanCard
              key={request._id}
              request={request}
              isDragDisabled={isDragDisabled}
              onDragStart={onDragStart}
              isDragging={draggedRequestId === request._id}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-32 text-gray-400">
            <p className="text-sm">No requests</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;