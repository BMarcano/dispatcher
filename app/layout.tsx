import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { RoleProvider } from '@/lib/role-context'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'HCP-OPS-SYNC | Crew Scheduling & Payroll',
  description: 'Internal crew scheduling and payroll management tool',
  icons: {
    icon: [

    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <RoleProvider>
          {children}
        </RoleProvider>
        <Analytics />
      </body>
    </html>
  )
}
