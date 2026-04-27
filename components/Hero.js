import styles from './Hero.module.css';
import { motion } from 'framer-motion';
import { premiumButtonMotion, sectionReveal } from '../lib/motion';

const heroStats = ['طحن حسب الطلب', 'تحويج بطابع مصري', 'طلب مباشر على واتساب'];

export default function Hero() {
  return (
    <motion.section
      className={styles.hero}
      initial={sectionReveal.initial}
      whileInView={sectionReveal.whileInView}
      viewport={sectionReveal.viewport}
      transition={sectionReveal.transition}
    >
      <div className={styles.editorialArt} aria-hidden="true">
        <span className={styles.steamOne} />
        <span className={styles.steamTwo} />
        <span className={styles.steamThree} />
        <span className={styles.stamp}>Farrag Coffee</span>
        <span className={styles.beanOne} />
        <span className={styles.beanTwo} />
      </div>

      <div className={styles.content}>
        <p className={styles.badge}>بن فراج — قهوة بطابعها</p>
        <h1>القهوة كما يجب أن تُطحن.</h1>
        <p className={styles.subtext}>
          من ريحة البن أول ما يتفتح، لآخر رشفة في الفنجان — بن فراج بيقدّم قهوة بطعم واضح، تحميص متوازن، وطابع
          مصري أصيل.
        </p>
        <div className={styles.actions}>
          <motion.a href="#products" className={`btn btnPrimary ${styles.ctaGlow}`} {...premiumButtonMotion}>
            اختار قهوتك
          </motion.a>
          <motion.a href="#experience" className="btn btnSecondary" {...premiumButtonMotion}>
            شوف التجربة
          </motion.a>
        </div>
        <div className={styles.stats}>
          {heroStats.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
      <span className={styles.sideNote}>من الحبة للفنجان</span>
    </motion.section>
  );
}
