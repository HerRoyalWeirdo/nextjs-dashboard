import '@/app/ui/global.css';
//any fonts of ui added here will go all pages
//import { inter } from '@/app/ui/fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* className={`${inter.className} antialiased`} */}
      <body>{children}</body>
    </html>
  );
}
