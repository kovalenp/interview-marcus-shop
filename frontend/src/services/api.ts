import { ProductDetailDto } from '@/types/product';
import { fetchWithCorrelationId } from '././helper';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050';

export async function getProducts() {
  const res = await fetchWithCorrelationId(`${BASE_URL}/products`);
  return res.json();
}

export async function getProductDetail(
  slug: string
): Promise<ProductDetailDto> {
  const res = await fetchWithCorrelationId(`${BASE_URL}/products/${slug}`);
  return res.json();
}

export async function postProductResolve(
  slug: string,
  selected: Record<string, string>
) {
  const res = await fetchWithCorrelationId(
    `${BASE_URL}/products/${slug}/resolve`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ selected }),
    }
  );

  if (!res.ok) {
    throw new Error('Failed to resolve constraints');
  }

  return res.json();
}
