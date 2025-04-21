'use client';

import { PartOption } from '@/types/product';
import { useState } from 'react';

type Violation = {
  message: string;
  affectedCategory: string;
  excludedOptions?: string[];
  requiredOptions?: string[];
};

type Props = {
  selectedOptions: PartOption[];
  totalPrice: number;
  violations: Violation[];
  effectivePrices?: Record<string, number>;
};

export default function SummaryPanel({
  selectedOptions,
  totalPrice,
  violations,
  effectivePrices,
}: Props) {
  const [showPopup, setShowPopup] = useState(false);
  const canSubmit = violations.length === 0 && selectedOptions.length > 0;

  const handleClick = () => {
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1250);
  };

  return (
    <div className="w-full max-w-xs flex-shrink-0 border-l pt-2 pl-6">
      <h2 className="mb-4 text-lg font-semibold">Your Configuration</h2>

      <ul className="mb-6 space-y-2 text-sm">
        {selectedOptions.map((part) => {
          const price = effectivePrices?.[part._id] ?? part.basePrice;
          return (
            <li key={part._id} className="flex justify-between">
              <span>{part.translations.en?.label ?? part._id}</span>
              <span className="text-gray-700">€{price}</span>
            </li>
          );
        })}
        {selectedOptions.length === 0 && (
          <li className="text-gray-400 italic">No parts selected yet.</li>
        )}
      </ul>

      {violations.length > 0 && (
        <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          <ul className="list-inside list-disc space-y-1">
            {violations.map((v, i) => (
              <li key={i}>{v.message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="border-t pt-4">
        <div className="mb-4 flex justify-between text-base font-medium">
          <span>Total:</span>
          <span>€{totalPrice}</span>
        </div>

        <button
          onClick={handleClick}
          disabled={!canSubmit}
          className={`w-full rounded px-4 py-2 text-white transition ${
            canSubmit
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'cursor-not-allowed bg-blue-500 opacity-50'
          }`}
        >
          Add to Cart
        </button>

        {showPopup && (
          <div className="mt-4 rounded border border-green-300 bg-green-50 p-3 text-sm text-green-800">
            ✅ We are going to ship it! 🛒🚴‍♂️
          </div>
        )}
      </div>
    </div>
  );
}
