# Frostburg Clothing - Next.js E-commerce Website

A modern, responsive e-commerce website built with Next.js 15, React, and TypeScript. This project converts the original HTML-based e-commerce website into a modern Next.js application using the App Router.

## 🚀 Features

- **Next.js 15** with App Router for optimal performance
- **TypeScript** for type safety and better developer experience
- **Responsive Design** that works on all devices
- **Static Site Generation** for fast loading times
- **Shopping Cart** with localStorage persistence
- **Product Catalog** with filtering and search
- **Product Detail Pages** with dynamic routing
- **Contact Form** with validation
- **User Authentication** pages (login/signup)
- **Checkout Process** with order summary
- **Modern UI/UX** with smooth animations

## 📁 Project Structure

```
nextjs-ecommerce/
├── app/
│   ├── about/
│   │   └── page.tsx          # About page
│   ├── checkout/
│   │   └── page.tsx          # Checkout page
│   ├── contact/
│   │   └── page.tsx          # Contact page
│   ├── login/
│   │   └── page.tsx          # Login/Signup page
│   ├── product/
│   │   └── [id]/
│   │       └── page.tsx      # Dynamic product pages
│   ├── store/
│   │   └── page.tsx          # Store/product catalog
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── next.config.js            # Next.js configuration
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

## 🛠️ Installation & Setup

1. **Navigate to the project directory:**
   ```bash
   cd nextjs-ecommerce
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser and visit:**
   ```
   http://localhost:3000
   ```

## 📱 Pages & Features

### Home Page (`/`)
- Hero section with call-to-action
- Featured products showcase
- Company features and benefits
- Responsive navigation

### Store (`/store`)
- Complete product catalog
- Search functionality
- Category filtering
- Price range filtering
- Sort by name/price
- Add to cart functionality

### Product Details (`/product/[id]`)
- Dynamic routing for individual products
- Product images and descriptions
- Size and color selection
- Quantity selection
- Related products
- Add to cart with options

### About (`/about`)
- Company story and mission
- Team member profiles
- Sustainability commitment
- Company values

### Contact (`/contact`)
- Contact form with validation
- Company information
- FAQ section
- Business hours

### Login/Signup (`/login`)
- Tab-based authentication
- Form validation
- Password strength indicator
- Social login options
- Account benefits showcase

### Checkout (`/checkout`)
- Shopping cart review
- Order summary with calculations
- Shipping information form
- Payment information form
- Secure checkout process

## 🎨 Design System

### Color Palette
- **Primary**: `#3a86ff` (Blue)
- **Secondary**: `#8338ec` (Purple)
- **Accent**: `#ff006e` (Pink)
- **Dark**: `#1a1a2e` (Dark Blue)
- **Light**: `#f8f9fa` (Light Gray)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Responsive**: Scales appropriately across devices

### Components
- Responsive navigation with mobile menu
- Product cards with hover effects
- Form elements with consistent styling
- Buttons with multiple variants
- Grid layouts for product displays

## 🛒 Shopping Cart Features

- **Local Storage**: Cart persists between sessions
- **Item Management**: Add, remove, update quantities
- **Real-time Updates**: Cart count updates across all pages
- **Order Summary**: Automatic calculation of totals, tax, and shipping
- **Form Validation**: Required fields and proper formatting

## 📱 Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Responsive layouts for tablets
- **Desktop Enhancement**: Enhanced features for larger screens
- **Touch-Friendly**: Appropriate touch targets and interactions

## 🔧 Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🚀 Deployment

This Next.js application can be deployed to various platforms:

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Deploy the 'out' folder
```

### Other Platforms
- AWS Amplify
- DigitalOcean App Platform
- Railway
- Render

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

If you have any questions or need help with setup, please open an issue on GitHub.

---

**Built with ❤️ using Next.js 15 and TypeScript**