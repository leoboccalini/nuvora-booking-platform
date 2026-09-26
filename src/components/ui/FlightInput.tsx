interface Props {
    value: string;
    onChange: (value: string) => void;
    onSelect?: (flight: {
        fullFlightNumber: string;
    }) => void;
    placeholder?: string;
}
export function FlightInput({ value, onChange, placeholder }: Props) {
    return <input aria-label="Flight number" className="w-full p-3 bg-[#1a1a1a] border border-[#FFD900]/30 rounded-lg text-white" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}/>;
}
