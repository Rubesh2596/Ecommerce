import { Trash2 } from 'lucide-react';
import useCartStore from '../store/cartStore'; // Corrected: default import
import type { CartItem as CartItemType } from '../types';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (!isNaN(newQuantity)) {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-start sm:items-center gap-4 w-full">
        <img src={item.image} alt={item.title} className="w-16 h-16 object-contain rounded-md flex-shrink-0" />
        <div className="min-w-0">
          <h3 className="font-semibold text-sm md:text-base truncate">{item.title}</h3>
          <p className="text-gray-600 text-sm mt-1">${item.price.toFixed(2)}</p>
        </div>
      </div>

      {/* Controls: stacked on mobile, inline on larger screens */}
      <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
        <div className="flex items-center border rounded-md overflow-hidden w-full sm:w-auto">
          <button
            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-lg"
            aria-label={`Decrease quantity for ${item.title}`}
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={handleQuantityChange}
            className="w-16 p-2 text-center border-l border-r"
          />
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-lg"
            aria-label={`Increase quantity for ${item.title}`}
          >
            +
          </button>
        </div>

        {/* Delete: full width on mobile, inline on desktop */}
        <button
          onClick={() => removeItem(item.id)}
          className="w-full sm:w-auto mt-2 sm:mt-0 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 py-2 rounded-md flex items-center justify-center gap-2"
          aria-label={`Remove ${item.title} from cart`}
        >
          <Trash2 size={16} />
          <span className="hidden sm:inline">Remove</span>
        </button>
      </div>
    </div>
  );
}

