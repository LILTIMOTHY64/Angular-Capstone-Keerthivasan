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
    features/
      products/         # product-card, product-list-page, product-detail-page,
                       # product-manage-page (create/edit), product-form
      cart/             # cart-view (display), cart-icon (badge), cart-page
      auth/             # login-page
    shared/             # header, footer, error-message, loading-spinner
    service/
      auth.service.ts          # DummyJSON JWT authentication
      cart.service.ts          # Cart state with localStorage persistence
      api.service.ts           # HTTP client for products
      auth.guard.ts            # Functional route guards
      error.service.ts         # Global error handling
      loading.service.ts       # Loading state management
  locale/               # messages.xlf (i18n - English & Spanish)
  styles.css            # Tailwind entry + global CSS variables
  main.ts
  app.config.ts         # Provider configuration + APP_INITIALIZER for cart
  app.routes.ts         # Lazy-loaded routes with guards
  app.component.ts
```
