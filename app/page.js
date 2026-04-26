'use client';

import { useMemo, useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductCatalog from '@/components/ProductCatalog';
import Cart from '@/components/Cart';
import MenuPreview from '@/components/MenuPreview';
import Reviews from '@/components/Reviews';
import Contact from '@/components/Contact';

const products = [
  { id: 1, name: 'برازيلي سادة', category: 'قهوة عربية', weight: '250 جم', price: 60, image: 'https://images.unsplash.com/photo-1497935586047-9397fe4794c0?auto=format&fit=crop&w=800&q=80' },
  { id: 2, name: 'برازيلي محوج', category: 'قهوة عربية', weight: '250 جم', price: 60, image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80' },
  { id: 3, name: 'تركي سادة', category: 'قهوة تركية', weight: '250 جم', price: 50, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80' },
  { id: 4, name: 'تركي محوج', category: 'قهوة تركية', weight: '250 جم', price: 50, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80' },
  { id: 5, name: 'يمني سادة', category: 'قهوة يمنية', weight: '250 جم', price: 80, image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80' },
  { id: 6, name: 'يمني محوج', category: 'قهوة يمنية', weight: '250 جم', price: 85, image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80' },
  { id: 7, name: 'إسبريسو', category: 'إسبريسو', weight: '1000 جم', price: 300, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80' }
];

export default function HomePage() {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, nextQuantity) => {
    setCartItems((prev) => {
      if (nextQuantity <= 0) {
        return prev.filter((item) => item.id !== id);
      }
      return prev.map((item) =>
        item.id === id ? { ...item, quantity: nextQuantity } : item
      );
    });
  };

  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  return (
    <main>
      <Header />
      <Hero />
      <ProductCatalog products={products} onAddToCart={addToCart} />
      <Cart items={cartItems} total={total} onUpdateQuantity={updateQuantity} />
      <MenuPreview />
      <Reviews />
      <Contact />
    </main>
  );
}
