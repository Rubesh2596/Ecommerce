import React, { useEffect, useState } from 'react';

// --- MOCK TYPE ---
type CartItem = {
  id: number | string;
  title: string;
  price: number;
  quantity: number;
  image: string;
};
// --- END MOCK TYPE ---

// --- MOCK ICONS ---
const Package: React.FC<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => (
  <svg
    className={className}
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.2" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const ArrowLeft: React.FC<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => (
  <svg
    className={className}
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);
// --- END MOCK ICONS ---

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
    <div className="min-h-screen flex items-center justify-center bg-[#f9fafb] px-4 py-8 sm:px-6 sm:py-12">
      <div className="w-full max-w-3xl sm:max-w-2xl bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.07)] p-6 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-28 h-28 bg-black/5 rounded-bl-[80px]" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-black/5 rounded-tr-[60px]" />

        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-[#111827] flex items-center justify-center p-3">
            <Package className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#111827] text-center">
          Thank you — your order is confirmed
        </h1>
        <p className="text-gray-500 text-center mt-2 text-sm sm:text-base">
          We've emailed your receipt. You'll receive shipping updates soon.
        </p>

        {order ? (
          <div className="mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="text-sm text-gray-500">Order ID</div>
                <div className="font-medium break-words">{order.id}</div>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-sm text-gray-500">Placed</div>
                <div className="font-medium">
                  {new Date(order.createdAt).toLocaleString()}
                </div>
              </div>
            </div>

            <ul className="mt-6 divide-y">
              {order.items.map((it) => (
                <li
                  key={it.id}
                  className="py-4 flex items-center gap-3"
                >
                  <img
                    src={it.image}
                    alt={it.title}
                    className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-md flex-shrink-0"
                    onError={(e) =>
                    (e.currentTarget.src =
                      'https://placehold.co/64x64/e2e8f0/333?text=Img')
                    }
                  />
                  <div className="flex-grow min-w-0">
                    <div className="font-semibold text-slate-800 truncate">
                      {it.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      Qty: {it.quantity}
                    </div>
                    <div className="text-left font-medium mt-1">
                      ${(it.price * it.quantity).toFixed(2)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="text-sm text-gray-500">Customer</div>
              <div className="text-left sm:text-right">
                <div className="font-medium">{order.customer?.name ?? 'Guest'}</div>
                <div className="text-sm text-gray-500">
                  {order.customer?.email ?? ''}
                </div>
              </div>
            </div>

            <div className="mt-6 border-t pt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">Total</div>
              <div className="text-xl sm:text-2xl font-bold">
                ${order.total.toFixed(2)}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 text-center text-gray-500">
            Order details are not available. If you just placed an order, please
            refresh the page or check your email for the receipt.
          </div>
        )}

        <button
          onClick={onBackToHome}
          className="mt-8 w-full py-3 rounded-full font-semibold bg-[#111827] text-white hover:bg-black transition-all flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Continue Shopping
        </button>

        <p className="text-center text-gray-400 text-sm mt-4">
          Need help? <span className="underline cursor-pointer">Contact Support</span>
        </p>
      </div>
    </div>
  );
}
