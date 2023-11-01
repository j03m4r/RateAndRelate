import ToasterProvider from '@/providers/ToasterProvider'
import './globals.css'
import type { Metadata } from 'next'
import { Oswald } from 'next/font/google'
import SupabaseProvider from '@/providers/SupabaseProvider'
import UserProvider from '@/providers/UserProvider'
import Navbar from '@/components/navbar/Navbar'
import Sidebar from '@/components/sidebar/Sidebar'
import ModalProvider from '@/providers/ModalProvider'
import getNotifications from '@/actions/getNotifications'

const font = Oswald({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Rate & Relate',
  description: 'Connect with friends over how the day was',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const notifications = await getNotifications();

  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider />
        <SupabaseProvider>
          <UserProvider>
            <ModalProvider />
            <Navbar notifications={notifications} />
            <Sidebar>
              {children}
            </Sidebar>
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}
