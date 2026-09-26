const methods = [{ id: 'demo', stripe_payment_method_id: 'demo', cardholder_name: 'Demo guest', card_brand: 'demo', card_last4: 'DEMO', card_exp_month: 12, card_exp_year: 2030 }];
const noop = async (..._args: unknown[]) => true;
const adapter = { paymentMethods: methods, fetchPaymentMethods: noop, addPaymentMethod: noop, deletePaymentMethod: noop, clearPaymentMethodsCache: noop };
export const usePaymentMethods = () => adapter;
