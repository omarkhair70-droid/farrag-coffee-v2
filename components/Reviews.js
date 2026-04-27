import { motion } from 'framer-motion';
import styles from './Reviews.module.css';
import { cardHover, sectionReveal } from '../lib/motion';

const reviews = [
  { quote: 'ريحة البن لوحدها كفاية تخليك تعرف إنك اخترت صح.', label: 'عميل من المنطقة' },
  { quote: 'التحويج مضبوط والطعم ثابت كل مرة.', label: 'طلب قهوة محوج' },
  { quote: 'طلبت على واتساب ووصلني كل حاجة واضحة وسهلة.', label: 'تجربة واتساب' }
];

export default function Reviews() {
  return (
    <motion.section className="section" initial={sectionReveal.initial} whileInView={sectionReveal.whileInView} viewport={sectionReveal.viewport} transition={sectionReveal.transition}>
      <h2 className="sectionTitle">آراء العملاء</h2>
      <div className={styles.grid}>
        {reviews.map((review) => (
          <motion.article key={review.label} className={styles.card} {...cardHover}>
            <p>{review.quote}</p>
            <span>{review.label}</span>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}
