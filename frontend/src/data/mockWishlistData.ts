export interface WishlistProduct {
    id: number;
    name: string;
    price: number;
    imageColor: string;
}

export const mockWishlistProducts: WishlistProduct[] = [
    {
        id: 1,
        name: 'BlueSound 8300',
        price: 89.99,
        imageColor: '#E5E7EB', // Light gray
    },
    {
        id: 2,
        name: 'SmartFit Pro Band',
        price: 89.99,
        imageColor: '#E5E7EB', // Light gray
    },
];
