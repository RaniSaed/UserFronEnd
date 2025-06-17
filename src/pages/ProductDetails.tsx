
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/api';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.getProduct(Number(id)),
    enabled: !!id,
  });

  const handleAddToCart = () => {
    if (product && quantity > 0 && quantity <= product.stock_level) {
      addToCart(product, quantity);
      toast({
        title: "Added to cart",
        description: `${quantity} ${product.name}(s) added to your cart.`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
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
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Link to="/">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isLowStock = product.stock_level <= product.low_stock_threshold;
  const isOutOfStock = product.stock_level === 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-6">
        <Link to="/" className="text-blue-600 hover:text-blue-800 text-sm">
          ← Back to Products
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-8xl text-gray-400">📦</div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-4">
              {product.category} • SKU: {product.sku}
            </p>
            <p className="text-4xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
          </div>

          <div className="flex items-center space-x-2">
            {isOutOfStock ? (
              <Badge variant="destructive">Out of Stock</Badge>
            ) : isLowStock ? (
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                Low Stock ({product.stock_level} remaining)
              </Badge>
            ) : (
              <Badge variant="outline" className="text-green-600 border-green-600">
                In Stock ({product.stock_level} available)
              </Badge>
            )}
          </div>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description || "No description available for this product."}
              </p>
            </CardContent>
          </Card>

          {!isOutOfStock && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="quantity" className="text-sm font-medium">
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={product.stock_level}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock_level, parseInt(e.target.value) || 1)))}
                  className="w-24 mt-1"
                />
              </div>

              <Button 
                onClick={handleAddToCart}
                size="lg"
                className="w-full"
                disabled={quantity <= 0 || quantity > product.stock_level}
              >
                Add {quantity} to Cart - ${(product.price * quantity).toFixed(2)}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
