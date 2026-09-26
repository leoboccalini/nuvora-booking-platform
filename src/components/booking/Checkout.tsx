import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { BookingData, Time, BillingInformation, LocationSuggestion, VehicleClass } from "../../types";
import { CountrySelector } from "./CountrySelector";
import { AddressAutocomplete } from "./AddressAutocomplete";
import { UserIcon, BriefcaseIcon, InformationCircleIcon, TagIcon, LocationPinIcon, CalendarIcon, ClockIcon, ChevronDownIcon, UserIconCategory, BriefcaseIconCategory, LockIcon, CheckIcon, } from "./icons";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { PaymentIcon } from "react-svg-credit-card-payment-icons";
import { toast } from "sonner";
import { SimpleSelect } from "../ui/SimpleSelect";
import { usePaymentMethods } from "../../hooks/usePaymentMethods";
import { formatTime, formatDate } from "../../utils/formatters";
import { RideMap } from "../../components/RideMap";
import { RouteTimeline } from "../../components/RouteTimeline";
import LocationInput from "../../components/ui/LocationInput";
import Calendar from "../../components/ui/Calendar";
import { TimePicker } from "../../components/ui/TimePicker";
import { getDirections } from "../../utils/googleMapsApi";
import { VEHICLE_CLASSES } from "../../constants";
import { FlightSuggestion } from "../../services/amadeusService";
import { FlightInput } from "../ui/FlightInput";
const formatTaxIdForCountry = (value: string, countryCode: string) => {
    let cleaned = value.replace(/\D/g, "");
    switch (countryCode) {
        case "BR":
            if (cleaned.length <= 11) {
                if (cleaned.length > 9) {
                    return cleaned.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2}).*/, "$1.$2.$3-$4");
                }
                else if (cleaned.length > 6) {
                    return cleaned.replace(/^(\d{3})(\d{3})(\d{0,3}).*/, "$1.$2.$3");
                }
                else if (cleaned.length > 3) {
                    return cleaned.replace(/^(\d{3})(\d{0,3}).*/, "$1.$2");
                }
            }
            else {
                if (cleaned.length > 12) {
                    return cleaned.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2}).*/, "$1.$2.$3/$4-$5");
                }
                else if (cleaned.length > 8) {
                    return cleaned.replace(/^(\d{2})(\d{3})(\d{3})(\d{0,4}).*/, "$1.$2.$3/$4");
                }
                else if (cleaned.length > 5) {
                    return cleaned.replace(/^(\d{2})(\d{3})(\d{0,3}).*/, "$1.$2.$3");
                }
                else if (cleaned.length > 2) {
                    return cleaned.replace(/^(\d{2})(\d{0,3}).*/, "$1.$2");
                }
            }
            return cleaned;
        case "US":
            if (cleaned.length > 2) {
                return cleaned.replace(/^(\d{2})(\d{0,7}).*/, "$1-$2");
            }
            return cleaned;
        case "PT":
            if (cleaned.length > 9)
                return cleaned.slice(0, 9);
            return cleaned;
        case "CH":
            let formatted = "CHE-";
            if (cleaned.length === 0)
                return formatted;
            if (cleaned.length > 9)
                cleaned = cleaned.slice(0, 9);
            if (cleaned.length > 6) {
                formatted += `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
            }
            else if (cleaned.length > 3) {
                formatted += `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
            }
            else {
                formatted += cleaned;
            }
            return formatted;
        default:
            return value;
    }
};
const getTaxIdPlaceholder = (countryCode: string) => {
    switch (countryCode) {
        case "BR":
            return "00.000.000/0000-00 (CNPJ) or CPF";
        case "US":
            return "XX-XXXXXXX (EIN)";
        case "PT":
            return "123456789 (NIF)";
        case "CH":
            return "CHE-123.456.789 MWST";
        default:
            return "VAT / EIN / Tax ID";
    }
};
interface CheckoutProps {
    bookingData: BookingData;
    bookingId?: string;
    onConfirm: () => void;
    onEditRideDetails?: () => void;
    onEditVehicle?: () => void;
    onEditPayment?: () => void;
    onEditBilling?: () => void;
    onUpdateBilling?: (billingInfo: BillingInformation) => void;
    onUpdateRideDetails?: (updatedData: {
        fromLocation: string;
        toLocation: string;
        date: Date;
        time: Time;
        fromPlaceId?: string;
        toPlaceId?: string;
        fromLocationAddress?: string;
        toLocationAddress?: string;
        distanceKm?: number;
        durationMinutes?: number;
        encodedPolyline?: string;
    }) => void;
    onUpdateVehicle?: (vehicle: VehicleClass) => void;
    onUpdatePaymentMethod?: (paymentMethod: any) => void;
    onUpdatePickupInfo?: (pickupInfo: any) => void;
    isProcessingPayment?: boolean;
}
const InfoCard: React.FC<{
    title: string;
    children: React.ReactNode;
    onEdit?: () => void;
}> = ({ title, children, onEdit }) => (<div className="bg-white border border-gray-200 rounded-lg p-4">
    {title ? (<div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-500 text-sm uppercase">
          {title}
        </h3>
        <button onClick={onEdit} className="bg-gray-100 hover:bg-gray-200 border border-gray-300 hover:border-gray-400 px-3 py-1 rounded-full text-sm font-bold text-gray-600 hover:text-gray-800 transition-all">
          Edit
        </button>
      </div>) : null}
    <div className="text-sm text-gray-800 space-y-2">
      {!title && onEdit && (<div className="flex justify-between items-start mb-2">
          <div className="flex-1">{children}</div>
          <button onClick={onEdit} className="bg-gray-100 hover:bg-gray-200 border border-gray-300 hover:border-gray-400 px-3 py-1 rounded-full text-sm font-bold text-gray-600 hover:text-gray-800 transition-all ml-4 flex-shrink-0">
            Edit
          </button>
        </div>)}
      {title && children}
    </div>
  </div>);
export const Checkout: React.FC<CheckoutProps> = ({ bookingData, bookingId, onConfirm, onEditBilling, onUpdateBilling, onUpdateRideDetails, onUpdateVehicle, onUpdatePaymentMethod, onUpdatePickupInfo, isProcessingPayment = false, }) => {
    useEffect(() => {
    }, []);
    const [isEditingRideDetails, setIsEditingRideDetails] = useState(false);
    const [isEditingVehicle, setIsEditingVehicle] = useState(true);
    const [isEditingPayment, setIsEditingPayment] = useState(false);
    const [isEditingGuest, setIsEditingGuest] = useState(false);
    const [isEditingPickupInfo, setIsEditingPickupInfo] = useState(false);
    const [isEditingBilling, setIsEditingBilling] = useState(false);
    const [expandedVehicleId, setExpandedVehicleId] = useState<string | null>(null);
    const [isPriceExpanded, setIsPriceExpanded] = useState(false);
    const [cardUpdateTrigger, setCardUpdateTrigger] = useState(0);
    const [lastBookingId, setLastBookingId] = useState<string | undefined>(bookingId);
    const rideDetailsRef = useRef<HTMLDivElement>(null);
    const vehicleSectionRef = useRef<HTMLDivElement>(null);
    const guestSectionRef = useRef<HTMLDivElement>(null);
    const paymentSectionRef = useRef<HTMLDivElement>(null);
    const billingSectionRef = useRef<HTMLDivElement>(null);
    const [invalidSections, setInvalidSections] = useState<string[]>([]);
    const [validationErrors, setValidationErrors] = useState<string[] | null>(null);
    const [sectionErrorsState, setSectionErrorsState] = useState<Record<string, string[]>>({});
    useEffect(() => {
        if (invalidSections.length > 0) {
            const validation = validateBookingData();
            setSectionErrorsState(validation.sectionErrors);
            setInvalidSections(validation.invalidSections);
        }
    }, [bookingData]);
    const [vehiclePrices, setVehiclePrices] = useState<Record<string, number>>(() => {
        const initialPrices: Record<string, number> = {};
        if (bookingData.vehicle?.id && bookingData.vehicle?.price) {
            initialPrices[bookingData.vehicle.id] = bookingData.vehicle.price;
        }
        return initialPrices;
    });
    const [billingEditData, setBillingEditData] = useState<BillingInformation>({
        customerType: "individual",
        companyName: "",
        taxId: "",
        streetAddress: "",
        addressComplement: "",
        zipCode: "",
        city: "",
        country: "CH",
        billingEmail: "",
    });
    const [isAddingNewCard, setIsAddingNewCard] = useState(false);
    const [guestEditData, setGuestEditData] = useState<{
        bookingFor: "myself" | "someoneElse";
        title: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    }>({
        bookingFor: "myself",
        title: "Mr.",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
    });
    const [pickupEditData, setPickupEditData] = useState<{
        flightNumber: string;
        pickupSign: string;
        notes: string;
        refCode: string;
    }>({
        flightNumber: "",
        pickupSign: "",
        notes: "",
        refCode: "",
    });
    const [emailValidation, setEmailValidation] = useState<{
        isValid: boolean;
        message: string;
    }>({
        isValid: true,
        message: "",
    });
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(bookingData.vehicle?.id || null);
    const selectedVehicle = isEditingVehicle && selectedVehicleId
        ? VEHICLE_CLASSES.find((v) => v.id === selectedVehicleId) ||
            bookingData.vehicle
        : bookingData.vehicle;
    const isTestMode = false;
    const getVehiclePrice = (vehicle: any) => {
        if (!vehicle)
            return 0;
        if (vehiclePrices && typeof vehiclePrices[vehicle.id] === 'number') {
            return vehiclePrices[vehicle.id];
        }
        if (bookingData.vehicle?.id === vehicle.id && bookingData.vehicle?.price) {
            return bookingData.vehicle.price;
        }
        return vehicle.priceBreakdown?.totalTTC || vehicle.price || 0;
    };
    const totalPrice = isTestMode
        ? 1.00
        : getVehiclePrice(selectedVehicle);
    const validateEmail = (email: string) => {
        if (!email) {
            setEmailValidation({ isValid: true, message: "" });
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);
        if (isValid) {
            setEmailValidation({ isValid: true, message: "" });
        }
        else {
            setEmailValidation({
                isValid: false,
                message: "Please enter a valid email address (e.g., example@domain.com)",
            });
        }
    };
    const [editFormData, setEditFormData] = useState({
        fromLocation: bookingData.fromLocation,
        toLocation: bookingData.toLocation || "",
        date: bookingData.date,
        time: bookingData.time,
        fromPlaceId: bookingData.fromPlaceId || "",
        toPlaceId: bookingData.toPlaceId || "",
    });
    const { paymentMethods, fetchPaymentMethods, addPaymentMethod, deletePaymentMethod: removePaymentMethod, clearPaymentMethodsCache, } = usePaymentMethods();
    const defaultPaymentMethod = paymentMethods.length > 0 ? paymentMethods[0] : null;
    useEffect(() => {
        if (bookingId && bookingId !== lastBookingId) {
            clearPaymentMethodsCache();
            setLastBookingId(bookingId);
            setCardUpdateTrigger((prev) => prev + 1);
        }
    }, [bookingId, lastBookingId, clearPaymentMethodsCache]);
    useEffect(() => {
    }, [paymentMethods]);
    const [activeField, setActiveField] = useState<string | null>(null);
    useEffect(() => {
        const preselectedVehicle = searchParams.get("vehicle") || searchParams.get("preselected_vehicle");
        if (preselectedVehicle && selectedVehicleId !== preselectedVehicle) {
            setSelectedVehicleId(preselectedVehicle);
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.delete("vehicle");
            newSearchParams.delete("preselected_vehicle");
            setSearchParams(newSearchParams, { replace: true });
            const vehicleToSave = VEHICLE_CLASSES.find((v) => v.id === preselectedVehicle);
            if (vehicleToSave && onUpdateVehicle) {
                if (distanceKm !== undefined && durationMinutes) {
                    import("../../services/PricingService").then(({ PricingService }) => {
                        PricingService.calculatePricing(vehicleToSave.id, distanceKm, durationMinutes)
                            .then((newPricing) => {
                            if (newPricing) {
                                const vehicleWithPrice = {
                                    ...vehicleToSave,
                                    price: newPricing.total,
                                    priceBreakdown: {
                                        baseFare: newPricing.subtotal,
                                        meetAndGreet: 0,
                                        estimatedTax: newPricing.tvaAmount,
                                    },
                                };
                                onUpdateVehicle(vehicleWithPrice);
                            }
                            else {
                                onUpdateVehicle(vehicleToSave);
                            }
                        })
                            .catch(() => {
                            onUpdateVehicle(vehicleToSave);
                        });
                    });
                }
                else {
                    onUpdateVehicle(vehicleToSave);
                }
            }
        }
        else if (bookingData.vehicle?.id &&
            !preselectedVehicle &&
            !selectedVehicleId) {
            setSelectedVehicleId(bookingData.vehicle.id);
        }
    }, [
        searchParams,
        isEditingVehicle,
    ]);
    useEffect(() => {
        setEditFormData({
            fromLocation: bookingData.fromLocation,
            toLocation: bookingData.toLocation || "",
            date: bookingData.date,
            time: bookingData.time,
            fromPlaceId: bookingData.fromPlaceId || "",
            toPlaceId: bookingData.toPlaceId || "",
        });
    }, []);
    useEffect(() => {
        if (paymentMethods.length > 0 &&
            !bookingData.paymentData?.paymentMethodId) {
            const firstMethod = paymentMethods[0];
            handleSelectPaymentMethod(firstMethod);
        }
    }, [paymentMethods, bookingData.paymentData?.paymentMethodId]);
    useEffect(() => {
        const calculateAllPrices = async () => {
            if (bookingData.distanceKm === undefined || !bookingData.date || !bookingData.time) {
                return;
            }
            try {
                const prices: Record<string, number> = {};
                const pickupDate = bookingData.date instanceof Date
                    ? bookingData.date.toISOString().split("T")[0]
                    : bookingData.date;
                const pickupTime = typeof bookingData.time === "object" &&
                    bookingData.time?.hour !== undefined
                    ? `${String(bookingData.time.hour).padStart(2, "0")}:${String(bookingData.time.minute).padStart(2, "0")}`
                    : bookingData.time;
                for (const vehicleClass of VEHICLE_CLASSES) {
                    const pricing = await PricingService.calculatePricing(vehicleClass.id, bookingData.distanceKm, bookingData.durationMinutes || 0);
                    if (pricing) {
                        prices[vehicleClass.id] = pricing.total;
                    }
                }
                setVehiclePrices(prices);
                if (bookingData.vehicle?.id && onUpdateVehicle) {
                    const currentVehicleId = bookingData.vehicle.id;
                    const newPricing = await PricingService.calculatePricing(currentVehicleId, bookingData.distanceKm, bookingData.durationMinutes || 0);
                    if (newPricing) {
                        const currentPrice = bookingData.vehicle.price || 0;
                        if (Math.abs(newPricing.total - currentPrice) > 0.05) {
                            onUpdateVehicle({
                                ...bookingData.vehicle,
                                price: newPricing.total,
                                priceBreakdown: {
                                    baseFare: newPricing.subtotal,
                                    meetAndGreet: 0,
                                    estimatedTax: newPricing.tvaAmount,
                                    totalTTC: newPricing.total
                                }
                            });
                        }
                    }
                }
            }
            catch (error) {
            }
        };
        calculateAllPrices();
    }, [
        bookingData.distanceKm,
        bookingData.date,
        bookingData.time,
        bookingData.durationMinutes,
        bookingData.fromLocation,
        bookingData.vehicle?.id,
    ]);
    const { fromLocation, fromLocationAddress, toLocation, toLocationAddress, date, time, vehicle, pickupInfo, paymentData, distanceKm, durationMinutes, fromPlaceId, toPlaceId, encodedPolyline, } = bookingData;
    useEffect(() => {
        const loadPassengerData = async () => {
            if (!onUpdatePickupInfo)
                return;
            if (pickupInfo?.guestDetails?.firstName &&
                pickupInfo?.guestDetails?.lastName) {
                return;
            }
            return;
        };
        loadPassengerData();
    }, [pickupInfo, onUpdatePickupInfo]);
    const formattedDateDisplay = formatDate(date);
    const formattedTimeDisplay = formatTime(date, time);
    const formatDuration = (minutes: number | undefined): string => {
        if (!minutes)
            return "0m";
        const hours = Math.floor(minutes / 60);
        const mins = Math.round(minutes % 60);
        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        return `${mins}m`;
    };
    const getGuestName = () => {
        if (pickupInfo?.guestDetails) {
            return `${pickupInfo.guestDetails.title} ${pickupInfo.guestDetails.firstName} ${pickupInfo.guestDetails.lastName}`;
        }
        return "Add your first and last name";
    };
    const calculateArrivalTime = () => {
        if (!date || !time)
            return "";
        const pickupDate = new Date(date);
        if (typeof time === "object") {
            pickupDate.setHours(time.hour, time.minute);
        }
        else {
            const [hours, minutes] = (time as string).split(":").map(Number);
            pickupDate.setHours(hours, minutes);
        }
        if (durationMinutes) {
            pickupDate.setMinutes(pickupDate.getMinutes() + durationMinutes);
        }
        return pickupDate.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    const formattedArrivalTime = calculateArrivalTime();
    const getGuestContact = () => {
        if (pickupInfo?.guestDetails) {
            const guestEmail = pickupInfo.guestDetails.email || "";
            const guestPhone = pickupInfo.guestDetails.phone || "";
            return `${guestEmail}${guestEmail && guestPhone ? " • " : ""}${guestPhone}`;
        }
        return "Add your contact info";
    };
    const handleCancelRideDetails = () => {
        setIsEditingRideDetails(false);
        setActiveField(null);
    };
    const handleSaveRideDetails = () => {
        const now = new Date();
        const selectedDate = new Date(editFormData.date);
        let hour = editFormData.time.hour;
        const minute = editFormData.time.minute;
        if (editFormData.time.period === "PM" && hour !== 12)
            hour += 12;
        if (editFormData.time.period === "AM" && hour === 12)
            hour = 0;
        selectedDate.setHours(hour, minute, 0, 0);
        const minimumTime = new Date(now.getTime() + 12 * 60 * 60 * 1000);
        if (selectedDate < minimumTime) {
            toast.error("Bookings must be made at least 12 hours in advance.");
            return;
        }
        handleSaveEdit();
        setIsEditingRideDetails(false);
    };
    const handleEditRideDetails = () => {
        setValidationErrors(null);
        setInvalidSections(prev => prev.filter(s => s !== "ride"));
        setSectionErrorsState(prev => {
            const newState = { ...prev };
            delete newState["ride"];
            return newState;
        });
        setIsEditingRideDetails(true);
    };
    const handleCancelEdit = () => {
        setIsEditingRideDetails(false);
        setActiveField(null);
        setEditFormData({
            fromLocation: bookingData.fromLocation,
            toLocation: bookingData.toLocation || "",
            date: bookingData.date,
            time: bookingData.time,
            fromPlaceId: bookingData.fromPlaceId || "",
            toPlaceId: bookingData.toPlaceId || "",
        });
    };
    const handleSaveEdit = async () => {
        if (editFormData.fromPlaceId && editFormData.toPlaceId) {
            try {
                const routeData = await getDirections(editFormData.fromPlaceId, editFormData.toPlaceId);
                if (routeData && onUpdateRideDetails) {
                    onUpdateRideDetails({
                        ...editFormData,
                        fromLocationAddress: routeData.startAddress,
                        toLocationAddress: routeData.endAddress,
                        distanceKm: routeData.distanceKm,
                        durationMinutes: routeData.durationMinutes,
                        encodedPolyline: routeData.encodedPolyline,
                    });
                }
                else if (onUpdateRideDetails) {
                    onUpdateRideDetails(editFormData);
                }
            }
            catch (error) {
                if (onUpdateRideDetails) {
                    onUpdateRideDetails(editFormData);
                }
            }
        }
        else {
            if (onUpdateRideDetails) {
                onUpdateRideDetails(editFormData);
            }
        }
        setIsEditingRideDetails(false);
    };
    const handleInputChange = (field: string, value: string | Date | Time) => {
        setEditFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    const formatTimeLocal = (time: {
        hour: number;
        minute: number;
        period: string;
    }) => {
        return `${String(time.hour).padStart(2, "0")} : ${String(time.minute).padStart(2, "0")} ${time.period}`;
    };
    const handleEditVehicle = async () => {
        setValidationErrors(null);
        setInvalidSections(prev => prev.filter(s => s !== "vehicle"));
        setSectionErrorsState(prev => {
            const newState = { ...prev };
            delete newState["vehicle"];
            return newState;
        });
        setIsEditingVehicle(true);
        setSelectedVehicleId(bookingData.vehicle?.id || null);
        if (distanceKm !== undefined && durationMinutes) {
            try {
                const { PricingService } = await import("../../services/PricingService");
                const prices: Record<string, number> = {};
                const pickupDate = bookingData.date instanceof Date
                    ? bookingData.date.toISOString().split("T")[0]
                    : bookingData.date;
                const pickupTime = typeof bookingData.time === "object" &&
                    bookingData.time?.hour !== undefined
                    ? `${String(bookingData.time.hour).padStart(2, "0")}:${String(bookingData.time.minute).padStart(2, "0")}`
                    : bookingData.time;
                for (const vehicleClass of VEHICLE_CLASSES) {
                    const pricing = await PricingService.calculatePricing(vehicleClass.id, distanceKm, durationMinutes);
                    if (pricing) {
                        prices[vehicleClass.id] = pricing.total;
                    }
                }
                setVehiclePrices(prices);
            }
            catch (error) {
            }
        }
    };
    const handleCancelVehicleEdit = () => {
        setSelectedVehicleId(bookingData.vehicle?.id || null);
        setIsEditingVehicle(false);
    };
    const handleSaveVehicleEdit = async () => {
        const selectedVehicle = VEHICLE_CLASSES.find((v) => v.id === selectedVehicleId);
        if (!selectedVehicle) {
            setIsEditingVehicle(false);
            return;
        }
        if (selectedVehicle && onUpdateVehicle) {
            if (distanceKm !== undefined && durationMinutes) {
                try {
                    const { PricingService } = await import("../../services/PricingService");
                    const pickupDate = bookingData.date instanceof Date
                        ? bookingData.date.toISOString().split("T")[0]
                        : bookingData.date;
                    const pickupTime = typeof bookingData.time === "object" &&
                        bookingData.time?.hour !== undefined
                        ? `${String(bookingData.time.hour).padStart(2, "0")}:${String(bookingData.time.minute).padStart(2, "0")}`
                        : bookingData.time;
                    const newPricing = await PricingService.calculatePricing(selectedVehicle.id, distanceKm, durationMinutes);
                    if (newPricing) {
                        const vehicleWithNewPrice = {
                            ...selectedVehicle,
                            price: newPricing.total,
                            priceBreakdown: {
                                baseFare: newPricing.subtotal,
                                meetAndGreet: 0,
                                estimatedTax: newPricing.tvaAmount,
                            },
                        };
                        onUpdateVehicle(vehicleWithNewPrice);
                    }
                    else {
                        onUpdateVehicle(selectedVehicle);
                    }
                }
                catch (error) {
                    onUpdateVehicle(selectedVehicle);
                }
            }
            else {
                onUpdateVehicle(selectedVehicle);
            }
        }
        else {
        }
        setIsEditingVehicle(false);
    };
    const handleAddNewCard = async (cardData?: any) => {
        try {
            const newCard = await addPaymentMethod(cardData);
            if (newCard) {
                setCardUpdateTrigger((prev) => prev + 1);
            }
        }
        catch (error) {
        }
    };
    const handleDeletePaymentMethod = async (method: any) => {
        if (!confirm(`Tem certeza que deseja remover o cartão terminado em ${method.card_last4}?`)) {
            return;
        }
        try {
            const success = await removePaymentMethod(method.id);
            if (success) {
                setCardUpdateTrigger((prev) => prev + 1);
            }
        }
        catch (err) {
            alert("Erro ao processar remoção.");
        }
    };
    const handleSelectPaymentMethod = (method: any) => {
        try {
            if (onUpdatePaymentMethod && method) {
                onUpdatePaymentMethod({
                    paymentMethodId: method.stripe_payment_method_id,
                    cardName: method.cardholder_name,
                    cardBrand: method.card_brand,
                    last4: method.card_last4,
                    expMonth: method.card_exp_month,
                    expYear: method.card_exp_year,
                });
            }
        }
        catch (error) {
        }
    };
    const handleEditGuest = () => {
        setValidationErrors(null);
        setInvalidSections(prev => prev.filter(s => s !== "guest"));
        setSectionErrorsState(prev => {
            const newState = { ...prev };
            delete newState["guest"];
            return newState;
        });
        if (pickupInfo?.bookingFor === "someoneElse" && pickupInfo.guestDetails) {
            setGuestEditData({
                bookingFor: "someoneElse",
                title: pickupInfo.guestDetails.title || "Mr.",
                firstName: pickupInfo.guestDetails.firstName || "",
                lastName: pickupInfo.guestDetails.lastName || "",
                email: pickupInfo.guestDetails.email || "",
                phone: pickupInfo.guestDetails.phone || "",
            });
        }
        else {
            setGuestEditData({
                bookingFor: "myself",
                title: pickupInfo?.guestDetails?.title || "Mr.",
                firstName: pickupInfo?.guestDetails?.firstName || "",
                lastName: pickupInfo?.guestDetails?.lastName || "",
                email: pickupInfo?.guestDetails?.email || "",
                phone: pickupInfo?.guestDetails?.phone || "",
            });
        }
        setEmailValidation({ isValid: true, message: "" });
        setIsEditingGuest(true);
    };
    const handleCancelGuestEdit = () => {
        setIsEditingGuest(false);
        setEmailValidation({ isValid: true, message: "" });
    };
    const handleSaveGuestEdit = () => {
        try {
            if (!guestEditData.firstName || !guestEditData.lastName) {
                alert("Nome e sobrenome são obrigatórios");
                return;
            }
            if (guestEditData.bookingFor === "someoneElse" && !guestEditData.email) {
                alert("Email é obrigatório para reservas de convidados");
                return;
            }
            const guestDetails = {
                title: guestEditData.title,
                firstName: guestEditData.firstName,
                lastName: guestEditData.lastName,
                email: guestEditData.email,
                phone: guestEditData.phone,
            };
            if (onUpdatePickupInfo) {
                const updateData: any = {
                    ...pickupInfo,
                    bookingFor: guestEditData.bookingFor,
                    guestDetails: guestDetails,
                };
                if (guestEditData.bookingFor === "someoneElse") {
                    updateData.pickupSign =
                        `${guestEditData.firstName} ${guestEditData.lastName}`.trim();
                }
                onUpdatePickupInfo(updateData);
            }
            setIsEditingGuest(false);
        }
        catch (error) {
            alert("Erro ao salvar. Tente novamente.");
        }
    };
    const handleGuestFieldChange = (field: keyof typeof guestEditData, value: string) => {
        setGuestEditData((prev) => {
            const updated = {
                ...prev,
                [field]: value,
            };
            if (field === "bookingFor" && value === "myself") {
                return {
                    ...updated,
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                };
            }
            if (field === "bookingFor" && value === "someoneElse") {
                return {
                    ...updated,
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                };
            }
            return updated;
        });
        if (field === "email") {
            validateEmail(value);
        }
    };
    const handleEditPickupInfo = () => {
        setValidationErrors(null);
        setInvalidSections(prev => prev.filter(s => s !== "guest"));
        setPickupEditData({
            flightNumber: pickupInfo?.flightNumber || "",
            pickupSign: pickupInfo?.pickupSign || "",
            notes: pickupInfo?.notes || "",
            refCode: pickupInfo?.refCode || "",
        });
        setIsEditingPickupInfo(true);
    };
    const handleCancelPickupEdit = () => {
        setIsEditingPickupInfo(false);
    };
    const validateBookingData = (): {
        isValid: boolean;
        errors: string[];
        invalidSections: string[];
        sectionErrors: Record<string, string[]>;
    } => {
        const errors: string[] = [];
        const invalidSects: string[] = [];
        const sectionErrors: Record<string, string[]> = {
            ride: [],
            vehicle: [],
            guest: [],
            payment: [],
            billing: [],
        };
        if (!bookingData.fromLocation || bookingData.fromLocation.trim() === "") {
            errors.push("Pickup address is required");
            if (!invalidSects.includes("ride"))
                invalidSects.push("ride");
            sectionErrors["ride"].push("Required: Pickup and Destination addresses");
        }
        if (bookingData.bookingType === "one-way" && (!bookingData.toLocation || bookingData.toLocation.trim() === "")) {
            errors.push("Destination address is required");
            if (!invalidSects.includes("ride"))
                invalidSects.push("ride");
            if (sectionErrors["ride"].length === 0) {
                sectionErrors["ride"].push("Required: Pickup and Destination addresses");
            }
        }
        if (!bookingData.vehicle || !bookingData.vehicle.id) {
            errors.push("Please select a vehicle category");
            invalidSects.push("vehicle");
            sectionErrors["vehicle"].push("Please select a vehicle category");
        }
        const guestInfo = bookingData.pickupInfo?.guestDetails;
        const isFirstNameMissing = !guestInfo?.firstName?.trim();
        const isLastNameMissing = !guestInfo?.lastName?.trim();
        const isEmailMissing = !guestInfo?.email?.trim();
        const isPhoneMissing = !guestInfo?.phone?.trim();
        const isEmailInvalid = guestInfo?.email?.trim() && !/\S+@\S+\.\S/.test(guestInfo.email);
        if (isFirstNameMissing || isLastNameMissing || isEmailMissing || isPhoneMissing || isEmailInvalid) {
            invalidSects.push("guest");
            if (isFirstNameMissing || isLastNameMissing || isEmailMissing || isPhoneMissing) {
                sectionErrors["guest"].push("Required: Name, Email and Phone");
            }
            if (isEmailInvalid) {
                sectionErrors["guest"].push("Invalid email address");
            }
            if (isFirstNameMissing)
                errors.push("First name is required");
            if (isLastNameMissing)
                errors.push("Last name is required");
            if (isEmailMissing)
                errors.push("Email is required");
            if (isEmailInvalid)
                errors.push("Invalid email");
            if (isPhoneMissing)
                errors.push("Phone is required");
        }
        const { date, time } = bookingData;
        if (date && time) {
            const now = new Date();
            const selectedDateTime = new Date(date);
            let hour = 0;
            let minute = 0;
            if (typeof time === 'string') {
                const timeStr = time as string;
                [hour, minute] = timeStr.split(':').map(Number);
            }
            else {
                hour = time.hour;
                minute = time.minute;
                if (time.period === "PM" && time.hour !== 12)
                    hour += 12;
                if (time.period === "AM" && time.hour === 12)
                    hour = 0;
            }
            selectedDateTime.setHours(hour, minute, 0, 0);
            const minimumTime = new Date(now.getTime() + 12 * 60 * 60 * 1000);
            if (selectedDateTime < minimumTime) {
                errors.push("Bookings must be made at least 12 hours in advance");
                invalidSects.push("ride");
                sectionErrors["ride"].push("Minimum 12 hours advance notice required");
            }
        }
        if (!bookingData.paymentData?.paymentMethodId) {
            errors.push("Payment method is required");
            invalidSects.push("payment");
            sectionErrors["payment"].push("Payment method required");
        }
        const billingInfo = bookingData.paymentData?.billingInfo;
        const billingErrors: string[] = [];
        if (billingInfo) {
            if (billingInfo.customerType === "company") {
                if (!billingInfo.companyName?.trim()) {
                    billingErrors.push("Nome da empresa é obrigatório");
                }
                if (!billingInfo.taxId?.trim()) {
                    billingErrors.push("Tax ID é obrigatório");
                }
            }
            if (!billingInfo.streetAddress?.trim() ||
                !billingInfo.zipCode?.trim() ||
                !billingInfo.city?.trim() ||
                !billingInfo.country?.trim()) {
                billingErrors.push("Endereço completo (rua, código postal, cidade, país) é obrigatório");
            }
        }
        if (billingErrors.length > 0) {
            invalidSects.push("billing");
            errors.push(...billingErrors);
            sectionErrors["billing"].push("Required: Complete billing address");
        }
        return {
            isValid: errors.length === 0,
            errors,
            invalidSections: invalidSects,
            sectionErrors,
        };
    };
    const handleSavePickupEdit = async () => {
        try {
            if (onUpdatePickupInfo) {
                const updateData = {
                    ...pickupInfo,
                    flightNumber: pickupEditData.flightNumber,
                    pickupSign: pickupEditData.pickupSign,
                    notes: pickupEditData.notes,
                    refCode: pickupEditData.refCode,
                };
                onUpdatePickupInfo(updateData);
            }
            setIsEditingPickupInfo(false);
        }
        catch (error) {
            toast.error("Error saving changes. Please try again.");
        }
    };
    const billingFormRef = useRef<HTMLDivElement>(null);
    const handleEditBilling = () => {
        setValidationErrors(null);
        setInvalidSections(prev => prev.filter(s => s !== "billing"));
        setSectionErrorsState(prev => {
            const newState = { ...prev };
            delete newState["billing"];
            return newState;
        });
        const currentCountry = bookingData.paymentData?.billingInfo?.country || "CH";
        const currentTaxId = bookingData.paymentData?.billingInfo?.taxId || "";
        const customerType = bookingData.paymentData?.billingInfo?.customerType || "individual";
        setBillingEditData({
            customerType,
            companyName: bookingData.paymentData?.billingInfo?.companyName || "",
            taxId: currentCountry === "CH" && !currentTaxId && customerType === "company"
                ? "CHE-"
                : currentTaxId,
            streetAddress: bookingData.paymentData?.billingInfo?.streetAddress || "",
            addressComplement: bookingData.paymentData?.billingInfo?.addressComplement || "",
            zipCode: bookingData.paymentData?.billingInfo?.zipCode || "",
            city: bookingData.paymentData?.billingInfo?.city || "",
            country: currentCountry,
            billingEmail: bookingData.paymentData?.billingInfo?.billingEmail || "",
        });
        setIsEditingBilling(true);
        setTimeout(() => {
            billingFormRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }, 100);
    };
    const handleCancelBillingEdit = () => {
        setIsEditingBilling(false);
    };
    const handleSaveBillingEdit = async () => {
        try {
            if (billingEditData.customerType === "company") {
                if (!billingEditData.companyName) {
                    toast.error("Please fill in company name");
                    return;
                }
                if (!billingEditData.taxId) {
                    toast.error("Please fill in Tax ID");
                    return;
                }
            }
            if (onUpdateBilling) {
                onUpdateBilling(billingEditData);
            }
            setIsEditingBilling(false);
        }
        catch (error) {
        }
    };
    const handlePickupFieldChange = (field: keyof typeof pickupEditData, value: string) => {
        setPickupEditData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    return (<>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 max-w-6xl mx-auto">
          
          <div className="lg:col-span-2 space-y-6">
            
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Your ride</h2>
              {!isEditingRideDetails && (<button onClick={handleEditRideDetails} className="text-[#FFD900] hover:bg-[#FFD900]/10 border border-[#FFD900]/30 hover:border-[#FFD900] px-3 py-1 rounded-full text-xs font-bold transition-all uppercase tracking-wider">
                  Edit
                </button>)}
            </div>
            
            {invalidSections.includes("ride") && sectionErrorsState["ride"] && (<div className="mb-3 text-red-500 text-sm font-bold flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 "/>
                {sectionErrorsState["ride"].join(" • ")}
              </div>)}

            
            <div ref={rideDetailsRef} className={`rounded-xl border-[0.5px] bg-gradient-to-br from-gray-800/20 via-[#0D0D0D] to-[#0D0D0D] p-6 shadow-sm transition-all duration-300 ${invalidSections.includes("ride")
            ? "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] "
            : "border-[#FFD900]"}`}>
              {isEditingRideDetails ? (<div className="space-y-3">
                  
                  <div className="relative">
                    <LocationInput id="from-location-edit" label="From" value={editFormData.fromLocation} onChange={(value) => handleInputChange("fromLocation", value)} onSelect={(suggestion) => {
                handleInputChange("fromLocation", suggestion.primaryText);
                handleInputChange("fromLocationAddress", (suggestion as any).description || `${suggestion.primaryText}, ${suggestion.secondaryText}`);
                handleInputChange("fromPlaceId", suggestion.placeId || "");
                setActiveField(null);
            }} placeholder="Address, airport, hotel, ..." icon={<LocationPinIcon />} isActive={activeField === "from-edit"} onFocus={() => setActiveField("from-edit")}/>
                  </div>

                  
                  <div className="relative">
                    <LocationInput id="to-location-edit" label="To" value={editFormData.toLocation} onChange={(value) => handleInputChange("toLocation", value)} onSelect={(suggestion) => {
                handleInputChange("toLocation", suggestion.primaryText);
                handleInputChange("toLocationAddress", (suggestion as any).description || `${suggestion.primaryText}, ${suggestion.secondaryText}`);
                handleInputChange("toPlaceId", suggestion.placeId || "");
                setActiveField(null);
            }} placeholder="Address, airport, hotel, ..." icon={<LocationPinIcon />} isActive={activeField === "to-edit"} onFocus={() => setActiveField("to-edit")}/>
                  </div>

                  
                  <div className="relative">
                    <label htmlFor="date-edit" className={`text-gray-400 text-sm absolute top-1.5 left-10 z-10 ${activeField === "date-edit"
                ? "font-bold text-[#FFD900]"
                : ""}`}>
                      Date
                    </label>
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none pt-4">
                      <CalendarIcon />
                    </div>
                    <button id="date-edit" onClick={() => setActiveField(activeField === "date-edit" ? null : "date-edit")} className="w-full bg-[#1A1A1A] border-[0.5px] border-[#FFD900]/30 focus:border-[#FFD900] rounded-lg p-4 pl-10 pt-7 text-left text-white focus:outline-none focus:ring-0 flex justify-between items-center transition-all duration-200">
                      <span>{formatDate(editFormData.date)}</span>
                      <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${activeField === "date-edit" ? "rotate-180" : ""}`}/>
                    </button>
                    {activeField === "date-edit" && (<Calendar selectedDate={editFormData.date} onSelectDate={(newDate) => {
                    handleInputChange("date", newDate);
                    setActiveField(null);
                }} onClose={() => setActiveField(null)}/>)}
                  </div>

                  
                  <div className="relative">
                    <label htmlFor="time-edit" className={`text-gray-400 text-sm absolute top-1.5 left-10 z-10 ${activeField === "time-edit"
                ? "font-bold text-[#FFD900]"
                : ""}`}>
                      Time
                    </label>
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none pt-4">
                      <ClockIcon />
                    </div>
                    <button id="time-edit" onClick={() => setActiveField(activeField === "time-edit" ? null : "time-edit")} className="w-full bg-[#1A1A1A] border-[0.5px] border-[#FFD900]/30 focus:border-[#FFD900] rounded-lg p-4 pl-10 pt-7 text-left text-white focus:outline-none focus:ring-0 flex justify-between items-center transition-all duration-200">
                      <span>{formatTimeLocal(editFormData.time)}</span>
                      <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${activeField === "time-edit" ? "rotate-180" : ""}`}/>
                    </button>
                    {activeField === "time-edit" && (<TimePicker value={editFormData.time} onChange={(newTime) => handleInputChange("time", newTime)} onClose={() => setActiveField(null)}/>)}
                  </div>

                  
                  <div className="flex justify-end space-x-3 pt-4 border-t border-[#FFD900]/20">
                    <button onClick={handleCancelRideDetails} className="text-gray-400 hover:text-white hover:bg-white/10 border border-gray-600 hover:border-white px-4 py-2 rounded-lg text-sm font-bold transition-all uppercase tracking-wider">
                      Cancel
                    </button>
                    <button onClick={handleSaveRideDetails} className="bg-[#FFD900] text-black border border-[#FFD900] hover:bg-[#E5C300] px-4 py-2 rounded-lg text-sm font-bold transition-all uppercase tracking-wider">
                      Save
                    </button>
                  </div>
                </div>) : (<>
                  
                  <div className="w-full">
                    
                    <p className="text-base sm:text-sm font-semibold text-[#FFD900] mb-3">
                      {formattedDateDisplay} - {formattedTimeDisplay}
                    </p>

                    
                    <div className="mb-4 rounded-lg overflow-hidden border border-[#FFD900]/20 w-full relative h-[200px] shrink-0">
                      

                      {(fromPlaceId && toPlaceId) || encodedPolyline ? (<RideMap originPlaceId={fromPlaceId || ""} destinationPlaceId={toPlaceId || ""} encodedPolyline={encodedPolyline}/>) : (<div className="w-full h-[200px] sm:h-[250px] bg-[#1A1A1A] flex items-center justify-center text-gray-400">
                          <div className="text-center px-4">
                            <p className="font-semibold mb-2 text-sm sm:text-base">
                              🗺️ Mapa não disponível
                            </p>
                            <p className="text-xs">
                              Selecione locais das sugestões do autocomplete
                            </p>
                          </div>
                        </div>)}
                    </div>

                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                      
                      
                      
                      <div className="flex flex-row gap-2.5 flex-1">
                        
                        <div className="relative flex flex-col items-center min-h-full">
                          
                          <div className="absolute top-2 bottom-2 w-0.5 bg-[#FFD900]"></div>

                          
                          <span className="relative z-10 h-2.5 w-2.5 rounded-full bg-[#FFD900] flex-shrink-0 mt-1.5"></span>

                          
                          <div className="flex-grow"></div>

                          
                          <span className="relative z-10 h-2.5 w-2.5 rounded-full bg-[#FFD900] flex-shrink-0 mb-1.5"></span>
                        </div>

                        <div className="flex flex-col gap-3 sm:gap-4 justify-between flex-1">
                          <div>
                            <p className="text-[13px] sm:text-sm font-bold text-[#FFD900] leading-none mb-1">
                              {fromLocation}
                            </p>
                            {fromLocationAddress && fromLocationAddress !== fromLocation && (<p className="text-[11px] sm:text-xs text-gray-400 leading-snug">
                                {fromLocationAddress}
                              </p>)}
                          </div>
                          <div>
                            <p className="text-[13px] sm:text-sm font-bold text-[#FFD900] leading-none mb-1">
                              {toLocation || "Destination not set"}
                            </p>
                            {toLocationAddress && toLocationAddress !== toLocation && (<p className="text-[11px] sm:text-xs text-gray-400 leading-snug">
                                {toLocationAddress}
                              </p>)}
                          </div>
                        </div>
                      </div>

                      
                      
                      

                      
                      <div className="flex md:hidden flex-row items-center justify-between w-full text-left">
                        <div>
                          <p className="text-[13px] sm:text-xs text-white">
                            Estimated arrival at {formattedArrivalTime}
                          </p>
                          <p className="text-[13px] sm:text-xs text-white">
                            Travel time {formatDuration(durationMinutes)}
                          </p>
                        </div>
                        <p className="text-[15px] sm:text-sm font-bold text-[#FFD900]">
                          {distanceKm
                ? `${distanceKm.toFixed(1)} km`
                : "0.0 km"}
                        </p>
                      </div>

                      
                      <div className="hidden md:flex flex-col items-end text-right">
                        <p className="text-sm font-semibold text-[#FFD900]">
                          {distanceKm
                ? `${distanceKm.toFixed(1)} km`
                : "0.0 km"}
                        </p>
                        <p className="text-xs text-white mt-0.5">
                          Estimated arrival at {formattedArrivalTime}
                        </p>
                        <p className="text-xs text-white mt-0.5">
                          Travel time {formatDuration(durationMinutes)}
                        </p>
                      </div>
                    </div>
                  </div>
                </>)}
            </div>

            
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">
                  Selected Category
                </h2>
                {!isEditingVehicle && (<button onClick={handleEditVehicle} className="text-[#FFD900] hover:bg-[#FFD900]/10 border border-[#FFD900]/30 hover:border-[#FFD900] px-3 py-1 rounded-full text-xs font-bold transition-all uppercase tracking-wider">
                    Edit
                  </button>)}
              </div>
              
              {invalidSections.includes("vehicle") &&
            sectionErrorsState["vehicle"] && (<div className="mb-3 text-red-500 text-sm font-bold flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 "/>
                    {sectionErrorsState["vehicle"].join(" • ")}
                  </div>)}
              <div ref={vehicleSectionRef} className={`rounded-xl border-[0.5px] bg-gradient-to-br from-gray-800/20 via-[#0D0D0D] to-[#0D0D0D] sm:p-6 p-0 shadow-sm transition-all duration-300 ${invalidSections.includes("vehicle")
            ? "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] "
            : "border-[#FFD900]"}`}>
                {isEditingVehicle ? (<div className="rounded-lg overflow-hidden sm:-mx-6 sm:-mb-6 sm:-mt-6">
                    {VEHICLE_CLASSES.map((vehicleOption, index) => {
                const isSelected = selectedVehicleId === vehicleOption.id;
                const isExpanded = expandedVehicleId === vehicleOption.id;
                const isLast = index === VEHICLE_CLASSES.length - 1;
                let displayPrice = vehiclePrices[vehicleOption.id];
                if (!displayPrice &&
                    isSelected &&
                    bookingData.vehicle?.price) {
                    displayPrice = bookingData.vehicle.price;
                }
                if (!displayPrice) {
                    displayPrice = vehicleOption.price;
                }
                if (bookingData?.pickupInfo?.notes?.toUpperCase().includes("TEST1CHF")) {
                    displayPrice = 1.00;
                }
                if (displayPrice === 0 || !displayPrice) {
                }
                const subtotal = displayPrice ? displayPrice / 1.081 : 0;
                const tax = displayPrice ? displayPrice - subtotal : 0;
                return (<div key={vehicleOption.id} id={`vehicle-${vehicleOption.id}`} className={`py-2 sm:py-6 px-3 sm:px-4 relative cursor-pointer transition-all
                                ${isSelected
                        ? "bg-[#FFD900] ring-2 ring-[#FFD900]"
                        : "bg-gradient-to-br from-gray-800/20 via-[#0D0D0D] to-[#0D0D0D] hover:from-gray-700/30"}
                                ${!isLast
                        ? "border-b-[0.5px] border-[#FFD900]"
                        : ""}
                                `} onClick={(e) => {
                        setSelectedVehicleId(vehicleOption.id);
                    }}>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                            <div className="flex items-center mb-2 sm:mb-0 w-full sm:w-auto">
                              <div className="relative mr-3 sm:mr-4">
                                <img src={vehicleOption.imageUrl} alt={vehicleOption.name} className="w-28 sm:w-32 h-auto relative z-10"/>
                              </div>
                              <div className="w-full mt-1.5 sm:mt-0">
                                
                                <div className="flex justify-between items-center sm:block mb-1 sm:mb-0">
                                  <h3 className={`font-semibold sm:font-bold text-base sm:text-lg leading-none mb-0 ${isSelected ? "text-black" : "text-white"}`}>
                                    {vehicleOption.name}
                                  </h3>

                                  
                                  <div className="sm:hidden flex items-center">
                                    <span className={`text-base font-bold ${isSelected ? "text-black" : "text-white"}`}>
                                      {displayPrice === 0 ? (<div className="inline-block relative top-1">
                                          <div className="animate-spin rounded-full h-4 w-4 border-2" style={{
                            borderColor: isSelected
                                ? "rgba(0, 0, 0, 0.2)"
                                : "rgba(255, 217, 0, 0.2)",
                            borderTopColor: isSelected
                                ? "#000000"
                                : "#FFD900",
                            borderStyle: "solid",
                        }}></div>
                                        </div>) : (`CHF ${displayPrice.toFixed(2)}`)}
                                    </span>
                                  </div>
                                </div>

                                
                                <div className={`flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm mt-0 mb-1 sm:my-1 ${isSelected ? "text-gray-700" : "text-white"} w-full`}>
                                  <div className="flex items-center">
                                    <UserIconCategory className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 ${isSelected
                        ? "text-gray-700"
                        : "text-white"}`}/>{" "}
                                    <span className={`font-medium sm:font-bold ${isSelected
                        ? "text-gray-700"
                        : "text-white"}`}>
                                      {vehicleOption.passengerCapacity}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <BriefcaseIconCategory className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 ${isSelected
                        ? "text-gray-700"
                        : "text-white"}`}/>{" "}
                                    <span className={`font-medium sm:font-bold ${isSelected
                        ? "text-gray-700"
                        : "text-white"}`}>
                                      {vehicleOption.luggageCapacity}
                                    </span>
                                  </div>
                                </div>
                                <p className={`text-[13px] sm:text-sm leading-tight ${isSelected
                        ? "text-gray-600"
                        : "text-gray-400"}`}>
                                  {vehicleOption.description}
                                </p>
                              </div>
                            </div>

                            
                            <div className="hidden sm:flex items-center self-end sm:self-center">
                              <span className={`text-xl font-bold ${isSelected ? "text-black" : "text-white"}`}>
                                {displayPrice === 0 ? (<div className="inline-block">
                                    <div className="animate-spin rounded-full h-6 w-6 border-2" style={{
                            borderColor: isSelected
                                ? "rgba(0, 0, 0, 0.2)"
                                : "rgba(255, 217, 0, 0.2)",
                            borderTopColor: isSelected
                                ? "#000000"
                                : "#FFD900",
                            borderStyle: "solid",
                        }}></div>
                                  </div>) : (`CHF ${displayPrice.toFixed(2)}`)}
                              </span>
                            </div>
                          </div>
                        </div>);
            })}
                  </div>) : ((() => {
            const vehicle = bookingData.vehicle;
            return (<>
                        <div className="flex flex-row items-center gap-4 p-2">
                          
                          <div className="flex-shrink-0">
                            <img src={vehicle?.imageUrl} alt={vehicle?.name} className="w-28 sm:w-40 h-auto object-contain cursor-pointer transition-transform hover:scale-105" onClick={handleEditVehicle}/>
                          </div>

                          
                          <div className="flex-1">
                            <h3 className="font-bold text-lg sm:text-xl text-white mb-1">
                              {vehicle?.name}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <div className="flex items-center">
                                <UserIcon className="w-4 h-4 text-white mr-1"/>{" "}
                                max. {vehicle?.passengerCapacity}
                              </div>
                              <div className="flex items-center">
                                <BriefcaseIcon className="w-4 h-4 text-white mr-1"/>{" "}
                                max. {vehicle?.luggageCapacity}
                              </div>
                            </div>
                            
                            <div className="flex items-start text-xs text-gray-500 mt-2">
                              <InformationCircleIcon className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400"/>
                              <span>
                                Have more bags or passengers? Please change to
                                Business Van/SUV.
                              </span>
                            </div>
                          </div>
                        </div>
                      </>);
        })())}
              </div>

              
              {isEditingVehicle && (<div className="flex justify-end space-x-3 mt-4">
                  <button onClick={handleCancelVehicleEdit} className="text-gray-400 hover:text-white hover:bg-white/10 border border-gray-600 hover:border-white px-4 py-2 rounded-lg text-sm font-bold transition-all uppercase tracking-wider">
                    Cancel
                  </button>
                  <button onClick={handleSaveVehicleEdit} className="bg-[#FFD900] text-black border border-[#FFD900] hover:bg-[#E5C300] px-4 py-2 rounded-lg text-sm font-bold transition-all uppercase tracking-wider">
                    Save
                  </button>
                </div>)}
            </div>

            
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[20px] sm:text-xl font-bold text-white">
                  Guest's information
                </h2>
                {!isEditingGuest && (<button onClick={handleEditGuest} className="text-[#FFD900] hover:bg-[#FFD900]/10 border border-[#FFD900]/30 hover:border-[#FFD900] px-3 py-1 rounded-full text-xs font-bold transition-all uppercase tracking-wider">
                    Edit
                  </button>)}
              </div>
              
              {invalidSections.includes("guest") &&
            sectionErrorsState["guest"] && (<div className="mb-3 text-red-500 text-sm font-bold flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 "/>
                    {sectionErrorsState["guest"].join(" • ")}
                  </div>)}

              <div ref={guestSectionRef} className={`relative z-20 rounded-xl border-[0.5px] bg-gradient-to-br from-gray-800/20 via-[#0D0D0D] to-[#0D0D0D] shadow-sm p-4 sm:p-6 transition-all duration-300 ${invalidSections.includes("guest")
            ? "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] "
            : "border-[#FFD900]"}`}>
                {isEditingGuest ? (<div>
                    
                    
                    <div className="mb-6 overflow-hidden rounded-xl border border-[#FFD900]/30">
                      <label className={`flex items-center cursor-pointer py-4 px-4 sm:px-6 transition-all ${guestEditData.bookingFor === "myself"
                ? "bg-[#FFD900]"
                : "bg-transparent hover:bg-[#1A1A1A]"}`}>
                        <input type="radio" name="bookingFor" value="myself" checked={guestEditData.bookingFor === "myself"} onChange={() => handleGuestFieldChange("bookingFor", "myself")} className="sr-only"/>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${guestEditData.bookingFor === "myself"
                ? "border-black bg-black"
                : "border-[#FFD900]"}`}>
                          {guestEditData.bookingFor === "myself" && (<svg className="w-3 h-3 text-[#FFD900]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                            </svg>)}
                        </div>
                        <span className={`ml-3 font-medium ${guestEditData.bookingFor === "myself"
                ? "text-black"
                : "text-white"}`}>
                          Book for myself
                        </span>
                      </label>

                      <div className="border-t border-[#FFD900]/30"></div>

                      <label className={`flex items-center cursor-pointer py-4 px-4 sm:px-6 transition-all ${guestEditData.bookingFor === "someoneElse"
                ? "bg-[#FFD900]"
                : "bg-transparent hover:bg-[#1A1A1A]"}`}>
                        <input type="radio" name="bookingFor" value="someoneElse" checked={guestEditData.bookingFor === "someoneElse"} onChange={() => handleGuestFieldChange("bookingFor", "someoneElse")} className="sr-only"/>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${guestEditData.bookingFor === "someoneElse"
                ? "border-black bg-black"
                : "border-[#FFD900]"}`}>
                          {guestEditData.bookingFor === "someoneElse" && (<svg className="w-3 h-3 text-[#FFD900]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                            </svg>)}
                        </div>
                        <span className={`ml-3 font-medium ${guestEditData.bookingFor === "someoneElse"
                ? "text-black"
                : "text-white"}`}>
                          Book for a guest
                        </span>
                      </label>
                      <div className="border-b border-[#FFD900]/30"></div>
                    </div>

                    
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <SimpleSelect label="Title *" value={guestEditData.title} onChange={(value) => handleGuestFieldChange("title", value)} options={[
                { value: "Mr.", label: "Mr." },
                { value: "Ms.", label: "Ms." },
                { value: "Mrs.", label: "Mrs." },
                { value: "Dr.", label: "Dr." },
            ]} placeholder="Select title"/>
                      </div>
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">
                            First name *
                          </label>
                          <input type="text" value={guestEditData.firstName} onChange={(e) => handleGuestFieldChange("firstName", e.target.value)} placeholder="First name" className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#FFD900]/30 rounded-lg text-white focus:ring-1 focus:ring-[#FFD900] focus:border-[#FFD900] placeholder-gray-500"/>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">
                            Last name *
                          </label>
                          <input type="text" value={guestEditData.lastName} onChange={(e) => handleGuestFieldChange("lastName", e.target.value)} placeholder="Last name" className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#FFD900]/30 rounded-lg text-white focus:ring-1 focus:ring-[#FFD900] focus:border-[#FFD900] placeholder-gray-500"/>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Email *
                        </label>
                        <div className="relative">
                          <input type="email" value={guestEditData.email} onChange={(e) => handleGuestFieldChange("email", e.target.value)} placeholder="Email address" className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-[#FFD900] focus:border-[#FFD900] placeholder-gray-500 ${!emailValidation.isValid &&
                emailValidation.message
                ? "bg-[#1A1A1A] border-red-500 text-white"
                : "bg-[#1A1A1A] border-[#FFD900]/30 text-white"}`}/>
                        </div>
                        {!emailValidation.isValid &&
                emailValidation.message && (<p className="text-xs text-red-500 mt-1">
                              {emailValidation.message}
                            </p>)}
                      </div>
                      <div className="relative z-50">
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Phone number *
                        </label>
                        <style>{`
                                .react-international-phone-country-selector-button {
                                    line-height: 1 !important;
                                    vertical-align: middle !important;
                                    text-align: center !important;
                                }
                                
                                .react-international-phone-country-selector-button * {
                                    vertical-align: middle !important;
                                    line-height: 1 !important;
                                }
                                
                                /* Forçar centralização do conteúdo interno */
                                .react-international-phone-country-selector-button__button-content {
                                    height: 100% !important;
                                    display: flex !important;
                                    align-items: center !important;
                                    justify-content: center !important;
                                    line-height: 1 !important;
                                    margin: 0 !important;
                                    padding: 0 !important;
                                }
                                
                                /* Mover apenas o número +41, não a bandeira */
                                .react-international-phone-country-selector-button__button-content {
                                    position: relative !important;
                                }
                                
                                /* Especificamente o texto do código do país */
                                .react-international-phone-country-selector-button__button-content::after {
                                    content: attr(data-country-code) !important;
                                    position: absolute !important;
                                    transform: translateY(-3px) !important;
                                    font-size: 14px !important;
                                }
                                
                                /* Esconder o texto original e mostrar apenas bandeira */
                                .react-international-phone-country-selector-button__button-content > *:not(.react-international-phone-flag-emoji) {
                                    transform: translateY(-3px) !important;
                                }
                                
                                /* Manter bandeira no lugar original */
                                .react-international-phone-flag-emoji {
                                    transform: translateY(-2px) !important;
                                    margin: 0 !important;
                                    padding: 0 !important;
                                }

                                /* Scrollbar Style for Phone Input Dropdown */
                                .react-international-phone-country-selector-dropdown::-webkit-scrollbar {
                                    width: 8px;
                                    background: #1A1A1A;
                                }
                                .react-international-phone-country-selector-dropdown::-webkit-scrollbar-thumb {
                                    background: #333;
                                    border-radius: 4px;
                                }
                                .react-international-phone-country-selector-dropdown::-webkit-scrollbar-thumb:hover {
                                    background: #FFD900;
                                }
                           `}</style>
                        <style>{`
                               .react-international-phone input {
                                   background-color: transparent !important;
                                   color: white !important;
                               }
                               .react-international-phone * { border: none !important; }
                               .react-international-phone-country-selector-button { border-right: none !important; }
                                .react-international-phone-country-selector-dropdown {
                                    background: #1A1A1A !important;
                                    border: 1px solid rgba(255, 217, 0, 0.3) !important;
                                    color: white !important;
                                    border-bottom-left-radius: 8px !important;
                                    border-bottom-right-radius: 8px !important;
                                }
                               .react-international-phone-country-selector-dropdown__list-item:hover {
                                   background-color: rgba(255, 255, 255, 0.1) !important;
                               }
                               .react-international-phone-country-selector-dropdown__list-item--selected {
                                   background-color: rgba(255, 217, 0, 0.15) !important;
                                   color: #FFD900 !important;
                               }
                           `}</style>
                        <div className="relative" style={{ overflow: "visible" }}>
                          <div className="border-[0.5px] border-[#FFD900]/30 rounded-lg bg-[#1A1A1A] focus-within:border-[#FFD900] users-select-none transition-all duration-200" style={{ height: "48px" }}>
                            <PhoneInput defaultCountry="ch" value={guestEditData.phone} onChange={(phone) => handleGuestFieldChange("phone", phone)} inputProps={{
                style: {
                    border: "none",
                    outline: "none",
                    padding: "12px 14px",
                    fontSize: "14px",
                    width: "100%",
                    backgroundColor: "transparent",
                    height: "48px",
                    borderRadius: "0px",
                    boxShadow: "none",
                    display: "flex",
                    alignItems: "center",
                    transform: "translateY(-3px)",
                    color: "white",
                },
            }} countrySelectorStyleProps={{
                buttonStyle: {
                    border: "none",
                    padding: "0",
                    margin: "0",
                    backgroundColor: "transparent",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: "75px",
                    height: "100%",
                    minHeight: "48px",
                    maxHeight: "48px",
                    borderRadius: "0",
                    position: "relative",
                    zIndex: 2,
                    lineHeight: "1",
                    boxSizing: "border-box",
                    textAlign: "center",
                    verticalAlign: "middle",
                },
                dropdownStyleProps: {
                    style: {
                        backgroundColor: "#1A1A1A",
                        border: "1px solid rgba(255, 217, 0, 0.3)",
                        color: "white",
                        zIndex: 9999,
                    },
                },
            }}/>
                          </div>
                        </div>
                      </div>
                    </div>

                    
                    <div className="flex justify-end space-x-3 pt-4 border-t border-[#FFD900]/20">
                      <button onClick={handleCancelGuestEdit} className="text-gray-400 hover:text-white hover:bg-white/10 border border-gray-600 hover:border-white px-4 py-2 rounded-lg text-sm font-bold transition-all uppercase tracking-wider">
                        Cancel
                      </button>
                      <button onClick={handleSaveGuestEdit} className="bg-[#FFD900] text-black border border-[#FFD900] hover:bg-[#E5C300] px-4 py-2 rounded-lg text-sm font-bold transition-all uppercase tracking-wider">
                        Save
                      </button>
                    </div>
                  </div>) : (<div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="text-white mb-1">Guest Name</div>
                        <div className="text-[#FFD900]">
                          {getGuestName() &&
                getGuestName() !== "N/A" &&
                getGuestName().trim() !== ""
                ? getGuestName()
                : "Add your personal information here"}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-white mb-1">Contact Details</div>
                      <div className="text-[#FFD900]">
                        {getGuestContact() &&
                getGuestContact() !== "N/A" &&
                getGuestContact().trim() !== ""
                ? getGuestContact()
                : "Add your contact information"}
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>
            
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[20px] sm:text-xl font-bold text-white">
                  Pickup Information
                </h2>
                {!isEditingPickupInfo && (<button onClick={handleEditPickupInfo} className="text-[#FFD900] hover:bg-[#FFD900]/10 border border-[#FFD900]/30 hover:border-[#FFD900] px-3 py-1 rounded-full text-xs font-bold transition-all uppercase tracking-wider">
                    Edit
                  </button>)}
              </div>

              <div className="rounded-xl border-[0.5px] border-[#FFD900] bg-gradient-to-br from-gray-800/20 via-[#0D0D0D] to-[#0D0D0D] p-4 sm:p-6 shadow-sm">
                <div>
                  {isEditingPickupInfo ? (<div className="space-y-3 sm:space-y-4">
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Flight number
                        </label>
                        <FlightInput value={pickupEditData.flightNumber} onChange={(value) => handlePickupFieldChange("flightNumber", value)} onSelect={(flight: FlightSuggestion) => {
                handlePickupFieldChange("flightNumber", flight.fullFlightNumber);
            }} placeholder="Enter flight number (e.g., LH202, BA2490)"/>
                        <p className="text-xs text-gray-500 mt-1">
                          e.g. LH 202, U24567, BA2490
                        </p>
                      </div>

                      
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Pickup sign
                        </label>
                        <input type="text" value={pickupEditData.pickupSign} onChange={(e) => handlePickupFieldChange("pickupSign", e.target.value)} placeholder="Name to display on pickup sign" className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#FFD900]/30 rounded-lg text-white focus:ring-1 focus:ring-[#FFD900] focus:border-[#FFD900] placeholder-gray-500"/>
                        <p className="text-xs text-gray-500 mt-1">
                          This will appear on your chauffeur's pickup sign when
                          they meet you.
                        </p>
                      </div>

                      
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Notes for the chauffeur
                        </label>
                        <textarea value={pickupEditData.notes} onChange={(e) => handlePickupFieldChange("notes", e.target.value)} placeholder="Any special instructions for the chauffeur" rows={3} className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#FFD900]/30 rounded-lg text-white focus:ring-1 focus:ring-[#FFD900] focus:border-[#FFD900] placeholder-gray-500"/>
                      </div>



                      
                      <div className="flex justify-end space-x-3 pt-4 border-t border-[#FFD900]/20">
                        <button onClick={handleCancelPickupEdit} className="text-gray-400 hover:text-white hover:bg-white/10 border border-gray-600 hover:border-white px-4 py-2 rounded-lg text-sm font-bold transition-all uppercase tracking-wider">
                          Cancel
                        </button>
                        <button onClick={handleSavePickupEdit} className="bg-[#FFD900] text-black border border-[#FFD900] hover:bg-[#E5C300] px-4 py-2 rounded-lg text-sm font-bold transition-all uppercase tracking-wider">
                          Save
                        </button>
                      </div>
                    </div>) : (<div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="text-white mb-1">Flight number</div>
                          <div className="text-[#FFD900]">
                            {pickupInfo?.flightNumber || "Not provided"}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="text-white mb-1">Pickup sign</div>
                        <div className="text-[#FFD900]">
                          {pickupInfo?.pickupSign || "Not provided"}
                        </div>
                      </div>
                      <div>
                        <div className="text-white mb-1">
                          Notes for the chauffeur
                        </div>
                        <div className="text-[#FFD900]">
                          {pickupInfo?.notes || "No notes provided"}
                        </div>
                      </div>

                    </div>)}
                </div>
              </div>
            </div>
          </div>

          
          <div className="space-y-6">
            <section ref={paymentSectionRef} aria-label="Simulated payment" className="rounded-xl border border-[#FFD900]/50 bg-[#0D0D0D] p-6">
              <h2 className="text-xl font-bold mb-3">Demo payment</h2>
              <div className="flex items-center gap-3 text-[#FFD900]"><CheckIcon className="w-5 h-5"/>Simulation ready</div>
              <p className="mt-3 text-sm text-gray-400">No card details required. Confirming creates a preview in this browser only; no charge or real reservation is made.</p>
            </section>
            
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[20px] sm:text-2xl font-bold text-white">
                Billing information
              </h2>
              {!isEditingBilling && (<button onClick={handleEditBilling} className="text-[#FFD900] hover:bg-[#FFD900]/10 border border-[#FFD900]/30 hover:border-[#FFD900] px-3 py-1 rounded-full text-xs font-bold transition-all uppercase tracking-wider">
                  Edit
                </button>)}
            </div>
            
            {invalidSections.includes("billing") &&
            sectionErrorsState["billing"] && (<div className="mb-3 text-red-500 text-sm font-bold flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 "/>
                  {sectionErrorsState["billing"].join(" • ")}
                </div>)}
            <div className={`rounded-xl border-[0.5px] bg-gradient-to-br from-gray-800/20 via-[#0D0D0D] to-[#0D0D0D] p-4 sm:p-6 shadow-sm transition-all duration-300 ${invalidSections.includes("billing")
            ? "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] "
            : "border-[#FFD900]"}`} ref={billingFormRef}>
              {isEditingBilling ? (<div className="space-y-3 sm:space-y-4">
                  
                  <div className="mb-3 sm:mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Customer type
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center cursor-pointer">
                        <input type="radio" name="customerType" value="individual" checked={billingEditData.customerType === "individual"} onChange={() => setBillingEditData({
                ...billingEditData,
                customerType: "individual",
            })} className="mr-2 accent-[#FFD900]"/>
                        <span className="text-sm text-gray-400">
                          Individual
                        </span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input type="radio" name="customerType" value="company" checked={billingEditData.customerType === "company"} onChange={() => setBillingEditData({
                ...billingEditData,
                customerType: "company",
                taxId: billingEditData.country === "CH" &&
                    !billingEditData.taxId
                    ? "CHE-"
                    : billingEditData.taxId,
            })} className="mr-2 accent-[#FFD900]"/>
                        <span className="text-sm text-gray-400">Company</span>
                      </label>
                    </div>
                  </div>

                  

                  

                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Street address
                    </label>
                    <AddressAutocomplete billingData={billingEditData} onAddressSelect={(updatedBilling) => setBillingEditData((prev) => ({
                ...prev,
                streetAddress: updatedBilling.streetAddress,
                city: updatedBilling.city,
                zipCode: updatedBilling.zipCode,
                country: updatedBilling.country,
            }))} placeholder="Fictional street address"/>
                  </div>

                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Address complement (optional)
                    </label>
                    <input type="text" value={billingEditData.addressComplement} onChange={(e) => setBillingEditData({
                ...billingEditData,
                addressComplement: e.target.value,
            })} placeholder="Apartment, floor, building, etc." className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#FFD900]/30 rounded-lg text-white focus:ring-1 focus:ring-[#FFD900] focus:border-[#FFD900] placeholder-gray-500"/>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Postal code
                      </label>
                      <input type="text" value={billingEditData.zipCode} onChange={(e) => setBillingEditData({
                ...billingEditData,
                zipCode: e.target.value,
            })} placeholder="ZIP" className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#FFD900]/30 rounded-lg text-white focus:ring-1 focus:ring-[#FFD900] focus:border-[#FFD900] placeholder-gray-500"/>
                    </div>

                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        City
                      </label>
                      <input type="text" value={billingEditData.city} onChange={(e) => setBillingEditData({
                ...billingEditData,
                city: e.target.value,
            })} placeholder="City" className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#FFD900]/30 rounded-lg text-white focus:ring-1 focus:ring-[#FFD900] focus:border-[#FFD900] placeholder-gray-500"/>
                    </div>
                  </div>

                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <CountrySelector value={billingEditData.country} onChange={(country) => {
                const updates: any = { country };
                if (country === "CH" && billingEditData.customerType === "company") {
                    if (!billingEditData.taxId || !billingEditData.taxId.startsWith("CHE-")) {
                        updates.taxId = "CHE-";
                    }
                }
                setBillingEditData({ ...billingEditData, ...updates });
            }} placeholder="Select country"/>
                  </div>

                  
                  {billingEditData.customerType === "company" && (<>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Company name <span className="text-red-500">*</span>
                        </label>
                        <input type="text" value={billingEditData.companyName} onChange={(e) => setBillingEditData({
                    ...billingEditData,
                    companyName: e.target.value,
                })} placeholder="Legal Company Name" className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#FFD900]/30 rounded-lg text-white focus:ring-1 focus:ring-[#FFD900] focus:border-[#FFD900] placeholder-gray-500"/>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Tax ID <span className="text-red-500">*</span>
                        </label>
                        <input type="text" value={billingEditData.taxId || ""} onChange={(e) => {
                    const formatted = formatTaxIdForCountry(e.target.value, billingEditData.country);
                    setBillingEditData({
                        ...billingEditData,
                        taxId: formatted,
                    });
                }} placeholder={getTaxIdPlaceholder(billingEditData.country)} className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#FFD900]/30 rounded-lg text-white focus:ring-1 focus:ring-[#FFD900] focus:border-[#FFD900] placeholder-gray-500"/>
                        <p className="text-xs text-gray-500 mt-1">
                          We will verify this ID with the tax authority.
                        </p>
                      </div>
                    </>)}

                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Billing email (optional)
                    </label>
                    <input type="email" value={billingEditData.billingEmail || ""} onChange={(e) => setBillingEditData({
                ...billingEditData,
                billingEmail: e.target.value,
            })} placeholder="billing@company.com" className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#FFD900]/30 rounded-lg text-white focus:ring-1 focus:ring-[#FFD900] focus:border-[#FFD900] placeholder-gray-500"/>
                  </div>

                  
                  <div className="flex justify-end space-x-3 pt-4 border-t border-[#FFD900]/20">
                    <button onClick={handleCancelBillingEdit} className="text-gray-400 hover:text-white hover:bg-white/10 border border-gray-600 hover:border-white px-4 py-2 rounded-lg text-sm font-bold transition-all uppercase tracking-wider">
                      Cancel
                    </button>
                    <button onClick={handleSaveBillingEdit} className="bg-[#FFD900] text-black border border-[#FFD900] hover:bg-[#E5C300] px-4 py-2 rounded-lg text-sm font-bold transition-all uppercase tracking-wider">
                      Save
                    </button>
                  </div>
                </div>) : (<div className="flex justify-between items-start">
                  <div className="text-sm text-gray-300 flex-1 space-y-2">
                    {bookingData.paymentData?.billingInfo ? (<>
                        
                        {bookingData.paymentData.billingInfo.customerType ===
                    "company" && (<>
                              <p className="font-semibold text-[#FFD900] text-lg">
                                {bookingData.paymentData.billingInfo.companyName}
                              </p>
                              {bookingData.paymentData.billingInfo.taxId && (<p className="text-gray-400 mt-1">
                                  {bookingData.paymentData.billingInfo.taxId}
                                </p>)}
                              <div className="mt-4"/>
                            </>)}

                        
                        <p className="text-white">
                          {bookingData.paymentData.billingInfo.streetAddress}
                        </p>
                        {bookingData.paymentData.billingInfo
                    .addressComplement && (<p className="text-gray-400">
                              {bookingData.paymentData.billingInfo
                        .addressComplement}
                            </p>)}
                        <p className="text-white">
                          {bookingData.paymentData.billingInfo.zipCode}{" "}
                          {bookingData.paymentData.billingInfo.city}
                        </p>
                        <p className="text-white font-medium">
                          {bookingData.paymentData.billingInfo.country}
                        </p>

                        
                        {bookingData.paymentData.billingInfo.billingEmail && (<p className="text-gray-400">
                            {bookingData.paymentData.billingInfo.billingEmail}
                          </p>)}
                      </>) : (<div className="flex items-center gap-2">
                        <InformationCircleIcon className="w-5 h-5 text-[#FFD900] flex-shrink-0"/>
                        <p className="text-gray-500 italic">
                          Add your billing details (optional)
                        </p>
                      </div>)}
                  </div>
                </div>)}
            </div>

            
            <div className="hidden sm:block rounded-xl border-[0.5px] border-[#FFD900] bg-gradient-to-br from-gray-800/20 via-[#0D0D0D] to-[#0D0D0D] p-6 shadow-sm space-y-3 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Price excl. tax</span>
                <span>
                  CHF{" "}
                  {(selectedVehicle?.priceBreakdown?.subtotalHT ||
            selectedVehicle?.priceBreakdown?.baseFare ||
            0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Estimated tax</span>
                <span>
                  CHF{" "}
                  {(selectedVehicle?.priceBreakdown?.tvaAmount ||
            selectedVehicle?.priceBreakdown?.estimatedTax ||
            0).toFixed(2)}
                </span>
              </div>

              
              

              <div className="border-t border-[#FFD900]/30 pt-3 mt-3 flex justify-between font-bold text-lg text-white">
                <span>Total price</span>
                <span>
                  CHF {totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            
            <div className="hidden sm:block">
              <button onClick={async () => {
            const validation = validateBookingData();
            if (!validation.isValid) {
                setSectionErrorsState(validation.sectionErrors);
                setInvalidSections(validation.invalidSections);
                if (validation.invalidSections.length > 0) {
                    const firstSect = validation.invalidSections[0];
                    if (firstSect === "ride")
                        setIsEditingRideDetails(true);
                    if (firstSect === "vehicle")
                        setIsEditingVehicle(true);
                    if (firstSect === "guest")
                        setIsEditingGuest(true);
                    if (firstSect === "billing")
                        setIsEditingBilling(true);
                    setTimeout(() => {
                        const mapper: any = {
                            ride: rideDetailsRef,
                            vehicle: vehicleSectionRef,
                            guest: guestSectionRef,
                            payment: paymentSectionRef,
                            billing: billingFormRef,
                        };
                        mapper[firstSect]?.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                        });
                    }, 100);
                }
                toast.error("Required fields missing!", {
                    position: "top-center",
                    duration: 2000,
                    style: {
                        background: "#FFD900",
                        color: "#000000",
                        fontWeight: "bold",
                        border: "none"
                    }
                });
                return;
            }
            try {
                await onConfirm();
            }
            catch (error: any) {
                toast.error(error.message ||
                    "Failed to process booking. Please check your details.");
            }
        }} disabled={isProcessingPayment} className={`w-full bg-[#FFD900] text-black font-bold py-3 rounded-lg shadow-md hover:bg-[#E5C300] transition-all flex justify-center items-center ${isProcessingPayment ? "opacity-50 cursor-not-allowed" : ""}`}>
                {isProcessingPayment ? (<>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>) : ("Confirm demo booking")}
              </button>
              <p className="text-xs text-gray-500 text-center mt-3">
                Portfolio beta — simulation only. No real reservation or charge.
              </p>

              
              <div className="space-y-4 text-sm px-2 mt-6">
                <div className="flex items-start">
                  <CheckIcon className="w-5 h-5 mr-3 mt-0.5 text-[#FFD900] flex-shrink-0"/>
                  <p className="text-gray-400">
                    This portfolio demo runs entirely in your browser.
                  </p>
                </div>

                <div className="flex items-start">
                  <CheckIcon className="w-5 h-5 mr-3 mt-0.5 text-[#FFD900] flex-shrink-0"/>
                  <div className="flex flex-wrap items-center gap-3 text-gray-400">
                    <p>Payment UI reference:</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <PaymentIcon type="Visa" format="flat" width={32}/>
                      <PaymentIcon type="Mastercard" format="flat" width={32}/>
                      <PaymentIcon type="Amex" format="flat" width={32}/>
                      <PaymentIcon type="Discover" format="flat" width={32}/>
                      <PaymentIcon type="Diners" format="flat" width={32}/>
                      <PaymentIcon type="Unionpay" format="flat" width={32}/>
                      <PaymentIcon type="Jcb" format="flat" width={32}/>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <InformationCircleIcon className="w-5 h-5 mr-3 mt-0.5 text-[#FFD900] flex-shrink-0"/>
                  <p className="text-gray-400">
                    Prices and payment are simulated. No service is reserved and no email is sent.
                  </p>
                </div>
              </div>
            </div>

            
            <div className="sm:hidden pb-24"></div>
          </div>
        </div>
      </main>

      
      <div className="sm:hidden pb-24"></div>

      
      <div className="fixed bottom-0 left-0 right-0 bg-[#0D0D0D] z-50 sm:hidden pb-safe">
        
        <div className="relative">
          <div className="h-[2px] bg-gradient-to-r from-transparent via-[#FFD900] to-transparent opacity-60"></div>
          <div className="absolute inset-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFD900] to-transparent blur-sm opacity-40"></div>
        </div>

        <div className="p-4 space-y-3">
          
          {isPriceExpanded && (<div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Price excl. tax</span>
                <span>CHF {(totalPrice / 1.081).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Estimated tax</span>
                <span>CHF {(totalPrice - totalPrice / 1.081).toFixed(2)}</span>
              </div>
              <div className="border-t border-[#FFD900]/20 pt-2"></div>
            </div>)}

          
          <button onClick={() => setIsPriceExpanded(!isPriceExpanded)} className="w-full flex items-center justify-between text-white">
            <span className="text-sm font-medium">Total price</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-[#FFD900]">
                CHF {totalPrice.toFixed(2)}
              </span>
              <ChevronDownIcon className={`w-5 h-5 text-[#FFD900] transition-transform ${isPriceExpanded ? "rotate-180" : ""}`}/>
            </div>
          </button>

          
          <button onClick={async () => {
            const validation = validateBookingData();
            if (!validation.isValid) {
                setSectionErrorsState(validation.sectionErrors);
                setInvalidSections(validation.invalidSections);
                if (validation.invalidSections.length > 0) {
                    const firstSect = validation.invalidSections[0];
                    if (firstSect === "ride")
                        setIsEditingRideDetails(true);
                    if (firstSect === "vehicle")
                        setIsEditingVehicle(true);
                    if (firstSect === "guest")
                        setIsEditingGuest(true);
                    if (firstSect === "billing")
                        setIsEditingBilling(true);
                    setTimeout(() => {
                        const mapper: any = {
                            ride: rideDetailsRef,
                            vehicle: vehicleSectionRef,
                            guest: guestSectionRef,
                            payment: paymentSectionRef,
                            billing: billingFormRef,
                        };
                        mapper[firstSect]?.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                        });
                    }, 100);
                }
                toast.error("Required fields missing!", {
                    position: "top-center",
                    duration: 2000,
                    style: {
                        background: "#FFD900",
                        color: "#000000",
                        fontWeight: "bold",
                        border: "none"
                    }
                });
                return;
            }
            try {
                await onConfirm();
            }
            catch (error: any) {
                toast.error(error.message || "Failed to process booking.");
            }
        }} disabled={isProcessingPayment} className={`w-full bg-[#FFD900] text-black font-bold py-3.5 rounded-lg shadow-[0_0_15px_rgba(255,217,0,0.3)] transition-all flex justify-center items-center ${isProcessingPayment ? "opacity-50 cursor-not-allowed" : ""}`}>
            {isProcessingPayment ? (<>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>) : ("Confirm demo booking")}
          </button>
        </div>
      </div>

      
    </>);
};
