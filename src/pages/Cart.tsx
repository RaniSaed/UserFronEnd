import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const Cart: React.FC = () => {
  const { items, total, updateQuantity, removeFromCart, getTotalItems } = useCart();

  if (items.length === 0) {
    return (
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
        <p className="text-gray-600 mb-8">You haven’t added any products yet.</p>
        <Link to="/">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map(({ product, quantity }) => (
            <Card key={product.id}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-2xl text-gray-400">
                    📦
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-1">
                      {product.category} • SKU: {product.sku}
                    </p>
                    <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-2">
                      <label htmlFor={`qty-${product.id}`} className="text-sm text-gray-600">
                        Qty:
                      </label>
                      <Input
                        id={`qty-${product.id}`}
                        type="number"
                        min={1}
                        max={product.stock_level}
                        value={quantity}
                        onChange={(e) => {
                          const val = Math.max(1, Math.min(product.stock_level, parseInt(e.target.value) || 1));
                          updateQuantity(product.id, val);
                        }}
                        className="w-20"
                      />
                    </div>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeFromCart(product.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>

                <div className="mt-4 text-right">
                  <span className="text-sm font-medium text-gray-600">Subtotal:</span>{" "}
                  <span className="text-lg font-semibold">${(product.price * quantity).toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Items ({getTotalItems()})</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <Link to="/checkout">
                <Button size="lg" className="w-full">Proceed to Checkout</Button>
              </Link>

              <Link to="/">
                <Button variant="outline" size="lg" className="w-full">Continue Shopping</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Cart;
