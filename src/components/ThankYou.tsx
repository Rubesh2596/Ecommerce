import { Package, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { CartItem } from '../types';

interface ThankYouProps {
  onBackToHome: () => void;
}

type SavedOrder = {
  id: string;
  createdAt: string;
  customer?: {
    name?: string;
    email?: string;
    address?: string;
  };
  items: CartItem[];
  total: number;
};

export default function ThankYou({ onBackToHome }: ThankYouProps) {
  const [order, setOrder] = useState<SavedOrder | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('lastOrder');
      if (raw) {
        const parsed = JSON.parse(raw) as SavedOrder;
        setOrder(parsed);
      }
    } catch (e) {
      setOrder(null);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9fafb] px-6 py-16">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.07)] p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-28 h-28 bg-black/5 rounded-bl-[80px]" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-black/5 rounded-tr-[60px]" />

        <div className="flex justify-center mb-6">
          <div className="w-18 h-18 rounded-full bg-[#111827] flex items-center justify-center p-4">
            <Package className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-[#111827] text-center">Thank you — your order is confirmed</h1>
        <p className="text-gray-500 text-center mt-2">We've emailed your receipt. You'll receive shipping updates soon.</p>

        {order ? (
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Order ID</div>
                <div className="font-medium">{order.id}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Placed</div>
                <div className="font-medium">{new Date(order.createdAt).toLocaleString()}</div>
              </div>
            </div>

            <ul className="mt-6 divide-y">
              {order.items.map((it) => (
                <li key={it.id} className="py-4 flex items-center gap-4">
                  <img src={it.image} alt={it.title} className="w-16 h-16 object-cover rounded-md" />
                  <div className="flex-grow">
                    <div className="font-semibold text-slate-800">{it.title}</div>
                    <div className="text-sm text-gray-500">Qty: {it.quantity}</div>
                  </div>
                  <div className="text-right font-medium">${(it.price * it.quantity).toFixed(2)}</div>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">Customer</div>
              <div className="text-right">
                <div className="font-medium">{order.customer?.name ?? 'Guest'}</div>
                <div className="text-sm text-gray-500">{order.customer?.email ?? ''}</div>
              </div>
            </div>

            <div className="mt-6 border-t pt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">Total</div>
              <div className="text-xl font-bold">${order.total.toFixed(2)}</div>
            </div>
          </div>
        ) : (
          <div className="mt-8 text-center text-gray-500">Order details are not available. If you just placed an order, please refresh the page or check your email for the receipt.</div>
        )}

        <button
          onClick={onBackToHome}
          className="mt-8 w-full py-3 rounded-full font-semibold bg-[#111827] text-white hover:bg-black transition-all flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Continue Shopping
        </button>

        <p className="text-center text-gray-400 text-sm mt-4">Need help? <span className="underline cursor-pointer">Contact Support</span></p>
      </div>
    </div>
  );
}
