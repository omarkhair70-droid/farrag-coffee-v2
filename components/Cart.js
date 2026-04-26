'use client';

import { useMemo, useState } from 'react';
import styles from './Cart.module.css';

const whatsappNumber = '201005009908';

function buildMessage({ customerName, phone, notes, items, subtotal, total }) {
  const lines = items.map(
    (item, index) => `${index + 1}- ${item.name} | الكمية: ${item.quantity} | السعر: ${item.price * item.quantity} جنيه`
  );

  return [
    'مرحباً بن فراج، أريد تأكيد الطلب التالي:',
    `الاسم: ${customerName}`,
    `رقم الهاتف: ${phone}`,
    `ملاحظات: ${notes || 'لا يوجد'}`,
    '--- المنتجات ---',
    ...lines,
    `المجموع الفرعي: ${subtotal} جنيه`,
    `الإجمالي: ${total} جنيه`
  ].join('\n');
}

export default function Cart({ items, total, onUpdateQuantity, onRemoveItem }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const subtotal = useMemo(() => total, [total]);

  const handleCheckout = (event) => {
    event.preventDefault();

    const message = encodeURIComponent(
      buildMessage({
        customerName,
        phone,
        notes,
        items,
        subtotal,
        total
      })
    );

    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank', 'noopener,noreferrer');
    setIsModalOpen(false);
  };

  return (
    <section id="cart" className="section">
      <h2 className="sectionTitle">سلة الطلب</h2>
      {items.length === 0 ? (
        <div className={styles.emptyWrap}>
          <p className={styles.empty}>السلة فارغة حالياً</p>
          <span>ابدأ بإضافة منتجاتك المفضلة واستمتع بمذاق فاخر.</span>
        </div>
      ) : (
        <>
          <div className={styles.list}>
            {items.map((item) => (
              <div key={item.id} className={styles.row}>
                <div>
                  <h3>{item.name}</h3>
                  <p>
                    {item.price} جنيه × {item.quantity}
                  </p>
                </div>
                <div className={styles.controls}>
                  <button className="btn btnSecondary" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button className="btn btnSecondary" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                    +
                  </button>
                  <button className={styles.removeBtn} onClick={() => onRemoveItem(item.id)}>
                    إزالة
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className={styles.total}>الإجمالي: {total} جنيه</p>
          <button className="btn btnPrimary" onClick={() => setIsModalOpen(true)}>
            إتمام الطلب
          </button>

          <div className={styles.stickyBar}>
            <span>{items.length} منتجات • {total} جنيه</span>
            <button className="btn btnPrimary" onClick={() => setIsModalOpen(true)}>
              متابعة الطلب
            </button>
          </div>
        </>
      )}

      {isModalOpen && (
        <div className={styles.overlay} onClick={() => setIsModalOpen(false)}>
          <form className={styles.modal} onSubmit={handleCheckout} onClick={(event) => event.stopPropagation()}>
            <h3>بيانات الطلب</h3>
            <label>
              الاسم
              <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} required />
            </label>
            <label>
              رقم الهاتف
              <input value={phone} onChange={(event) => setPhone(event.target.value)} required />
            </label>
            <label>
              ملاحظات
              <textarea rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} />
            </label>
            <button className="btn btnPrimary" type="submit">
              إرسال الطلب على واتساب
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
