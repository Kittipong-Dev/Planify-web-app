// Calendar.js (React Component)
import React, { useState } from 'react';
import '/styles/calendar.css';


const Calendar = () => {
  const [displayedMonth, setDisplayedMonth] = useState(new Date().getMonth());
  const [displayedYear, setDisplayedYear] = useState(new Date().getFullYear());
  const [startDate, setStartDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [selectedButton, setSelectedButton] = useState(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const renderCalendarDays = () => {
    const firstDay = new Date(displayedYear, displayedMonth, 1).getDay();
    const daysInMonth = new Date(displayedYear, displayedMonth + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="day empty" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(displayedYear, displayedMonth, day);
      const isSelected =
        (startDate && currentDate.getTime() === startDate.getTime()) ||
        (dueDate && currentDate.getTime() === dueDate.getTime());

      days.push(
        <div
          key={day}
          className={`day ${isSelected ? 'selected' : ''}`}
          onClick={() => handleDateClick(currentDate)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const handleDateClick = (date) => {
    if (selectedButton === 'start') {
      if (dueDate && date > dueDate) {
        alert('Start date cannot be after the due date.');
        return;
      }
      setStartDate(date);
    } else if (selectedButton === 'due') {
      if (startDate && date < startDate) {
        alert('Due date cannot be before the start date.');
        return;
      }
      setDueDate(date);
    }
  };

  const handleMonthChange = (direction) => {
    if (direction === 'prev') {
      if (displayedMonth === 0) {
        setDisplayedMonth(11);
        setDisplayedYear(displayedYear - 1);
      } else {
        setDisplayedMonth(displayedMonth - 1);
      }
    } else {
      if (displayedMonth === 11) {
        setDisplayedMonth(0);
        setDisplayedYear(displayedYear + 1);
      } else {
        setDisplayedMonth(displayedMonth + 1);
      }
    }
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={() => handleMonthChange('prev')}>←</button>
        <span>{`${monthNames[displayedMonth]} ${displayedYear}`}</span>
        <button onClick={() => handleMonthChange('next')}>→</button>
      </div>
      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>
      <div className="calendar-days">{renderCalendarDays()}</div>
      <div className="date-controls">
        <button
          className="date-button"
          onClick={() => setSelectedButton('start')}
        >
          Start Date: {startDate ? startDate.toLocaleDateString() : 'Not Set'}
        </button>
        <button
          className="date-button"
          onClick={() => setSelectedButton('due')}
        >
          Due Date: {dueDate ? dueDate.toLocaleDateString() : 'Not Set'}
        </button>
      </div>
    </div>
  );
};

export default Calendar;
