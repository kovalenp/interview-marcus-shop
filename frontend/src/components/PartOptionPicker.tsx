'use client';

import Image from 'next/image';
import { PartOption } from '@/types/product';

interface Props {
  category: string;
  options: PartOption[];
  selectedId?: string;
  availableIds: string[];
  // eslint-disable-next-line no-unused-vars
  onSelect: (optionId: string) => void;
  effectivePrices?: Record<string, number>;
}

export default function PartOptionPicker({
  category,
  options,
  selectedId,
  availableIds,
  onSelect,
  effectivePrices = {},
}: Props) {
  return (
    <div className="mb-10">
      <h3 className="mb-4 text-xl font-semibold tracking-wide capitalize">
        {category.replace(/_/g, ' ')}
      </h3>

      <div className="flex flex-wrap justify-center gap-6 sm:justify-start">
        {options.map((option) => {
          const isSelected = selectedId === option._id;
          const isDisabled = !availableIds.includes(option._id);
          const label = option.translations.en?.label || option._id;
          const displayPrice =
            effectivePrices?.[option._id] ?? option.basePrice;

          return (
            <button
              key={option._id}
              className={`relative flex h-52 w-48 flex-col items-center justify-between rounded-xl border p-4 text-center text-base transition ${isSelected ? 'border-blue-600 ring-2 ring-blue-300' : 'border-gray-300'} ${isDisabled ? 'cursor-not-allowed opacity-50' : 'hover:border-blue-400'} `}
              disabled={isDisabled}
              onClick={() => onSelect(option._id)}
              title={
                isDisabled
                  ? 'This option is not available based on your selection'
                  : label
              }
            >
              <div className="relative h-24 w-full">
                {option.image?.main && (
                  <Image
                    src={option.image.main}
                    alt={label}
                    fill
                    className="object-contain"
                  />
                )}
              </div>

              <span className="mt-3 font-semibold">{label}</span>
              <span className="text-lg font-bold text-gray-800">
                €{displayPrice}
              </span>

              {isSelected && (
                <span className="absolute top-2 right-2 text-xl text-blue-600">
                  ✔️
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
