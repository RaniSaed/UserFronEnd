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

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody?.error || `HTTP error! status: ${response.status}`;
    throw new Error(message);
  }
  return response.json();
};

export const api = {
  /**
   * שליפת כל המוצרים
   */
  async getProducts(): Promise<Product[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/products`);
      return await handleResponse(res);
    } catch (error) {
      console.error('❌ Failed to fetch products:', error);
      throw error;
    }
  },

  /**
   * שליפת מוצר לפי מזהה
   */
  async getProduct(id: number): Promise<Product> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${id}`);
      return await handleResponse(res);
    } catch (error) {
      console.error(`❌ Failed to fetch product [id=${id}]:`, error);
      throw error;
    }
  },

  /**
   * רכישת מוצר לפי מזהה וכמות
   */
  async purchaseProduct(productId: number, quantity: number): Promise<void> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/products/${productId}/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
      await handleResponse(res);
    } catch (error) {
      console.error(`❌ Failed to purchase product [id=${productId}]:`, error);
      throw error;
    }
  },
};
