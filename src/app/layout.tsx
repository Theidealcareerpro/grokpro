import { ThemeProvider } from 'next-themes';
import './globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'The Ideal Professional Gen',
  description: 'Free portfolios, CVs, and Cover Letters for Professionals',
  // (Optional) helps browser UI match dark theme:
  themeColor: '#0b1220',
  // (Optional) hints to UA/forms:
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} antialiased text-foreground bg-background leading-relaxed`}>
        <ThemeProvider
          attribute="class"
          forcedTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
