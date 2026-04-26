import styles from './Reviews.module.css';

const reviews = [
  'خدمة ممتازة وطعم رائع للقهوة.',
  'التحميص مضبوط والتوصيل سريع.',
  'أفضل قهوة عربية جربتها مؤخراً.'
];

export default function Reviews() {
  return (
    <section className="section">
      <h2 className="sectionTitle">آراء العملاء</h2>
      <div className={styles.grid}>
        {reviews.map((review, i) => (
          <article key={i} className={styles.card}>
            <p>{review}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
