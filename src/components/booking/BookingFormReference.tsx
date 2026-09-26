import React, { useState, useEffect, useRef } from "react";
import { LocationSuggestion } from "../../types";
import { getDirections, getPlaceAutocompleteSuggestions, } from "../../utils/googleMapsApi";
import { Plane, Train, Building, MapPin, Calendar as CalendarLucide, Clock, ChevronDown, Loader2, Check, Trash2, } from "lucide-react";
import { SimpleSpinner } from "../SimpleSpinner";
import { toast } from "sonner";
enum BookingType {
    OneWay = "one-way",
    ByTheHour = "by-the-hour"
}
interface Time {
    hour: number;
    minute: number;
    period: "AM" | "PM";
}
interface BookingData {
    bookingType: BookingType;
    fromLocation: string;
    fromLocationAddress?: string;
    fromPlaceId?: string;
    toLocation?: string;
    toLocationAddress?: string;
    toPlaceId?: string;
    date: Date;
    time: Time;
    duration?: number;
    distanceKm?: number;
    durationMinutes?: number;
    encodedPolyline?: string;
}
interface BookingFormProps {
    onSearch: (data: BookingData) => void;
}
const DURATION_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1} hour${i === 0 ? "" : "s"}`,
}));
const LOCATION_PATTERNS = {
    airport: {
        keywords: ["airport", "aeroporto", "aéroport", "heliport", "heliporto"],
        icon: Plane,
        regex: /\b[A-Z]{3}\b/,
    },
    train: {
        keywords: [
            "train station",
            "estação de trem",
            "gare",
            "railway station",
            "estação ferroviária",
            "central station",
        ],
        icon: Train,
    },
    busMetro: {
        keywords: [
            "bus station",
            "estação rodoviária",
            "terminal de ônibus",
            "rodoviária",
            "bus terminal",
            "metro station",
            "subway station",
        ],
        icon: Train,
    },
    hotel: {
        keywords: ["hotel", "pousada", "resort", "inn", "lodge", "hostel"],
        icon: Building,
    },
};
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const LocationPinIcon = () => (<svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
  </svg>);
const getLocationIcon = (suggestion: LocationSuggestion): React.ReactNode => {
    const fullText = `${suggestion.primaryText} ${suggestion.secondaryText}`.toLowerCase();
    if (suggestion.type === "airport") {
        return <Plane className="w-5 h-5 text-gray-400"/>;
    }
    if (LOCATION_PATTERNS.airport.regex.test(suggestion.primaryText || "") ||
        LOCATION_PATTERNS.airport.keywords.some((k) => fullText.includes(k))) {
        return <Plane className="w-5 h-5 text-gray-400"/>;
    }
    for (const [type, config] of Object.entries(LOCATION_PATTERNS)) {
        if (type === "airport")
            continue;
        if (config.keywords.some((k) => fullText.includes(k))) {
            const Icon = config.icon;
            return <Icon className="w-5 h-5 text-gray-400"/>;
        }
    }
    return <MapPin className="w-5 h-5 text-gray-400"/>;
};
const CalendarIcon = () => <CalendarLucide className="w-5 h-5 text-gray-400"/>;
const ClockIcon = () => <Clock className="w-5 h-5 text-gray-400"/>;
const ChevronDownIcon = ({ className }: {
    className?: string;
}) => (<ChevronDown className={className || "w-5 h-5"}/>);
const InformationCircleIcon = ({ className }: {
    className?: string;
}) => (<svg className={className || "w-5 h-5"} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
  </svg>);
const isPastDateTime = (date: Date, time: Time): boolean => {
    const now = new Date();
    const selectedDateTime = new Date(date);
    let hour24 = time.hour;
    if (time.period === "PM" && time.hour !== 12)
        hour24 += 12;
    if (time.period === "AM" && time.hour === 12)
        hour24 = 0;
    selectedDateTime.setHours(hour24, time.minute, 0, 0);
    const minimumTime = new Date(now.getTime() + 12 * 60 * 60 * 1000);
    return selectedDateTime < minimumTime;
};
const LocationInput: React.FC<{
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    onSelect: (suggestion: LocationSuggestion) => void;
    placeholder?: string;
    icon: React.ReactNode;
    isActive: boolean;
    onFocus: () => void;
    error?: string;
}> = ({ id, label, value, onChange, onSelect, placeholder, icon, isActive, onFocus, error, }) => {
    const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);
    useEffect(() => {
        if (value.length >= 2 && isActive && showSuggestions) {
            setIsLoading(true);
            if (debounceRef.current)
                clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(async () => {
                try {
                    const results = await getPlaceAutocompleteSuggestions(value);
                    setSuggestions(results);
                }
                catch (error) {
                    setSuggestions([]);
                }
                finally {
                    setIsLoading(false);
                }
            }, 200);
        }
        else {
            setSuggestions([]);
            setIsLoading(false);
        }
        return () => {
            if (debounceRef.current)
                clearTimeout(debounceRef.current);
        };
    }, [value, isActive, showSuggestions]);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current &&
                !containerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
                setSuggestions([]);
            }
        };
        if (showSuggestions) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showSuggestions]);
    const handleSelectSuggestion = (suggestion: LocationSuggestion) => {
        onSelect(suggestion);
        setShowSuggestions(false);
        setSuggestions([]);
        setIsLoading(false);
        if (inputRef.current) {
            inputRef.current.blur();
        }
    };
    const handleClearInput = () => {
        onChange("");
        setSuggestions([]);
        setShowSuggestions(false);
    };
    const handleFocus = () => {
        onFocus();
        if (value.length > 2) {
            setShowSuggestions(true);
        }
    };
    return (<div ref={containerRef} className="relative">
        <label htmlFor={id} className={`text-gray-500 text-xs sm:text-sm absolute top-1.5 left-8 sm:left-10 z-10 ${isActive ? "font-bold" : ""}`}>
          {label}
        </label>
        <div className="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3 pointer-events-none pt-4">
          {icon}
        </div>
        <input ref={inputRef} id={id} type="text" value={value} onChange={(e) => {
            onChange(e.target.value);
            if (e.target.value.length > 2) {
                setShowSuggestions(true);
            }
        }} onFocus={handleFocus} placeholder={placeholder} className={`w-full bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 pl-8 sm:pl-10 pt-6 sm:pt-7 text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition-colors ${error ? "border-red-500 bg-red-50" : ""}`}/>
        {isLoading && (<div className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin text-gray-400"/>
          </div>)}
        {value && !isLoading && (<button onClick={handleClearInput} className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-lg sm:text-xl">
            ×
          </button>)}
        {error && (<p className="absolute -bottom-5 left-0 text-xs text-red-500">
            {error}
          </p>)}

        
        {showSuggestions && suggestions.length > 0 && (<div className="absolute z-[9999] w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 sm:max-h-60 overflow-y-auto animate-fadeIn">
            {suggestions.map((suggestion, index) => (<button key={suggestion.placeId || `suggestion-${index}`} onClick={() => handleSelectSuggestion(suggestion)} className="w-full px-3 sm:px-4 py-2 sm:py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="flex-shrink-0">
                    {getLocationIcon(suggestion)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900">
                      {suggestion.primaryText}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">
                      {suggestion.secondaryText}
                    </p>
                  </div>
                </div>
              </button>))}
          </div>)}
      </div>);
};
const Calendar: React.FC<{
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
    onClose: () => void;
}> = ({ selectedDate, onSelectDate, onClose }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    const calendarRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (calendarRef.current &&
                !calendarRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);
    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };
    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };
    const handlePrevMonth = () => {
        setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };
    const handleNextMonth = () => {
        setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };
    const renderDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const numDays = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`}/>);
        }
        for (let i = 1; i <= numDays; i++) {
            const dayDate = new Date(year, month, i);
            dayDate.setHours(0, 0, 0, 0);
            const isSelected = dayDate.getTime() === new Date(selectedDate).setHours(0, 0, 0, 0);
            const isToday = dayDate.getTime() === today.getTime();
            const dayEnd = new Date(dayDate);
            dayEnd.setHours(23, 59, 59, 999);
            const minimumBookingTime = new Date(Date.now() + 12 * 60 * 60 * 1000);
            const isPast = dayEnd < minimumBookingTime;
            days.push(<button key={i} onClick={() => {
                    onSelectDate(dayDate);
                    onClose();
                }} type="button" disabled={isPast} className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-xs sm:text-sm font-medium transition-colors ${isSelected
                    ? "bg-black text-white"
                    : isPast
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-900 hover:bg-gray-100"} ${isToday && !isSelected ? "border border-black" : ""}`} aria-label={`Select ${dayDate.toLocaleDateString()}`}>
          {i}
        </button>);
        }
        return days;
    };
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (<div ref={calendarRef} className="absolute z-[9999] bg-white border border-gray-200 rounded-lg shadow-lg mt-1 p-3 sm:p-4 w-full animate-fadeIn">
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <button onClick={handlePrevMonth} className="p-1 sm:p-2 rounded-full hover:bg-gray-100">
          <ChevronDownIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 rotate-90"/>
        </button>
        <span className="font-semibold text-gray-900 text-sm sm:text-base">
          {currentMonth.toLocaleString("en-US", {
            month: "long",
            year: "numeric",
        })}
        </span>
        <button onClick={handleNextMonth} className="p-1 sm:p-2 rounded-full hover:bg-gray-100">
          <ChevronDownIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 -rotate-90"/>
        </button>
      </div>
      <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-2">
        {WEEKDAYS.map((day) => (<div key={day} className="font-medium">
            {day}
          </div>))}
      </div>
      <div className="grid grid-cols-7 gap-1">{renderDays()}</div>
    </div>);
};
const TimePicker: React.FC<{
    value: Time;
    onChange: (time: Time) => void;
    onClose: () => void;
}> = ({ value, onChange, onClose }) => {
    const [selectedHour, setSelectedHour] = useState(value.hour);
    const [selectedMinute, setSelectedMinute] = useState(value.minute);
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
    const hours = [...Array.from({ length: 12 }, (_, i) => i + 1)];
    const minutes = Array.from({ length: 12 }, (_, i) => i * 5);
    const selectClassName = "p-1 sm:p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-1 focus:ring-black focus:border-black focus:outline-none transition-colors text-sm sm:text-base";
    return (<div ref={timePickerRef} className="absolute z-[9999] bg-white border border-gray-200 rounded-lg shadow-lg mt-1 p-3 sm:p-4 w-full animate-fadeIn">
      <div className="flex justify-center items-center space-x-1 sm:space-x-2 mb-3 sm:mb-4">
        <select value={selectedHour} onChange={handleHourChange} className={selectClassName} style={{ backgroundColor: "#F0F2F7" }}>
          {hours.map((h) => (<option key={h} value={h}>
              {String(h).padStart(2, "0")}
            </option>))}
        </select>
        <span className="text-lg sm:text-xl font-bold text-gray-700">:</span>
        <select value={selectedMinute} onChange={handleMinuteChange} className={selectClassName} style={{ backgroundColor: "#F0F2F7" }}>
          {minutes.map((m) => (<option key={m} value={m}>
              {String(m).padStart(2, "0")}
            </option>))}
        </select>
        <select value={selectedPeriod} onChange={handlePeriodChange} className={selectClassName} style={{ backgroundColor: "#F0F2F7" }}>
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
      <button onClick={handleConfirm} type="button" className="w-full bg-[#FFD900] hover:bg-[#FFD900]/90 text-black font-semibold py-2 sm:py-3 rounded-lg shadow-md hover:shadow-lg transition-all text-sm sm:text-base">
        Confirm
      </button>
    </div>);
};
const DurationSelect: React.FC<{
    value: number;
    onChange: (value: number) => void;
    label: string;
    isActive: boolean;
    onFocus: () => void;
}> = ({ value, onChange, label, isActive, onFocus }) => {
    return (<div className="relative">
      <label className={`text-gray-500 text-xs sm:text-sm absolute top-1.5 left-8 sm:left-10 z-10 ${isActive ? "font-bold" : ""}`}>
        {label}
      </label>
      <div className="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3 pointer-events-none pt-4">
        <ClockIcon />
      </div>
      <select value={value} onChange={(e) => onChange(parseInt(e.target.value))} onFocus={onFocus} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 pl-8 sm:pl-10 pt-6 sm:pt-7 text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 appearance-none">
        {DURATION_OPTIONS.map((option) => (<option key={option.value} value={option.value}>
            {option.label}
          </option>))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none pt-4">
        <ChevronDownIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"/>
      </div>
    </div>);
};
const BookingFormReference: React.FC<BookingFormProps> = ({ onSearch }) => {
    const [bookingType, setBookingType] = useState<BookingType>(BookingType.OneWay);
    const [fromLocation, setFromLocation] = useState("Geneva International Airport (GVA)");
    const [fromLocationAddress, setFromLocationAddress] = useState("");
    const [fromPlaceId, setFromPlaceId] = useState<string | undefined>(undefined);
    const [toLocation, setToLocation] = useState("Lausanne railway station");
    const [toLocationAddress, setToLocationAddress] = useState("");
    const [toPlaceId, setToPlaceId] = useState<string | undefined>(undefined);
    const [date, setDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() + 2);
        d.setHours(12, 0, 0, 0);
        return d;
    });
    const [time, setTime] = useState<Time>({ hour: 12, minute: 0, period: "PM" });
    const [duration, setDuration] = useState(2);
    const [activeField, setActiveField] = useState<string | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [preselectedVehicle, setPreselectedVehicle] = useState<string | null>(null);
    const [calculationFromQuery, setCalculationFromQuery] = useState<string | null>(null);
    const [isHoveringDelete, setIsHoveringDelete] = useState(false);
    const formRef = useRef<HTMLDivElement>(null);
    const vehicleInfo = {
        business: {
            name: "Business Class",
            category: "Executive sedan",
            image: "/images/vehicle-1.svg",
        },
        van: {
            name: "Business Van/SUV",
            category: "People carrier",
            image: "/images/vehicle-3.svg",
        },
        electric: {
            name: "Electric Class",
            category: "Electric sedan",
            image: "/images/vehicle-2.svg",
        },
        first: {
            name: "First Class",
            category: "Premium sedan",
            image: "/images/vehicle-4.svg",
        },
    };
    const handleRemovePreselection = () => {
        setPreselectedVehicle(null);
        setIsHoveringDelete(false);
        const url = new URL(window.location.href);
        url.searchParams.delete("vehicle");
        window.history.pushState({}, "", url);
    };
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const vehicleParam = urlParams.get("vehicle");
        if (vehicleParam) {
            setPreselectedVehicle(vehicleParam);
        }
        const handleVehiclePreselect = (event: CustomEvent) => {
            const vehicleId = event.detail?.vehicleId;
            if (vehicleId) {
                setPreselectedVehicle(vehicleId);
            }
        };
        const handleRoutePreselect = (event: CustomEvent) => {
            const from = event.detail?.from;
            const to = event.detail?.to;
            const calcFrom = event.detail?.calculationFrom;
            if (from) {
                setFromLocation(from);
                setCalculationFromQuery(calcFrom || null);
            }
            if (to) {
                setToLocation(to);
            }
        };
        window.addEventListener("vehiclePreselect", handleVehiclePreselect as EventListener);
        window.addEventListener("routePreselect", handleRoutePreselect as EventListener);
        return () => {
            window.removeEventListener("vehiclePreselect", handleVehiclePreselect as EventListener);
            window.removeEventListener("routePreselect", handleRoutePreselect as EventListener);
        };
    }, []);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (formRef.current && !formRef.current.contains(event.target as Node)) {
                setActiveField(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!fromLocation.trim()) {
            newErrors.from = "Please select a pickup location";
        }
        else {
        }
        if (bookingType === BookingType.OneWay && !toLocation.trim()) {
            newErrors.to = "Please select a drop-off location";
        }
        else if (bookingType === BookingType.OneWay) {
        }
        else {
        }
        if (isPastDateTime(date, time)) {
            newErrors.datetime = "Bookings must be made at least 12 hours in advance.";
        }
        else {
        }
        setErrors(newErrors);
        const isValid = Object.keys(newErrors).length === 0;
        if (isValid) {
        }
        else {
        }
        return isValid;
    };
    const handleSearchClick = async () => {
        if (!validateForm())
            return;
        setIsSearching(true);
        try {
            const directions = bookingType === BookingType.OneWay
                ? await getDirections(fromPlaceId || fromLocation, toPlaceId || toLocation)
                : { distanceKm: 0, durationMinutes: duration * 60, encodedPolyline: "" };
            const draft = {
                bookingType, fromLocation, fromLocationAddress, fromPlaceId,
                toLocation: bookingType === BookingType.OneWay ? toLocation : fromLocation,
                toLocationAddress, toPlaceId, date, time, duration,
                ...directions, preselectedVehicle,
            };
            sessionStorage.setItem("nuvora:journey", JSON.stringify(draft));
            window.location.assign("/booking/checkout");
        }
        catch {
            toast.error("Please check the journey details and try again.");
        }
        finally {
            setIsSearching(false);
        }
    };
    const handleSelectFrom = (location: LocationSuggestion) => {
        setFromLocation(location.primaryText);
        const fullAddress = location.description || `${location.primaryText}, ${location.secondaryText}`;
        setFromLocationAddress(fullAddress);
        setFromPlaceId(location.placeId);
        setActiveField(null);
        setErrors((prev) => ({ ...prev, from: "" }));
    };
    const handleSelectTo = (location: LocationSuggestion) => {
        setToLocation(location.primaryText);
        const fullAddress = location.description || `${location.primaryText}, ${location.secondaryText}`;
        setToLocationAddress(fullAddress);
        setToPlaceId(location.placeId);
        setActiveField(null);
        setErrors((prev) => ({ ...prev, to: "" }));
    };
    const formatDate = (date: Date): string => {
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };
    const formatTime = (time: Time): string => {
        return `${String(time.hour).padStart(2, "0")} : ${String(time.minute).padStart(2, "0")} ${time.period}`;
    };
    const isSearchDisabled = isSearching;
    const renderOneWayForm = () => (<>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative">
          <LocationInput id="from-location" label="From" value={fromLocation} onChange={(value) => {
            setFromLocation(value);
            setFromPlaceId(undefined);
            if (calculationFromQuery) {
                setCalculationFromQuery(null);
            }
            if (errors.from) {
                const newErrors = { ...errors };
                delete newErrors.from;
                setErrors(newErrors);
            }
        }} onSelect={handleSelectFrom} placeholder="Address, airport, hotel, ..." icon={<LocationPinIcon />} isActive={activeField === "from"} onFocus={() => setActiveField("from")} error={errors.from}/>
        </div>
        <div className="relative">
          <LocationInput id="to-location" label="To" value={toLocation} onChange={setToLocation} onSelect={handleSelectTo} placeholder="Address, airport, hotel, ..." icon={<LocationPinIcon />} isActive={activeField === "to"} onFocus={() => setActiveField("to")} error={errors.to}/>
        </div>
      </div>
    </>);
    const renderByTheHourForm = () => (<>
      <div className="relative">
        <LocationInput id="from-location-hourly" label="From" value={fromLocation} onChange={setFromLocation} onSelect={handleSelectFrom} placeholder="Address, airport, hotel, ..." icon={<LocationPinIcon />} isActive={activeField === "from-hourly"} onFocus={() => setActiveField("from-hourly")} error={errors.from}/>
      </div>
      <DurationSelect value={duration} onChange={setDuration} label="Duration" isActive={activeField === "duration"} onFocus={() => setActiveField("duration")}/>
    </>);
    return (<>
      <div ref={formRef} className="bg-white rounded-lg sm:rounded-xl shadow-2xl w-full mx-auto border-2 border-gold/50 relative z-[200]">
        <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
            `}</style>

        
        <div className="px-4 sm:px-6 py-4 sm:py-5 text-center">
          <h2 className="text-lg sm:text-xl font-bold text-black uppercase tracking-wider">
            Book Your <span className="text-[#FFD900]">Ride</span>
          </h2>
        </div>

        
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4">
          {bookingType === BookingType.OneWay
            ? renderOneWayForm()
            : renderByTheHourForm()}

          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="relative">
              <label htmlFor="date" className={`text-gray-500 text-xs sm:text-sm absolute top-1.5 left-8 sm:left-10 z-10 ${activeField === "date" ? "font-bold" : ""}`}>
                Date
              </label>
              <div className="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3 pointer-events-none pt-4">
                <CalendarIcon />
              </div>
              <button id="date" onClick={() => setActiveField(activeField === "date" ? null : "date")} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 pl-8 sm:pl-10 pt-6 sm:pt-7 text-left text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 flex justify-between items-center">
                <span className="text-xs sm:text-sm">{formatDate(date)}</span>
                <ChevronDownIcon className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform ${activeField === "date" ? "rotate-180" : ""}`}/>
              </button>
              {activeField === "date" && (<Calendar selectedDate={date} onSelectDate={(newDate) => {
                setDate(newDate);
                setActiveField(null);
            }} onClose={() => setActiveField(null)}/>)}
            </div>

            
            <div className="relative">
              <label htmlFor="time" className={`text-gray-500 text-xs sm:text-sm absolute top-1.5 left-8 sm:left-10 z-10 ${activeField === "time" ? "font-bold" : ""}`}>
                Time
              </label>
              <div className="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3 pointer-events-none pt-4">
                <ClockIcon />
              </div>
              <button id="time" onClick={() => setActiveField(activeField === "time" ? null : "time")} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 pl-8 sm:pl-10 pt-6 sm:pt-7 text-left text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 flex justify-between items-center">
                <span className="text-xs sm:text-sm">{formatTime(time)}</span>
                <ChevronDownIcon className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform ${activeField === "time" ? "rotate-180" : ""}`}/>
              </button>
              {activeField === "time" && (<TimePicker value={time} onChange={setTime} onClose={() => setActiveField(null)}/>)}
            </div>
          </div>

          
          {preselectedVehicle &&
            vehicleInfo[preselectedVehicle as keyof typeof vehicleInfo] && (<div className="relative">
                <div className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 flex items-center justify-between">
                  
                  <div className="flex items-center flex-1 min-w-0 gap-2">
                    <img src={vehicleInfo[preselectedVehicle as keyof typeof vehicleInfo].image} alt={vehicleInfo[preselectedVehicle as keyof typeof vehicleInfo].name} className="w-10 sm:w-12 h-auto flex-shrink-0"/>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[11px] sm:text-xs text-black leading-tight truncate">
                        <strong>
                          {vehicleInfo[preselectedVehicle as keyof typeof vehicleInfo].name}
                        </strong>{" "}
                        -{" "}
                        {vehicleInfo[preselectedVehicle as keyof typeof vehicleInfo].category}{" "}
                        or similar
                      </h3>
                    </div>
                  </div>

                  
                  <button onClick={handleRemovePreselection} onMouseEnter={() => setIsHoveringDelete(true)} onMouseLeave={() => setIsHoveringDelete(false)} className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-200 hover:bg-gray-400 flex items-center justify-center transition-all duration-300 group ml-2" aria-label="Remove vehicle selection">
                    {isHoveringDelete ? (<Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-700 transition-transform group-hover:scale-110"/>) : (<Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-700 transition-transform group-hover:scale-110"/>)}
                  </button>
                </div>
              </div>)}

          {errors.datetime && (<p className="text-xs text-red-500 text-center">
              {errors.datetime}
            </p>)}

          {errors.general && (<div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-red-600 text-center flex items-center justify-center space-x-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                <span>{errors.general}</span>
              </p>
            </div>)}

          
          <button onClick={handleSearchClick} disabled={isSearchDisabled} className="w-full bg-[#FFD900] hover:bg-[#FFD900]/90 text-black font-semibold py-3 sm:py-4 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-base sm:text-lg border-2 border-[#FFD900]">
            {isSearching && (<Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin"/>)}
            <span>{isSearching ? "Searching..." : "Search"}</span>
          </button>

          <p className="text-xs text-gray-500 text-center pt-2 flex items-center justify-center space-x-1.5 px-2">
            <InformationCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0"/>
            <span className="text-center">
              "Includes 60 min free waiting time at airports, 15 min elsewhere."
            </span>
          </p>
        </div>
      </div>
    </>);
};
export default BookingFormReference;
