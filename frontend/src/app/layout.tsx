import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Task Management - Choreo Full-Stack Sample',
  description: 'A comprehensive task management application built with Next.js and deployed on WSO2 Choreo',
  keywords: ['task management', 'choreo', 'nextjs', 'wso2', 'productivity'],
  authors: [{ name: 'WSO2 Choreo Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Task Management - Choreo Full-Stack Sample',
    description: 'A comprehensive task management application built with Next.js and deployed on WSO2 Choreo',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Task Management - Choreo Full-Stack Sample',
    description: 'A comprehensive task management application built with Next.js and deployed on WSO2 Choreo',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <div id="root" className="h-full">
          {children}
        </div>
      </body>
    </html>
  )
}
