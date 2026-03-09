# Flopkart 🛒 Angular Capstone Project

A modern e-commerce Angular application with real API integration, cart persistence, and comprehensive admin features. Built following all Angular 21 best practices.

## ✨ Features

### 👥 User Roles
- **Buyer**: Browse products, add to cart, view persistent cart
- **Owner**: Create, edit, and delete products with success notifications
- **Authentication**: Real DummyJSON API integration with JWT token management

### 🛍️ Product Management
- Browse all products with category filtering and pagination (6 items per page)
- Product detail pages with images and descriptions
- Add/edit products (owner only)
- Delete products with confirmation modal and success message (owner only)
- Real-time quantity tracking in cart controls

### 🛒 Shopping Cart
- **Persistent cart**: Uses browser localStorage for session recovery
- Add/remove items and adjust quantities
- Real-time total price calculation
- Cart badge updates on header
- Cart state survives page reloads and browser restarts

### 🔐 Authentication
- DummyJSON API integration (`https://dummyjson.com/auth/login`)
- JWT token-based authentication with 30-minute expiration
- Session persistence using localStorage
- Login success popup with user display name
- Functional route guards (authGuard, ownerGuard, buyerGuard)

### 🎨 UI/UX
- Responsive design (mobile, tablet, desktop)
- Success/error messages with loading spinners
- Modal confirmations for destructive actions
- Smooth transitions and animations
- Consistent card heights (no layout shift on state changes)
- Accessibility: WCAG AA compliant with ARIA attributes
- i18n ready (Spanish translations via XLIFF)

---

## Tech Stack

- **Angular 21** (standalone components, signals, native control flow, OnPush change detection)
- **Tailwind CSS v4** (utility-first styling)
- **RxJS** (observables, BehaviorSubject for cart state)
- **Angular Reactive Forms** with `FormBuilder.nonNullable`
- **Angular Router** (lazy-loaded feature routes with functional guards)
- **HttpClient** with fetch API
- **i18n via XLIFF** (`src/locale/messages.xlf`)

---

## Folder Structure

```
src/
  app/
    pages/
      product-list-page/    # Browse products, category filter, pagination
      product-detail-page/  # Single product view with cart controls
      product-manage-page/  # Add / edit product form (owner only)
      cart-page/            # Cart shell with checkout modal stub
      login-page/           # Login form with redirect on success
      not-found-page/       # 404 wildcard route
    components/
      products/
        product-card/       # Presentational card (inputs: product, quantity; outputs: add, increment, decrement, edit, remove)
        product-form/       # Reactive form for create / edit (inputs: product?, categories)
      cart/
        cart-view/          # Cart items list with quantity controls and modals
        cart-row/           # Presentational single cart row (outputs: increment, decrement, confirmRemove)
        cart-icon/          # Header badge showing total item count
    shared/
      header/               # App header with navigation and cart icon
      footer/               # App footer
      error-message/        # Global error display
      loading-spinner/      # Global loading indicator
    services/
      auth.service.ts       # DummyJSON JWT authentication, session persistence
      cart.service.ts       # Cart state (BehaviorSubject + localStorage)
      api.service.ts        # HTTP client for products and categories
      error.service.ts      # Global error handling
      loading.service.ts    # Loading state management
    guards/
      auth.guard.ts         # Redirects unauthenticated users to /login
      no-auth.guard.ts      # Redirects logged-in users away from /login
      owner.guard.ts        # Restricts routes to owners; redirects to /404
      buyer.guard.ts        # Restricts routes to buyers
    models/
      product.model.ts      # Product interface
      cart.model.ts         # CartItem interface, CartAction type
    app.routes.ts           # Routes with lazy loading, guards, and data.title
    app.config.ts           # provideRouter, provideHttpClient, provideClientHydration
    app.component.ts        # Root component; sets dynamic page title on NavigationEnd
  locale/
    messages.xlf            # i18n source strings (English)
    messages.es.xlf         # Spanish translations
  styles.css                # Tailwind entry + global CSS variables
  main.ts
```
