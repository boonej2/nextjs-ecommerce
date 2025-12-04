'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import { getCartItems, updateCartItemQuantity, removeCartItem, clearCart, CartItem } from "@/lib/cart-client"

export default function Checkout() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0
  })
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCart()
    
    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCart()
    }
    
    window.addEventListener('cartUpdated', handleCartUpdate)
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [])

  const loadCart = async () => {
    try {
      setLoading(true)
      const items = await getCartItems()
      setCartItems(items)
      calculateOrderSummary(items)
    } catch (error) {
      console.error('Error loading cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateOrderSummary = (items: CartItem[]) => {
    const subtotal = items.reduce((total: number, item: CartItem) => total + (item.price * item.quantity), 0)
    const shipping = subtotal > 0 ? 5.99 : 0
    const tax = subtotal * 0.08 // 8% tax
    const total = subtotal + shipping + tax

    setOrderSummary({
      subtotal: parseFloat(subtotal.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2))
    })
  }

  const handleUpdateQuantity = async (id: string, quantity: number) => {
    await updateCartItemQuantity(id, quantity)
    await loadCart()
  }

  const handleRemoveItem = async (id: string) => {
    await removeCartItem(id)
    await loadCart()
  }

  const placeOrder = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!')
      return
    }
    
    // Simulate order processing
    const orderNumber = Math.floor(Math.random() * 1000000)
    alert(`Order placed successfully!\nOrder #${orderNumber}\nTotal: $${orderSummary.total.toFixed(2)}`)
    
    // Clear cart after successful order
    await clearCart()
    setCartItems([])
    
    // Redirect to home page
    setTimeout(() => {
      window.location.href = '/'
    }, 2000)
  }

  const showNotification = (message: string, type = 'success') => {
    const notification = document.createElement('div')
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'error' ? 'var(--danger-color)' : 'var(--success-color)'};
      color: white;
      padding: 12px 20px;
      border-radius: var(--border-radius);
      box-shadow: var(--box-shadow);
      z-index: 10000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `
    notification.textContent = message
    
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.style.transform = 'translateX(0)'
    }, 100)
    
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)'
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 3000)
  }

  const validateForm = (form: HTMLFormElement) => {
    const inputs = form.querySelectorAll('input[required], select[required]')
    let isValid = true
    
    inputs.forEach(input => {
      const htmlInput = input as HTMLInputElement | HTMLSelectElement
      if (!htmlInput.value.trim()) {
        isValid = false
        htmlInput.style.borderColor = 'var(--danger-color)'
      } else {
        htmlInput.style.borderColor = '#e9ecef'
      }
    })
    
    return isValid
  }

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const shippingForm = document.getElementById('shipping-form') as HTMLFormElement
    const paymentForm = document.getElementById('payment-form') as HTMLFormElement
    
    const isShippingValid = validateForm(shippingForm)
    const isPaymentValid = validateForm(paymentForm)
    
    if (isShippingValid && isPaymentValid) {
      placeOrder()
    } else {
      showNotification('Please fill in all required fields correctly.', 'error')
    }
  }

  return (
    <div>
      <Navigation />

      {/* Checkout Hero */}
      <section className="checkout-hero">
        <div className="container">
          <h1>Checkout</h1>
          <p>Review your order and complete your purchase</p>
        </div>
      </section>

      {/* Checkout Content */}
      <section className="checkout-content">
        {/* Cart Items */}
        <div className="cart-items" id="cart-items">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p>Loading cart...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="empty-cart">
              <h3>Your cart is empty</h3>
              <p>Add some items to your cart to continue shopping.</p>
              <Link href="/store" className="btn btn-primary">Continue Shopping</Link>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="cart-item" data-id={item.id}>
                <div className="cart-item-image">{item.name.charAt(0)}</div>
                <div className="cart-item-details">
                  <div className="cart-item-name">{item.name}</div>
                  {item.size && <div className="cart-item-option">Size: {item.size}</div>}
                  {item.color && <div className="cart-item-option">Color: {item.color}</div>}
                  <div className="cart-item-price">${item.price}</div>
                  <div className="quantity-controls">
                    <button 
                      className="quantity-btn minus" 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      className="quantity-btn plus" 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button 
                  className="remove-btn" 
                  onClick={() => handleRemoveItem(item.id)}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div id="order-summary">
            <div className="summary-item">
              <span>Subtotal:</span>
              <span>${orderSummary.subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span>Shipping:</span>
              <span>${orderSummary.shipping.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span>Tax:</span>
              <span>${orderSummary.tax.toFixed(2)}</span>
            </div>
            <div className="summary-total">
              <span>Total:</span>
              <span>${orderSummary.total.toFixed(2)}</span>
            </div>
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '1rem' }}
              onClick={handleCheckoutSubmit}
              disabled={cartItems.length === 0}
            >
              Place Order
            </button>
          </div>
        </div>
      </section>

      {/* Shipping & Payment Info */}
      <section className="featured-products" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <div className="contact-grid">
            {/* Shipping Information */}
            <div className="contact-form">
              <h2>Shipping Information</h2>
              <form id="shipping-form">
                <div className="form-group">
                  <label htmlFor="full-name">Full Name</label>
                  <input type="text" id="full-name" name="full-name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input type="text" id="address" name="address" required />
                </div>
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input type="text" id="city" name="city" required />
                </div>
                <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label htmlFor="state">State</label>
                    <input type="text" id="state" name="state" required />
                  </div>
                  <div>
                    <label htmlFor="zip">ZIP Code</label>
                    <input type="text" id="zip" name="zip" required />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="country">Country</label>
                  <select id="country" name="country" required>
                    <option value="">Select Country</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>
              </form>
            </div>

            {/* Payment Information */}
            <div className="contact-form">
              <h2>Payment Information</h2>
              <form id="payment-form">
                <div className="form-group">
                  <label htmlFor="card-number">Card Number</label>
                  <input type="text" id="card-number" name="card-number" placeholder="1234 5678 9012 3456" required />
                </div>
                <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label htmlFor="expiry">Expiry Date</label>
                    <input type="text" id="expiry" name="expiry" placeholder="MM/YY" required />
                  </div>
                  <div>
                    <label htmlFor="cvv">CVV</label>
                    <input type="text" id="cvv" name="cvv" placeholder="123" required />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="card-name">Name on Card</label>
                  <input type="text" id="card-name" name="card-name" required />
                </div>
                <div className="form-group">
                  <label>
                    <input type="checkbox" name="save-card" id="save-card" />
                    Save card for future purchases
                  </label>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Trust Badges */}
      <section className="features">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2>Secure Checkout</h2>
            <p style={{ color: 'var(--gray-color)' }}>Your payment information is encrypted and secure</p>
          </div>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">🔒</div>
              <h3>SSL Encrypted</h3>
              <p>All data is encrypted using 256-bit SSL security</p>
            </div>
            <div className="feature">
              <div className="feature-icon">💳</div>
              <h3>Secure Payments</h3>
              <p>We never store your full payment details</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🛡️</div>
              <h3>PCI Compliant</h3>
              <p>Fully compliant with payment card industry standards</p>
            </div>
            <div className="feature">
              <div className="feature-icon">📞</div>
              <h3>24/7 Support</h3>
              <p>Help is available anytime you need it</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
