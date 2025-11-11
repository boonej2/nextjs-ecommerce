'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navigation from "@/components/Navigation"
import { signInAction } from '@/app/actions/auth'
import { checkAuthStatus, signOutUser } from '@/lib/auth-client'

export default function Login() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('login')
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isSignupLoading, setIsSignupLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [user, setUser] = useState<{ id: string; email: string; name?: string | null } | null>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    // Check authentication status
    checkAuthStatus().then(({ authenticated, user }) => {
      if (authenticated && user) {
        setUser(user)
      }
      setIsCheckingAuth(false)
    })
  }, [])

  const handleSignOut = async () => {
    const success = await signOutUser()
    if (success) {
      setUser(null)
      setSuccess('Signed out successfully')
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } else {
      setError('Failed to sign out. Please try again.')
    }
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    if (!email || !password) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }
    
    try {
      // Use server action which handles CSRF automatically
      const result = await signInAction(formData)
      
      // Debug: Log the result (remove in production)
      console.log('signInAction result:', result)
      
      if (result?.error) {
        setError(result.error === 'CredentialsSignin' ? 'Invalid email or password' : result.error)
        setIsLoading(false)
      } else if (result?.success) {
        // Successful login - update user state and redirect
        const authStatus = await checkAuthStatus()
        if (authStatus.authenticated && authStatus.user) {
          setUser(authStatus.user)
        }
        setSuccess('Login successful! Redirecting...')
        setTimeout(() => {
          router.push('/')
          router.refresh()
        }, 500)
      } else {
        // Debug: Log when we hit the else case
        console.log('Unexpected result structure:', result)
        setError('Authentication failed. Please try again.')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('An error occurred during login. Please try again.')
      setIsLoading(false)
    }
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSignupLoading(true)
    setError(null)
    setSuccess(null)
    const formData = new FormData(e.target as HTMLFormElement)
    const firstName = formData.get('firstname') as string
    const lastName = formData.get('lastname') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirm-password') as string
    
    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      setIsSignupLoading(false)
      return
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match!')
      setIsSignupLoading(false)
      return
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      setIsSignupLoading(false)
      return
    }
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          email,
          password,
        }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSuccess('Account created successfully! Signing you in...')
        // Auto-login is handled by the registration route
        // Check auth status and update user state
        setTimeout(async () => {
          const authStatus = await checkAuthStatus()
          if (authStatus.authenticated && authStatus.user) {
            setUser(authStatus.user)
          }
          router.push('/')
          router.refresh()
        }, 1000)
      } else {
        setError(data.error || 'Registration failed. Please try again.')
        setIsSignupLoading(false)
      }
    } catch (error) {
      console.error('Registration error:', error)
      setError('An error occurred during registration. Please try again.')
      setIsSignupLoading(false)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value
    let strength = 0
    
    if (password.length >= 8) strength += 1
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 1
    if (password.match(/\d/)) strength += 1
    if (password.match(/[^a-zA-Z\d]/)) strength += 1
    
    setPasswordStrength(strength)
  }

  const getStrengthColor = () => {
    const colors = ['#d00000', '#ff9e00', '#ffd000', '#9acd32', '#38b000']
    return colors[passwordStrength] || '#d00000'
  }

  const getStrengthLabel = () => {
    const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong']
    return labels[passwordStrength] || 'Very Weak'
  }

  return (
    <div>
      <Navigation />

      {/* Login/Signup Hero Section */}
      <section className="login-hero">
        <div className="container">
          <h1 className="hero-title">Welcome Back</h1>
          <p className="hero-subtitle">Sign in to your account or create a new one to access exclusive features</p>
        </div>
      </section>

      {/* Login/Signup Form Section */}
      <section className="auth-section">
        <div className="container">
          {isCheckingAuth ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Loading...</p>
            </div>
          ) : user ? (
            <div className="auth-container" style={{ textAlign: 'center', padding: '3rem' }}>
              <h2 style={{ marginBottom: '1rem' }}>Welcome back, {user.name || user.email}!</h2>
              <p style={{ marginBottom: '2rem', color: 'var(--gray-color)' }}>
                You are already signed in.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Link href="/" className="btn btn-primary">
                  Go to Home
                </Link>
                <button onClick={handleSignOut} className="btn btn-outline">
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
          <div className="auth-container">
            <div className="auth-tabs">
              <button 
                className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`} 
                onClick={() => {
                  setActiveTab('login')
                  setError(null)
                  setSuccess(null)
                }}
              >
                Login
              </button>
              <button 
                className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`} 
                onClick={() => {
                  setActiveTab('signup')
                  setError(null)
                  setSuccess(null)
                }}
              >
                Sign Up
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="auth-message auth-error">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="auth-message auth-success">
                {success}
              </div>
            )}

            {/* Login Form */}
            <div className={`auth-form ${activeTab === 'login' ? 'active' : ''}`} id="login-form">
              <form className="login-form" onSubmit={handleLoginSubmit}>
                <div className="form-group">
                  <label htmlFor="login-email">Email Address</label>
                  <input type="email" id="login-email" name="email" placeholder="Enter your email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="login-password">Password</label>
                  <input type="password" id="login-password" name="password" placeholder="Enter your password" required />
                </div>
                <div className="form-options">
                  <label className="checkbox-label">
                    <input type="checkbox" name="remember" />
                    <span className="checkmark"></span>
                    Remember me
                  </label>
                  <a href="#" className="forgot-password">Forgot password?</a>
                </div>
                <button type="submit" className="btn btn-primary btn-full" disabled={isLoading || isSignupLoading}>
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
              
              
            </div>

            {/* Signup Form */}
            <div className={`auth-form ${activeTab === 'signup' ? 'active' : ''}`} id="signup-form">
              <form className="signup-form" onSubmit={handleSignupSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="signup-firstname">First Name</label>
                    <input type="text" id="signup-firstname" name="firstname" placeholder="Enter your first name" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="signup-lastname">Last Name</label>
                    <input type="text" id="signup-lastname" name="lastname" placeholder="Enter your last name" required />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="signup-email">Email Address</label>
                  <input type="email" id="signup-email" name="email" placeholder="Enter your email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="signup-password">Password</label>
                  <input 
                    type="password" 
                    id="signup-password" 
                    name="password" 
                    placeholder="Create a password" 
                    required 
                    onChange={handlePasswordChange}
                  />
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div 
                        className="strength-fill" 
                        style={{ 
                          width: `${(passwordStrength / 4) * 100}%`,
                          backgroundColor: getStrengthColor()
                        }}
                      ></div>
                    </div>
                    <span className="strength-text">{getStrengthLabel()}</span>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="signup-confirm-password">Confirm Password</label>
                  <input type="password" id="signup-confirm-password" name="confirm-password" placeholder="Confirm your password" required />
                </div>
                <div className="form-options">
                  <label className="checkbox-label">
                    <input type="checkbox" name="newsletter" />
                    <span className="checkmark"></span>
                    Send me updates about new products and promotions
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" name="terms" required />
                    <span className="checkmark"></span>
                    I agree to the <a href="#" className="link">Terms of Service</a> and <a href="#" className="link">Privacy Policy</a>
                  </label>
                </div>
                <button type="submit" className="btn btn-primary btn-full" disabled={isLoading || isSignupLoading}>
                  {isSignupLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            </div>
          </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="auth-benefits">
        <div className="container">
          <h2 className="section-title">Why Create an Account?</h2>
          <div className="benefits-grid">
            <div className="benefit">
              <div className="benefit-icon">🚚</div>
              <h3>Faster Checkout</h3>
              <p>Save your shipping and payment details for quick and easy purchases</p>
            </div>
            <div className="benefit">
              <div className="benefit-icon">📦</div>
              <h3>Order Tracking</h3>
              <p>Track your orders and view your complete order history</p>
            </div>
            <div className="benefit">
              <div className="benefit-icon">⭐</div>
              <h3>Exclusive Offers</h3>
              <p>Get access to members-only sales and special promotions</p>
            </div>
            <div className="benefit">
              <div className="benefit-icon">❤️</div>
              <h3>Wish Lists</h3>
              <p>Save your favorite items and create multiple wish lists</p>
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

      <style jsx>{`
        /* Login Hero Section */
        .login-hero {
          margin-top: 70px;
          padding: 80px 0;
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          color: white;
          text-align: center;
        }

        .login-hero .hero-title {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .login-hero .hero-subtitle {
          font-size: 1.25rem;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto;
        }

        /* Auth Section */
        .auth-section {
          padding: 80px 0;
          background: white;
        }

        .auth-container {
          max-width: 500px;
          margin: 0 auto;
          background: white;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          overflow: hidden;
        }

        .auth-tabs {
          display: flex;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
        }

        .auth-tab {
          flex: 1;
          padding: 1.5rem;
          background: none;
          border: none;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--gray-color);
          cursor: pointer;
          transition: var(--transition);
        }

        .auth-tab.active {
          background: white;
          color: var(--primary-color);
          border-bottom: 2px solid var(--primary-color);
        }

        .auth-tab:hover:not(.active) {
          background: rgba(255, 255, 255, 0.5);
          color: var(--dark-color);
        }

        .auth-message {
          padding: 1rem;
          margin: 1rem 2rem 0;
          border-radius: var(--border-radius);
          font-size: 0.9rem;
          font-weight: 500;
          text-align: center;
        }

        .auth-error {
          background-color: #fee;
          color: #c33;
          border: 1px solid #fcc;
        }

        .auth-success {
          background-color: #efe;
          color: #3c3;
          border: 1px solid #cfc;
        }

        .auth-form {
          display: none;
          padding: 2rem;
        }

        .auth-form.active {
          display: block;
        }

        .btn-full {
          width: 100%;
          padding: 15px;
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-options {
          margin: 1.5rem 0;
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          margin-bottom: 1rem;
          cursor: pointer;
          font-size: 0.9rem;
          color: var(--gray-color);
        }

        .checkbox-label input {
          margin-right: 0.75rem;
          margin-top: 0.25rem;
        }

        .forgot-password {
          color: var(--primary-color);
          text-decoration: none;
          font-size: 0.9rem;
        }

        .forgot-password:hover {
          text-decoration: underline;
        }

        .auth-divider {
          text-align: center;
          margin: 2rem 0;
          position: relative;
          color: var(--gray-color);
        }

        .auth-divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #e9ecef;
        }

        .auth-divider span {
          background: white;
          padding: 0 1rem;
          position: relative;
        }

        .social-login {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .btn-social {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 12px;
        }

        .social-icon {
          font-size: 1.2rem;
        }

        /* Password Strength */
        .password-strength {
          margin-top: 0.5rem;
        }

        .strength-bar {
          width: 100%;
          height: 4px;
          background: #e9ecef;
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 0.25rem;
        }

        .strength-fill {
          height: 100%;
          width: 0%;
          transition: all 0.3s ease;
          border-radius: 2px;
        }

        .strength-text {
          font-size: 0.8rem;
          color: var(--gray-color);
        }

        /* Benefits Section */
        .auth-benefits {
          padding: 80px 0;
          background: #f8f9fa;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .benefit {
          text-align: center;
          padding: 2rem;
          background: white;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          transition: var(--transition);
        }

        .benefit:hover {
          transform: translateY(-5px);
        }

        .benefit-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .benefit h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: var(--dark-color);
        }

        .benefit p {
          color: var(--gray-color);
          line-height: 1.6;
        }

        .link {
          color: var(--primary-color);
          text-decoration: none;
        }

        .link:hover {
          text-decoration: underline;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .login-hero .hero-title {
            font-size: 2.5rem;
          }

          .auth-container {
            margin: 0 1rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .social-login {
            grid-template-columns: 1fr;
          }

          .benefits-grid {
            grid-template-columns: 1fr;
          }
          
          .auth-tabs {
            flex-direction: column;
          }
          
          .auth-tab {
            padding: 1.25rem;
          }
        }

        @media (max-width: 480px) {
          .login-hero .hero-title {
            font-size: 2rem;
          }

          .login-hero .hero-subtitle {
            font-size: 1rem;
          }

          .auth-form {
            padding: 1.5rem;
          }

          .benefit {
            padding: 1.5rem;
          }
        }

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

        .nav-link:hover,
        .nav-link.active {
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

        /* Form Styles */
        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: var(--dark-color);
        }

        .form-group input {
          width: 100%;
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: var(--border-radius);
          font-size: 1rem;
          transition: var(--transition);
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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

        .btn-primary:hover:not(:disabled) {
          background: var(--secondary-color);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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

        /* Section Title */
        .section-title {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: var(--dark-color);
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

        /* Checkbox Styles */
        .checkmark {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 2px solid #d1d5db;
          border-radius: 3px;
          margin-right: 0.75rem;
          position: relative;
        }

        .checkbox-label input:checked + .checkmark::after {
          content: '';
          position: absolute;
          left: 4px;
          top: 1px;
          width: 6px;
          height: 10px;
          border: solid var(--primary-color);
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .checkbox-label input:checked + .checkmark {
          border-color: var(--primary-color);
        }

        /* Mobile Navigation */
        @media (max-width: 768px) {
          .nav-menu {
            display: none;
          }

          .hamburger {
            display: flex;
          }

          .nav-logo a {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  )
}
