import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"

export default function Accessibility() {
  return (
    <div>
      <Navigation />

      {/* Accessibility Hero */}
      <section className="accessibility-hero">
        <div className="container">
          <h1>Accessibility Statement</h1>
          <p>Our commitment to making our website accessible to everyone</p>
        </div>
      </section>

      {/* Accessibility Content */}
      <section className="accessibility-content">
        <div className="container">
          <div className="accessibility-section">
            <h2>Our Commitment</h2>
            <p>Frostburg Clothing is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.</p>
          </div>

          <div className="accessibility-section">
            <h2>Conformance Status</h2>
            <p>The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. We strive to meet WCAG 2.1 Level AA guidelines, which define how to make web content more accessible for people with disabilities.</p>
            
            <h3>Measures to Support Accessibility</h3>
            <p>Frostburg Clothing takes the following measures to ensure accessibility:</p>
            <ul>
              <li>Include accessibility as part of our mission statement</li>
              <li>Integrate accessibility into our procurement practices</li>
              <li>Provide continual accessibility training for our staff</li>
              <li>Assign clear accessibility goals and responsibilities</li>
            </ul>
          </div>

          <div className="accessibility-section">
            <h2>Accessibility Features</h2>
            <p>Our website includes several features designed to improve accessibility for users with disabilities:</p>
            <ul>
              <li>Keyboard navigation support</li>
              <li>Screen reader compatibility</li>
              <li>Alternative text for images</li>
              <li>Clear and consistent navigation</li>
              <li>Responsive design for various screen sizes</li>
              <li>High contrast mode compatibility</li>
              <li>Resizable text without loss of functionality</li>
            </ul>
          </div>

          <div className="accessibility-section">
            <h2>Feedback</h2>
            <p>We welcome your feedback on the accessibility of Frostburg Clothing. Please let us know if you encounter accessibility barriers:</p>
            <ul>
              <li>Email: accessibility@frostburgclothing.com</li>
              <li>Phone: (301) 420-6969</li>
              <li>Address: 123 Mountain View Drive, Frostburg, MD 21532</li>
            </ul>
          </div>

          <div className="accessibility-section">
            <h2>Technical Specifications</h2>
            <p>Accessibility of Frostburg Clothing relies on the following technologies to work with the particular combination of web browser and any assistive technologies or plugins installed on your computer:</p>
            <ul>
              <li>HTML</li>
              <li>WAI-ARIA</li>
              <li>CSS</li>
              <li>JavaScript</li>
            </ul>
            <p>These technologies are relied upon for conformance with the accessibility standards used.</p>
          </div>

          <div className="accessibility-section">
            <h2>Assessment Approach</h2>
            <p>Frostburg Clothing assesses the accessibility of our website through the following approaches:</p>
            <ul>
              <li>Self-evaluation</li>
              <li>External evaluation by accessibility experts</li>
              <li>Continuous monitoring and improvement</li>
            </ul>
          </div>

          <div className="accessibility-section">
            <h2>Limitations and Alternatives</h2>
            <p>Despite our best efforts to ensure accessibility of Frostburg Clothing, there may be some limitations. Please contact us if you observe an issue.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
