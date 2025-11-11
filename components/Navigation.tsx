'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { checkAuthStatus, signOutUser } from '@/lib/auth-client'
import { getCartCount } from '@/lib/cart-client'

export default function Navigation() {
  const pathname = usePathname()
  const [cartCount, setCartCount] = useState(0)
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [user, setUser] = useState<{ id: string; email: string; name?: string | null } | null>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    // Load cart count
    updateCartCount()

    // Check authentication status
    checkAuthStatus().then(({ authenticated, user }) => {
      if (authenticated && user) {
        setUser(user)
      }
      setIsCheckingAuth(false)
      // Update cart count after auth check (cart may be in database)
      updateCartCount()
    })

    // Listen for cart updates
    const handleCartUpdate = () => {
      updateCartCount()
    }

    window.addEventListener('storage', handleCartUpdate)
    // Also listen for custom events from same window
    window.addEventListener('cartUpdated', handleCartUpdate)

    return () => {
      window.removeEventListener('storage', handleCartUpdate)
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [])

  const updateCartCount = async () => {
    const count = await getCartCount()
    setCartCount(count)
  }

  const handleSignOut = async () => {
    const success = await signOutUser()
    if (success) {
      setUser(null)
      window.location.href = '/'
    }
  }

  const isActive = (path: string) => pathname === path

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <Link href="/">Frostburg Clothing</Link>
        </div>
        <ul className={`nav-menu ${isNavOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link 
              href="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`} 
              onClick={() => setIsNavOpen(false)}
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              href="/store" 
              className={`nav-link ${isActive('/store') ? 'active' : ''}`} 
              onClick={() => setIsNavOpen(false)}
            >
              Store
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              href="/about" 
              className={`nav-link ${isActive('/about') ? 'active' : ''}`} 
              onClick={() => setIsNavOpen(false)}
            >
              About
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              href="/contact" 
              className={`nav-link ${isActive('/contact') ? 'active' : ''}`} 
              onClick={() => setIsNavOpen(false)}
            >
              Contact
            </Link>
          </li>
          {!isCheckingAuth && (
            user ? (
              <>
                <li className="nav-item">
                  <span className="nav-link nav-user" style={{ color: 'var(--primary-color)' }}>
                    {user.name || user.email}
                  </span>
                </li>
                <li className="nav-item">
                  <button 
                    className="nav-link nav-signout" 
                    onClick={() => {
                      handleSignOut()
                      setIsNavOpen(false)
                    }}
                    type="button"
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link 
                  href="/login" 
                  className={`nav-link ${isActive('/login') ? 'active' : ''}`} 
                  onClick={() => setIsNavOpen(false)}
                >
                  Login
                </Link>
              </li>
            )
          )}
          <li className="nav-item">
            <Link 
              href="/checkout" 
              className={`nav-link cart-icon ${isActive('/checkout') ? 'active' : ''}`} 
              onClick={() => setIsNavOpen(false)}
            >
              Cart <span id="cart-count">{cartCount}</span>
            </Link>
          </li>
        </ul>
        <div className={`hamburger ${isNavOpen ? 'active' : ''}`} onClick={() => setIsNavOpen(!isNavOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  )
}

