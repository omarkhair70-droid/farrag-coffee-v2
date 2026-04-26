import Image from 'next/image';
import styles from './ProductCatalog.module.css';

export default function ProductCatalog({ products, onAddToCart }) {
  return (
    <section id="products" className="section">
      <h2 className="sectionTitle">كتالوج المنتجات</h2>
      <div className={styles.grid}>
        {products.map((product) => (
          <article key={product.id} className={styles.card}>
            <div className={styles.imageWrap}>
              <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
            <div className={styles.content}>
              <h3>{product.name}</h3>
              <p>{product.category}</p>
              <div className={styles.meta}>
                <span>{product.weight}</span>
                <strong>{product.price} جنيه</strong>
              </div>
              <button className="btn btnPrimary" onClick={() => onAddToCart(product)}>
                أضف للسلة
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
