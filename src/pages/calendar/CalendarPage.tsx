import { useState } from "react";
import Calendar from "react-calendar";
import AddEventForm from "@/components/addEventForm/addEventForm";
import EventItem from "@/components/EventItem/EventItem";
import "./CalendarPage.css";
import Navbar from "@/components/navbar/Navbar";

interface Event {
  date: Date;
  title: string;
}

function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<Event[]>([]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddEvent = (date: Date, title: string) => {
    setEvents([...events, { date, title }]);
  };

  const handleUpdateEvent = (index: number, updatedEvent: Event) => {
    const updatedEvents = [...events];
    updatedEvents[index] = updatedEvent;
    setEvents(updatedEvents);
  };

  const handleDeleteEvent = (index: number) => {
    const updatedEvents = [...events];
    updatedEvents.splice(index, 1);
    setEvents(updatedEvents);
  };

  // Filter events happening this week, this month, and this year
  const today = new Date();
  const thisWeekEvents = events.filter(
    (event) =>
      event.date >= today &&
      event.date <= new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)
  );
  const thisMonthEvents = events.filter(
    (event) =>
      event.date.getFullYear() === today.getFullYear() &&
      event.date.getMonth() === today.getMonth()
  );
  const thisYearEvents = events.filter(
    (event) => event.date.getFullYear() === today.getFullYear()
  );

  return (
    <>
      <Navbar />
      <div className="calendar-container">
        <h1 className="calendar-title">Calendar</h1>
        <div className="calendar">
          <Calendar className="react-calendar" onClickDay={handleDateClick} />
        </div>
        {selectedDate && (
          <div className="events-container">
            <h2>Events for {selectedDate.toLocaleDateString()}</h2>
            <ul className="events-list">
              {events
                .filter(
                  (event) =>
                    event.date.toDateString() === selectedDate.toDateString(),
                )
                .map((event, index) => (
                  <EventItem
                    key={index}
                    date={event.date}
                    title={event.title}
                    onUpdateEvent={(updatedDate, updatedTitle) =>
                      handleUpdateEvent(index, {
                        date: updatedDate,
                        title: updatedTitle,
                      })
                    }
                    onDelete={() => handleDeleteEvent(index)}
                  />
                ))}
            </ul>
          </div>
        )}
        <div className="add-event-container">
          <AddEventForm onAddEvent={handleAddEvent} />
        </div>
      </div>
      <div className="upcoming-events">
        <h2>Upcoming Events</h2>
        <h3>This Week</h3>
        <ul>
          {thisWeekEvents.map((event, index) => (
            <li key={index}>{event.title}</li>
          ))}
        </ul>
        <h3>This Month</h3>
        <ul>
          {thisMonthEvents.map((event, index) => (
            <li key={index}>{event.title}</li>
          ))}
        </ul>
        <h3>This Year</h3>
        <ul>
          {thisYearEvents.map((event, index) => (
            <li key={index}>{event.title}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default CalendarPage;
