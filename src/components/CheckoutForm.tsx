import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema } from '../schemas/checkoutSchema';
import type { CheckoutFormData } from '../schemas/checkoutSchema';
import FormInput from './FormInput';
import useCartStore from '../store/cartStore';

interface CheckoutFormProps {
  onSuccessfulCheckout: () => void;
  onBack: () => void;
}

export default function CheckoutForm({ onSuccessfulCheckout, onBack }: CheckoutFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = (data: CheckoutFormData) => {
    setIsSubmitting(true);
    console.log('Checkout successful:', data);

    // Prepare order payload from cart
    const cartItems = useCartStore.getState().items;
    const total = cartItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
    const order = {
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      customer: data,
      items: cartItems,
      total,
    };

    // Persist last order to localStorage so the ThankYou page can show details
    try {
      localStorage.setItem('lastOrder', JSON.stringify(order));
    } catch (e) {
      // ignore storage errors
    }

    // Simulate an API call
    setTimeout(() => {
      setIsSubmitting(false);
      // clear cart after saving last order
      useCartStore.getState().clearCart();
      onSuccessfulCheckout(); // switch views
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-slate-800">Checkout</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 gap-6">
          <FormInput
            label="Full Name"
            id="name"
            register={register('name')}
            error={errors.name?.message}
            placeholder="John Doe"
          />
          <FormInput
            label="Email Address"
            id="email"
            type="email"
            register={register('email')}
            error={errors.email?.message}
            placeholder="you@example.com"
          />
          <FormInput
            label="Shipping Address"
            id="address"
            register={register('address')}
            error={errors.address?.message}
            placeholder="123 Main Street"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="City"
              id="city"
              register={register('city')}
              error={errors.city?.message}
              placeholder="Anytown"
            />
            <FormInput
              label="Postal Code"
              id="postalCode"
              register={register('postalCode')}
              error={errors.postalCode?.message}
              placeholder="12345"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse sm:flex-row gap-4 justify-between items-center">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto px-6 py-3 rounded-lg text-slate-600 font-semibold hover:bg-slate-100 transition-colors"
          >
            Back to Cart
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Place Order'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

