import { Time } from '../types';
export const formatTime = (date: Date, time: Time) => {
    const fullDate = new Date(date);
    let hour = time.hour;
    if (time.period === 'PM' && hour < 12) {
        hour += 12;
    }
    if (time.period === 'AM' && hour === 12) {
        hour = 0;
    }
    fullDate.setHours(hour, time.minute);
    return fullDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
};
export const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
};
