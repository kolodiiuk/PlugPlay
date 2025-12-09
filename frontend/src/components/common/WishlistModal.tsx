import { useState } from 'react';
import WishlistItem from './WishlistItem';
import { mockWishlistProducts, WishlistProduct } from '../../data/mockWishlistData';

interface WishlistModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function WishlistModal({ isOpen, onClose }: WishlistModalProps) {
    const [wishlistItems, setWishlistItems] = useState<WishlistProduct[]>(mockWishlistProducts);

    const handleRemoveItem = (id: number) => {
        setWishlistItems(wishlistItems.filter(item => item.id !== id));
    };

    const handleClearAll = () => {
        setWishlistItems([]);
    };

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-40 animate-fadeIn"
                onClick={onClose}
            />

            <div className="fixed top-16 right-64 w-full max-w-[28rem] bg-white rounded-lg shadow-2xl z-50 max-h-[calc(100vh-5rem)] flex flex-col animate-slideDown">
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Wishlist</h2>
                            <p className="text-sm text-gray-500 mt-0.5">
                                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
                            </p>
                        </div>
                        <button
                            onClick={handleClearAll}
                            className="text-red-500 hover:text-red-600 font-medium text-sm transition-colors"
                        >
                            Clear All
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    {wishlistItems.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">Your wishlist is empty</p>
                        </div>
                    ) : (
                        <div>
                            {wishlistItems.map((product) => (
                                <WishlistItem
                                    key={product.id}
                                    product={product}
                                    onRemove={handleRemoveItem}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
