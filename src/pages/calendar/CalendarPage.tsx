import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import AddEventForm from "@/components/addEventForm/addEventForm";
import EventItem from "@/components/EventItem/EventItem";
import "./CalendarPage.css";
import Navbar from "@/components/navbar/Navbar";
import axios from "axios";

interface Event {
  date: string;
  time: string;
  title: string;
  component: boolean;
}

function getSemester(date: Date): string {
  const month = date.getMonth();
  if (month >= 8 && month <= 11) {
    return "Fall";
  } else if (month >= 0 && month <= 3) {
    return "Winter";
  }
  return "Unknown";
}

function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const ucid = localStorage.getItem("ucid");
      const events_res = await axios.get(`/api/calendar?ucid=${ucid}`);

      const events = events_res.data.map((item: any) => {
        const date = new Date(item.date).toLocaleDateString();
        const time = new Date(item.date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        return {
          date,
          time,
          title: `${item.course_name}${item.course_num} - ${item.name}`,
          component: true,
        };
      });
      setEvents(events);
    };
    fetchData();
  }, []);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date.toLocaleDateString());
  };

  const handleAddEvent = (date: string, title: string, time: string) => {
    setEvents([...events, { date, time, title, component: false }]);
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

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const hasEvent = events.some(
        (event) => event.date === date.toLocaleDateString(),
      );
      return hasEvent ? <span className="dot"></span> : null;
    }
    return null;
  };

  const today = new Date();
  const thisWeekEvents = events.filter(
    (event) =>
      new Date(event.date) >= today &&
      new Date(event.date) <=
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
  );
  const thisMonthEvents = events.filter(
    (event) =>
      new Date(event.date).getFullYear() === today.getFullYear() &&
      new Date(event.date).getMonth() === today.getMonth(),
  );
  const thisSemesterEvents = events.filter(
    (event) => getSemester(new Date(event.date)) === getSemester(today),
  );

  return (
    <>
      <Navbar />
      <div className="calendar-container">
        <div>
          <h1 className="calendar-title">Calendar</h1>
          <div className="calendar">
            <Calendar
              className="react-calendar"
              onClickDay={handleDateClick}
              tileContent={tileContent}
            />
          </div>
          {selectedDate && (
            <div className="events-container">
              <h2>Events for {selectedDate}</h2>
              <ul className="events-list">
                {events
                  .filter((event) => event.date === selectedDate)
                  .map((event, index) => (
                    <EventItem
                      key={index}
                      date={event.date}
                      time={event.time}
                      title={event.title}
                      component={event.component}
                      onUpdateEvent={(updatedDate, updatedTitle, updatedTime) =>
                        handleUpdateEvent(index, {
                          date: updatedDate,
                          time: updatedTime,
                          title: updatedTitle,
                          component: false,
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
              <li key={index}>
                {new Date(event.date).toLocaleDateString("en-US", {
                  timeZone: "UTC",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
                : {event.title}
              </li>
            ))}
          </ul>
          <h3>This Month</h3>
          <ul>
            {thisMonthEvents.map((event, index) => (
              <li key={index}>
                {new Date(event.date).toLocaleDateString("en-US", {
                  timeZone: "UTC",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
                : {event.title}
              </li>
            ))}
          </ul>
          <h3>This Semester</h3>
          <ul>
            {thisSemesterEvents.map((event, index) => (
              <li key={index}>
                {new Date(event.date).toLocaleDateString("en-US", {
                  timeZone: "UTC",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
                : {event.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default CalendarPage;
