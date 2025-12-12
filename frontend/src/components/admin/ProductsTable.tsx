import { Product } from '../../models/Product';
import { Edit2, Trash2 } from 'lucide-react';

interface ProductsTableProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
}

const ProductsTable = ({ products, onEdit, onDelete }: ProductsTableProps) => {
    const formatCurrency = (amount: number) => {
        return `${amount.toFixed(2)} ₴`;
    };

    const getStockColor = (stock: number) => {
        if (stock > 30) return 'text-green-600';
        if (stock > 10) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getCategoryColor = (categoryName: string) => {
        const colors: Record<string, string> = {
            'Chargers': 'bg-blue-100 text-blue-700',
            'Smart Home': 'bg-purple-100 text-purple-700',
            'Power Banks': 'bg-green-100 text-green-700',
            'Audio': 'bg-pink-100 text-pink-700',
            'Wearables': 'bg-indigo-100 text-indigo-700',
            'Storage': 'bg-orange-100 text-orange-700'
        };
        return colors[categoryName] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Image
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Product Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stock
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <img
                                        src={product.pictureUrls[0]}
                                        alt={product.name}
                                        className="w-12 h-12 rounded object-cover"
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(product.category?.name || '')}`}>
                                        {product.category?.name}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <p className="text-sm text-gray-900">{formatCurrency(product.price)}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <p className={`text-sm font-medium ${getStockColor(product.stockQuantity)}`}>
                                        {product.stockQuantity}
                                    </p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => onEdit(product)}
                                            className="text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(product)}
                                            className="text-red-600 hover:text-red-800 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">Showing {products.length} of {products.length} products</p>
            </div>
        </div>
    );
};

export default ProductsTable;
