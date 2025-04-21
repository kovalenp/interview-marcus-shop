'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getProductDetail } from '@/services/api';
import ProductCustomizer from '@/components/ProductCustomizer';

export default function ProductDetailPage() {
  const { slug } = useParams();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProductDetail(slug as string),
    enabled: !!slug,
  });

  if (isLoading) return <p className="p-6">Loading product...</p>;
  if (!product) return <p className="p-6 text-red-600">Product not found</p>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-bold">{product.name}</h1>
      <ProductCustomizer product={product} />
    </div>
  );
}
