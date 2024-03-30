import React, { useState } from "react";
import "./addEventForm.css";

interface EventFormProps {
  onAddEvent: (date: Date, title: string) => void;
}

function AddEventForm({ onAddEvent }: EventFormProps) {
  const [date, setDate] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const day = new Date(date).getUTCDate();
    const month = new Date(date).getUTCMonth();
    const year = new Date(date).getUTCFullYear();

    const selectedDate = new Date(year, month, day);
    console.log(selectedDate);
    if (date) {
      onAddEvent(selectedDate, title);
      setDate("");
      setTitle("");
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
        <button type="submit">Add Event</button>
      </form>
    </div>
  );
}

export default AddEventForm;
