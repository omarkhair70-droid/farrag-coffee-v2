'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './ProductCatalog.module.css';
import { addToCartMotion, cardHover, premiumButtonMotion, sectionReveal } from '../lib/motion';

const ALL_FILTER = 'all';

const normalize = (value = '') => value.toString().trim().toLowerCase();

export default function ProductCatalog({ products, onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState(ALL_FILTER);
  const [searchTerm, setSearchTerm] = useState('');
  const [quantities, setQuantities] = useState({});

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

  return (
    <motion.section
      id="products"
      className="section"
      initial={sectionReveal.initial}
      whileInView={sectionReveal.whileInView}
      viewport={sectionReveal.viewport}
      transition={sectionReveal.transition}
    >
      <div className={styles.headerRow}>
        <h2 className="sectionTitle">كتالوج المنتجات</h2>
        <p className={styles.subtitle}>اختيارات فاخرة محمصة بعناية لعشاق القهوة الأصيلة.</p>
      </div>

      <div className={styles.toolbar}>
        <input
          className={styles.search}
          placeholder="ابحث عن منتج أو نوع القهوة..."
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

          return (
            <motion.article key={product.id} className={styles.card} {...cardHover}>
              <div className={styles.imageWrap}>
                <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div className={styles.content}>
                <h3>{product.name}</h3>
                <p className={styles.description}>{product.description}</p>
                <div className={styles.tags}>
                  <span>{product.category}</span>
                  <span>{product.type}</span>
                  <span>{product.weight}</span>
                </div>
                <div className={styles.meta}>
                  <strong>{product.price} جنيه</strong>
                </div>
                <div className={styles.actions}>
                  <div className={styles.qtyControls}>
                    <motion.button
                      className="btn btnSecondary"
                      onClick={() => setQuantity(product.id, quantity - 1)}
                      {...premiumButtonMotion}
                    >
                      -
                    </motion.button>
                    <span>{quantity}</span>
                    <motion.button
                      className="btn btnSecondary"
                      onClick={() => setQuantity(product.id, quantity + 1)}
                      {...premiumButtonMotion}
                    >
                      +
                    </motion.button>
                  </div>
                  <motion.button
                    className="btn btnPrimary"
                    onClick={() => onAddToCart(product, quantity)}
                    {...addToCartMotion}
                  >
                    أضف للسلة
                  </motion.button>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      {!filteredProducts.length ? (
        <p className={styles.emptyState}>لا توجد منتجات مطابقة حالياً. جرّب تغيير الفئة أو البحث.</p>
      ) : null}
    </motion.section>
  );
}
