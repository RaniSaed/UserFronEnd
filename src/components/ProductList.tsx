import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api, Product } from "@/api/api";
import ProductCard from "./ProductCard";

const ProductList: React.FC = () => {
  const {
    data: products,
    isLoading,
    error,
  } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: api.getProducts,
  });

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm border p-6 animate-pulse"
        >
          <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderError = () => (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">
        Error Loading Products
      </h2>
      <p className="text-gray-600 mb-2">
        Please ensure the backend is reachable on{" "}
        <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:5000</code>
      </p>
      <p className="text-sm text-gray-500">
        Error: {error instanceof Error ? error.message : "Unknown error"}
      </p>
    </div>
  );

  const renderEmpty = () => (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        No Products Found
      </h2>
      <p className="text-gray-600">No products are currently available.</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Products</h1>
        <p className="text-gray-600">
          Discover our amazing collection of products
        </p>
      </div>

      {isLoading && renderSkeleton()}
      {error && renderError()}
      {!isLoading && !error && (!products || products.length === 0) && renderEmpty()}

      {!isLoading && !error && products && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
