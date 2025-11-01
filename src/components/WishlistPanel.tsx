// React import not needed with automatic JSX runtime
import { X, Heart, ChevronLeft } from 'lucide-react';
import useWishlist from '../store/wishlistStore';
import useCartStore from '../store/cartStore';

interface Props {
    open: boolean;
    onClose: () => void;
    onViewCart?: () => void;
    onBack?: () => void;
}

export default function WishlistPanel({ open, onClose, onViewCart, onBack }: Props) {
    const { items, remove } = useWishlist();
    const { addItem } = useCartStore();

    const moveToCart = (product: any) => {
        addItem({ ...product, quantity: 1 });
        remove(product.id);
    };

    return (
        <div className={`fixed inset-0 z-50 transition-all duration-500 ease-in-out ${open ? 'visible' : 'invisible'}`}>
            <div onClick={onClose} className={`absolute inset-0 bg-black/60 transition-opacity duration-500 ${open ? 'opacity-100' : 'opacity-0'}`} />

            <div className={`absolute top-0 right-0 h-full w-full max-w-md sm:max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-500 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => { if (onBack) onBack(); else onClose(); }}
                            className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-50 hover:bg-gray-100 text-sm font-medium"
                            aria-label="Back"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Back</span>
                        </button>
                        <h2 className="text-2xl font-bold">My Wishlist</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                        <X size={24} />
                    </button>
                </div>

                {items.length === 0 ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
                        <Heart size={64} className="text-gray-300 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700">Your wishlist is empty</h3>
                        <p className="text-gray-500 mt-2">Add products to your wishlist to see them here.</p>
                    </div>
                ) : (
                    <div className="flex-grow overflow-y-auto overflow-x-hidden p-4 sm:p-6 space-y-4">
                        {items.map((it) => (
                            <div key={it.id} className="flex items-center gap-4">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-md border p-1 flex-shrink-0">
                                    <img src={it.image} alt={it.title} className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-grow min-w-0">
                                    <p className="font-semibold text-sm max-h-[3rem] overflow-hidden leading-tight break-words">{it.title}</p>
                                    <p className="text-sm text-gray-500">${it.price.toFixed(2)}</p>
                                </div>
                                <div className="flex flex-col gap-2 w-24 sm:w-28 flex-shrink-0">
                                    <button onClick={() => moveToCart(it)} className="w-full text-sm bg-blue-600 text-white px-2 py-1 rounded-lg">Move to cart</button>
                                    <button onClick={() => remove(it.id)} className="w-full text-sm text-red-600 hover:underline">Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {items.length > 0 && (
                    <div className="p-6 border-t bg-gray-50">
                        <div className="flex justify-between items-center mb-4 text-lg font-semibold">
                            <span>Total</span>
                            <span>${items.reduce((s, i) => s + i.price, 0).toFixed(2)}</span>
                        </div>
                        <div className="space-y-3">
                            <button onClick={() => onViewCart && onViewCart()} className="w-full bg-white border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-bold">View Cart</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
