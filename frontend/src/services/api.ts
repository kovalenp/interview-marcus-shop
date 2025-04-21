// src/services/api.ts
import { ProductDetailDto } from '@/types/product';

const BASE_URL = 'http://localhost:5050';

export async function getProducts() {
  const res = await fetch(`${BASE_URL}/products`);
  return res.json();
}

export async function getProductDetail(
  slug: string
): Promise<ProductDetailDto> {
  const res = await fetch(`${BASE_URL}/products/${slug}`);
  return res.json();
}

export async function postProductResolve(
  slug: string,
  selected: Record<string, string>
) {
  const res = await fetch(`${BASE_URL}/products/${slug}/resolve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ selected }),
  });

  if (!res.ok) {
    throw new Error('Failed to resolve constraints');
  }

  return res.json();
}
