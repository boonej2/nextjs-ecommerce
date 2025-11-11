'use client'

import Navigation from "@/components/Navigation"
import Link from "next/link"


export default function About() {
  return (
    <div>
      <Navigation />

      {/* About Hero */}
      <section className="about-hero">
        <div className="container">
          <h1>Our Story</h1>
          <p>Born in the mountains, built for adventure</p>
        </div>
      </section>

      {/* About Content */}
      <section className="about-content">
        <div className="container">
          
            <div>
              <h2 className="section-title">Who We Are</h2>
              <p>Founded in 2015 in the heart of Western Maryland, Frostburg Clothing was born from a passion for the great outdoors and a need for durable, comfortable clothing that could withstand the elements while looking great.</p>
              
              <p>Our journey began with a small workshop creating custom outdoor gear for local hikers and has grown into a respected brand known for quality outdoor apparel and casual wear that performs in any environment.</p>
              
              <h3>Our Mission</h3>
              <p>To provide premium outdoor clothing and casual wear that combines technical performance with everyday comfort, empowering people to embrace adventure in style.</p>
              
              <h3>Our Values</h3>
              <ul style={{ marginLeft: '2rem', marginBottom: '2rem' }}>
                <li><strong>Durability:</strong> Built to last through seasons of adventure</li>
                <li><strong>Comfort:</strong> Designed for all-day wear in any environment</li>
                <li><strong>Sustainability:</strong> Committed to ethical manufacturing and eco-friendly materials</li>
                <li><strong>Community:</strong> Supporting local outdoor enthusiasts and conservation efforts</li>
              </ul>
            </div>
            
          </div>
        
      </section>

      {/* Team Section */}
      <section className="features" style={{ background: 'white' }}>
        <div className="container">
          <h2 className="section-title">Meet Our Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="team-image">JB</div>
              <h3>Jackson Boone</h3>
              <p style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Founder & CEO</p>
              <p>Jackson brings 20+ years of outdoor experience to product design.</p>
            </div>
            <div className="team-member">
              <div className="team-image">JB</div>
              <h3>Jacob Brashear</h3>
              <p style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Creative Director</p>
              <p>Jacob combines technical fabric expertise with contemporary design for functional, stylish apparel.</p>
            </div>
            <div className="team-member">
              <div className="team-image">JM</div>
              <h3>Joshua Martin</h3>
              <p style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Head of Operations</p>
              <p>Joshua manages our ethical manufacturing partnerships and ensures quality control across all products.</p>
            </div>
            <div className="team-member">
              <div className="team-image">TP</div>
              <h3>Trush Patel</h3>
              <p style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Customer Experience</p>
              <p>Trush provides expert advice and exceptional service to outdoor enthusiasts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="featured-products">
        <div className="container">
          <h2 className="section-title">Our Commitment to Sustainability</h2>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">🌱</div>
              <h3>Eco-Friendly Materials</h3>
              <p>We use organic cotton, recycled polyester, and other sustainable fabrics in our products.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">⚡</div>
              <h3>Carbon Neutral</h3>
              <p>Our operations are carbon neutral, and we offset our shipping emissions.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🤝</div>
              <h3>Ethical Manufacturing</h3>
              <p>All our partners adhere to fair labor practices and safe working conditions.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">📦</div>
              <h3>Sustainable Packaging</h3>
              <p>We use recycled and biodegradable packaging materials for all our shipments.</p>
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
                <li><Link href="/login">Login</Link></li>
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