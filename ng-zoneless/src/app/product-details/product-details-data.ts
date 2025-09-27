export type Product = {
    id: number;
    name: string;
    price: number;
    inStock: boolean;
};

export const PRODUCTS: Product[] = Array.from({ length: 8 }, (_, i) => ({
    id: 1000 + i,
    name: ['Desk Chair','Standing Desk','Monitor Arm','LED Lamp','USB Hub','Laptop Stand','Keyboard','Mouse'][i % 8],
    price: Math.round((79 + Math.random() * 320) * 100) / 100,
    inStock: Math.random() > 0.3,
}));