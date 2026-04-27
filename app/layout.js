import './globals.css';

export const metadata = {
  title: 'بن فراج | قهوة بطابعها',
  description: 'اختار قهوتك من بن فراج: بن برازيلي، تركي، يمني وإسبريسو بطحن مناسب وطلب مباشر على واتساب.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
