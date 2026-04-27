import { motion } from 'framer-motion';
import styles from './CoffeeRitual.module.css';
import { sectionReveal } from '../lib/motion';

const rituals = [
  { title: 'الحبة', text: 'اختيار بن بطعم واضح وثابت.' },
  { title: 'الطحنة', text: 'درجة طحن تناسب طريقتك في التحضير.' },
  { title: 'التحويج', text: 'نكهة شرقية محسوبة من غير مبالغة.' },
  { title: 'الفنجان', text: 'تجربة قهوة سهلة تطلبها وتستمتع بيها.' }
];

export default function CoffeeRitual() {
  return (
    <motion.section
      className={`section ${styles.ritual}`}
      initial={sectionReveal.initial}
      whileInView={sectionReveal.whileInView}
      viewport={sectionReveal.viewport}
      transition={sectionReveal.transition}
    >
      <h2 className="sectionTitle">مش مجرد بن… دي طقوس قهوة</h2>
      <p className={styles.subtitle}>في بن فراج، كل نوع له طابع، كل طحن له استخدام، وكل فنجان له مزاجه.</p>
      <div className={styles.grid}>
        {rituals.map((item, index) => (
          <motion.article
            key={item.title}
            className={styles.card}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
          >
            <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}
