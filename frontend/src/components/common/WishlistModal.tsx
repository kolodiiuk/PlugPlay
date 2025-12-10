import { useState, useMemo } from 'react';
import {skipToken} from '@reduxjs/toolkit/query';
import WishlistItem from './WishlistItem';
import {WishlistProduct } from '../../data/mockWishlistData';
import { WishList } from '../../models/WishList';
import {storage} from '../../utils/StorageService';
import {useGetUserByTokenQuery} from '../../api/userInfoApi.ts'
import {useGetAllProductsQuery} from '../../api/productsApi.ts';
import {useNavigate, useLocation} from 'react-router-dom';
import {
    useAddToWishlistMutation,
    useGetWishlistItemQuery,
    useIsInWishlistQuery,
    useGetUserWishlistQuery,
    useRemoveWishlistItemMutation,
    useClearWishlistMutation
} from '../../api/wishlistApi';
import { useCartContext } from '../../context/CartContext.tsx';

interface WishlistModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function WishlistModal({ isOpen, onClose }: WishlistModalProps) {
    const navigate = useNavigate();
    const {isCartOpen, closeCart} = useCartContext();

    const {data: wishlistItems, isLoading : isLoadingWishList, isError : isWishListError, refetch} = useGetUserWishlistQuery();
    const {data: products, isLoading: isLoadingProducts, isError: isProductsError} = useGetAllProductsQuery();

    const sortedItems = useMemo(
        () => [...(wishlistItems ?? [])].sort((a, b) => a.id - b.id),
        [wishlistItems]
    );

    const enrichedItems = useMemo(() =>
        sortedItems.map(item => ({
            ...item,
            product: products?.find(p => p.id === item.productId),
        })),
        [sortedItems, products]
    );

    const [removeItem] = useRemoveWishlistItemMutation();
    const [clear] = useClearWishlistMutation();

    const handleRemoveItem = async (id: number, productId? : number) => {
        await removeItem(id);
        refetch();
        reloadIfNeeded(productId);
    };

    const handleClearAll = async () => {
        await clear();
        refetch();
        reloadIfNeeded();
    };

    const handleNavigate = (productId?: number) => {
        if (!productId) {
            return;
        }

        navigate(`/product/${productId}`);
        onClose();
    };

    const reloadIfNeeded = (productId?: number) => {
        console.log(location.pathname);
        console.log((`/product/${productId}`));

        if (location.pathname === ("/")
            || (!productId && location.pathname.startsWith("/product/"))
            || (productId && location.pathname === (`/product/${productId}`))) {
            console.log("reload");
            window.location.reload();
        }
    };

    const isError = isWishListError || isProductsError;
    const isLoading = isLoadingWishList || isLoadingProducts;
    if (!isOpen || isError || isLoading) return null;

    if(isCartOpen) {
        closeCart();
    }

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
                                {enrichedItems.length} {enrichedItems?.length === 1 ? 'item' : 'items'}
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
                    {enrichedItems.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">Your wishlist is empty</p>
                        </div>
                    ) : (
                        <div>
                            {enrichedItems.map((item) => (
                                <WishlistItem
                                    key={item.id}
                                    itemId={item.id}
                                    product={item.product}
                                    onRemove={handleRemoveItem}
                                    onImageClick={handleNavigate}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>;
        </>
    );
}
