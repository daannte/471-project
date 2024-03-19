import React, { useState } from 'react';
import Calendar from 'react-calendar';
import './CalendarPage.css';

function CalendarPage() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    
    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
    };

    const events: Record<string, string[]> = {
        '2024-03-01': ['Assignment 1', 'Quiz 5'],
        '2024-03-02': ['Midterm'],
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
                        {events[selectedDate.toISOString().split('T')[0]]?.map((event, index) => (
                            <li key={index}>{event}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default CalendarPage;
