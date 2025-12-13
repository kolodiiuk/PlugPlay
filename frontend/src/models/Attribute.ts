export interface Attribute {
  id: number;
  name: string;
  unit?: string;
  dataType: string;
  productAttributeDtos: ProductAttribute[]
}

export interface ProductAttribute {
  id: number;
  attributeId: number;
  productId: number;
  strValue?: string;
  numValue?: number;
}
