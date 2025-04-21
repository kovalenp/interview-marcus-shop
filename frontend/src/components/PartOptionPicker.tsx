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
}

export default function PartOptionPicker({
  category,
  options,
  selectedId,
  availableIds,
  onSelect,
}: Props) {
  return (
    <div className="mb-6">
      <h3 className="text-md mb-2 font-medium capitalize">
        {category.replace(/_/g, ' ')}
      </h3>
      <div className="flex flex-wrap gap-4">
        {options.map((option) => {
          const isSelected = selectedId === option._id;
          const isDisabled = !availableIds.includes(option._id);
          const label = option.translations.en?.label || option._id;

          return (
            <button
              key={option._id}
              className={`relative flex h-28 w-24 flex-col items-center justify-between rounded-md border p-2 text-center text-xs ${isSelected ? 'border-blue-600 ring-2 ring-blue-300' : 'border-gray-200'} ${isDisabled ? 'cursor-not-allowed opacity-50' : 'hover:border-blue-400'}`}
              disabled={isDisabled}
              onClick={() => onSelect(option._id)}
              title={
                isDisabled
                  ? 'This option is not available based on your selection'
                  : label
              }
            >
              <div className="relative h-16 w-full">
                {option.image?.main && (
                  <Image
                    src={option.image.main}
                    alt={label}
                    fill
                    className="object-contain"
                  />
                )}
              </div>
              <span className="mt-2">{label}</span>
              <span className="mt-0.5 text-xs text-gray-600">
                €{option.basePrice}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
