import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={`${styles.hero} section`}>
      <p className={styles.badge}>بن فراج</p>
      <h1>طعم القهوة الأصلي</h1>
      <p className={styles.subtext}>
        اختار قهوتك، حدد الكمية، وابعت طلبك على واتساب بخطوة واحدة.
      </p>
      <div className={styles.actions}>
        <a href="#products" className="btn btnPrimary">ابدأ الطلب</a>
        <a href="#products" className="btn btnSecondary">شوف المنتجات</a>
      </div>
    </section>
  );
}
