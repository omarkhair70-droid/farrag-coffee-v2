import styles from './Contact.module.css';

export default function Contact() {
  return (
    <section id="contact" className="section">
      <h2 className="sectionTitle">تواصل معنا</h2>
      <div className={styles.info}>
        <p>
          <strong>فيسبوك:</strong>{' '}
          <a href="https://www.facebook.com/Faragcoffee" target="_blank" rel="noreferrer">
            facebook.com/Faragcoffee
          </a>
        </p>
        <p><strong>الإيميل:</strong> basilmohamed227@gmail.com</p>
        <p><strong>الفرع 1:</strong> 01005009908</p>
        <p><strong>الفرع 2:</strong> 01008006460</p>
      </div>
    </section>
  );
}
