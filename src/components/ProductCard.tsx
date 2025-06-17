
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/api/api';
import { useCart } from '@/contexts/CartContext';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock_level > 0) {
      addToCart(product, 1);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  const isLowStock = product.stock_level <= product.low_stock_threshold;
  const isOutOfStock = product.stock_level === 0;

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
        <CardContent className="p-6">
          <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center group-hover:bg-gray-50 transition-colors">
            <div className="text-4xl text-gray-400">📦</div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
              {product.name}
            </h3>
            
            <p className="text-sm text-gray-500 uppercase tracking-wide">
              {product.category}
            </p>
            
            <p className="text-2xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </p>
            
            <div className="flex items-center space-x-2">
              {isOutOfStock ? (
                <Badge variant="destructive">Out of Stock</Badge>
              ) : isLowStock ? (
                <Badge variant="outline" className="text-orange-600 border-orange-600">
                  Low Stock ({product.stock_level})
                </Badge>
              ) : (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  In Stock ({product.stock_level})
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-6 pt-0">
          <Button 
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="w-full"
            variant={isOutOfStock ? "secondary" : "default"}
          >
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;
