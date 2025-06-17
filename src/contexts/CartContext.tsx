import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { Product } from '@/api/api';

// ---------- Interfaces ----------
export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: number; quantity: number } }
  | { type: 'CLEAR_CART' };

interface CartContextType extends CartState {
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
}

// ---------- Context ----------
const CartContext = createContext<CartContextType | undefined>(undefined);

// ---------- Helpers ----------
const calculateTotal = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

// ---------- Reducer ----------
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === action.payload.product.id
      );

      let updatedItems: CartItem[];

      if (existingIndex !== -1) {
        updatedItems = [...state.items];
        updatedItems[existingIndex].quantity += action.payload.quantity;
      } else {
        updatedItems = [...state.items, { ...action.payload }];
      }

      return { items: updatedItems, total: calculateTotal(updatedItems) };
    }

    case 'REMOVE_FROM_CART': {
      const filtered = state.items.filter(
        (item) => item.product.id !== action.payload.productId
      );
      return { items: filtered, total: calculateTotal(filtered) };
    }

    case 'UPDATE_QUANTITY': {
      const updated = state.items
        .map((item) =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
        .filter((item) => item.quantity > 0);

      return { items: updated, total: calculateTotal(updated) };
    }

    case 'CLEAR_CART':
      return { items: [], total: 0 };

    default:
      return state;
  }
};

// ---------- Provider ----------
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  const addToCart = useCallback((product: Product, quantity: number) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId } });
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const getTotalItems = useCallback(() => {
    return state.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [state.items]);

  const value = useMemo(
    () => ({
      ...state,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
    }),
    [state, addToCart, removeFromCart, updateQuantity, clearCart, getTotalItems]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// ---------- Hook ----------
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('❌ useCart must be used within a CartProvider');
  }
  return context;
};
