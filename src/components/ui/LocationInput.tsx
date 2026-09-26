import React, { useState, useEffect, useRef } from 'react';
import { LocationSuggestion } from '../../types';
import { getPlaceAutocompleteSuggestions } from '../../utils/googleMapsApi';
import { PlaneIcon, CloseIcon } from '../booking/icons';
interface LocationInputProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    onSelect: (suggestion: LocationSuggestion) => void;
    placeholder?: string;
    icon: React.ReactNode;
    isActive: boolean;
    onFocus: () => void;
}
const LocationInput: React.FC<LocationInputProps> = ({ id, label, value, onChange, onSelect, placeholder, icon, isActive, onFocus, }) => {
    const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const debounceTimeoutRef = useRef<number | null>(null);
    useEffect(() => {
        if (value.length > 2 && isActive && showSuggestions) {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
            debounceTimeoutRef.current = window.setTimeout(async () => {
                const fetchedSuggestions = await getPlaceAutocompleteSuggestions(value);
                setSuggestions(fetchedSuggestions);
                setShowSuggestions(true);
            }, 300);
        }
        else if (value.length <= 2) {
            setSuggestions([]);
            setShowSuggestions(false);
        }
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [value, isActive, showSuggestions]);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
                setSuggestions([]);
            }
        };
        if (showSuggestions) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSuggestions]);
    const handleSelectSuggestion = (suggestion: LocationSuggestion) => {
        onSelect(suggestion);
        setShowSuggestions(false);
        setSuggestions([]);
        if (inputRef.current) {
            inputRef.current.blur();
        }
    };
    const handleClearInput = () => {
        onChange('');
        setSuggestions([]);
        setShowSuggestions(false);
    };
    return (<div ref={containerRef} className="relative">
      <label htmlFor={id} className={`text-gray-500 text-sm absolute top-1.5 left-10 z-10 ${isActive ? 'font-bold' : ''}`}>
        {label}
      </label>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none pt-4">
        {icon}
      </div>
      <input ref={inputRef} type="text" id={id} value={value} onChange={(e) => {
            onChange(e.target.value);
            if (e.target.value.length > 2) {
                setShowSuggestions(true);
            }
        }} onFocus={() => {
            onFocus();
            if (value.length > 2) {
                setShowSuggestions(true);
            }
        }} placeholder={placeholder} className="w-full bg-[#1A1A1A] border-[0.5px] border-[#FFD900]/30 rounded-lg p-4 pl-10 pt-7 text-left text-white focus:outline-none focus:ring-1 focus:ring-[#FFD900] focus:border-[#FFD900] transition-all" autoComplete="off"/>
      {value && isActive && (<button type="button" onClick={handleClearInput} className="absolute inset-y-0 right-0 flex items-center justify-center pr-5 text-gray-400 hover:text-white" aria-label="Clear input">
          <CloseIcon className="w-5 h-5"/>
        </button>)}

      {showSuggestions && suggestions.length > 0 && (<ul className="absolute z-50 w-full bg-[#1A1A1A] border border-[#FFD900]/30 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.5)] mt-1 max-h-60 overflow-y-auto custom-scrollbar">
          {suggestions.map((suggestion) => (<li key={suggestion.id} className="p-3 hover:bg-[#FFD900]/10 cursor-pointer flex items-center border-b border-white/5 last:border-0" onClick={() => handleSelectSuggestion(suggestion)}>
              
              {suggestion.type === 'airport' && <PlaneIcon className="w-4 h-4 text-[#FFD900] mr-3"/>}
              {suggestion.type !== 'airport' && <div className="w-1.5 h-1.5 rounded-full bg-[#FFD900] mr-3"/>}
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{suggestion.primaryText}</p>
                <p className="text-xs text-gray-400">{suggestion.secondaryText}</p>
              </div>
            </li>))}
        </ul>)}
    </div>);
};
export default LocationInput;
