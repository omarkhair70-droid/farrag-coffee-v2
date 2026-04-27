import { motion } from 'framer-motion';
import styles from './BrandIntro.module.css';
import { sectionReveal } from '../lib/motion';

const points = ['طعم ثابت', 'ريحة واضحة', 'طلب سهل'];

export default function BrandIntro() {
  return (
    <motion.section
      id="experience"
      className={`section ${styles.brandIntro}`}
      initial={sectionReveal.initial}
      whileInView={sectionReveal.whileInView}
      viewport={sectionReveal.viewport}
      transition={sectionReveal.transition}
    >
      <div className={styles.content}>
        <p className={styles.kicker}>هوية بن فراج</p>
        <h2 className="sectionTitle">بن فراج مش مجرد محل بن.</h2>
        <p>
          دي تجربة قهوة معمولة للناس اللي بتحس بالفرق من أول ريحة. من اختيار النوع، لطريقة الطحن، للتحويج، كل
          تفصيلة معمولة عشان الفنجان يطلع بطعم واضح وثابت.
        </p>
        <div className={styles.points}>
          {points.map((point) => (
            <span key={point}>{point}</span>
          ))}
        </div>
      </div>
      <div className={styles.panel}>
        <p className={styles.panelLabel}>طقس يومي بطابع مصري</p>
        <h3>من أول اختيار البن… لآخر نفس في الفنجان.</h3>
        <p>
          نشتغل على القهوة كأنها تجربة كاملة: جودة في الحبة، اتزان في الطحن، ولمسة تحويج محسوبة تخلي كل فنجان
          ثابت وواضح.
        </p>
      </div>
    </motion.section>
  );
}
