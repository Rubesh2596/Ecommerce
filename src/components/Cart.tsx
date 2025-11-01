import React from 'react';
import useCartStore from '../store/cartStore';
import CartItem from './CartItem';

interface Props {
  onCheckout: () => void;
  onContinueShopping?: () => void;
}

const Cart: React.FC<Props> = ({ onCheckout, onContinueShopping }) => {
  const items = useCartStore((state) => state.items);
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (items.length === 0) {
    return <p className="text-center text-gray-500 py-8">Your cart is empty.</p>;
  }

  return (
    <div>
      {items.map((item) => <CartItem key={item.id} item={item} />)}
      <div className="mt-6 text-right">
        <h3 className="text-xl font-bold text-gray-800">Total: ${total.toFixed(2)}</h3>
        <div className="mt-4 flex flex-col md:flex-row md:justify-end gap-3">
          {onContinueShopping && (
            <button
              onClick={onContinueShopping}
              className="w-full md:w-auto px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
            >
              Continue Shopping
            </button>
          )}
          <button
            onClick={onCheckout}
            className="w-full md:w-auto bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors duration-300 font-semibold text-lg"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;

