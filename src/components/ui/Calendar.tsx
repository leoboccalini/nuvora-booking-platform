"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '../booking/icons';
interface CalendarProps {
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
    onClose: () => void;
}
const Calendar: React.FC<CalendarProps> = ({ selectedDate, onSelectDate, onClose }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    const calendarRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);
    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };
    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };
    const handlePrevMonth = () => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };
    const handleNextMonth = () => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };
    const renderDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const numDays = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="text-center py-2"></div>);
        }
        for (let i = 1; i <= numDays; i++) {
            const dayDate = new Date(year, month, i);
            const isSelected = dayDate.toDateString() === selectedDate.toDateString();
            const isToday = dayDate.toDateString() === new Date().toDateString();
            const dayEnd = new Date(dayDate);
            dayEnd.setHours(23, 59, 59, 999);
            const minimumBookingTime = new Date(Date.now() + 12 * 60 * 60 * 1000);
            const isPast = dayEnd < minimumBookingTime;
            days.push(<button key={i} onClick={() => !isPast && onSelectDate(dayDate)} disabled={isPast} className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-colors
            ${isSelected ? 'bg-black text-white' : ''}
            ${!isSelected && !isPast ? 'text-gray-900 hover:bg-gray-100' : ''}
            ${isPast ? 'text-gray-300 cursor-not-allowed' : ''}
            ${isToday && !isSelected ? 'border border-black' : ''}
          `}>
          {i}
        </button>);
        }
        return days;
    };
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (<div ref={calendarRef} className="absolute z-20 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeftIcon className="w-4 h-4 text-gray-600"/>
        </button>
        <span className="font-semibold text-gray-900">
          {currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
        </span>
        <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100">
          <ArrowRightIcon className="w-4 h-4 text-gray-600"/>
        </button>
      </div>
      <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-2">
        {weekdays.map(day => <div key={day} className="font-medium">{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>
    </div>);
};
export default Calendar;
