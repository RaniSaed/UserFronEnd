const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock_level: number;
  description: string;
  low_stock_threshold: number;
  category: string;
}

export const api = {
  // שליפת כל המוצרים
  async getProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/products`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched products:', data);
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // שליפת מוצר לפי מזהה
  async getProduct(id: number): Promise<Product> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched product:', data);
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // רכישת מוצר לפי מזהה וכמות
  async purchaseProduct(productId: number, quantity: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/user/products/${productId}/purchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error?.error || 'Purchase failed');
    }
  }
};
