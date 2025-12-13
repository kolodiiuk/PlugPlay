import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import ProductsTable from '../../components/admin/ProductsTable';
import ProductModal from '../../components/admin/ProductModal';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';
import { mockAdminProducts } from '../../data/mockAdminData';
import { Product } from '../../models/Product';
import { useProductsService } from '../../features/products/ProductsService';
import { useGetAllCategoriesQuery } from '../../api/adminProductApi';
import { Category } from '../../models/Category';

const AdminProducts = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category>();

    const productsResult = useProductsService({
        categoryId: selectedCategory?.id,
    });
    
    const filteredProducts = productsResult.products.filter(product => {
       const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
       return matchesSearch;
     });
    const {data: categories = [], isLoading: isLoadingCategories, isError: isCategoryError } = useGetAllCategoriesQuery();

    const handleCreateProduct = () => {
        setModalMode('create');
        setSelectedProduct(undefined);
        setIsModalOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setModalMode('edit');
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (product: Product) => {
        setSelectedProduct(product);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        setIsDeleteModalOpen(false);
        setSelectedProduct(undefined);
    };

    return (
        <div className="max-w-7xl ml-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">Products Management</h1>
                <button
                    onClick={handleCreateProduct}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Create Product
                </button>
            </div>

            <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div>
                    <select
                        value={selectedCategory?.id ?? ""}
                        onChange={(e) => setSelectedCategory(categories.find((c) => c.id === Number(e.target.value)))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">All</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <ProductsTable
                products={filteredProducts}
                onEdit={handleEditProduct}
                onDelete={handleDeleteClick}
            />

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={selectedProduct}
                mode={modalMode}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                productName={selectedProduct?.name || ''}
            />
        </div>
    );
};

export default AdminProducts;
