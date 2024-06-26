import { useState } from "react";
import "./EventItem.css";

interface Props {
  date: string;
  time: string;
  title: string;
  component: boolean;
  onDelete: () => void;
  onUpdateEvent: (date: string, title: string, time: string) => void;
}

function EventItem({
  date,
  time,
  title,
  component,
  onDelete,
  onUpdateEvent,
}: Props) {
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>(title);
  const [editedDate, setEditedDate] = useState<string>(date);
  const [editedTime, setEditedTime] = useState<string>(time);

  const handleEdit = () => {
    setShowEditForm(true);
    setEditedTitle(title);
    setEditedDate(date);
    setEditedTime(time);
  };

  const handleCancelEdit = () => {
    setShowEditForm(false);
  };

  const handleSaveEdit = () => {
    if (editedDate && editedTitle && editedTime) {
      onUpdateEvent(editedDate, editedTitle, editedTime);
      setShowEditForm(false);
    }
  };

  const handleDelete = () => {
    onDelete();
    setShowEditForm(false);
    setEditedTitle("");
    setEditedDate("");
    setEditedTime("");
  };

  return (
    <div className="event-item">
      <div className="event-details">
        <div>Title: {title}</div>
        <div>
          Time:{" "}
          {new Date("1970-01-01T" + time + "Z").toLocaleTimeString("en-US", {
            timeZone: "UTC",
            hour12: true,
            hour: "numeric",
            minute: "numeric",
          })}
        </div>
      </div>
      {!component && (
        <div className="edit-button">
          <button onClick={handleEdit}>Edit Event</button>
        </div>
      )}
      {showEditForm && (
        <div className="edit-form">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <input
            type="date"
            value={editedDate}
            onChange={(e) => setEditedDate(e.target.value)}
          />
          <input
            type="time"
            value={editedTime}
            onChange={(e) => setEditedTime(e.target.value)}
          />
          <button onClick={handleSaveEdit}>Save</button>
          <button onClick={handleCancelEdit}>Cancel</button>
          <button onClick={handleDelete}>Delete Event</button>
        </div>
      )}
    </div>
  );
}

export default EventItem;
