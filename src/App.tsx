import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import FleetSection from './components/FleetSection';
import AnimatedBackground from './components/AnimatedBackground';
import { Checkout } from './components/booking/Checkout';
import { BookingConfirmation } from './components/booking/BookingConfirmation';
import { parseJourney, prepareBooking } from './demo/booking';
import type { BookingData } from './types';
function Home() {
    return <><Navigation /><main className="pt-20">
    <HeroSection />
    <section id="about" className="max-w-5xl mx-auto px-6 pt-16 text-center"><p className="text-gold text-xs font-bold uppercase tracking-[.22em] mb-4">Portfolio beta · Leo Boccalini</p><h2 className="text-3xl font-bold mb-5">A booking product, built around the journey.</h2><p className="text-gray-400 leading-relaxed max-w-3xl mx-auto">This public version is adapted from my existing application. Explore its booking form, editable checkout and confirmation ticket using fictional data. This beta demonstrates the ground transport flow; aviation and nautical service catalogs are future extensions.</p></section>
    <FleetSection />
    <section id="services" className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-6">{[['01', 'Plan the journey', 'One-way and hourly booking, locations, date and time.'], ['02', 'Make it yours', 'Vehicle categories, passenger details and pickup instructions.'], ['03', 'Review and confirm', 'Itemized demo pricing and a detailed confirmation ticket.']].map(([n, title, description]) => <article key={n} className="rounded-2xl border border-gold/20 bg-black/30 p-7"><span className="text-gold text-3xl font-light">{n}</span><h3 className="text-xl font-semibold my-4">{title}</h3><p className="text-gray-400">{description}</p></article>)}</section>
    <section id="routes" className="max-w-6xl mx-auto px-6 py-16"><h2 className="text-3xl font-bold mb-8">Try a journey</h2><div className="grid md:grid-cols-3 gap-4">{[['Geneva International Airport (GVA)', 'Lausanne railway station'], ['Geneva International Airport (GVA)', 'Montreux'], ['Zurich Airport (ZRH)', 'Zurich City Centre']].map(([from, to]) => <button key={to} className="text-left rounded-xl border border-gold/30 p-6 hover:bg-gold/10" onClick={() => { window.dispatchEvent(new CustomEvent('routePreselect', { detail: { from, to } })); document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }); }}><span className="block text-gray-400 text-sm">{from}</span><span className="block text-xl mt-2 text-gold">→ {to}</span><span className="block text-xs text-gray-500 mt-4">Load sample route</span></button>)}</div></section>
    <section id="faq" className="max-w-4xl mx-auto px-6 py-14"><h2 className="text-3xl font-bold mb-8">About the demo</h2>{[['Can I make a real booking?', 'No. Confirmation is a simulation, with no reservation, charge or email.'], ['What comes from the original product?', 'The React booking form, calendar and time controls, category selection, editable checkout sections, price calculation functions and confirmation ticket layout.'], ['Are maps and prices live?', 'No. Location suggestions, route distances and pricing inputs use a small local dataset. The route drawing is illustrative.'], ['What happens to the information I enter?', 'Guest and billing edits exist only in memory and reset when the page is refreshed. Only journey details are kept in session storage for navigation. Use the supplied fictional details.']].map(([q, a]) => <details key={q} className="border-b border-gold/20 py-5"><summary className="cursor-pointer font-medium text-lg">{q}</summary><p className="text-gray-400 mt-4 leading-relaxed">{a}</p></details>)}</section>
    <footer id="contact" className="border-t border-gold/20 py-10 px-6 text-center text-sm text-gray-400"><p className="text-white mb-3">Nuvora · A portfolio project by Leo Boccalini</p><a className="text-gold underline" href="https://github.com/leoboccalini/nuvora-booking-platform">Explore the source code</a><span className="mx-4">·</span><a className="text-gold underline" href="https://github.com/leoboccalini">GitHub profile</a></footer>
  </main></>;
}
function Flow() {
    const [booking, setBooking] = useState<BookingData | null>(null);
    const [confirmed, setConfirmed] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        let active = true;
        let raw: string | null = null;
        try {
            raw = sessionStorage.getItem('nuvora:journey');
        }
        catch { }
        const journey = parseJourney(raw);
        if (!journey) {
            setLoading(false);
            return;
        }
        prepareBooking(journey).then(value => { if (active) {
            setBooking(value);
            setLoading(false);
        } });
        return () => { active = false; };
    }, []);
    useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);
    if (loading)
        return <p className="p-16 text-center">Preparing your demo journey…</p>;
    if (!booking)
        return <div className="max-w-lg mx-auto p-12 text-center"><h1 className="text-2xl mb-4">Start with your journey</h1><p className="text-gray-400 mb-6">Choose a route to explore the booking demo.</p><Link className="text-gold underline" to="/">Plan a journey</Link></div>;
    if (location.pathname.includes('confirmation'))
        return confirmed ? <BookingConfirmation bookingData={booking}/> : <Navigate to="/booking/checkout" replace/>;
    return <><div className="max-w-6xl mx-auto px-6 pt-6 flex items-center justify-between"><Link to="/" className="text-gold">← Change journey</Link><span className="text-gray-400 text-sm">Journey / Checkout / Confirmation</span></div>
    <Checkout bookingData={booking} bookingId={booking.bookingId} onUpdateRideDetails={data => setBooking(prev => prev && { ...prev, ...data })} onUpdateVehicle={vehicle => setBooking(prev => prev && { ...prev, vehicle })} onUpdatePickupInfo={pickupInfo => setBooking(prev => prev && { ...prev, pickupInfo })} onUpdateBilling={billingInfo => setBooking(prev => prev && { ...prev, paymentData: { ...prev.paymentData, billingInfo } })} onUpdatePaymentMethod={() => { }} onConfirm={() => { setConfirmed(true); navigate('/booking/confirmation'); }}/>
  </>;
}
export default function App() { return <BrowserRouter><AnimatedBackground variant="both" className="text-white"><div className="demo-banner">PORTFOLIO BETA · Fictional data · No real bookings or payments</div><Toaster richColors position="top-center"/><Routes><Route path="/" element={<Home />}/><Route path="/booking/*" element={<Flow />}/><Route path="/checkout" element={<Navigate to="/booking/checkout" replace/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes></AnimatedBackground></BrowserRouter>; }
