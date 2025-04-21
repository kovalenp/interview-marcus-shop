'use client';

import { useState, useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import { postProductResolve } from '@/services/api';
import PartOptionPicker from './PartOptionPicker';
import { ProductDetailDto } from '@/types/product';
import SummaryPanel from './SummaryPanel';

export default function ProductCustomizer({
  product,
}: {
  product: ProductDetailDto;
}) {
  const [effectivePrices, setEffectivePrices] = useState<
    Record<string, number>
  >({});
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
      setEffectivePrices(result.effectivePrices);
    },
    onError: () => {
      setViolations([
        { message: 'Failed to resolve configuration.', affectedCategory: '' },
      ]);
      setEffectivePrices({});
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
      .filter((option): option is ProductDetailDto['partOptions'][number] =>
        Boolean(option)
      );
  }, [selected, product.partOptions]);

  const totalPrice = selectedOptions.reduce(
    (sum, part) => sum + (part?.basePrice || 0),
    0
  );

  const blockingViolations = useMemo(
    () => violations.filter((v) => !v.excludedOptions),
    [violations]
  );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 lg:flex-row lg:items-start lg:justify-center">
      <div className="flex-1 space-y-6">
        {product.categories.map((category) => (
          <PartOptionPicker
            key={category}
            category={category}
            options={optionsByCategory[category]}
            selectedId={selected[category]}
            availableIds={available[category] || []}
            onSelect={(id) => handleSelect(category, id)}
            effectivePrices={effectivePrices}
          />
        ))}
      </div>
      <SummaryPanel
        selectedOptions={selectedOptions}
        totalPrice={totalPrice}
        violations={blockingViolations}
        effectivePrices={effectivePrices}
      />{' '}
    </div>
  );
}
