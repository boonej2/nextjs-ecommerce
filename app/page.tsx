'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ProductCard from '../components/ProductCard'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import { Product, getFeaturedProducts, getAllProducts } from '../lib/products'
import { addToCart } from '../lib/cart-client'

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [randomFeaturedProduct, setRandomFeaturedProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      // Load featured products
      const featured = await getFeaturedProducts(3)
      setFeaturedProducts(featured)
      
      // Select random product for hero section (exclude already featured products)
      const allProducts = await getAllProducts()
      const nonFeaturedProducts = allProducts.filter(product => 
        !featured.some(featuredProduct => featuredProduct.id === product.id)
      )
      const randomIndex = Math.floor(Math.random() * nonFeaturedProducts.length)
      setRandomFeaturedProduct(nonFeaturedProducts[randomIndex] || null)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (id: number, name: string, price: number) => {
    await addToCart(id, name, price, 1)
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
      <Navigation />

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
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p>Loading products...</p>
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map(product => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
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

      <Footer />
    </div>
  )
}
