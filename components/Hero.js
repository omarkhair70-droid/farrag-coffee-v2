import styles from './Hero.module.css';
import { motion } from 'framer-motion';
import { premiumButtonMotion, sectionReveal } from '../lib/motion';

export default function Hero() {
  return (
    <motion.section
      className={`${styles.hero} section`}
      initial={sectionReveal.initial}
      whileInView={sectionReveal.whileInView}
      viewport={sectionReveal.viewport}
      transition={sectionReveal.transition}
    >
      <p className={styles.badge}>بن فراج</p>
      <h1>طعم القهوة الأصلي</h1>
      <p className={styles.subtext}>
        اختار قهوتك، حدد الكمية، وابعت طلبك على واتساب بخطوة واحدة.
      </p>
      <div className={styles.actions}>
        <motion.a href="#products" className="btn btnPrimary" {...premiumButtonMotion}>
          ابدأ الطلب
        </motion.a>
        <motion.a href="#products" className="btn btnSecondary" {...premiumButtonMotion}>
          شوف المنتجات
        </motion.a>
      </div>
    </motion.section>
  );
}
