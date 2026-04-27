import { motion } from 'framer-motion';
import styles from './CoffeeGuide.module.css';
import { premiumButtonMotion, sectionReveal } from '../lib/motion';

const guideCards = [
  {
    question: 'عايز طعم هادي ومتوازن؟',
    product: 'برازيلي سادة',
    description: 'مناسب للقهوة اليومية والناس اللي بتحب الطعم الصافي.'
  },
  {
    question: 'عايز ريحة شرقية واضحة؟',
    product: 'تركي محوج',
    description: 'مناسب للي بيحب القهوة بريحة تقيلة وطابع مصري.'
  },
  {
    question: 'عايز طعم تقيل وفاخر؟',
    product: 'يمني',
    description: 'مناسب للي بيدور على عمق وطعم طويل.'
  },
  {
    question: 'عندك ماكينة؟',
    product: 'إسبريسو',
    description: 'مناسب للمكاين ومحبي الكريمة والطعم المركز.'
  }
];

export default function CoffeeGuide() {
  return (
    <motion.section
      id="guide"
      className={`section ${styles.guide}`}
      initial={sectionReveal.initial}
      whileInView={sectionReveal.whileInView}
      viewport={sectionReveal.viewport}
      transition={sectionReveal.transition}
    >
      <h2 className="sectionTitle">مش عارف تختار إيه؟</h2>
      <p className={styles.subtitle}>اختار حسب مزاجك، وسيب الباقي على فراج.</p>
      <div className={styles.grid}>
        {guideCards.map((card) => (
          <article key={card.product} className={styles.card}>
            <p className={styles.question}>{card.question}</p>
            <h3>{card.product}</h3>
            <p>{card.description}</p>
            <motion.a href="#products" className="btn btnSecondary" {...premiumButtonMotion}>
              شوف المنتج
            </motion.a>
          </article>
        ))}
      </div>
    </motion.section>
  );
}
