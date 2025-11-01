import { useState, useEffect } from 'react';
import { X, ShoppingCart, Plus, Minus, Check, Star, ChevronDown } from 'lucide-react';
import type { Product } from '../types';
import useCartStore from '../store/cartStore';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

// Custom hook for the "Read More" functionality
const useTruncatedText = (text: string, maxLength: number) => {
  const [isTruncated, setIsTruncated] = useState(true);

  const toggleTruncate = () => {
    setIsTruncated(!isTruncated);
  };

  const displayText = isTruncated ? text.slice(0, maxLength) : text;
  const needsTruncation = text.length > maxLength;

  return { displayText, toggleTruncate, isTruncated, needsTruncation };
};


export default function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Reset local state when the product prop changes (modal opens)
  useEffect(() => {
    if (product) {
      setIsAdded(false);
      setQuantity(1);
    }
  }, [product]);

  const { displayText, toggleTruncate, isTruncated, needsTruncation } = useTruncatedText(product?.description || '', 150);


  if (!product) {
    return null;
  }

  const handleAddToCart = () => {
    if (isAdded) return;
    addItem({ ...product, quantity });
    setIsAdded(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  // New animation styles
  const animationStyle = `
    @keyframes slide-in-bottom {
      from {
        opacity: 0;
        transform: translateY(50px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-slide-in-bottom {
      animation: slide-in-bottom 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    }
  `;

  return (
    <>
      <style>{animationStyle}</style>
      <div
        className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-end md:items-center p-0 md:p-4 transition-opacity duration-300"
        onClick={onClose}
      >
        <div
          className="relative bg-white rounded-t-2xl md:rounded-2xl shadow-xl w-full max-w-4xl h-screen md:h-[90vh] flex flex-col md:flex-row overflow-hidden animate-slide-in-bottom"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 bg-white/50 backdrop-blur-sm rounded-full p-1 transition-all z-20"
            aria-label="Close product details"
          >
            <X size={24} />
          </button>
          {/* Back button for accessibility/navigation */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 text-sm px-3 py-1 rounded-md bg-white/80 hover:bg-white/90 z-20"
            aria-label="Back to products"
          >
            Back
          </button>

          {/* Image Section - Takes up more space */}
          <div className="w-full md:w-3/5 bg-gray-100 flex justify-center items-center p-4 md:p-8 relative overflow-hidden">
            <div className="w-full flex justify-center items-center">
              <img
                src={product.image}
                alt={product.title}
                className="max-h-56 sm:max-h-72 md:max-h-full max-w-full object-contain transition-transform duration-500 ease-in-out hover:scale-105"
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="w-full md:w-2/5 p-4 sm:p-6 flex flex-col">
            {/* Top Details (scrollable) */}
            <div className="flex-grow overflow-y-auto pr-2">
              <span className="text-sm sm:text-sm font-semibold text-blue-600 uppercase tracking-wider">{product.category}</span>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mt-2">{product.title}</h1>

              <div className="flex items-center gap-2 mt-3 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-bold text-base text-slate-700">{product.rating.rate}</span>
                </div>
                <span className="text-slate-500 text-xs">({product.rating.count} reviews)</span>
              </div>

              {/* Description with Read More */}
              <div className="text-slate-600 mt-4 text-sm leading-relaxed">
                <p>
                  {displayText}
                  {needsTruncation && isTruncated && '...'}
                </p>
                {needsTruncation && (
                  <button
                    onClick={toggleTruncate}
                    className="mt-2 text-blue-600 font-semibold flex items-center gap-1 text-sm"
                  >
                    {isTruncated ? 'Read More' : 'Show Less'}
                    <ChevronDown className={`w-4 h-4 transition-transform ${!isTruncated ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>
            </div>

            {/* Bottom CTA - stays visible */}
            <div className="mt-4 sm:mt-6 pt-3 sm:pt-6 bg-white">
              <div className="flex justify-between items-center mb-3">
                {/* Quantity Controls */}
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button onClick={() => handleQuantityChange(-1)} className="p-2 text-gray-500 hover:text-black transition-colors" aria-label="Decrease quantity">
                    <Minus size={14} />
                  </button>
                  <span className="font-bold text-lg w-10 text-center">{quantity}</span>
                  <button onClick={() => handleQuantityChange(1)} className="p-2 text-gray-500 hover:text-black transition-colors" aria-label="Increase quantity">
                    <Plus size={14} />
                  </button>
                </div>
                {/* Price */}
                <span className="text-2xl sm:text-4xl font-extrabold text-slate-900">${(product.price * quantity).toFixed(2)}</span>
              </div>
              <button
                onClick={handleAddToCart}
                className={`w-full text-white font-bold py-3 sm:py-4 px-4 rounded-lg transition-all transform duration-300 ease-in-out flex items-center justify-center gap-2 ${isAdded ? 'bg-green-500 scale-105' : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'}`}
              >
                {isAdded ? (
                  <>
                    <Check size={18} />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

