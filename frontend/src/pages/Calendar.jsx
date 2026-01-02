import CalendarScheduler from '../components/calendar/CalendarScheduler';

const Calendar = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Maintenance Calendar</h1>
      <CalendarScheduler />
    </div>
  );
};

export default Calendar;
