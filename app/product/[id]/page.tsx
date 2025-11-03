'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import ProductCard from '../../../components/ProductCard'
import { Product, productData, getProductById, getProductsByCategory } from '../../../lib/products'

export default function ProductDetail() {
  const params = useParams()
  const productId = params.id as string
  
  const [cartCount, setCartCount] = useState(0)
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isNavOpen, setIsNavOpen] = useState(false)

  useEffect(() => {
    // Load cart count from localStorage
    const savedCart = localStorage.getItem('ecommerce-cart')
    if (savedCart) {
      const cartItems = JSON.parse(savedCart)
      const totalItems = cartItems.reduce((total: number, item: any) => total + item.quantity, 0)
      setCartCount(totalItems)
    }
    
    // Load product data
    const foundProduct = getProductById(parseInt(productId))
    setProduct(foundProduct || null)
    
    // Load related products
    if (foundProduct) {
      const related = getProductsByCategory(foundProduct.category)
        .filter(p => p.id !== foundProduct.id)
        .slice(0, 3)
      setRelatedProducts(related)
    }
  }, [productId])

  const addToCart = () => {
    if (!product) return
    
    const savedCart = localStorage.getItem('ecommerce-cart')
    let cartItems = savedCart ? JSON.parse(savedCart) : []
    
    const existingItem = cartItems.find((item: any) => 
      item.id === product.id.toString() && 
      item.size === selectedSize && 
      item.color === selectedColor
    )
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cartItems.push({
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        quantity,
        size: selectedSize,
        color: selectedColor
      })
    }
    
    localStorage.setItem('ecommerce-cart', JSON.stringify(cartItems))
    setCartCount(cartItems.reduce((total: number, item: any) => total + item.quantity, 0))
    
    showNotification('Item added to cart!')
  }

  const showNotification = (message: string) => {
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
    
    setTimeout(() => {
      notification.style.transform = 'translateX(0)'
    }, 100)
    
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)'
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 300)
    }, 3000)
  }

  if (!product) {
    return (
      <div>
        <nav className="navbar">
          <div className="nav-container">
            <div className="nav-logo">
              <Link href="/">Frostburg Clothing</Link>
            </div>
            <ul className={`nav-menu ${isNavOpen ? 'active' : ''}`}>
              <li className="nav-item">
                <Link href="/" className="nav-link" onClick={() => setIsNavOpen(false)}>Home</Link>
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
                <Link href="/checkout" className="nav-link cart-icon" onClick={() => setIsNavOpen(false)}>
                  Cart <span id="cart-count">{cartCount}</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        <section className="product-detail">
          <div className="container">
            <div className="product-not-found">
              <h2>Product Not Found</h2>
              <p>The product you're looking for doesn't exist.</p>
              <Link href="/store" className="btn btn-primary">Back to Store</Link>
            </div>
          </div>
        </section>
      </div>
    )
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
              <Link href="/" className="nav-link" onClick={() => setIsNavOpen(false)}>Home</Link>
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

      {/* Product Detail Section */}
      <section className="product-detail">
        <div className="container">
          <div className="product-detail-grid">
            {/* Product Images */}
            <div className="product-images">
              <div className="main-product-image">
                <Image 
                  src={product.image} 
                  alt={product.name}
                  width={600}
                  height={600}
                  style={{ objectFit: 'cover', width: '100%', height: '400px' }}
                  priority
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="product-info">
              <div className="breadcrumb">
                <Link href="/">Home</Link> / <Link href="/store">Store</Link> / <span>{product.name}</span>
              </div>
              
              <h1 className="product-title">{product.name}</h1>
              <p className="product-price">${product.price}</p>
              
              <div className="product-description">
                <p>{product.description}</p>
              </div>

              {/* Product Features */}
              <div className="product-features">
                <h3>Key Features</h3>
                <ul>
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>

              {/* Product Options */}
              <div className="product-options">
                {product.sizes.length > 0 && (
                  <div className="option-group">
                    <label htmlFor="size-select">Size</label>
                    <select 
                      id="size-select"
                      className="option-select"
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                    >
                      <option value="">Select Size</option>
                      {product.sizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                {product.colors.length > 0 && (
                  <div className="option-group">
                    <label htmlFor="color-select">Color</label>
                    <select 
                      id="color-select"
                      className="option-select"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                    >
                      <option value="">Select Color</option>
                      {product.colors.map(color => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div className="option-group">
                  <label htmlFor="quantity">Quantity</label>
                  <input 
                    type="number" 
                    id="quantity"
                    className="quantity-input"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>

              {/* Product Actions */}
              <div className="product-actions">
                <button 
                  className="btn btn-primary add-to-cart-btn"
                  onClick={addToCart}
                  disabled={!selectedSize || !selectedColor}
                >
                  Add to Cart
                </button>
                <button className="btn btn-outline buy-now-btn">
                  Buy Now
                </button>
              </div>

              {/* Product Meta */}
              <div className="product-meta">
                <div className="meta-item">
                  <span className="meta-label">SKU:</span>
                  <span className="meta-value">FB-{product.id.toString().padStart(3, '0')}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Category:</span>
                  <span className="meta-value">{product.category}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Shipping:</span>
                  <span className="meta-value">Free shipping on orders over $50</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Returns:</span>
                  <span className="meta-value">30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="featured-products">
          <div className="container">
            <h2 className="section-title">Related Products</h2>
            <div className="products-grid">
              {relatedProducts.map(relatedProduct => (
                <ProductCard 
                  key={relatedProduct.id}
                  product={relatedProduct}
                  onAddToCart={(id, name, price) => {
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
                    showNotification('Item added to cart!')
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

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

      <style jsx>{`
        /* CSS Variables */
        :root {
          --primary-color: #3b82f6;
          --secondary-color: #1e40af;
          --dark-color: #1f2937;
          --gray-color: #6b7280;
          --border-radius: 8px;
          --box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          --transition: all 0.3s ease;
        }

        /* Navigation Styles */
        .navbar {
          position: fixed;
          top: 0;
          width: 100%;
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          z-index: 1000;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 70px;
        }

        .nav-logo a {
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--primary-color);
          text-decoration: none;
        }

        .nav-menu {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 2rem;
        }

        .nav-link {
          color: var(--dark-color);
          text-decoration: none;
          font-weight: 500;
          transition: var(--transition);
        }

        .nav-link:hover {
          color: var(--primary-color);
        }

        .cart-icon {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        #cart-count {
          background: var(--primary-color);
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
        }

        .hamburger {
          display: none;
          flex-direction: column;
          cursor: pointer;
        }

        .bar {
          width: 25px;
          height: 3px;
          background: var(--dark-color);
          margin: 3px 0;
          transition: var(--transition);
        }

        /* Container */
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        /* Product Detail Section */
        .product-detail {
          margin-top: 70px;
          padding: 80px 0;
        }

        .product-detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: start;
        }

        .product-images {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .main-product-image {
          background: #f8f9fa;
          border-radius: var(--border-radius);
          padding: 2rem;
          text-align: center;
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .product-image-large {
          font-size: 3rem;
          color: var(--gray-color);
        }

        .breadcrumb {
          margin-bottom: 1rem;
          color: var(--gray-color);
          font-size: 0.9rem;
        }

        .breadcrumb a {
          color: var(--primary-color);
          text-decoration: none;
        }

        .breadcrumb a:hover {
          text-decoration: underline;
        }

        .product-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--dark-color);
        }

        .product-price {
          font-size: 2rem;
          font-weight: 600;
          color: var(--primary-color);
          margin-bottom: 2rem;
        }

        .product-description {
          margin-bottom: 2rem;
          line-height: 1.6;
          color: var(--dark-color);
        }

        .product-features {
          margin-bottom: 2rem;
        }

        .product-features h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: var(--dark-color);
        }

        .product-features ul {
          list-style: none;
          padding: 0;
        }

        .product-features li {
          padding: 0.5rem 0;
          padding-left: 1.5rem;
          position: relative;
          color: var(--gray-color);
        }

        .product-features li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: var(--primary-color);
          font-weight: bold;
        }

        .product-options {
          margin-bottom: 2rem;
        }

        .option-group {
          margin-bottom: 1.5rem;
        }

        .option-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: var(--dark-color);
        }

        .option-select, .quantity-input {
          width: 100%;
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: var(--border-radius);
          font-size: 1rem;
          transition: var(--transition);
        }

        .option-select:focus, .quantity-input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .quantity-input {
          max-width: 100px;
        }

        .product-actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .add-to-cart-btn, .buy-now-btn {
          flex: 1;
          padding: 15px;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .add-to-cart-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .add-to-cart-btn:disabled:hover {
          background: #9ca3af;
        }

        .product-meta {
          border-top: 1px solid #e5e7eb;
          padding-top: 2rem;
        }

        .meta-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .meta-label {
          font-weight: 500;
          color: var(--dark-color);
        }

        .meta-value {
          color: var(--gray-color);
        }

        /* Featured Products Section */
        .featured-products {
          padding: 80px 0;
          background: #f8f9fa;
        }

        .section-title {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 3rem;
          color: var(--dark-color);
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .product-card {
          background: white;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          overflow: hidden;
          transition: var(--transition);
        }

        .product-card:hover {
          transform: translateY(-5px);
        }

        .product-link {
          text-decoration: none;
          color: inherit;
        }

        .product-image {
          background: #f8f9fa;
          padding: 2rem;
          text-align: center;
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gray-color);
          font-size: 1.5rem;
        }

        .product-name {
          padding: 1rem;
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
        }

        .product-price {
          padding: 0 1rem;
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--primary-color);
          margin: 0 0 1rem 0;
        }

        .add-to-cart {
          margin: 0 1rem 1rem 1rem;
          width: calc(100% - 2rem);
        }

        /* Product Not Found */
        .product-not-found {
          text-align: center;
          padding: 4rem 0;
        }

        .product-not-found h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: var(--dark-color);
        }

        .product-not-found p {
          color: var(--gray-color);
          margin-bottom: 2rem;
        }

        /* Button Styles */
        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: var(--border-radius);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          text-decoration: none;
          display: inline-block;
          text-align: center;
        }

        .btn-primary {
          background: var(--primary-color);
          color: white;
        }

        .btn-primary:hover {
          background: var(--secondary-color);
        }

        .btn-outline {
          background: transparent;
          border: 1px solid #d1d5db;
          color: var(--dark-color);
        }

        .btn-outline:hover {
          border-color: var(--primary-color);
          color: var(--primary-color);
        }

        /* Footer Styles */
        .footer {
          background: var(--dark-color);
          color: white;
          padding: 3rem 0 1rem;
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .footer-section h3,
        .footer-section h4 {
          margin-bottom: 1rem;
        }

        .footer-section ul {
          list-style: none;
          padding: 0;
        }

        .footer-section ul li {
          margin-bottom: 0.5rem;
        }

        .footer-section a {
          color: #d1d5db;
          text-decoration: none;
          transition: var(--transition);
        }

        .footer-section a:hover {
          color: white;
        }

        .footer-bottom {
          text-align: center;
          padding-top: 2rem;
          border-top: 1px solid #374151;
          color: #9ca3af;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .product-detail-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .product-actions {
            flex-direction: column;
          }

          .nav-menu {
            display: none;
          }

          .hamburger {
            display: flex;
          }

          .nav-logo a {
            font-size: 1.25rem;
          }

          .product-title {
            font-size: 2rem;
          }

          .product-price {
            font-size: 1.75rem;
          }
        }

        @media (max-width: 480px) {
          .product-detail {
            padding: 60px 0;
          }

          .product-title {
            font-size: 1.75rem;
          }

          .product-price {
            font-size: 1.5rem;
          }

          .section-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  )
}