import React from 'react';
import { UserIcon as UserIconHero, BriefcaseIcon as BriefcaseIconHero, InformationCircleIcon as InformationCircleIconHero, CheckIcon as CheckIconHero, CheckCircleIcon as CheckCircleIconHero, PencilIcon as PencilIconHero, TagIcon as TagIconHero, ChevronDownIcon as ChevronDownIconHero, XMarkIcon as CloseIconHero, ArrowLeftIcon as ArrowLeftIconHero, ArrowRightIcon as ArrowRightIconHero, MapPinIcon as LocationPinIconHero, CalendarIcon as CalendarIconHero, ClockIcon as ClockIconHero, Bars3Icon as MenuIconHero, ExclamationCircleIcon as ExclamationCircleIconHero, LockClosedIcon as LockClosedIconHero, MagnifyingGlassIcon as MagnifyingGlassIconHero, FunnelIcon as FunnelIconHero, ArrowDownTrayIcon as ArrowDownTrayIconHero, PlusIcon as PlusIconHero } from '@heroicons/react/24/solid';
const ChevronDown: React.FC<{
    className?: string;
}> = ({ className = "w-5 h-5" }) => (<ChevronDownIconHero className={className} style={{ color: '#64666b' }}/>);
export { ChevronDown as ChevronDownIcon };
const Close: React.FC<{
    className?: string;
}> = ({ className = "w-5 h-5" }) => (<CloseIconHero className={className} style={{ color: '#64666b' }}/>);
export { Close as CloseIcon };
const ArrowLeft: React.FC<{
    className?: string;
}> = ({ className = "w-5 h-5" }) => (<ArrowLeftIconHero className={className} style={{ color: '#64666b' }}/>);
export { ArrowLeft as ArrowLeftIcon };
const Plane: React.FC<{
    className?: string;
}> = ({ className = "w-5 h-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="#64666b" viewBox="0 0 24 24" style={{ transform: 'rotate(45deg)' }}>
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
    </svg>);
export { Plane as PlaneIcon };
export const ArrowRightIcon: React.FC<{
    className?: string;
}> = ({ className = "w-5 h-5" }) => (<ArrowRightIconHero className={className} style={{ color: '#64666b' }}/>);
export const LocationPinIcon: React.FC<{
    className?: string;
}> = ({ className = "w-5 h-5" }) => (<LocationPinIconHero className={className} style={{ color: '#64666b' }}/>);
export const CalendarIcon: React.FC<{
    className?: string;
}> = ({ className = "w-5 h-5" }) => (<CalendarIconHero className={className} style={{ color: '#64666b' }}/>);
export const ClockIcon: React.FC<{
    className?: string;
}> = ({ className = "w-5 h-5" }) => (<ClockIconHero className={className} style={{ color: '#64666b' }}/>);
export const InformationCircleIcon: React.FC<{
    className?: string;
}> = ({ className = "w-4 h-4" }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd"></path>
    </svg>);
export const UserIcon: React.FC<{
    className?: string;
}> = ({ className = "w-5 h-5" }) => (<UserIconHero className={className} style={{ color: '#64666b' }}/>);
export const BriefcaseIcon: React.FC<{
    className?: string;
}> = ({ className = "w-5 h-5" }) => (<BriefcaseIconHero className={className} style={{ color: '#64666b' }}/>);
export const CheckIcon: React.FC<{
    className?: string;
}> = ({ className = "w-5 h-5" }) => (<CheckIconHero className={className}/>);
export const PencilIcon: React.FC<{
    className?: string;
}> = ({ className = "w-5 h-5" }) => (<PencilIconHero className={className} style={{ color: '#64666b' }}/>);
export const TagIcon: React.FC<{
    className?: string;
}> = ({ className = "w-5 h-5" }) => (<TagIconHero className={className} style={{ color: '#64666b' }}/>);
export const UserIconCategory: React.FC<{
    className?: string;
}> = ({ className = "w-5 h-5" }) => (<UserIconHero className={className}/>);
export const BriefcaseIconCategory: React.FC<{
    className?: string;
}> = ({ className = "w-5 h-5" }) => (<BriefcaseIconHero className={className}/>);
export const CheckIconCategory: React.FC<{
    className?: string;
}> = ({ className = "w-5 h-5" }) => (<CheckIconHero className={className}/>);
export const InformationCircleIconCategory: React.FC<{
    className?: string;
}> = ({ className = "w-4 h-4" }) => (<InformationCircleIconHero className={className}/>);
export const CheckCircleIconCategory: React.FC<{
    className?: string;
}> = ({ className = "w-5 h-5" }) => (<CheckCircleIconHero className={className}/>);
export const MenuIcon: React.FC<{
    className?: string;
}> = ({ className = "w-6 h-6" }) => (<MenuIconHero className={className} style={{ color: '#64666b' }}/>);
export const ExclamationCircleIcon: React.FC<{
    className?: string;
}> = ({ className = "w-5 h-5" }) => (<ExclamationCircleIconHero className={className} style={{ color: '#64666b' }}/>);
export const AppleIcon: React.FC<{
    className?: string;
}> = ({ className = "w-5 h-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="#64666b" viewBox="0 0 24 24">
        <path d="M19.333 12.034c0 1.255-.54 2.438-1.453 3.328-.973.973-2.26 1.555-3.566 1.555-.38 0-.82-.056-1.29-.18-.553-.14-1.12-.335-1.688-.588-.568-.253-.984-.42-1.248-.498-.264-.078-.503-.117-.718-.117-.238 0-.5.04-.785.117-.285.078-.687.255-1.207.53-.52.274-1.025.48-1.516.616-.49.137-.93.205-1.32.205-1.306 0-2.52-.568-3.46-1.527-.94-.96-1.498-2.14-1.498-3.34 0-1.935 1.256-3.727 3.768-5.375 1.05-.694 2.126-1.077 3.23-1.164.38-.03 1.1.254 2.16.855.953.53 1.662.83 2.126.83.464 0 1.173-.3 2.127-.83 1.06-.6 1.78-.885 2.16-.855.225.013.435.04.63.08.195.04.38.09.555.15l.112.04c1.227.465 2.14 1.482 2.738 3.05.15.39.225.795.225 1.215zM15.53 5.467c.75-.828 1.29-1.896 1.62-3.204-.54.013-.984.14-1.332.38-.348.24-.68.53-1.005.87-.294.31-.58.62-.86.928-.28.308-.53.593-.75.855-.66.78-1.21 1.73-1.65 2.85.345.04.68.06 1.005.06.325 0 .71-.06 1.155-.18.445-.12.83-.297 1.155-.53.325-.23.59-.49.795-.78z"></path>
    </svg>);
export const GoogleIcon: React.FC<{
    className?: string;
}> = ({ className = "w-5 h-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="#64666b" viewBox="0 0 24 24">
         <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path><path d="M1 1h22v22H1z" fill="none"></path>
    </svg>);
export const FacebookIcon: React.FC<{
    className?: string;
}> = ({ className = "w-5 h-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="#64666b" viewBox="0 0 24 24">
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"></path>
    </svg>);
export const EyeIcon: React.FC<{
    className?: string;
}> = ({ className = "w-5 h-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#64666b" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
    </svg>);
export const EyeSlashIcon: React.FC<{
    className?: string;
}> = ({ className = "w-5 h-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#64666b" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243l-4.243-4.243"/>
    </svg>);
export const MastercardIcon: React.FC<{
    className?: string;
}> = ({ className = "h-6" }) => (<svg className={className} viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="pi-mastercard">
        <title id="pi-mastercard">Mastercard</title>
        <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path>
        <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path>
        <circle fill="#EB001B" cx="15" cy="12" r="7"></circle>
        <circle fill="#F79E1B" cx="23" cy="12" r="7"></circle>
        <path fill="#FF5F00" d="M22 12c0-3.9-3.1-7-7-7s-7 3.1-7 7 3.1 7 7 7 7-3.1 7-7z"></path>
    </svg>);
export const VisaIcon: React.FC<{
    className?: string;
}> = ({ className = "h-6" }) => (<svg className={className} viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="pi-visa">
        <title id="pi-visa">Visa</title>
        <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path>
        <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path>
        <path d="M28.3 10.1H28.3l-.6-5.1h-2.2l-1.4 5.1h-1.8l1.4-5.1h-2.2l-1.4 5.1h-1.8l1.4-5.1h-2.2l-1.4 5.1h-1.8l1.4-5.1h-2.2l-.6 5.1H9.5l-.6-5.1H8.4l-1.4 5.1h-1.8l1.4-5.1h-2.2L3.6 10l-.6-5.1H1l-2 12h2.6l.7-4.4h.2l.6 4.4h1.7l1-6.7h.2l.6 6.7h1.9l1.1-6.7h.2l.6 6.7h1.7l1-6.7h.2l.6 6.7h1.7l.7-4.4h.2l.6 4.4H22l-1.4-9h2.2l-.7 4.4h.2l.6-4.4h1.7l-.7 4.4h.2l.6-4.4h1.7l1-6.7h.2l.6 6.7H29l1.1-6.7h.2l.6 6.7h1.9l-1.5-12h-2.2l-.7 4.4h-.2l.6-4.4z" fill="#142688"></path>
    </svg>);
export const AmexIcon: React.FC<{
    className?: string;
}> = ({ className = "h-6" }) => (<svg className={className} viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="pi-american_express">
        <title id="pi-american_express">American Express</title>
        <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path>
        <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path>
        <path d="M30.5 4H7.5a.5.5 0 00-.5.5v15a.5.5 0 00.5.5h23a.5.5 0 00.5-.5v-15a.5.5 0 00-.5-.5zM20 17.5h-3.5a.5.5 0 010-1H20a.5.5 0 010 1zm0-3h-3.5a.5.5 0 010-1H20a.5.5 0 010 1zm0-3h-3.5a.5.5 0 010-1H20a.5.5 0 010 1zm-8 6h-3.5a.5.5 0 010-1H12a.5.5 0 010 1zm0-3h-3.5a.5.5 0 010-1H12a.5.5 0 010 1zm0-3h-3.5a.5.5 0 010-1H12a.5.5 0 010 1zm-2-5h12a.5.5 0 010 1h-12a.5.5 0 010-1z" fill="#006FCF"></path>
    </svg>);
export const DiscoverIcon: React.FC<{
    className?: string;
}> = ({ className = "h-6" }) => (<svg className={className} viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="pi-discover">
        <title id="pi-discover">Discover</title>
        <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path>
        <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path>
        <path d="M22.04 14.54a.48.48 0 01-.48-.48V9.92a.48.48 0 01.48-.48h.95a2.06 2.06 0 012.06 2.06v1a2.06 2.06 0 01-2.06 2.06h-.95zM12.42 14.54a5.5 5.5 0 01-5.5-5.5 5.5 5.5 0 015.5-5.5h3a.48.48 0 01.48.48v9.12a.48.48 0 01-.48.48h-3zm-2.43-2.43a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" fill="#252525"></path>
        <path d="M15.08 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm6.44 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" fill="#F68121"></path>
    </svg>);
export const LargeCheckCircleIcon: React.FC<{
    className?: string;
}> = ({ className = "w-16 h-16" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="#64666b" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>);
export const ShareIcon: React.FC<{
    className?: string;
}> = ({ className = "w-5 h-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#64666b" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.195.025.39.05.588.08m-5.88.08h5.88a2.25 2.25 0 012.25 2.25v.08c0 .537-.213 1.025-.588 1.386m-5.88-2.186a2.25 2.25 0 10-2.186 0m3.383-3.383a2.25 2.25 0 01-2.186 0M12 12.75a2.25 2.25 0 110-4.5 2.25 2.25 0 010 4.5z"/>
    </svg>);
export const CarIcon: React.FC<{
    className?: string;
    variant?: 'solid' | 'outline';
}> = ({ className = "w-8 h-8", variant = 'solid' }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill={variant === 'solid' ? "#64666b" : "none"} stroke={variant === 'outline' ? "#64666b" : "none"} strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-1.5-1.5V9a4.5 4.5 0 014.5-4.5h1.5a4.5 4.5 0 014.5 4.5v8.25a1.5 1.5 0 01-1.5 1.5m-13.5-9a12 12 0 0112 0m-12 0a12 12 0 0112 0m-12 0V9a4.5 4.5 0 014.5-4.5h1.5a4.5 4.5 0 014.5 4.5v.75m-12 0V9a4.5 4.5 0 014.5-4.5h1.5a4.5 4.5 0 014.5 4.5v.75m-7.5 9V18a2.25 2.25 0 002.25-2.25V9a2.25 2.25 0 00-2.25-2.25H9A2.25 2.25 0 006.75 9v6.75A2.25 2.25 0 009 18h.75"/>
    </svg>);
export const CarIconOutline: React.FC<{
    className?: string;
}> = ({ className = "w-8 h-8" }) => (<CarIcon className={className} variant="outline"/>);
export const AirplaneIcon: React.FC<{
    className?: string;
    variant?: 'solid' | 'outline';
}> = ({ className = "w-8 h-8", variant = 'solid' }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill={variant === 'solid' ? "#64666b" : "none"} stroke={variant === 'outline' ? "#64666b" : "none"} strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 16-4-4 4-4M7 21l1-4-4-4 4-4-1-4L21 3 7 21z"/>
    </svg>);
export const AirplaneIconOutline: React.FC<{
    className?: string;
}> = ({ className = "w-8 h-8" }) => (<AirplaneIcon className={className} variant="outline"/>);
export const BusIcon: React.FC<{
    className?: string;
    variant?: 'solid' | 'outline';
}> = ({ className = "w-8 h-8", variant = 'solid' }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill={variant === 'solid' ? "#64666b" : "none"} stroke={variant === 'outline' ? "#64666b" : "none"} strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-1.5-1.5V9a4.5 4.5 0 014.5-4.5h1.5a4.5 4.5 0 014.5 4.5v8.25a1.5 1.5 0 01-1.5 1.5m-13.5-9a12 12 0 0112 0m-12 0a12 12 0 0112 0m-12 0V9a4.5 4.5 0 014.5-4.5h1.5a4.5 4.5 0 014.5 4.5v.75"/>
    </svg>);
export const BusIconOutline: React.FC<{
    className?: string;
}> = ({ className = "w-8 h-8" }) => (<BusIcon className={className} variant="outline"/>);
export const MotorcycleIcon: React.FC<{
    className?: string;
    variant?: 'solid' | 'outline';
}> = ({ className = "w-8 h-8", variant = 'solid' }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill={variant === 'solid' ? "#64666b" : "none"} stroke={variant === 'outline' ? "#64666b" : "none"} strokeWidth="1.5" viewBox="0 0 24 24">
        <circle cx="5" cy="18" r="3"/><circle cx="19" cy="18" r="3"/><path d="M12 19l-2-7 5-4 2 2m-5 9v-7l7-4"/>
    </svg>);
export const MotorcycleIconOutline: React.FC<{
    className?: string;
}> = ({ className = "w-8 h-8" }) => (<MotorcycleIcon className={className} variant="outline"/>);
export const TaxiIcon: React.FC<{
    className?: string;
    variant?: 'solid' | 'outline';
}> = ({ className = "w-8 h-8", variant = 'solid' }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill={variant === 'solid' ? "#64666b" : "none"} stroke={variant === 'outline' ? "#64666b" : "none"} strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-1.5-1.5V9a4.5 4.5 0 014.5-4.5h1.5a4.5 4.5 0 014.5 4.5v8.25a1.5 1.5 0 01-1.5 1.5m-7.5 0H9m4.5 0h.75m-4.5 0v-2.25A2.25 2.25 0 0111.25 14h1.5A2.25 2.25 0 0115 16.25v2.5M6 10h12M6 14h12"/>
    </svg>);
export const TaxiIconOutline: React.FC<{
    className?: string;
}> = ({ className = "w-8 h-8" }) => (<TaxiIcon className={className} variant="outline"/>);
export const LockIcon: React.FC<{
    className?: string;
}> = ({ className = "w-4 h-4" }) => (<LockClosedIconHero className={className} style={{ color: '#6b7280' }}/>);
export const SearchIcon: React.FC<{
    className?: string;
}> = ({ className = "w-5 h-5" }) => (<MagnifyingGlassIconHero className={className} style={{ color: '#64666b' }}/>);
export const FilterIcon: React.FC<{
    className?: string;
}> = ({ className = "w-5 h-5" }) => (<FunnelIconHero className={className} style={{ color: '#64666b' }}/>);
export const DownloadIcon: React.FC<{
    className?: string;
}> = ({ className = "w-5 h-5" }) => (<ArrowDownTrayIconHero className={className} style={{ color: '#64666b' }}/>);
export const EditIcon: React.FC<{
    className?: string;
}> = ({ className = "w-5 h-5" }) => (<PencilIconHero className={className} style={{ color: '#64666b' }}/>);
export const PlusIcon: React.FC<{
    className?: string;
}> = ({ className = "w-5 h-5" }) => (<PlusIconHero className={className} style={{ color: '#64666b' }}/>);
