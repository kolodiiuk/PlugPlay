import { useState, useEffect, useMemo, useRef } from 'react';
import { X, Trash2 } from 'lucide-react';
import { Product } from '../../models/Product';
import { Attribute } from '../../models/Attribute';
import { useAddProductMutation, useGetAllAttributesQuery, useGetAllCategoriesQuery, useUpdateProductMutation, useUploadProductImageMutation } from '../../api/adminProductApi';
import { ProductAttributeCreateRequest } from '../../api/adminProductApi';
import { useGetAttributeGroupsMutation } from '../../api/productsApi';
import AttributeGroup from '../../models/AttributeGroup';
import ProductImageGallery from '../products/ProductImageGallery';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product?: Product;
    mode: 'create' | 'edit';
}

interface AttributeWithValue {
    attribute: Attribute;
    value: string | number;
}

const ProductModal = ({ isOpen, onClose, product, mode }: ProductModalProps) => {
    const [formData, setFormData] = useState({
        id: product?.id,
        name: product?.name || '',
        category: product?.category,
        price: product?.price || 0,
        stock: product?.stockQuantity || 0,
        description: product?.description || '',
        imageUrls: product?.pictureUrls
    });

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        setFormData({
            id: product?.id,
            name: product?.name || '',
            category: product?.category ?? categories[0],
            price: product?.price || 0,
            stock: product?.stockQuantity || 0,
            description: product?.description || '',
            imageUrls: product?.pictureUrls
        });

        if(!product) {
            setSelectedAttributes([]);
            return;
        }

        const mapAttributeGroupToAttributeWithValue = (
            group: AttributeGroup
        ): AttributeWithValue => {
            const productAttr = group.productAttributeDtos?.[0];

            const attribute: Attribute = {
                id: group.id,
                name: group.name,
                unit: group.unit,
                dataType: group.dataType,
                productAttributeDtos: productAttr ? [productAttr] : []
            };

            const value =
                group.dataType === "Number"
                    ? productAttr?.numValue ?? 0
                    : productAttr?.strValue ?? "";

            return {
                attribute,
                value
            };
        };

        const loadAttributes = async () => {
            if (!product.category?.id) return;

            try {
                const attributeGroups = await getAttributeGroups({
                    categoryId: product.category.id,
                    productIds: [product.id]
                }).unwrap();

                setSelectedAttributes(attributeGroups.map( ag => mapAttributeGroupToAttributeWithValue(ag)));
            } catch (err) {
                console.error("Failed to load attributes", err);
                setSelectedAttributes([]);
            }
        };

        loadAttributes();
    }, [product]);

    const [selectedAttributes, setSelectedAttributes] = useState<AttributeWithValue[]>([]);
    const {data: categories = [], isLoading: isLoadingCategories, isError: isCategoryError } = useGetAllCategoriesQuery();
    const {data: availableAttributes = [], isLoading: isLoadingAttributes, isError: isAttributeError} = useGetAllAttributesQuery()

    const [getAttributeGroups] = useGetAttributeGroupsMutation();
    const [uploadProductImage] = useUploadProductImageMutation();
    const [addProduct] = useAddProductMutation();
    const [updateProduct] = useUpdateProductMutation();

    //const [getAttributeGroups] = useGetAttributeGroupsMutation();

    //const [availableAttributes, setAvailableAttributes] = useState<Attribute[]>([]);
    const unselectedAttributes = useMemo(
        () =>
            availableAttributes.filter(
                a => !selectedAttributes.some(sa => sa.attribute.id === a.id)
            ),
        [ availableAttributes, selectedAttributes]
    );
    // useEffect(() => {
    //     const loadAttributes = () => {
            // if (!formData.category?.id) {
            //     setAvailableAttributes([]);

            //     return;
            // }

            //const attrs = await getAttributeGroups({ categoryId: formData?.category?.id }).unwrap();

    //         setAvailableAttributes(attrs);
    //     };

    // loadAttributes();
    // }, [formData.category?.id, selectedAttributes, attrs]);
        

    const addAttribute = (attr: Attribute) => {
        const newAttribute: AttributeWithValue = {
            attribute: {
                id: attr.id,
                name: attr.name,
                dataType: attr.dataType,
                unit: attr.unit,
            },
            value: attr.dataType === 'decimal' ? 0 : ''
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

      const handleSubmit = () => {
        const productAttributes = selectedAttributes.map<ProductAttributeCreateRequest>(sa => ({attributeId: sa.attribute.id, value:sa.value.toString()}))   

        if(!formData?.category?.id) {
            onClose();
            return;
        }
        const request = {
                name: formData.name,
                description: formData.description,
                price: formData.price,
                stockQuantity: formData.stock,
                categoryId: formData.category.id,
                productAttributes: productAttributes
        }

        if(mode === "create") {
            addProduct(request)
        }
        else if(formData.id) {
            updateProduct({
                prodId: formData.id,
                data: request
            })
        }
        onClose();
    };

        const handleCategoryChange = (categoryId: number) => {
        console.log(categoryId);
        console.log(categories.find((c) => c.id === categoryId));
        setFormData({ ...formData, category: categories.find((c) => c.id === categoryId) });
        setSelectedAttributes([]);
    };

    const chooseAndUploadImage = (e: React.MouseEvent) => {
        e.preventDefault();
        fileInputRef.current?.click();
    };

    const handleFileSelected = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file || !formData.id) return;

        try {
            await uploadProductImage({
                productId: formData.id,
                file
            }).unwrap();

            e.target.value = "";

            console.log("Image uploaded successfully");
        } catch (err) {
            console.error("Image upload failed", err);
        }
    };

    const isError = isCategoryError || isAttributeError;
    const isLoading = isLoadingCategories || isLoadingAttributes;

    if (!isOpen || isLoading || isError) {
        return null;
    } 

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
                                value={formData.category?.id}
                                onChange={(e) => handleCategoryChange(Number(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
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

                    {(mode != "create") && (<div className="mt-6" >
                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-medium text-gray-700">
                                Image
                            </label>

                            <button
                                type="button"
                                onClick={chooseAndUploadImage}
                                className="px-3 py-2 border border-gray-300 rounded-lg"
                            >
                                Upload
                            </button>

                            <div className="border border-gray-300 rounded bg-gray-100 overflow-hidden align-center">
                                <div className="bg-white rounded-lg p-8">
                                    <ProductImageGallery
                                    images={formData.imageUrls ?? []}
                                    initialIndex={0}
                                    altPrefix={formData.name}
                                    className=""
                                    />
                                </div>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleFileSelected}
                            />
                        </div>
                    </div>)}

                    <div className="mt-8 border-t border-gray-200 pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Product Attributes</h3>
                            {formData.category && unselectedAttributes.length > 0 && (
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
                                    {unselectedAttributes.map(attr => (
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
                                {selectedAttributes.map((attrWithVal, index) => (
                                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {attrWithVal.attribute.name} {attrWithVal.attribute.unit && <span className="text-gray-500">({attrWithVal.attribute.unit})</span>}
                                            </label>
                                            <input
                                                type={attrWithVal.attribute.dataType === 'number' ? 'number' : 'text'}
                                                value={attrWithVal.value}
                                                onChange={(e) => updateAttributeValue(index, attrWithVal.attribute.dataType === 'number' ? Number(e.target.value) : e.target.value)}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder={`Enter ${attrWithVal.attribute.name.toLowerCase()}`}
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
                            onClick={handleSubmit}
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
