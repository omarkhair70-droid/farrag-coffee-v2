'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './ProductCatalog.module.css';
import { addToCartMotion, cardHover, premiumButtonMotion, sectionReveal } from '../lib/motion';

const ALL_FILTER = 'all';
const whatsappNumber = '201005009908';
const grindOptions = ['ناعم تركي', 'وسط', 'خشن', 'إسبريسو', 'بدون طحن'];

const normalize = (value = '') => value.toString().trim().toLowerCase();

const getSuitableFor = (product) => {
  const name = normalize(product.name);
  if (name.includes('برازيلي') && name.includes('سادة')) return 'مناسب للقهوة اليومية';
  if (name.includes('تركي') && name.includes('محوج')) return 'مناسب لمحبي الريحة المحوجة';
  if (name.includes('يمني')) return 'مناسب للطعم التقيل';
  if (name.includes('إسبريسو') || name.includes('espresso')) return 'مناسب للمكاين';
  return 'مناسب لعشاق القهوة';
};

const getDefaultGrind = (product) => {
  const fullName = normalize(`${product.name} ${product.category}`);
  return fullName.includes('إسبريسو') || fullName.includes('espresso') ? 'إسبريسو' : 'ناعم تركي';
};

export default function ProductCatalog({ products, onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState(ALL_FILTER);
  const [searchTerm, setSearchTerm] = useState('');
  const [quantities, setQuantities] = useState({});
  const [grinds, setGrinds] = useState({});
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

  const setGrind = (productId, grind) => {
    setGrinds((prev) => ({
      ...prev,
      [productId]: grind
    }));
  };

  const getGrind = (product) => grinds[product.id] ?? getDefaultGrind(product);

  const handleQuickWhatsApp = (product, quantity, grind) => {
    const total = product.price * quantity;
    const message = encodeURIComponent(
      `مرحباً بن فراج، أريد طلب:\nالمنتج: ${product.name}\nالطحنة: ${grind}\nالكمية: ${quantity}\nالسعر: ${product.price} جنيه\nالإجمالي: ${total} جنيه\nمن موقع بن فراج.`
    );

    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

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
        {filteredProducts.map((product, index) => {
          const quantity = getQuantity(product.id);
          const grind = getGrind(product);
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
                  <span className={styles.blendNo}>{String(index + 1).padStart(2, '0')}</span>
                  <span className={styles.typePill}>{product.category} • {product.type}</span>
                </div>
                <h3>{product.name}</h3>
                <p className={styles.description}>{product.description}</p>
                <p className={styles.suitable}>{getSuitableFor(product)}</p>
                <p className={styles.signature}>Farrag Blend • طحن طازة</p>
                <div className={styles.meta}>
                  <strong>{product.price} جنيه</strong>
                  <span>{product.weight}</span>
                </div>

                <label className={styles.grindWrap}>
                  <span className={styles.grindLabel}>اختار الطحنة</span>
                  <select className={styles.grindSelect} value={grind} onChange={(event) => setGrind(product.id, event.target.value)}>
                    {grindOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <div className={styles.actions}>
                  <div className={styles.qtyControls}>
                    <motion.button className="btn btnSecondary" onClick={() => setQuantity(product.id, quantity - 1)} {...premiumButtonMotion}>-</motion.button>
                    <span>{quantity}</span>
                    <motion.button className="btn btnSecondary" onClick={() => setQuantity(product.id, quantity + 1)} {...premiumButtonMotion}>+</motion.button>
                  </div>
                  <div className={styles.ctaRow}>
                    <motion.button className={`btn btnPrimary ${styles.compactBtn}`} onClick={() => onAddToCart(product, quantity, grind)} {...addToCartMotion}>
                      أضف للسلة
                    </motion.button>
                    <motion.button
                      className={`btn btnSecondary ${styles.compactBtn}`}
                      onClick={() => handleQuickWhatsApp(product, quantity, grind)}
                      {...premiumButtonMotion}
                    >
                      اطلبه فورًا
                    </motion.button>
                  </div>
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
