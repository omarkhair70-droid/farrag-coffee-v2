import Image from 'next/image';
import styles from './Hero.module.css';
import { motion } from 'framer-motion';
import { premiumButtonMotion, sectionReveal } from '../lib/motion';

export default function Hero() {
  return (
    <motion.section
      className={styles.hero}
      initial={sectionReveal.initial}
      whileInView={sectionReveal.whileInView}
      viewport={sectionReveal.viewport}
      transition={sectionReveal.transition}
    >
      <div className={styles.mediaLayer}>
        <Image
          src="/images/menu-1.jpeg"
          alt="فنجان قهوة فاخر"
          fill
          className={styles.heroImage}
          priority
          sizes="100vw"
        />
      </div>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <p className={styles.badge}>تجربة قهوة نخبوية</p>
        <h1>قهوة بطابع سينمائي… فخامة داكنة بطعم لا يُنسى</h1>
        <p className={styles.subtext}>
          من أول رشفة، تعيش تجربة بن فراج بنكهة عصرية جريئة، تحميص متوازن، وأناقة في كل تفصيلة.
        </p>
        <div className={styles.actions}>
          <motion.a href="#products" className={`btn btnPrimary ${styles.ctaGlow}`} {...premiumButtonMotion}>
            ابدأ الطلب الآن
          </motion.a>
          <motion.a href="#products" className="btn btnSecondary" {...premiumButtonMotion}>
            استكشف المنتجات
          </motion.a>
        </div>
      </div>
    </motion.section>
  );
}
