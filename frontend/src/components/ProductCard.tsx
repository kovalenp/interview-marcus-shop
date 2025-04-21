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
    <Link href={`/product/${slug}`} className="block group">
      <div className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
        <div className="relative w-full h-48">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
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
