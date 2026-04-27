import Image from 'next/image';
import styles from './Header.module.css';
import { motion } from 'framer-motion';
import { premiumButtonMotion } from '../lib/motion';

const navLinks = [
  { label: 'الرئيسية', href: '#' },
  { label: 'التجربة', href: '#experience' },
  { label: 'اختار قهوتك', href: '#guide' },
  { label: 'المنتجات', href: '#products' },
  { label: 'الطلب', href: '#cart' },
  { label: 'تواصل', href: '#contact' }
];

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href="#" className={styles.logoWrap}>
          <Image src="/images/logo.png" alt="بن فراج" width={52} height={52} className={styles.logoImage} priority />
          <div>
            <span className={styles.logoText}>بن فراج</span>
            <small>قهوة بطابعها</small>
          </div>
        </a>
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
      </div>
    </header>
  );
}
