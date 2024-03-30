import React, { useState } from 'react';
import './EventItem.css';

interface EventItemProps {
    date: Date;
    title: string;
    onDelete: () => void;
    onUpdateEvent: (date: Date, title: string) => void;
}

function EventItem({ date, title, onDelete, onUpdateEvent }: EventItemProps) {
    const [showEditForm, setShowEditForm] = useState<boolean>(false);
    const [editedDate, setEditedDate] = useState<string>(date ? date.toISOString().split('T')[0] : '');
    const [editedTitle, setEditedTitle] = useState<string>(title);

    const handleEdit = () => {
        setShowEditForm(true);
    };

    const handleCancelEdit = () => {
        setShowEditForm(false);
    };

    const handleSaveEdit = () => {
        const updatedDate = new Date(editedDate);
        onUpdateEvent(updatedDate, editedTitle);
        setShowEditForm(false);
    };

    return (
        <div className="event-item">
            <div className="event-details">
                <div>Date: {date ? new Date(date).toLocaleDateString() : ''}</div>
                <div>Title: {title}</div>
            </div>
            <div className="edit-button">
                <button onClick={handleEdit}>Edit Event</button>
            </div>
            {showEditForm && (
                <div className="edit-form">
                    <input type="date" value={editedDate} onChange={(e) => setEditedDate(e.target.value)} />
                    <input type="text" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} />
                    <button onClick={handleSaveEdit}>Save</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                    <button onClick={onDelete}>Delete Event</button>
                </div>
            )}
        </div>
    );
}

export default EventItem;
