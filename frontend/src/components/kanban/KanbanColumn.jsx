import { Droppable } from 'react-beautiful-dnd';
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

const KanbanColumn = ({ status, requests, count }) => {
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
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-3 space-y-3 min-h-[500px] border-2 border-t-0 rounded-b-lg transition-colors ${snapshot.isDraggingOver
              ? 'bg-blue-50 border-blue-300'
              : 'bg-gray-50 border-gray-200'
              }`}
          >
            {requests && requests.length > 0 ? (
              requests.map((request, index) => (
                <KanbanCard
                  key={request._id}
                  request={request}
                  index={index}
                />
              ))
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-400">
                <p className="text-sm">No requests</p>
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;