'use client';

import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/services/api';
import ProductCard from '@/components/ProductCard';

export default function HomePage() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  if (isLoading) {
    return <p className="p-6 text-center text-gray-500">Loading products...</p>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Available Products
      </h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {products?.map((product: any) => (
          <ProductCard
            key={product.slug}
            slug={product.slug}
            name={product.name}
            image={product.image}
          />
        ))}
      </div>
    </div>
  );
}
