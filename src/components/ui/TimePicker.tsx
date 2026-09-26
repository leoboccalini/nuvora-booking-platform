"use client";
import React, { useState, useEffect, useRef } from "react";
import { Time } from "../../types";
interface TimePickerProps {
    value: Time;
    onChange: (time: Time) => void;
    onClose: () => void;
}
const TimePicker: React.FC<TimePickerProps> = ({ value, onChange, onClose, }) => {
    const [selectedHour, setSelectedHour] = useState(value.hour);
    const [selectedMinute, setSelectedMinute] = useState(() => {
        return Math.floor(value.minute / 5) * 5;
    });
    const [selectedPeriod, setSelectedPeriod] = useState(value.period);
    const timePickerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (timePickerRef.current &&
                !timePickerRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);
    const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedHour(Number(e.target.value));
    };
    const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMinute(Number(e.target.value));
    };
    const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedPeriod(e.target.value as "AM" | "PM");
    };
    const handleConfirm = () => {
        onChange({
            hour: selectedHour,
            minute: selectedMinute,
            period: selectedPeriod,
        });
        onClose();
    };
    const hours = Array.from({ length: 12 }, (_, i) => (i === 0 ? 12 : i));
    const minutes = Array.from({ length: 12 }, (_, i) => i * 5);
    return (<div ref={timePickerRef} className="absolute z-50 bg-[#1A1A1A] border border-[#FFD900] rounded-lg shadow-[0_0_15px_rgba(255,217,0,0.2)] mt-1 p-4 w-full min-w-[200px]">
      <div className="flex justify-center items-center space-x-2 mb-4">
        <select value={selectedHour} onChange={handleHourChange} className="p-2 border border-[#FFD900]/30 rounded-md bg-black text-white focus:ring-1 focus:ring-[#FFD900] focus:border-[#FFD900] outline-none appearance-none cursor-pointer">
          {hours.map((h) => (<option key={h} value={h}>
              {String(h).padStart(2, "0")}
            </option>))}
        </select>
        <span className="text-xl font-bold text-white">:</span>
        <select value={selectedMinute} onChange={handleMinuteChange} className="p-2 border border-[#FFD900]/30 rounded-md bg-black text-white focus:ring-1 focus:ring-[#FFD900] focus:border-[#FFD900] outline-none appearance-none cursor-pointer">
          {minutes.map((m) => (<option key={m} value={m}>
              {String(m).padStart(2, "0")}
            </option>))}
        </select>
        <select value={selectedPeriod} onChange={handlePeriodChange} className="p-2 border border-[#FFD900]/30 rounded-md bg-black text-white focus:ring-1 focus:ring-[#FFD900] focus:border-[#FFD900] outline-none appearance-none cursor-pointer">
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
      <button onClick={handleConfirm} className="w-full bg-[#FFD900] text-black font-bold py-2 rounded-lg shadow-md hover:bg-[#E5C300] transition-colors uppercase tracking-wider text-sm">
        Confirm
      </button>
    </div>);
};
export { TimePicker };
export default TimePicker;
