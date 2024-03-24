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
    </>
  );
}

export default CalendarPage;
