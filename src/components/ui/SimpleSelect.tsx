import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "../booking/icons";
interface SimpleProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    options: {
        value: string;
        label: string;
    }[];
    placeholder?: string;
}
export const SimpleSelect: React.FC<SimpleProps> = ({ label, value, onChange, options, placeholder = "Select", }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current &&
                !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };
    return (<div className="relative w-full" ref={containerRef}>
      
      <button type="button" onClick={() => setIsOpen(!isOpen)} className={`flex w-full items-center justify-between rounded-md border border-[#FFD900]/30 bg-[#1A1A1A] px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#FFD900] transition-all
        ${isOpen ? "rounded-b-none border-b-0" : ""} 
        `}>
        <span className={!value ? "text-gray-500" : ""}>
          {value || placeholder}
        </span>
        <ChevronDownIcon className={`h-4 w-4 text-white opacity-50 transition-transform ${isOpen ? "rotate-180" : ""}`}/>
      </button>

      
      {isOpen && (<div className="absolute left-0 top-full z-[999] w-full rounded-b-lg rounded-t-none border border-t-0 border-[#FFD900]/30 bg-[#1A1A1A] shadow-xl overflow-hidden">
          <ul className="py-0">
            {options.map((option) => (<li key={option.value} onClick={() => handleSelect(option.value)} className={`cursor-pointer px-4 py-2.5 text-sm text-white transition-colors hover:bg-[#FFD900] hover:text-black
                ${value === option.value ? "bg-white/10" : ""}
                `}>
                {option.label}
              </li>))}
          </ul>
        </div>)}
    </div>);
};
