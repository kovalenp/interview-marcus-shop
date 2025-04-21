'use client';

import Link from 'next/link';
import Image from 'next/image';

export interface ProductCardProps {
  slug: string;
  name: string;
  image: string;
}

export default function ProductCard({ slug, name, image }: ProductCardProps) {
  return (
    <Link href={`/product/${slug}`} className="group block">
      <div className="overflow-hidden rounded-xl border shadow-sm transition hover:shadow-md">
        <div className="relative h-48 w-full">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600">
            {name}
          </h2>
        </div>
      </div>
    </Link>
  );
}
