import './globals.css';

export const metadata = {
  title: 'بن فراج | طعم القهوة الأصلي',
  description: 'موقع بن فراج لطلب القهوة العربية بسهولة عبر واتساب.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
