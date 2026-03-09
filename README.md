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

---

## Best Practices Applied

| Practice | Implementation |
|---|---|
| **Standalone components** | All components use `standalone: true` |
| **Signal-based state** | Auth (signals), Cart (RxJS Observable), computed derived state |
| **OnPush change detection** | Every component for performance |
| **Dependency injection** | `inject()` function, no constructor parameters |
| **Reactive Forms** | `FormBuilder.nonNullable` with validators |
| **Native control flow** | `@if`, `@for`, `@switch` only (no `*ngIf`/`*ngFor`) |
| **Type safety** | No `any` types, explicit or inferred |
| **No deprecated APIs** | No `@HostBinding`/`@HostListener`, uses `host` config |
| **Lazy loading** | Routes use `loadComponent()` for code splitting |
| **Error handling** | Global error service with user-facing messages |
| **Loading states** | Centralized loading service with spinners |
| **Accessibility** | WCAG AA: ARIA attributes, semantic HTML, color contrast, focus management |
| **i18n ready** | All user-visible strings use `i18n` attributes |
| **Utility CSS** | Tailwind classes, minimal custom CSS with CSS variables |
| **Small focused components** | Single responsibility principle |
| **Data persistence** | localStorage for cart and user session |
| **Computed signals** | Reactive state without manual subscriptions |
| **Observable-to-signal** | `toSignal()` for RxJS interoperability |

---

## Getting Started

### Demo Users (DummyJSON)

```
Buyer:  username: emilys, password: emilyspass
Owner:  username: michaelw, password: michaelwpass
```

### Commands

```bash
# Install dependencies
npm install

# Start dev server
npm start
# Open http://localhost:4200

# Build for production
npm run build

# Extract i18n strings
ng extract-i18n --output-path src/locale
```

---

## Routes

| Path | Component | Auth | Notes |
|---|---|---|---|
| `/` | App redirect | - | Redirects to /products |
| `/products` | ProductListPageComponent | - | Browse all products with filters and pagination |
| `/product/:id` | ProductDetailPageComponent | - | Single product detail, add to cart, delete (owner) |
| `/cart` | CartPageComponent | buyerGuard | View/manage cart items with persistence |
| `/login` | LoginPageComponent | - | Authentication with DummyJSON API |
| `/add` | ProductManagePageComponent | ownerGuard | Create new product (owner only) |
| `/manageProduct/:id` | ProductManagePageComponent | ownerGuard | Edit existing product (owner only) |

---

## Key Features

### Authentication (AuthService)
- Real DummyJSON API: `POST https://dummyjson.com/auth/login`
- Request: `{ username, password, expiresInMins: 30 }`
- Response: JWT tokens + user profile
- Session persistence: localStorage with key `'flopkart_user'`
- State: Angular signals with computed derived signals

### Cart (CartService)
- Hybrid state management: RxJS BehaviorSubject
- Persistence: localStorage with key `'flopkart_cart'`
- Auto-restoration: APP_INITIALIZER loads cart at app startup
- Observable streams: `items$`, `totalCount$`, `totalPrice$`
- Signal integration: `toSignal()` for component reactivity

### Product Management (ApiService)
- GET `/products` - All products
- GET `/products/:id` - Single product
- POST `/products/add` - Create product
- PUT `/products/:id` - Update product
- DELETE `/products/:id` - Delete product

---

## Component Highlights

### ProductCardComponent
- Reusable product display card
- Computed quantity signal tracks cart state
- Dynamic "Add to Cart" / quantity controls UI
- Responsive layout with consistent card height
- No layout shift when button state changes

### ProductDetailPageComponent
- Product image + full details
- Cart controls (quantity +/-)
- Delete button with confirmation modal
- Success message with redirect
- Loading spinner during API calls

### ProductManagePageComponent
- Create (route: `/add`) or Edit (route: `/manageProduct/:id`)
- Form pre-population in edit mode
- Success message with 2-second redirect
- Global error/loading state

### CartPageComponent
- View all cart items with images
- Adjust quantities per item
- Remove individual items
- Real-time total calculation
- Persistent state across sessions

### LoginPageComponent
- DummyJSON authentication
- Login success popup with display name
- 2-second redirect to products page
- Error messages for invalid credentials
- Demo credentials displayed

---

## State Management

**Signals (Auth)**
```typescript
readonly userSelected = signal<AuthUser | null>(...);
readonly isLoggedIn = computed(() => this.user() !== null);
readonly isOwner = computed(() => this.user()?.role === 'owner');
readonly isBuyer = computed(() => this.user()?.role === 'buyer');
readonly displayName = computed(() => this.user()?.displayName ?? '');
```

**RxJS Observables (Cart)**
```typescript
readonly items$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();
readonly totalCount$: Observable<number> = this.items$.pipe(map(...sum quantities...));
readonly totalPrice$: Observable<number> = this.items$.pipe(map(...sum prices...));
```

**Computed Signals (Components)**
```typescript
protected readonly quantity = computed(() => {
  // Depends on toSignal(cartItems$) and this.product?.id
  return this.cartItems().find(i => i.productId === this.product?.id)?.quantity ?? 0;
});
```

---

## Accessibility Features

- ✅ WCAG AA color contrast ratios
- ✅ Semantic HTML (`<button>`, `<form>`, `<article>`, `<nav>`)
- ✅ ARIA labels (`aria-label`, `aria-describedby`, `aria-live`)
- ✅ Form validation feedback (`role="alert"`)
- ✅ Focus management (tab order, visible focus states)
- ✅ Error messages with `role="alert"`
- ✅ Live regions for cart updates (`aria-live="polite"`)

---

## Development Workflow

1. **Authentication**: Login with demo user to access features
2. **Browse**: View products on `/products` with category filters
3. **Add to Cart**: Click "Add to Cart" (buyer only), quantity controls appear
4. **Cart**: Visit `/cart` to view persisted items
5. **Create Product** (owner): `/add` form to create new products
6. **Edit Product** (owner): Click product → edit button
7. **Delete Product** (owner): Click product → delete button with confirmation
8. **Logout**: Header logout clears session

---

## i18n Translations

English (default) and Spanish translations via XLIFF:
- `src/locale/messages.xlf` - English
- `src/locale/messages.es.xlf` - Spanish

To extract new strings:
```bash
ng extract-i18n --output-path src/locale
```

---

## Performance Optimizations

- ✅ OnPush change detection strategy (all components)
- ✅ Lazy loading (feature routes)
- ✅ Code splitting (component-based bundles)
- ✅ Image optimization (Tailwind lazy loading)
- ✅ Computed signals (no unnecessary recalculations)
- ✅ Observable subscriptions (auto-unsubscribe with `@if` destruction)
- ✅ localStorage (prevents API calls for cached data)

---

## Future Enhancements

- [ ] Token refresh logic with refresh tokens
- [ ] Product search functionality
- [ ] Advanced filtering (price range, ratings)
- [ ] Order history
- [ ] Product reviews and ratings
- [ ] Wishlist feature
- [ ] Checkout with payment integration
- [ ] Admin dashboard with analytics

---

## License

MIT
