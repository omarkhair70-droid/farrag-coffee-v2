import styles from './MenuPreview.module.css';

export default function MenuPreview() {
  return (
    <section className="section">
      <h2 className="sectionTitle">معاينة المنيو</h2>
      <div className={styles.grid}>
        <div className={styles.placeholder}>صورة منيو 1</div>
        <div className={styles.placeholder}>صورة منيو 2</div>
      </div>
    </section>
  );
}
