export interface PartOption {
  _id: string;
  categoryId: string;
  basePrice: number;
  stock: number;
  image?: {
    main: string;
  };
  translations: {
    [lang: string]: {
      label: string;
    };
  };
}

export interface ProductDetailDto {
  slug: string;
  name: string;
  image: string;
  translations: {
    [lang: string]: {
      name: string;
      description?: string;
    };
  };
  categories: string[];
  availableOptions: Record<string, string[]>;
  partOptions: PartOption[];
}
