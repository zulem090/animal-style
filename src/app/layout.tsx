import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { TopMenu } from '@/components/TopMenu';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { Toaster } from 'react-hot-toast';
import { ProductStoreProvider } from '@/components/store/productStoreProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Animal Style',
  description: 'El paraiso de las mascotas',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <ProductStoreProvider>
        <html lang="en">
          <head>
            <link rel="icon" href="/images/logo/favicon.ico" sizes="256*200" />
          </head>
          <body className={inter.className}>
            <div className="m-auto mb-6 lg:w-[75%] xl:w-[80%] 2xl:w-[85%]">
              {/* <div className="sm:bg-slate-600 md:bg-fuchsia-200 lg:bg-green-200 xl:bg-orange-300 2xl:bg-rose-300 m-auto mb-6 lg:w-[75%] xl:w-[80%] 2xl:w-[85%]"> */}
              {/* <div className="m-auto mb-6"> */}
              <TopMenu />

              <div className="px-6 pt-6 bg-white p-2 m-2 pb-5 rounded">{children}</div>
            </div>
            {/* {children} */}
            <Toaster position="bottom-right" />
          </body>
        </html>
      </ProductStoreProvider>
    </AuthProvider>
  );
}
