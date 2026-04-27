import { motion } from 'framer-motion';
import styles from './WhyFarrag.module.css';
import { sectionReveal } from '../lib/motion';

const reasons = [
  { title: 'طحن طازة', text: 'البن يتحضر بالطريقة المناسبة لاستخدامك.' },
  { title: 'تحويج مضبوط', text: 'نكهة شرقية واضحة من غير مبالغة.' },
  { title: 'طلب سريع', text: 'اختار، أكد، وابعت طلبك على واتساب.' },
  { title: 'طعم ثابت', text: 'تجربة قهوة تعرف ترجع لها كل مرة.' }
];

export default function WhyFarrag() {
  return (
    <motion.section
      className={`section ${styles.why}`}
      initial={sectionReveal.initial}
      whileInView={sectionReveal.whileInView}
      viewport={sectionReveal.viewport}
      transition={sectionReveal.transition}
    >
      <h2 className="sectionTitle">ليه بن فراج؟</h2>
      <p className={styles.subtitle}>لأن القهوة الحلوة مش صدفة. هي اختيار، طحن، وتحضير مضبوط.</p>
      <div className={styles.grid}>
        {reasons.map((reason, index) => (
          <article key={reason.title} className={styles.card}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{reason.title}</h3>
            <p>{reason.text}</p>
          </article>
        ))}
      </div>
    </motion.section>
  );
}
