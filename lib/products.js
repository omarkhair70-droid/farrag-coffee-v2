import fallbackProducts from '../data/products';

const normalizeProduct = (product = {}) => {
  const price = Number(product.price);

  if (
    typeof product.id !== 'string' ||
    typeof product.name !== 'string' ||
    typeof product.category !== 'string' ||
    typeof product.type !== 'string' ||
    typeof product.weight !== 'string' ||
    typeof product.description !== 'string' ||
    Number.isNaN(price)
  ) {
    return null;
  }

  return {
    id: product.id,
    name: product.name,
    category: product.category,
    type: product.type,
    weight: product.weight,
    price,
    description: product.description,
    image: product.image || null,
    is_active: typeof product.is_active === 'boolean' ? product.is_active : true,
    sort_order: Number.isInteger(product.sort_order) ? product.sort_order : 0
  };
};

export const getFallbackProducts = () =>
  fallbackProducts.map((product, index) => ({
    ...product,
    is_active: true,
    sort_order: index
  }));

export const normalizeProducts = (products = []) => {
  if (!Array.isArray(products)) return [];

  return products
    .map(normalizeProduct)
    .filter(Boolean)
    .sort((a, b) => {
      if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
      return a.name.localeCompare(b.name, 'ar');
    });
};
