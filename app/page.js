'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from '../components/Header';
import Hero from '../components/Hero';
import BrandIntro from '../components/BrandIntro';
import CoffeeRitual from '../components/CoffeeRitual';
import CoffeeGuide from '../components/CoffeeGuide';
import ProductCatalog from '../components/ProductCatalog';
import WhyFarrag from '../components/WhyFarrag';
import Cart from '../components/Cart';
import MenuPreview from '../components/MenuPreview';
import Reviews from '../components/Reviews';
import Contact from '../components/Contact';
import products from '../data/products';

export default function HomePage() {
  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast] = useState('');

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });

    setToast(`تمت إضافة ${quantity} × ${product.name} إلى السلة`);
    setTimeout(() => setToast(''), 2200);
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

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  return (
    <main>
      <Header />
      <Hero />
      <BrandIntro />
      <CoffeeRitual />
      <CoffeeGuide />
      <ProductCatalog products={products} onAddToCart={addToCart} />
      <WhyFarrag />
      <Cart items={cartItems} total={total} onUpdateQuantity={updateQuantity} onRemoveItem={removeItem} />
      <MenuPreview />
      <Reviews />
      <Contact />
      <AnimatePresence>
        {toast ? (
          <motion.div
            className="toast"
            initial={{ opacity: 0, y: 16, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 8, x: '-50%' }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
