import { useState } from "react";
import Calendar from "react-calendar";
import AddEventForm from "@/components/addEventForm/addEventForm";
import "./CalendarPage.css";

function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<{ [key: string]: string[] }>({});

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddEvent = (date: Date, title: string) => {
    const dateKey = date.toISOString().split("T")[0];
    const updatedEvents = {
      ...events,
      [dateKey]: [...(events[dateKey] || []), title],
    };
    setEvents(updatedEvents);
  };

  return (
    <div className="calendar-container">
      <h1 className="calendar-title">Calendar</h1>
      <div className="calendar">
        <Calendar className="react-calendar" onClickDay={handleDateClick} />
      </div>
      {selectedDate && (
        <div className="events-container">
          <h2>Events for {selectedDate.toLocaleDateString()}</h2>
          <ul className="events-list">
            {events[selectedDate.toISOString().split("T")[0]]?.map(
              (event, index) => <li key={index}>{event}</li>,
            )}
          </ul>
        </div>
      )}
      <div className="add-event-container">
        <AddEventForm onAddEvent={handleAddEvent} />
      </div>
    </div>
  );
}

export default CalendarPage;
