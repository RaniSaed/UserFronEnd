
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
  async getProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`);
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
  }
};
