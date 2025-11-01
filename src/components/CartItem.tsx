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
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center gap-4">
        <img src={item.image} alt={item.title} className="w-16 h-16 object-contain rounded-md" />
        <div>
          <h3 className="font-semibold text-sm md:text-base">{item.title}</h3>
          <p className="text-gray-600 text-sm">${item.price.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center border rounded-md overflow-hidden">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
            aria-label={`Decrease quantity for ${item.title}`}
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={handleQuantityChange}
            className="w-16 p-2 text-center"
          />
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
            aria-label={`Increase quantity for ${item.title}`}
          >
            +
          </button>
        </div>
        <button
          onClick={() => removeItem(item.id)}
          className="text-red-500 hover:text-red-700 transition-colors"
          aria-label={`Remove ${item.title} from cart`}
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}

