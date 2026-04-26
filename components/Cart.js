import styles from './Cart.module.css';

const whatsappNumber = '201005009908';

function buildMessage(items, total) {
  const lines = items.map(
    (item, index) => `${index + 1}- ${item.name} | الكمية: ${item.quantity} | السعر: ${item.price * item.quantity} جنيه`
  );

  return [
    'مرحباً بن فراج، أريد تأكيد الطلب التالي:',
    ...lines,
    `الإجمالي: ${total} جنيه`
  ].join('\n');
}

export default function Cart({ items, total, onUpdateQuantity }) {
  const message = encodeURIComponent(buildMessage(items, total));
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <section id="cart" className="section">
      <h2 className="sectionTitle">سلة الطلب</h2>
      {items.length === 0 ? (
        <p className={styles.empty}>السلة فارغة حالياً. أضف منتجاتك المفضلة.</p>
      ) : (
        <>
          <div className={styles.list}>
            {items.map((item) => (
              <div key={item.id} className={styles.row}>
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.price} جنيه × {item.quantity}</p>
                </div>
                <div className={styles.controls}>
                  <button className="btn btnSecondary" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button className="btn btnSecondary" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
              </div>
            ))}
          </div>
          <p className={styles.total}>الإجمالي: {total} جنيه</p>
          <a className="btn btnPrimary" href={whatsappLink} target="_blank" rel="noreferrer">
            إرسال الطلب على واتساب
          </a>
        </>
      )}
    </section>
  );
}
