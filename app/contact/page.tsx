'use client'

import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import Link from "next/link"

export default function Contact() {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Get form data
    const formData = new FormData(e.target as HTMLFormElement)
    const name = formData.get('name')
    const email = formData.get('email')
    const subject = formData.get('subject')
    const message = formData.get('message')
    
    // Simulate form submission
    console.log('Form submitted:', { name, email, subject, message })
    
    // Show success message
    showNotification("Message sent successfully! We\\'ll get back to you soon.")
    
    // Reset form
    ;(e.target as HTMLFormElement).reset()
  }

  const showNotification = (message: string) => {
    const notification = document.createElement('div')
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--success-color);
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

  return (
    <div>
      <Navigation />

      {/* Contact Hero */}
      <section className="contact-hero">
        <div className="container">
          <h1>Get In Touch</h1>
          <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="contact-content">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form">
              <h2>Send Us a Message</h2>
              <form id="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" name="name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" name="email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input type="text" id="subject" name="subject" required />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" required></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="contact-info">
              <h2>Contact Information</h2>
              <div className="info-item">
                <div className="info-icon">📍</div>
                <div>
                  <h3>Our Location</h3>
                  <p>420691337 Main Street<br />Frostburg, MD 21532</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">📞</div>
                <div>
                  <h3>Phone Number</h3>
                  <p>(301) 420-6969<br />Mon-Fri: 9AM-6PM EST</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">✉️</div>
                <div>
                  <h3>Email Address</h3>
                  <p>support@frostburgclothing.com<br />info@frostburgclothing.com</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">🕒</div>
                <div>
                  <h3>Business Hours</h3>
                  <p>Monday - Friday: 9AM - 6PM<br />Saturday: 10AM - 5PM<br />Sunday: 12PM - 4PM</p>
                </div>
              </div>

              {/* FAQ Section */}
              <div style={{ marginTop: '3rem' }}>
                <h3>Frequently Asked Questions</h3>
                <div style={{ marginTop: '1rem' }}>
                  <details style={{ marginBottom: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: 'var(--border-radius)' }}>
                    <summary style={{ fontWeight: '600', cursor: 'pointer' }}>What is your return policy?</summary>
                    <p style={{ marginTop: '0.5rem' }}>We offer a 30-day return policy for all items in original condition with tags attached.</p>
                  </details>
                  <details style={{ marginBottom: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: 'var(--border-radius)' }}>
                    <summary style={{ fontWeight: '600', cursor: 'pointer' }}>Do you offer international shipping?</summary>
                    <p style={{ marginTop: '0.5rem' }}>Yes, we ship to over 50 countries worldwide. Shipping costs and delivery times vary by location.</p>
                  </details>
                  <details style={{ marginBottom: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: 'var(--border-radius)' }}>
                    <summary style={{ fontWeight: '600', cursor: 'pointer' }}>How can I track my order?</summary>
                    <p style={{ marginTop: '0.5rem' }}>You'll receive a tracking number via email once your order ships. You can also track it from your account.</p>
                  </details>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="features" style={{ background: 'white', padding: 0 }}>
        <div className="container">
          <div style={{ background: '#f8f9fa', borderRadius: 'var(--border-radius)', padding: '3rem', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '1rem' }}>Visit Our Store</h2>
            <p style={{ marginBottom: '2rem', color: 'var(--gray-color)' }}>Come see our collection in person at our flagship store in historic Frostburg, MD</p>
            <div style={{ background: '#e9ecef', height: '300px', borderRadius: 'var(--border-radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-color)' }}>
              Store Location Map
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
