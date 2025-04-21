'use client';

import { useState, useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import { postProductResolve } from '@/services/api';
import PartOptionPicker from './PartOptionPicker';
import { ProductDetailDto } from '@/types/product';

export default function ProductCustomizer({
  product,
}: {
  product: ProductDetailDto;
}) {
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [available, setAvailable] = useState(product.availableOptions);
  const [violations, setViolations] = useState<
    {
      message: string;
      affectedCategory: string;
      excludedOptions?: string[];
      requiredOptions?: string[];
    }[]
  >([]);

  const resolver = useMutation({
    mutationFn: () => postProductResolve(product.slug, selected),
    onSuccess: (result) => {
      setAvailable(result.availableOptions);
      setViolations(result.violations);
    },
    onError: () => {
      setViolations([
        {
          message: 'Failed to resolve configuration. Please try again.',
          affectedCategory: '',
        },
      ]);
    },
  });

  const handleSelect = (category: string, optionId: string) => {
    const isSame = selected[category] === optionId;
    const updated = { ...selected };

    if (isSame) {
      delete updated[category]; // deselect
    } else {
      updated[category] = optionId;
    }

    setSelected(updated);
    resolver.mutate();
  };

  const optionsByCategory = useMemo(() => {
    const map: Record<string, typeof product.partOptions> = {};
    for (const category of product.categories) {
      map[category] = product.partOptions.filter(
        (option) => option.categoryId === category
      );
    }
    return map;
  }, [product.categories, product.partOptions]);

  const selectedOptions = useMemo(() => {
    return Object.entries(selected)
      .map(([, id]) => product.partOptions.find((p) => p._id === id))
      .filter(Boolean);
  }, [selected, product.partOptions]);

  const totalPrice = selectedOptions.reduce(
    (sum, part) => sum + (part?.basePrice || 0),
    0
  );

  return (
    <div className="space-y-6">
      {product.categories.map((category) => (
        <PartOptionPicker
          key={category}
          category={category}
          options={optionsByCategory[category]}
          selectedId={selected[category]}
          availableIds={available[category] || []}
          onSelect={(id) => handleSelect(category, id)}
        />
      ))}

      {violations.length > 0 && (
        <div className="mt-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          <ul className="list-inside list-disc">
            {violations.map((v, i) => (
              <li key={i}>{v.message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between border-t pt-4">
        <div className="text-lg font-medium">Total: €{totalPrice}</div>
        <button
          disabled
          className="cursor-not-allowed rounded bg-blue-500 px-4 py-2 text-white opacity-50"
          title="Coming soon"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
