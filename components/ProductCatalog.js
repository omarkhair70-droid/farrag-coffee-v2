'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './ProductCatalog.module.css';
import { addToCartMotion, cardHover, premiumButtonMotion, sectionReveal } from '../lib/motion';

const ALL_FILTER = 'all';

const normalize = (value = '') => value.toString().trim().toLowerCase();

const getSuitableFor = (product) => {
  const name = normalize(product.name);
  if (name.includes('برازيلي') && name.includes('سادة')) return 'مناسب لـ القهوة اليومية';
  if (name.includes('تركي') && name.includes('محوج')) return 'مناسب لـ ريحة محوج واضحة';
  if (name.includes('يمني')) return 'مناسب لـ الطعم التقيل';
  if (name.includes('إسبريسو') || name.includes('espresso')) return 'مناسب لـ المكاين';
  return 'مناسب لـ عشاق القهوة';
};

export default function ProductCatalog({ products, onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState(ALL_FILTER);
  const [searchTerm, setSearchTerm] = useState('');
  const [quantities, setQuantities] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(max-width: 699px)');
    const updateIsMobile = () => setIsMobile(mediaQuery.matches);

    updateIsMobile();
    mediaQuery.addEventListener('change', updateIsMobile);

    return () => mediaQuery.removeEventListener('change', updateIsMobile);
  }, []);

  const categories = useMemo(
    () => [
      { id: ALL_FILTER, label: 'الكل' },
      ...[...new Set(products.map((product) => product.category))].map((category) => ({
        id: category,
        label: category
      }))
    ],
    [products]
  );

  const filteredProducts = useMemo(() => {
    const term = normalize(searchTerm);

    return products.filter((product) => {
      const matchesCategory = activeCategory === ALL_FILTER || product.category === activeCategory;
      const matchesSearch =
        !term ||
        normalize(product.name).includes(term) ||
        normalize(product.category).includes(term) ||
        normalize(product.type).includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchTerm]);

  const setQuantity = (productId, nextQty) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, nextQty)
    }));
  };

  const getQuantity = (productId) => quantities[productId] ?? 1;

  const sectionAnimation = isMobile
    ? { initial: false, animate: { opacity: 1, y: 0 } }
    : {
        initial: sectionReveal.initial,
        whileInView: sectionReveal.whileInView,
        viewport: sectionReveal.viewport
      };

  return (
    <motion.section id="products" className="section" {...sectionAnimation} transition={sectionReveal.transition}>
      <div className={styles.headerRow}>
        <h2 className="sectionTitle">اختار قهوتك</h2>
        <p className={styles.subtitle}>كل منتج متجهّز بطحنة وطابع يخلّي الطلب واضح وسهل من أول مرة.</p>
      </div>

      <div className={styles.toolbar}>
        <input
          className={styles.search}
          placeholder="ابحث عن نوع القهوة المناسب..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          aria-label="بحث المنتجات"
          autoComplete="off"
        />
        <div className={styles.filters}>
          {categories.map((category) => (
            <motion.button
              key={category.id}
              className={`${styles.filterBtn} ${activeCategory === category.id ? styles.filterBtnActive : ''}`}
              onClick={() => setActiveCategory(category.id)}
              {...premiumButtonMotion}
            >
              {category.label}
            </motion.button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {filteredProducts.map((product) => {
          const quantity = getQuantity(product.id);
          const cardAnimation = isMobile
            ? { initial: false, animate: { opacity: 1, y: 0 } }
            : {
                initial: { opacity: 0, y: 24 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, amount: 0.15 }
              };

          return (
            <motion.article key={product.id} className={styles.card} {...cardAnimation} {...cardHover}>
              <div className={styles.content}>
                <div className={styles.topRow}>
                  <h3>{product.name}</h3>
                  <span className={styles.typePill}>{product.category} • {product.type}</span>
                </div>
                <p className={styles.description}>{product.description}</p>
                <p className={styles.suitable}>{getSuitableFor(product)}</p>
                <div className={styles.meta}>
                  <strong>{product.price} جنيه</strong>
                  <span>{product.weight}</span>
                </div>
                <div className={styles.actions}>
                  <div className={styles.qtyControls}>
                    <motion.button className="btn btnSecondary" onClick={() => setQuantity(product.id, quantity - 1)} {...premiumButtonMotion}>-</motion.button>
                    <span>{quantity}</span>
                    <motion.button className="btn btnSecondary" onClick={() => setQuantity(product.id, quantity + 1)} {...premiumButtonMotion}>+</motion.button>
                  </div>
                  <motion.button className="btn btnPrimary" onClick={() => onAddToCart(product, quantity)} {...addToCartMotion}>
                    أضف للسلة
                  </motion.button>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      {!filteredProducts.length ? <p className={styles.emptyState}>لا توجد منتجات مطابقة حالياً. جرّب فئة أو بحث مختلف.</p> : null}
    </motion.section>
  );
}
