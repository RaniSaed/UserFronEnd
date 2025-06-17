import React from 'react';
import { Link } from 'react-router-dom';
import { Product, api } from '@/api/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isLowStock = product.stock_level <= product.low_stock_threshold;
  const isOutOfStock = product.stock_level === 0;

  const { mutate: purchase } = useMutation({
    mutationFn: (qty: number) => api.purchaseProduct(product.id, qty),
    onSuccess: () => {
      toast({
        title: '✅ Success',
        description: `${product.name} purchased successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err: any) => {
      toast({
        title: '❌ Failed',
        description: err?.message || 'Unexpected error',
      });
    },
  });

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) purchase(1);
  };

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="group hover:shadow-lg transition-shadow duration-300 cursor-pointer">
        <CardContent className="p-4 flex flex-col items-center text-center">
          <div className="bg-gray-100 rounded-lg aspect-square w-full flex items-center justify-center mb-4 group-hover:bg-gray-200">
            <span className="text-5xl">📦</span>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500">{product.category}</p>
          <p className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</p>

          <div className="mt-2">
            {isOutOfStock ? (
              <Badge variant="destructive">Out of Stock</Badge>
            ) : isLowStock ? (
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                Low ({product.stock_level})
              </Badge>
            ) : (
              <Badge variant="outline" className="text-green-600 border-green-600">
                In Stock ({product.stock_level})
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="px-4 pb-4">
          <Button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className="w-full"
            variant={isOutOfStock ? 'secondary' : 'default'}
          >
            {isOutOfStock ? 'Out of Stock' : 'Buy Now'}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;
