import { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { toast } from 'react-hot-toast';
import CreateRequestModal from './CreateRequestModal';
import './calendar.css';

const statusColors = {
  New: '#3B82F6',         // Blue
  'In Progress': '#F59E0B', // Orange
  Repaired: '#10B981',    // Green
  Scrap: '#EF4444',       // Red
};

const CalendarScheduler = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const calendarRef = useRef(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Fetch only Preventive maintenance requests
      const response = await fetch(
        'http://localhost:5000/api/calendar/events?requestType=Preventive',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch events');

      const data = await response.json();

      // Transform API data to FullCalendar events
      const calendarEvents = data.map((event) => ({
        id: event._id,
        title: event.title,
        start: event.start,
        end: event.end,
        allDay: event.allDay || false,
        backgroundColor: event.color || statusColors[event.status] || '#6B7280',
        borderColor: event.color || statusColors[event.status] || '#6B7280',
        extendedProps: {
          ...event,
        },
      }));

      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load calendar events');
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (arg) => {
    // Open create modal when clicking on a date
    setSelectedDate(arg.date);
    setShowCreateModal(true);
  };

  const handleEventClick = (clickInfo) => {
    // Show event details when clicking on an event
    setSelectedEvent(clickInfo.event);
    setShowEventModal(true);
  };

  const handleEventDrop = async (info) => {
    // Handle drag & drop to reschedule
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5000/api/requests/${info.event.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            scheduledDate: info.event.start.toISOString(),
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to update event');

      toast.success('Event rescheduled successfully');
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to reschedule event');
      info.revert(); // Revert the event to its original position
    }
  };

  const handleRequestCreated = () => {
    // Refresh events after creating a new request
    fetchEvents();
    setShowCreateModal(false);
    toast.success('Preventive maintenance scheduled');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Calendar */}
      <div className="card p-6">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          events={events}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          height="auto"
          eventDisplay="block"
          displayEventTime={true}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: 'short',
          }}
        />
      </div>

      {/* Event Details Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedEvent.title}
              </h3>
              <button
                onClick={() => setShowEventModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {/* Status */}
              {selectedEvent.extendedProps?.status && (
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span
                    className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{
                      backgroundColor: selectedEvent.backgroundColor,
                    }}
                  >
                    {selectedEvent.extendedProps.status}
                  </span>
                </div>
              )}

              {/* Date & Time */}
              <div>
                <p className="text-sm text-gray-500">Scheduled</p>
                <p className="text-gray-900">
                  {selectedEvent.start?.toLocaleString('en-US', {
                    dateStyle: 'full',
                    timeStyle: 'short',
                  })}
                </p>
                {selectedEvent.extendedProps?.durationHours && (
                  <p className="text-sm text-gray-600">
                    Duration: {selectedEvent.extendedProps.durationHours} hours
                  </p>
                )}
              </div>

              {/* Equipment */}
              {selectedEvent.extendedProps?.equipment && (
                <div>
                  <p className="text-sm text-gray-500">Equipment</p>
                  <p className="text-gray-900">
                    {selectedEvent.extendedProps.equipment.name}
                  </p>
                </div>
              )}

              {/* Technician */}
              {selectedEvent.extendedProps?.assignedTechnician && (
                <div>
                  <p className="text-sm text-gray-500">Assigned To</p>
                  <p className="text-gray-900">
                    {selectedEvent.extendedProps.assignedTechnician.name}
                  </p>
                </div>
              )}

              {/* Description */}
              {selectedEvent.extendedProps?.description && (
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="text-gray-900">
                    {selectedEvent.extendedProps.description}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  window.location.href = `/requests/${selectedEvent.id}`;
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Details
              </button>
              <button
                onClick={() => setShowEventModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Request Modal */}
      {showCreateModal && (
        <CreateRequestModal
          selectedDate={selectedDate}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleRequestCreated}
        />
      )}

      {/* Legend */}
      <div className="card p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Status Legend</h4>
        <div className="flex flex-wrap gap-3">
          {Object.entries(statusColors).map(([status, color]) => (
            <div key={status} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-gray-700">{status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarScheduler;
