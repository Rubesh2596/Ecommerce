import { ShoppingCart } from 'lucide-react';
import useCartStore from '../store/cartStore';
import type{ Product } from '../types';

interface ProductItemProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

export default function ProductItem({ product, onProductClick }: ProductItemProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
  };

  return (
    <div
      className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-all duration-300 cursor-pointer group flex flex-col"
      onClick={() => onProductClick(product)}
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain p-6 transition-transform duration-500 ease-in-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center gap-4">
          <button
            onClick={handleAddToCart}
            className="p-3 bg-white text-slate-800 rounded-full scale-0 group-hover:scale-100 transition-transform duration-200 delay-100 transform hover:scale-110"
            aria-label="Add to cart"
          >
            <ShoppingCart size={22} />
          </button>
        </div>
      </div>
      <div className="p-5 flex-grow flex flex-col">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{product.category}</span>
        <h3 className="text-lg font-bold text-slate-800 mt-2 flex-grow" title={product.title}>
          {product.title}
        </h3>
        <div className="flex items-center justify-between mt-4">
          <span className="text-2xl font-extrabold text-slate-900">${product.price.toFixed(2)}</span>
          <div className="flex items-center gap-1 text-sm text-amber-500">
             <span>{product.rating.rate} ★</span>
             <span className="text-slate-400">({product.rating.count})</span>
          </div>
        </div>
      </div>
    </div>
  );
}

