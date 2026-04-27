import { motion } from 'framer-motion';
import styles from './Contact.module.css';
import { premiumButtonMotion, sectionReveal } from '../lib/motion';

export default function Contact() {
  return (
    <motion.section
      id="contact"
      className={`section ${styles.contact}`}
      initial={sectionReveal.initial}
      whileInView={sectionReveal.whileInView}
      viewport={sectionReveal.viewport}
      transition={sectionReveal.transition}
    >
      <h2 className="sectionTitle">جاهز تختار قهوتك؟</h2>
      <p className={styles.copy}>اختار النوع، حدد الكمية، وابعت طلبك مباشرة لفراج على واتساب.</p>
      <div className={styles.ctas}>
        <motion.a href="#products" className="btn btnPrimary" {...premiumButtonMotion}>ابدأ الطلب الآن</motion.a>
        <motion.a href="https://www.facebook.com/Faragcoffee" target="_blank" rel="noreferrer" className="btn btnSecondary" {...premiumButtonMotion}>
          تواصل على فيسبوك
        </motion.a>
      </div>
      <div className={styles.infoGrid}>
        <article><h3>فيسبوك</h3><a href="https://www.facebook.com/Faragcoffee" target="_blank" rel="noreferrer">facebook.com/Faragcoffee</a></article>
        <article><h3>الإيميل</h3><a href="mailto:basilmohamed227@gmail.com">basilmohamed227@gmail.com</a></article>
        <article><h3>الفرع 1</h3><a href="tel:01005009908">01005009908</a></article>
        <article><h3>الفرع 2</h3><a href="tel:01008006460">01008006460</a></article>
      </div>
    </motion.section>
  );
}
