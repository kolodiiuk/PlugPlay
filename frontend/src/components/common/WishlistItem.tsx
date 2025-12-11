import { ShoppingCart, X } from 'lucide-react';
import { Product } from '../../models/Product';

interface WishlistItemProps {
    itemId: number;
    product: Product | undefined;
    isInCart: boolean;
    isOutOfStock: boolean;
    onRemove: (id: number) => void;
    onImageClick: (productId: number | undefined) => void;
    onAddToCart: (product: Product) => void;
    onBuy: (product: Product) => void;
}

export default function WishlistItem({itemId, product, isInCart, isOutOfStock, onRemove, onImageClick, onAddToCart, onBuy}: WishlistItemProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('uk-UA', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(price);
    };

    return (
        <div className="relative bg-white rounded-lg p-4 mb-3">
            <button
                onClick={() => onRemove(itemId)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Remove from wishlist"
            >
                <X className="w-5 h-5" />
            </button>

            <div className="flex gap-4 mb-4">
                <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={product?.pictureUrls[0] ?? ""}
                        alt={product?.name ?? "product"}
                        className="w-full h-full object-cover"
                        onClick={() => {
                          onImageClick(product?.id);
                        }}
                      />
                  </div>

                <div className="flex-1">
                    <h3 className="text-base font-medium text-gray-900 mb-1">
                        {product?.name} 
                    </h3>
                    
                    <p className="text-lg font-semibold text-gray-900">
                        ₴{formatPrice(product?.price ?? 0)}
                    </p>
                    <span className="text-sm text-red-500 font-medium">{isOutOfStock && 'Out of stock'}</span>
                </div>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={() => {
                        if (product) {
                            onAddToCart(product)
                        }
                    }}
                    disabled={isInCart || isOutOfStock}
                    className="w-full bg-white text-gray-900 px-6 py-3 rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition-colors font-semibold
                    disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed">
                    {isInCart? "Already in cart" : "Add to cart"}
                </button>
                <button
                    onClick={() => {
                        if (product) {
                            onBuy(product)
                        }
                    }}
                    disabled={isInCart || isOutOfStock}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2 
                    disabled:bg-gray-400 disabled:cursor-not-allowed">
                    <ShoppingCart className="w-4 h-4" />
                    Buy
                </button>
            </div>
        </div>
    );
}
