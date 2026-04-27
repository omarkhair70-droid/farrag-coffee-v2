import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './MenuPreview.module.css';
import { cardHover, sectionReveal } from '../lib/motion';

const menuImages = ['/images/menu-1.jpeg', '/images/menu-2.jpeg', '/images/menu-3.jpeg'];

export default function MenuPreview() {
  return (
    <motion.section
      className="section"
      initial={sectionReveal.initial}
      whileInView={sectionReveal.whileInView}
      viewport={sectionReveal.viewport}
      transition={sectionReveal.transition}
    >
      <h2 className="sectionTitle">المنيو الكامل</h2>
      <p className={styles.subtitle}>تصفّح اختيارات فراج وشوف الأنواع المتاحة.</p>
      <div className={styles.grid}>
        {menuImages.map((menuImage, index) => (
          <motion.figure key={menuImage} className={styles.menuCard} {...cardHover}>
            <Image
              src={menuImage}
              alt={`منيو فراج ${index + 1}`}
              width={900}
              height={1200}
              className={styles.menuImage}
              sizes="(max-width: 699px) 100vw, (max-width: 999px) 50vw, 33vw"
            />
          </motion.figure>
        ))}
      </div>
    </motion.section>
  );
}
