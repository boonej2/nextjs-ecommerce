'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ProductCard from '../components/ProductCard'
import { Product, getFeaturedProducts, getAllProducts } from '../lib/products'

export default function Home() {
  const [cartCount, setCartCount] = useState(0)
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [randomFeaturedProduct, setRandomFeaturedProduct] = useState<Product | null>(null)
  const [isNavOpen, setIsNavOpen] = useState(false)

  useEffect(() => {
    // Load cart count from localStorage
    const savedCart = localStorage.getItem('ecommerce-cart')
    if (savedCart) {
      const cartItems = JSON.parse(savedCart)
      const totalItems = cartItems.reduce((total: number, item: any) => total + item.quantity, 0)
      setCartCount(totalItems)
    }
    
    // Load featured products
    const featured = getFeaturedProducts(3)
    setFeaturedProducts(featured)
    
    // Select random product for hero section (exclude already featured products)
    const allProducts = getAllProducts()
    const nonFeaturedProducts = allProducts.filter(product => 
      !featured.some(featuredProduct => featuredProduct.id === product.id)
    )
    const randomIndex = Math.floor(Math.random() * nonFeaturedProducts.length)
    setRandomFeaturedProduct(nonFeaturedProducts[randomIndex])
  }, [])

  const addToCart = (id: number, name: string, price: number) => {
    const savedCart = localStorage.getItem('ecommerce-cart')
    let cartItems = savedCart ? JSON.parse(savedCart) : []
    
    const existingItem = cartItems.find((item: any) => item.id === id.toString())
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cartItems.push({
        id: id.toString(),
        name,
        price,
        quantity: 1
      })
    }
    
    localStorage.setItem('ecommerce-cart', JSON.stringify(cartItems))
    setCartCount(cartItems.reduce((total: number, item: any) => total + item.quantity, 0))
    
    // Show notification
    showNotification('Item added to cart!')
  }

  const showNotification = (message: string) => {
    // Create notification element
    const notification = document.createElement('div')
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      z-index: 10000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      font-weight: 500;
    `
    notification.textContent = message
    
    document.body.appendChild(notification)
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)'
    }, 100)
    
    // Animate out and remove
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)'
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 300)
    }, 3000)
  }

  return (
    <div>
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <Link href="/">Frostburg Clothing</Link>
          </div>
          <ul className={`nav-menu ${isNavOpen ? 'active' : ''}`}>
            <li className="nav-item">
              <Link href="/" className="nav-link active" onClick={() => setIsNavOpen(false)}>Home</Link>
            </li>
            <li className="nav-item">
              <Link href="/store" className="nav-link" onClick={() => setIsNavOpen(false)}>Store</Link>
            </li>
            <li className="nav-item">
              <Link href="/about" className="nav-link" onClick={() => setIsNavOpen(false)}>About</Link>
            </li>
            <li className="nav-item">
              <Link href="/contact" className="nav-link" onClick={() => setIsNavOpen(false)}>Contact</Link>
            </li>
            <li className="nav-item">
              <Link href="/login" className="nav-link" onClick={() => setIsNavOpen(false)}>Login</Link>
            </li>
            <li className="nav-item">
              <Link href="/checkout" className="nav-link cart-icon" onClick={() => setIsNavOpen(false)}>
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

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div>
            <h1 className="hero-title">Embrace the Outdoors</h1>
            <p className="hero-subtitle">
              Premium outdoor clothing and casual wear designed for comfort, durability, and style in any weather.
            </p>
            <div className="hero-buttons">
              <Link href="/store" className="btn btn-primary">Shop Now</Link>
              <Link href="/about" className="btn btn-secondary">Learn More</Link>
            </div>
          </div>
          <div className="hero-image">
            {randomFeaturedProduct ? (
              <Link href={`/product/${randomFeaturedProduct.id}`}>
                <div className="featured-product-image">
                  <Image 
                    src={randomFeaturedProduct.image} 
                    alt={randomFeaturedProduct.name}
                    width={400}
                    height={300}
                    style={{ 
                      objectFit: 'cover', 
                      width: '100%', 
                      height: '300px',
                      borderRadius: 'var(--border-radius)',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                    }}
                    priority
                  />
                  <div className="featured-product-overlay">
                    <span className="featured-badge">Featured Product</span>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="placeholder-image">Featured Product Image</div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          <div className="products-grid">
            {featuredProducts.map(product => (
              <ProductCard 
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">🚚</div>
              <h3>Free Shipping</h3>
              <p>Free shipping on all orders over $50</p>
            </div>
            <div className="feature">
              <div className="feature-icon">↩️</div>
              <h3>Easy Returns</h3>
              <p>30-day return policy for all items</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🔒</div>
              <h3>Secure Payment</h3>
              <p>Your payment information is safe with us</p>
            </div>
            <div className="feature">
              <div className="feature-icon">📞</div>
              <h3>24/7 Support</h3>
              <p>Get help whenever you need it</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Frostburg Clothing</h3>
              <p>Premium outdoor clothing and casual wear for the modern adventurer.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/store">Store</Link></li>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li><a href="#">Shipping Info</a></li>
                <li><a href="#">Size Guide</a></li>
                <li><a href="#">FAQs</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>Email: support@frostburgclothing.com</p>
              <p>Phone: (301) 420-6969</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Frostburg Clothing. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}