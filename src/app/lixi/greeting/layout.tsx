import { Dancing_Script, Playfair_Display } from 'next/font/google';

const dancingScript = Dancing_Script({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '700'],
  variable: '--font-dancing',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
});

export default function GreetingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${dancingScript.variable} ${playfairDisplay.variable}`}>
      {children}
    </div>
  );
}
