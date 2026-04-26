import styles from './Header.module.css';

const navLinks = [
  { label: 'الرئيسية', href: '#' },
  { label: 'المنتجات', href: '#products' },
  { label: 'السلة', href: '#cart' },
  { label: 'تواصل معنا', href: '#contact' }
];

export default function Header() {
  return (
    <header className={`${styles.header} section`}>
      <div className={styles.logo}>بن فراج</div>
      <nav className={styles.nav}>
        {navLinks.map((link) => (
          <a key={link.label} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
      <a href="#products" className="btn btnPrimary">
        اطلب الآن
      </a>
    </header>
  );
}
