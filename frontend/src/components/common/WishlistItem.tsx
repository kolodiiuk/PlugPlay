import { ShoppingCart, X } from 'lucide-react';
import { WishlistProduct } from '../../data/mockWishlistData';

interface WishlistItemProps {
    product: WishlistProduct;
    onRemove: (id: number) => void;
}

export default function WishlistItem({ product, onRemove }: WishlistItemProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('uk-UA', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(price);
    };

    return (
        <div className="relative bg-white rounded-lg p-4 mb-3">
            <button
                onClick={() => onRemove(product.id)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Remove from wishlist"
            >
                <X className="w-5 h-5" />
            </button>

            <div className="flex gap-4 mb-4">
                <div
                    className="w-20 h-20 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: product.imageColor }}
                />

                <div className="flex-1">
                    <h3 className="text-base font-medium text-gray-900 mb-1">
                        {product.name}
                    </h3>
                    <p className="text-lg font-semibold text-gray-900">
                        ₴{formatPrice(product.price)}
                    </p>
                </div>
            </div>

            <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    Buy
                </button>
            </div>
        </div>
    );
}
