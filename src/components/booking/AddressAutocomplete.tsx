import type { BillingInformation } from '../../types';
export function AddressAutocomplete({ billingData, onAddressSelect, placeholder }: {
    billingData: BillingInformation;
    onAddressSelect: (data: BillingInformation) => void;
    placeholder?: string;
}) {
    return <input aria-label="Street address" value={billingData.streetAddress} placeholder={placeholder} onChange={e => onAddressSelect({ ...billingData, streetAddress: e.target.value })} className="w-full p-3 bg-[#1a1a1a] border border-[#FFD900]/30 rounded-lg text-white"/>;
}
