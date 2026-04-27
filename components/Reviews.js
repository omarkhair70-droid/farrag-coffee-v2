import { motion } from 'framer-motion';
import styles from './Reviews.module.css';
import { cardHover, sectionReveal } from '../lib/motion';

const reviews = [
  'خدمة ممتازة وطعم رائع للقهوة.',
  'التحميص مضبوط والتوصيل سريع.',
  'أفضل قهوة عربية جربتها مؤخراً.'
];

export default function Reviews() {
  return (
    <motion.section
      className="section"
      initial={sectionReveal.initial}
      whileInView={sectionReveal.whileInView}
      viewport={sectionReveal.viewport}
      transition={sectionReveal.transition}
    >
      <h2 className="sectionTitle">آراء العملاء</h2>
      <div className={styles.grid}>
        {reviews.map((review, i) => (
          <motion.article key={i} className={styles.card} {...cardHover}>
            <p>{review}</p>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}
