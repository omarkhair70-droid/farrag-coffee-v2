import Image from 'next/image';
import styles from './MenuPreview.module.css';

const menuImages = ['/images/menu-1.jpeg', '/images/menu-2.jpeg', '/images/menu-3.jpeg'];

export default function MenuPreview() {
  return (
    <section className="section">
      <h2 className="sectionTitle">معاينة المنيو</h2>
      <div className={styles.grid}>
        {menuImages.map((menuImage, index) => (
          <div key={menuImage} className={styles.menuCard}>
            <Image
              src={menuImage}
              alt={`منيو فراج ${index + 1}`}
              width={900}
              height={1200}
              className={styles.menuImage}
              sizes="(max-width: 699px) 100vw, (max-width: 999px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
