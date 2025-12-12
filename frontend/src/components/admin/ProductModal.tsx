import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { Product } from '../../models/Product';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product?: Product;
    mode: 'create' | 'edit';
}

interface AttributeTemplate {
    id: number;
    name: string;
    dataType: string;
    unit?: string;
}

interface SelectedAttribute {
    attributeId: number;
    attributeName: string;
    dataType: string;
    unit?: string;
    value: string | number;
}

const mockAttributesByCategory: Record<string, AttributeTemplate[]> = {
    'Chargers': [
        { id: 1, name: 'Power Output', dataType: 'number', unit: 'W' },
        { id: 2, name: 'Cable Length', dataType: 'number', unit: 'm' },
        { id: 3, name: 'Port Type', dataType: 'string' },
        { id: 4, name: 'Fast Charging', dataType: 'string' }
    ],
    'Smart Home': [
        { id: 5, name: 'Connectivity', dataType: 'string' },
        { id: 6, name: 'Voltage', dataType: 'number', unit: 'V' },
        { id: 7, name: 'Smart Features', dataType: 'string' },
        { id: 8, name: 'Voice Control', dataType: 'string' }
    ],
    'Power Banks': [
        { id: 9, name: 'Battery Capacity', dataType: 'number', unit: 'mAh' },
        { id: 10, name: 'Output Power', dataType: 'number', unit: 'W' },
        { id: 11, name: 'Number of Ports', dataType: 'number' },
        { id: 12, name: 'Fast Charging', dataType: 'string' }
    ],
    'Audio': [
        { id: 13, name: 'Battery Life', dataType: 'number', unit: 'hours' },
        { id: 14, name: 'Bluetooth Version', dataType: 'string' },
        { id: 15, name: 'Noise Cancellation', dataType: 'string' },
        { id: 16, name: 'Driver Size', dataType: 'number', unit: 'mm' }
    ],
    'Wearables': [
        { id: 17, name: 'Battery Life', dataType: 'number', unit: 'days' },
        { id: 18, name: 'Water Resistance', dataType: 'string' },
        { id: 19, name: 'Display Size', dataType: 'number', unit: 'inch' },
        { id: 20, name: 'Heart Rate Monitor', dataType: 'string' }
    ],
    'Storage': [
        { id: 21, name: 'Capacity', dataType: 'number', unit: 'GB' },
        { id: 22, name: 'Read Speed', dataType: 'number', unit: 'MB/s' },
        { id: 23, name: 'Write Speed', dataType: 'number', unit: 'MB/s' },
        { id: 24, name: 'Interface', dataType: 'string' }
    ]
};

const ProductModal = ({ isOpen, onClose, product, mode }: ProductModalProps) => {
    const [formData, setFormData] = useState({
        name: product?.name || '',
        category: product?.category?.name || '',
        price: product?.price || 0,
        stock: product?.stockQuantity || 0,
        description: product?.description || '',
        imageUrl: product?.pictureUrls[0] || ''
    });

    const [selectedAttributes, setSelectedAttributes] = useState<SelectedAttribute[]>([]);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                category: product.category?.name || '',
                price: product.price,
                stock: product.stockQuantity,
                description: product.description,
                imageUrl: product.pictureUrls[0] || ''
            });
        }
    }, [product]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onClose();
    };

    const handleCategoryChange = (categoryName: string) => {
        setFormData({ ...formData, category: categoryName });
        setSelectedAttributes([]);
    };

    const availableAttributes = mockAttributesByCategory[formData.category] || [];

    const addAttribute = (attr: AttributeTemplate) => {
        const newAttribute: SelectedAttribute = {
            attributeId: attr.id,
            attributeName: attr.name,
            dataType: attr.dataType,
            unit: attr.unit,
            value: attr.dataType === 'number' ? 0 : ''
        };
        setSelectedAttributes([...selectedAttributes, newAttribute]);
    };

    const removeAttribute = (index: number) => {
        setSelectedAttributes(selectedAttributes.filter((_, i) => i !== index));
    };

    const updateAttributeValue = (index: number, value: string | number) => {
        const updated = [...selectedAttributes];
        updated[index] = { ...updated[index], value };
        setSelectedAttributes(updated);
    };

    const getUnselectedAttributes = () => {
        const selectedIds = selectedAttributes.map(a => a.attributeId);
        return availableAttributes.filter(attr => !selectedIds.includes(attr.id));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {mode === 'create' ? 'Create New Product' : 'Edit Product'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter product name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select category</option>
                                <option value="Chargers">Chargers</option>
                                <option value="Smart Home">Smart Home</option>
                                <option value="Power Banks">Power Banks</option>
                                <option value="Audio">Audio</option>
                                <option value="Wearables">Wearables</option>
                                <option value="Storage">Storage</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price (₴)
                            </label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Stock Quantity
                            </label>
                            <input
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            placeholder="Enter product description"
                        />
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Image URL
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="https://example.com/image.jpg"
                            />
                            <button
                                type="button"
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                                Upload
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-gray-200 pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Product Attributes</h3>
                            {formData.category && getUnselectedAttributes().length > 0 && (
                                <select
                                    onChange={(e) => {
                                        const attrId = Number(e.target.value);
                                        const attr = availableAttributes.find(a => a.id === attrId);
                                        if (attr) {
                                            addAttribute(attr);
                                            e.target.value = '';
                                        }
                                    }}
                                    className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <option value="">+ Add Attribute</option>
                                    {getUnselectedAttributes().map(attr => (
                                        <option key={attr.id} value={attr.id}>
                                            {attr.name} {attr.unit ? `(${attr.unit})` : ''}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {!formData.category && (
                            <p className="text-sm text-gray-500">Select a category to add attributes</p>
                        )}

                        {formData.category && selectedAttributes.length === 0 && (
                            <p className="text-sm text-gray-500">No attributes added yet. Select one from the dropdown above.</p>
                        )}

                        {selectedAttributes.length > 0 && (
                            <div className="space-y-3">
                                {selectedAttributes.map((attr, index) => (
                                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {attr.attributeName} {attr.unit && <span className="text-gray-500">({attr.unit})</span>}
                                            </label>
                                            <input
                                                type={attr.dataType === 'number' ? 'number' : 'text'}
                                                value={attr.value}
                                                onChange={(e) => updateAttributeValue(index, attr.dataType === 'number' ? Number(e.target.value) : e.target.value)}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder={`Enter ${attr.attributeName.toLowerCase()}`}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeAttribute(index)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {mode === 'create' ? 'Create Product' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;
