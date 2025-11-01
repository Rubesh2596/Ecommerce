import { useEffect, useMemo, useState } from 'react';
import type { Product } from '../types';
import { Star, Heart } from 'lucide-react';
import useWishlist from '../store/wishlistStore';

interface Props {
  onProductClick?: (product: Product) => void;
  searchTerm?: string;
  category?: string | null;
}

// +--------------------------+
// | NEW ProductItem COMPONENT |
// +--------------------------+
// Redesigned for a "no-shadow", professional, and clean aesthetic.

interface ProductItemProps {
  product: Product;
  onProductClick: (product: Product) => void;
}

const ProductItem = ({ product, onProductClick }: ProductItemProps) => {
  const { toggle, isInWishlist } = useWishlist();

  return (
    <div
      onClick={() => onProductClick(product)}
      // Removed all shadows. Using a border for separation.
      // Hover animation is now a subtle -translate-y and border color change.
      className="group relative flex flex-col border border-slate-200 rounded-2xl overflow-hidden bg-white transition-all duration-300 ease-in-out hover:border-blue-400 hover:-translate-y-1 cursor-pointer"
    >
      {/* Wishlist toggle (top-right) */}
      <button
        onClick={(e) => { e.stopPropagation(); toggle(product); }}
        aria-label="Toggle wishlist"
        className={`absolute top-3 right-3 z-20 p-2 rounded-full transition-colors ${isInWishlist(product.id) ? 'bg-red-50 text-red-600' : 'bg-white text-gray-400 hover:bg-gray-100'}`}
      >
        <Heart className="w-5 h-5" />
      </button>

      {/* Image Container - Added overflow-hidden */}
      <div className="relative w-full h-52 bg-white p-4 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain object-center transition-transform duration-300 ease-in-out group-hover:scale-105"
        />
        {/* View Details overlay - New "pop" animation */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
          <span className="text-white font-semibold py-2 px-5 rounded-full bg-white/20 border border-white/50 transform scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 ease-in-out">
            View Details
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between border-t border-slate-200">
        <div>
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">{product.category}</p>
          <h3 className="mt-2 font-bold text-gray-800 max-h-[3rem] overflow-hidden leading-tight text-sm">
            {product.title}
          </h3>
        </div>

        {/* Price and Rating */}
        <div className="mt-4 flex items-end justify-between">
          <p className="text-2xl font-extrabold text-gray-900">${product.price.toFixed(2)}</p>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium text-gray-600">
              {product.rating?.rate} ({product.rating?.count})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};


/**
 * Skeleton component, updated for the no-shadow design.
 */
const ProductSkeleton = () => (
  // Removed shadow, relying only on border and bg.
  <div className="relative border border-slate-200 rounded-2xl overflow-hidden bg-white animate-pulse break-inside-avoid">
    {/* Image Skeleton */}
    <div className="w-full h-52 bg-slate-100"></div>
    {/* Content Skeleton */}
    <div className="p-5 border-t border-slate-200">
      <div className="h-3 bg-slate-100 rounded w-1/3 mb-3"></div>
      <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
      <div className="mt-5 flex items-end justify-between">
        <div className="h-8 bg-slate-200 rounded w-1/3"></div>
        <div className="h-4 bg-slate-100 rounded w-1/4"></div>
      </div>
    </div>
  </div>
);

/**
 * Shared component for empty/error states - New Minimal Design
 */
const InfoBlock = ({ title, message, icon }: { title: string; message: string; icon: React.ReactNode }) => (
  // Removed card styles (shadow, border, bg) for a cleaner, more minimal look.
  <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 text-slate-300">{icon}</div>
    <h3 className="mt-4 text-xl font-bold text-gray-700">{title}</h3>
    <p className="mt-2 text-sm text-gray-500">{message}</p>
  </div>
);

export default function ProductList({ onProductClick, searchTerm = '', category = null }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from API (No changes)
  useEffect(() => {
    let mounted = true;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch('https://fakestoreapi.com/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data: Product[] = await res.json();
        if (mounted) setProducts(data);
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProducts();
    return () => { mounted = false; };
  }, []);

  // Filter products based on search and category (No changes)
  const filtered = useMemo(() => {
    const q = (searchTerm || '').trim().toLowerCase();
    return products.filter((p) => {
      const matchesCategory = category ? p.category === category : true;
      const matchesSearch = q ? p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) : true;
      return matchesCategory && matchesSearch;
    });
  }, [products, searchTerm, category]);

  // Animation keyframes (No changes)
  const animationStyle = `
    @keyframes fade-in-up {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-fade-in-up {
      animation: fade-in-up 0.5s ease-out forwards;
      opacity: 0; /* Start hidden */
    }
  `;

  // 1. Loading State: Show animated skeletons (Using new Skeleton)
  if (loading) {
    return (
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  // 2. Error State: Show error message (Using new InfoBlock)
  if (error) {
    return (
      <InfoBlock
        title="Something went wrong"
        message={error}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-red-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
          </svg>
        }
      />
    );
  }

  // 3. No Results State: Show empty message (Using new InfoBlock)
  if (filtered.length === 0) {
    return (
      <InfoBlock
        title="No Products Found"
        message="Try adjusting your search or category filters."
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-slate-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        }
      />
    );
  }

  // 4. Success State: Render the animated, staggered masonry grid (No changes)
  return (
    <>
      <style>{animationStyle}</style>
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        {filtered.map((product, index) => (
          <div
            key={product.id}
            className="break-inside-avoid animate-fade-in-up"
            style={{ animationDelay: `${index * 75}ms` }} // Staggered animation
          >
            <ProductItem
              product={product}
              onProductClick={onProductClick ?? (() => { })}
            />
          </div>
        ))}
      </div>
    </>
  );
}