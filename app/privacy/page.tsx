import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"

export default function Privacy() {
  return (
    <div>
      <Navigation />

      {/* Privacy Hero */}
      <section className="privacy-hero">
        <div className="container">
          <h1>Privacy Policy</h1>
          <p>Last updated: December 4, 2025</p>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="privacy-content">
        <div className="container">
          <div className="privacy-section">
            <h2>Information We Collect</h2>
            <p>At Frostburg Clothing, we are committed to protecting your privacy. We collect information to provide and improve our services, and to communicate with you about products, services, and promotions.</p>
            
            <h3>Personal Information</h3>
            <p>When you make a purchase or create an account, we collect personal information such as:</p>
            <ul>
              <li>Name and contact details</li>
              <li>Shipping and billing address</li>
              <li>Payment information</li>
              <li>Purchase history</li>
              <li>Communication preferences</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <p>We automatically collect certain information when you visit our website, including:</p>
            <ul>
              <li>IP address and device information</li>
              <li>Browser type and settings</li>
              <li>Pages visited and time spent</li>
              <li>Referring website information</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h2>How We Use Your Information</h2>
            <p>We use the information we collect for various purposes, including:</p>
            <ul>
              <li>Processing and fulfilling your orders</li>
              <li>Providing customer support</li>
              <li>Improving our products and services</li>
              <li>Sending marketing communications (with your consent)</li>
              <li>Preventing fraud and enhancing security</li>
              <li>Complying with legal obligations</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h2>Information Sharing</h2>
            <p>We do not sell or rent your personal information to third parties. We may share your information with:</p>
            <ul>
              <li>Payment processors to complete transactions</li>
              <li>Shipping carriers to deliver your orders</li>
              <li>Service providers who assist with our operations</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h2>Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access and review your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
              <li>Request information about how your data is used</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h2>Cookies and Tracking</h2>
            <p>We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content.</p>
          </div>

          <div className="privacy-section">
            <h2>Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
          <p>Email: privacy@frostburgclothing.com</p>
          <p>Phone: (301) 420-6969</p>
          <p>Frostburg Clothing<br />
          123 Mountain View Drive<br />
          Frostburg, MD 21532</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
