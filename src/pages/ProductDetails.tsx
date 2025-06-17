import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/api";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const queryClient = useQueryClient();

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => api.getProduct(Number(id)),
    enabled: !!id,
  });

  const { mutate: purchase } = useMutation({
    mutationFn: (qty: number) => api.purchaseProduct(Number(id), qty),
    onSuccess: () => {
      toast({
        title: "✅ Purchase Successful",
        description: `${quantity} × ${product?.name} purchased successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
    },
    onError: (err: any) => {
      toast({
        title: "❌ Purchase Failed",
        description: err?.message || "Unexpected error occurred.",
      });
    },
  });

  const handlePurchase = () => {
    if (product && quantity > 0 && quantity <= product.stock_level) {
      purchase(quantity);
    }
  };

  const isLowStock = product?.stock_level <= product?.low_stock_threshold;
  const isOutOfStock = product?.stock_level === 0;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-200 rounded-lg"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
        <Link to="/">
          <Button variant="outline">Back to Products</Button>
        </Link>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <nav className="mb-6">
        <Link to="/" className="text-sm text-blue-600 hover:underline">
          ← Back to Products
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Product Image Placeholder */}
        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-8xl text-gray-400">📦</span>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-sm text-muted-foreground mb-2">
              {product.category} • SKU: {product.sku}
            </p>
            <p className="text-4xl font-bold">${product.price.toFixed(2)}</p>
          </div>

          <div>
            {isOutOfStock ? (
              <Badge variant="destructive">Out of Stock</Badge>
            ) : isLowStock ? (
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                Low Stock ({product.stock_level} left)
              </Badge>
            ) : (
              <Badge variant="outline" className="text-green-600 border-green-600">
                In Stock ({product.stock_level} available)
              </Badge>
            )}
          </div>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700">
                {product.description || "No description available."}
              </p>
            </CardContent>
          </Card>

          {!isOutOfStock && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  max={product.stock_level}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.max(
                        1,
                        Math.min(product.stock_level, parseInt(e.target.value) || 1)
                      )
                    )
                  }
                  className="w-24 mt-1"
                />
              </div>

              <Button
                onClick={handlePurchase}
                size="lg"
                className="w-full"
                disabled={quantity <= 0 || quantity > product.stock_level}
              >
                Buy {quantity} × ${product.price.toFixed(2)} = $
                {(product.price * quantity).toFixed(2)}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
