import React, { useState } from "react";
import "./addEventForm.css";

interface Props {
  onAddEvent: (date: string, title: string, time: string) => void;
}

function AddEventForm({ onAddEvent }: Props) {
  const [date, setDate] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [time, setTime] = useState<string>("");

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (date && title && time) {
      onAddEvent(date, title, time);
      setDate("");
      setTitle("");
      setTime("");
    }
  };

  return (
    <div className="event-form">
      <h2>Add Event</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Date:</label>
          <input type="date" value={date} onChange={handleDateChange} />
        </div>
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={handleTitleChange} />
        </div>
        <div>
          <label>Event Time:</label>
          <input type="time" value={time} onChange={handleTimeChange} />
        </div>
        <button type="submit">Add Event</button>
      </form>
    </div>
  );
}

export default AddEventForm;
