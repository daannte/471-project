import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import AddEventForm from "@/components/addEventForm/addEventForm";
import EventItem from "@/components/EventItem/EventItem";
import "./CalendarPage.css";
import Navbar from "@/components/navbar/Navbar";
import axios from "axios";

interface Event {
  id: number;
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
  const [lastId, setLastId] = useState<number>(() => {
    const storedId = localStorage.getItem("lastId");
    return storedId ? parseInt(storedId) : 0;
  });
  const storedUcid = localStorage.getItem("ucid");
  const [ucid, _] = useState<number | null>(
    storedUcid ? parseInt(storedUcid) : null,
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsRes = await axios.get(`/api/calendar?ucid=${ucid}`);
        const userEventsRes = await axios.get(`/api/events?ucid=${ucid}`);

        const eventsData = eventsRes.data.map((item: any) => ({
          date: new Date(item.date).toLocaleDateString(),
          time: new Date(item.date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          title: `${item.course_name}${item.course_num} - ${item.name}`,
          component: true,
        }));

        const userEventsData = userEventsRes.data.map((item: any) => ({
          date: new Date(item.date).toLocaleDateString(),
          time: new Date(item.date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          title: item.name,
          component: false,
        }));

        const combinedEvents = [...eventsData, ...userEventsData];
        setEvents(combinedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem("lastId", lastId.toString());
  }, [lastId]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date.toLocaleDateString());
  };

  const handleAddEvent = async (date: string, title: string, time: string) => {
    const res = await axios.post(`/api/events?ucid=${ucid}`, {
      id: lastId,
      date,
      time,
      title,
    });

    if (res.data.success) {
      setEvents([
        ...events,
        { id: lastId, date, time, title, component: false },
      ]);
      setLastId((prevId) => prevId + 1);
    }
  };

  const handleUpdateEvent = async (updatedEvent: Event) => {
    const index = events.findIndex((event) => event.id === updatedEvent.id);

    if (index !== -1) {
      const res = await axios.put("/api/events", updatedEvent);
      if (res.data.success) {
        const updatedEvents = [...events];
        updatedEvents[index] = updatedEvent;
        setEvents(updatedEvents);
      }
    }
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
                        handleUpdateEvent({
                          id: event.id,
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
