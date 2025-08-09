import type {Metadata} from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({ // Fuente sans personalizada (variable)
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({ // Fuente mono para fragmentos de código
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = { // Metadatos para SEO / head
  title: 'ReNDeR TeX',
  description: 'Visualizar y editar expresiones matemáticas en LaTeX a imagenes PNG o JPG.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Favicon & PWA meta */}
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>        
  <a href="#main-content" className="skip-link sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-md focus:bg-primary focus:text-primary-foreground focus:shadow-lg">Saltar al contenido</a> {/* Accesibilidad: enlace de salto */}
        <div id="main-content" role="main">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
