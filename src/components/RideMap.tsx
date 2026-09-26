export function RideMap({ theme = 'dark' }: {
    originPlaceId?: string;
    destinationPlaceId?: string;
    encodedPolyline?: string;
    theme?: string;
}) {
    const light = theme === 'light';
    return <div className={`h-full w-full relative ${light ? 'bg-[#e9e8df]' : 'bg-[#171c1a]'}`} aria-label="Illustrative route diagram, not live navigation">
    <svg viewBox="0 0 600 200" preserveAspectRatio="none" className="h-full w-full" role="img" aria-label="Illustrative route from A to B">
      <path d="M0 80L170 150 260 200M180 0L200 90 600 140M400 0L350 200M0 170L600 20" fill="none" stroke={light ? '#ccd0c4' : '#303a32'} strokeWidth="13"/>
      <path d="M0 15Q180 180 360 70T600 120" fill="none" stroke={light ? '#c2d8df' : '#21383e'} strokeWidth="40"/>
      <path d="M85 150L170 100 290 100 370 45 510 60" fill="none" stroke="#d7b832" strokeWidth="5" strokeDasharray="8 4"/>
      <circle cx="85" cy="150" r="13" fill="#ffd900"/><circle cx="510" cy="60" r="13" fill="#ffd900"/>
      <text x="80" y="155" fill="#111" fontSize="13" fontWeight="bold">A</text><text x="505" y="65" fill="#111" fontSize="13" fontWeight="bold">B</text>
    </svg>
    <span className="absolute bottom-2 left-2 rounded bg-black/80 text-white px-2 py-1 text-[10px]">Illustrative route · Demo distances</span>
  </div>;
}
