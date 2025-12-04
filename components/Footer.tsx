import Link from 'next/link'

export default function Footer() {
  return (
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
              <li><Link href="/shipping">Shipping Info</Link></li>
              <li><Link href="/size-guide">Size Guide</Link></li>
              <li><Link href="/faqs">FAQs</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/accessibility">Accessibility</Link></li>
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
  )
}
