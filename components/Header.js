import Image from 'next/image';
import styles from './Header.module.css';
import { motion } from 'framer-motion';
import { premiumButtonMotion } from '../lib/motion';

const navLinks = [
  { label: 'الرئيسية', href: '#' },
  { label: 'المنتجات', href: '#products' },
  { label: 'السلة', href: '#cart' },
  { label: 'تواصل معنا', href: '#contact' }
];

export default function Header() {
  return (
    <header className={`${styles.header} section`}>
      <div className={styles.logoWrap}>
        <Image src="/images/logo.png" alt="Farrag Coffee" width={56} height={56} className={styles.logoImage} priority />
        <span className={styles.logoText}>بن فراج</span>
      </div>
      <nav className={styles.nav}>
        {navLinks.map((link) => (
          <a key={link.label} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
      <motion.a href="#products" className="btn btnPrimary" {...premiumButtonMotion}>
        اطلب الآن
      </motion.a>
    </header>
  );
}
