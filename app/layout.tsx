import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Frostburg Clothing - Premium Outdoor & Casual Wear',
  description: 'Premium outdoor clothing and casual wear designed for comfort, durability, and style in any weather.',
  keywords: 'outdoor clothing, casual wear, hiking gear, premium apparel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Mobile menu toggle functionality
              document.addEventListener('DOMContentLoaded', function() {
                const hamburger = document.querySelector('.hamburger');
                const navMenu = document.querySelector('.nav-menu');
                
                if (hamburger && navMenu) {
                  hamburger.addEventListener('click', () => {
                    hamburger.classList.toggle('active');
                    navMenu.classList.toggle('active');
                  });
                  
                  // Close menu when clicking on links
                  const navLinks = document.querySelectorAll('.nav-link');
                  navLinks.forEach(link => {
                    link.addEventListener('click', () => {
                      hamburger.classList.remove('active');
                      navMenu.classList.remove('active');
                    });
                  });
                }
              });
            `
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}