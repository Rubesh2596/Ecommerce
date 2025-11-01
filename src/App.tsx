import { useState, useEffect } from 'react';
import { ShoppingCart, Search, ArrowUp, Mail, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Heart } from 'lucide-react';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import CheckoutForm from './components/CheckoutForm';
import WishlistPanel from './components/WishlistPanel';
import useWishlist from './store/wishlistStore';
import ThankYou from './components/ThankYou';
import useCartStore from './store/cartStore';
import type { Product } from './types';
import ProductDetailModal from './components/ProductDetailModal';
import ContactModal from './components/ContactModal';

type View = 'products' | 'cart' | 'checkout' | 'confirmation';

// --- NEW INNOVATIVE HERO COMPONENT (60/40 SPLIT) ---

// Images for the 3D carousel (Original Links Restored)
const carouselProducts = [
  { id: 1, title: "Wireless Headphones", img: "https://plus.unsplash.com/premium_photo-1677838847804-4054143fb91a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%D&auto=format&fit=crop&q=80&w=1974" },
  { id: 2, title: "Smart Watch", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHNtYXJ0d2F0Y2h8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600" },
  { id: 3, title: "Pro Laptop", img: "https://images.unsplash.com/photo-1654119895136-6aad918f412c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHByZWRhdGFyJTIwbGFwdG9wfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600" },
  { id: 4, title: "Gaming Console", img: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%D&auto=format&fit=crop&q=80&w=2127" },
  { id: 5, title: "VR Headset", img: "https://images.unsplash.com/photo-1576633587382-13ddf37b1fc1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHZyJTIwaGVhZHNldHxlbnwwfHwwfHx8MA%3D&auto=format&fit=crop&q=60&w=600" },
  { id: 6, title: "DSLR Camera", img: "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHNsciUyMGNhbWVyYXxlbnwwfHwwfHx8MA%3D&auto=format&fit=crop&q=60&w=600" },
];

const HeroShowcase = () => {
  const [rotation, setRotation] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const totalItems = carouselProducts.length;
  const anglePerItem = 360 / totalItems;

  const rotate = (direction: 'next' | 'prev') => {
    setRotation(prev => prev + (direction === 'next' ? -anglePerItem : anglePerItem));
  };

  // Detect mobile viewport (<= 480px) and stop auto-rotation on mobile
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth <= 480);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    if (isMobile) return; // do not auto-rotate on small screens
    const interval = setInterval(() => rotate('next'), 4000);
    return () => clearInterval(interval);
  }, [isMobile]);

  // Calculate radius based on screen size for responsiveness
  const [radius, setRadius] = useState(250);
  useEffect(() => {
    const updateRadius = () => {
      if (window.innerWidth < 768) {
        setRadius(160); // Smaller for mobile (when stacked)
      } else if (window.innerWidth < 1024) {
        setRadius(180); // Smaller for tablet (when split)
      } else {
        setRadius(250); // Large for desktop
      }
    };
    updateRadius();
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, []);

  // If mobile, render a simplified stacked hero without rotating carousel
  if (isMobile) {
    const first = carouselProducts[0];
    return (
      <section
        className="relative min-h-screen text-white overflow-hidden"
        style={{
          backgroundImage: `url(${first.img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay for subtle transparency */}
        <div className="absolute inset-0 bg-black/50" aria-hidden />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 gap-6 items-center py-12 relative">
          <div className="w-full text-center">
            <span className="text-lg font-bold text-blue-300 uppercase tracking-widest">Welcome to ShopTechX</span>
            <h2 className="text-3xl font-extrabold mt-4">The Future in Your Hands.</h2>
            <p className="mt-4 text-sm text-gray-200">Explore our curated collection of the finest tech gear.</p>
            <button onClick={() => { document.getElementById('product-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="mt-6 inline-flex items-center px-6 py-3 bg-blue-600/90 text-white rounded-full">Browse Collection</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-slate-900 via-gray-900 to-slate-900 text-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-5 gap-8 min-h-screen items-center py-20 lg:py-0">

        {/* --- 60% Text Content (Original Content) --- */}
        <div className="lg:col-span-3 z-10 text-center lg:text-left">
          <div className="max-w-lg mx-auto lg:mx-0 animate-fade-in-up">
            <span className="text-lg font-bold text-blue-400 uppercase tracking-widest">Welcome to ShopTechX</span>
            <h2 className="text-5xl md:text-7xl font-extrabold drop-shadow-xl mt-4">The Future <br /> in Your Hands.</h2>
            <p className="mt-6 text-lg md:text-xl text-gray-300 drop-shadow-lg">Experience cutting-edge technology. Explore our curated collection of the finest tech gear.</p>
            <button onClick={() => { document.getElementById('product-section')?.scrollIntoView({ behavior: 'smooth' }); }} className="group relative inline-flex items-center justify-center mt-10 px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full transition-all duration-300 overflow-hidden hover:from-blue-700 hover:to-indigo-800 shadow-2xl shadow-blue-500/30 transform hover:scale-110">
              <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
              <span className="relative">Browse Collection</span>
            </button>
          </div>
        </div>

        {/* --- 40% 3D Carousel Scene (Original Design) --- */}
        <div className="lg:col-span-2 z-0 flex items-center justify-center h-full relative">
          {/* Set perspective on the parent container */}
          <div className="absolute w-full h-full" style={{ perspective: '1000px' }}>
            <div className="relative w-full h-full transition-transform duration-1000 ease-in-out" style={{ transformStyle: 'preserve-3d', transform: `rotateY(${rotation}deg)` }}>
              {/* Items are positioned absolutely within the rotating container */}
              {carouselProducts.map((product, index) => (
                <div key={product.id} className="absolute top-1/2 left-1/2 -mt-[160px] -ml-[100px] md:-mt-[190px] md:-ml-[140px] w-[200px] h-[320px] md:w-[280px] md:h-[380px] rounded-2xl overflow-hidden shadow-2xl shadow-black/50" style={{ transform: `rotateY(${index * anglePerItem}deg) translateZ(${radius}px)`, backfaceVisibility: 'hidden' }}>
                  <img src={product.img} alt={product.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <p className="absolute bottom-4 left-4 text-lg font-bold">{product.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Navigation */}
          <div className="absolute z-20 bottom-0 lg:bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
            <button onClick={() => rotate('prev')} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/20 transition-all transform hover:scale-110" aria-label="Previous item">
              <ChevronLeft size={24} />
            </button>
            <button onClick={() => rotate('next')} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/20 transition-all transform hover:scale-110" aria-label="Next item">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
// --- END NEW HERO COMPONENT ---


export default function App() {
  const [view, setView] = useState<View>('products');
  const [showMiniCart, setShowMiniCart] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);

  const { items, clearCart } = useCartStore();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const wishlistCount = useWishlist((s) => s.items.length);

  // Effect to handle body scroll when a modal or panel is open
  useEffect(() => {
    const isModalOpen = showMiniCart || !!selectedProduct;
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMiniCart, selectedProduct]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSuccessfulCheckout = () => {
    clearCart();
    setView('confirmation');
  };
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderView = () => {
    switch (view) {
      case 'cart':
        return <Cart onCheckout={() => setView('checkout')} onContinueShopping={() => setView('products')} />;
      case 'checkout':
        return <CheckoutForm onSuccessfulCheckout={handleSuccessfulCheckout} onBack={() => setView('cart')} />;
      case 'confirmation':
        return <ThankYou onBackToHome={() => setView('products')} />;
      case 'products':
      default:
        return <ProductList onProductClick={handleProductClick} searchTerm={searchTerm} category={selectedCategory} />;
    }
  };

  const categories = ['All', 'electronics', `men's clothing`, `women's clothing`, 'jewelery'];

  // Helper function to reset view to home/products
  const goToHome = () => {
    setView('products');
    setSelectedCategory(null);
    setSearchTerm('');
    scrollToTop();
  }

  return (
    <div className="min-h-screen bg-gray-100 text-slate-800 font-sans antialiased selection:bg-blue-500 selection:text-white">

      {/* --- NEW INNOVATIVE NAVBAR --- */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/80 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">

            {/* Left: Contact Icon */}
            <div className="flex-1 flex justify-start">
              <button
                onClick={() => setShowContactModal(true)}
                className="flex items-center justify-center w-10 h-10 rounded-full text-slate-600 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                aria-label="Contact Us"
              >
                <Mail size={20} />
              </button>
            </div>

            {/* Center: Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 cursor-pointer transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(30,58,138,0.2)]" onClick={goToHome}>
                ShopTechX
              </h1>
            </div>

            {/* Right: Wishlist + Cart Icon */}
            <div className="flex-1 flex justify-end items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowWishlist(true)}
                  className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-slate-600 hover:text-red-600 hover:bg-gray-100 transition-colors"
                  aria-label={`Wishlist`}
                >
                  <Heart className="w-5 h-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center border-2 border-white">
                      {wishlistCount}
                    </span>
                  )}
                </button>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowMiniCart(true)}
                  className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-slate-600 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                  aria-label={`Shopping cart with ${cartCount} items`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center border-2 border-white animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* --- SLIDE-IN CART PANEL --- */}
      <div className={`fixed inset-0 z-50 transition-all duration-500 ease-in-out ${showMiniCart ? 'visible' : 'invisible'}`}>
        {/* Overlay */}
        <div onClick={() => setShowMiniCart(false)} className={`absolute inset-0 bg-black/60 transition-opacity duration-500 ${showMiniCart ? 'opacity-100' : 'opacity-0'}`}></div>
        {/* Panel */}
        <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-500 ease-in-out ${showMiniCart ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold">My Cart</h2>
            <button onClick={() => setShowMiniCart(false)} className="p-2 rounded-full hover:bg-gray-100">
              <X size={24} />
            </button>
          </div>

          {items.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
              <ShoppingCart size={64} className="text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">Your cart is empty</h3>
              <p className="text-gray-500 mt-2">Looks like you haven't added anything yet.</p>
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {items.map((it) => (
                <div key={it.id} className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-white rounded-md border p-1 flex-shrink-0">
                    <img src={it.image} alt={it.title} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-grow overflow-hidden">
                    <p className="font-semibold truncate">{it.title}</p>
                    <p className="text-sm text-gray-500">Qty: {it.quantity}</p>
                  </div>
                  <p className="font-bold text-lg">${(it.price * it.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}

          {items.length > 0 && (
            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-between items-center mb-4 text-lg font-semibold">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="space-y-3">
                <button onClick={() => { setView('cart'); setShowMiniCart(false); }} className="w-full bg-white border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors">View Cart</button>
                <button onClick={() => { setView('checkout'); setShowMiniCart(false); }} className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-lg font-bold hover:from-blue-700 hover:to-indigo-800 transition-all transform hover:scale-105">Proceed to Checkout</button>
              </div>
            </div>
          )}
        </div>
      </div>


      {/* --- HERO SECTION --- */}
      {view === 'products' && (
        <HeroShowcase />
      )}

      {/* --- MAIN CONTENT --- */}
      <main id="product-section" className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* === START OF CHANGED SECTION === */}
        {view === 'products' && (
          // Main sticky container
          <div className="mb-12 bg-white p-4 sm:p-6 rounded-lg shadow-lg sticky top-[64px] sm:top-[80px] z-20 backdrop-blur-lg bg-white/80 border border-gray-200/80">

            {/* Original Layout: Search on left, filters on right (on desktop) */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">

              {/* 1. Search Bar - UNCHANGED */}
              <div className="relative w-full md:w-auto md:flex-grow max-w-lg">
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products, brands, and more..."
                  className="w-full bg-gray-100 border-2 border-transparent rounded-full py-3 pl-12 pr-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
              </div>

              {/* 2. INNOVATIVE Filter Pills - Horizontal Scroll
                 - `w-full md:w-auto`: Stacks on mobile, side-by-side on desktop.
                 - `py-1`: ***FIX*** - Added padding to make room for scrollbar, preventing clipping.
                 - Removed the broken `md:max-w-[50%]` class.
              */}
              <nav className="w-full md:w-auto py-1">
                {/* Mobile: show a Filters button that opens a panel. Desktop: show pills inline */}
                <div className="flex md:hidden justify-end">
                  <button onClick={() => setShowFilterPanel(true)} className="px-4 py-2 rounded-full border bg-white text-sm font-medium">Filters</button>
                </div>

                <div className="hidden md:flex gap-3 flex-wrap md:justify-end">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat === 'All' ? null : cat)}
                      className={`
                        flex-shrink-0       
                        whitespace-nowrap   
                        px-5 py-2 rounded-full 
                        text-sm font-medium 
                        capitalize 
                        transition-all duration-300 
                        transform hover:scale-105
                        ${(selectedCategory === cat || (cat === 'All' && selectedCategory === null))
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                          : 'bg-white text-slate-700 hover:bg-gray-100 border border-gray-300'
                        }
                      `}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </nav>

            </div>
          </div>
        )}
        {/* Mobile Filter Panel (slide-down) */}
        {showFilterPanel && (
          <div className="md:hidden mt-3">
            <div className="bg-white rounded-lg shadow-md border p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Filters</h3>
                <button onClick={() => setShowFilterPanel(false)} className="p-1 rounded-full hover:bg-gray-100">
                  <X size={18} />
                </button>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat === 'All' ? null : cat); setShowFilterPanel(false); }}
                    className={`flex-shrink-0 whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium capitalize ${selectedCategory === cat || (cat === 'All' && selectedCategory === null) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-slate-700'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* === END OF CHANGED SECTION === */}


        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
          {renderView()}
        </div>
      </main>

      {/* --- FOOTER & OTHER COMPONENTS --- */}
      <footer className="bg-white text-slate-600 py-12 border-t mt-16">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; {new Date().getFullYear()} ShopTechX. All rights reserved.</p>
          <p className="text-sm text-slate-500 mt-2">Pioneering Tomorrow's Technology Today</p>
        </div>
      </footer>
      {showScrollTop && (
        <button onClick={scrollToTop} className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all duration-300 animate-fade-in-up transform hover:scale-110">
          <ArrowUp />
        </button>
      )}
      {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} />}
      {showWishlist && (
        <WishlistPanel
          open={showWishlist}
          onClose={() => setShowWishlist(false)}
          onViewCart={() => { setView('cart'); setShowWishlist(false); }}
          onBack={() => { setView('products'); setShowWishlist(false); }}
        />
      )}
      <ProductDetailModal product={selectedProduct} onClose={closeModal} />
    </div>
  );
}