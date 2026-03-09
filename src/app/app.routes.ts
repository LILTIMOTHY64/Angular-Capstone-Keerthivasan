import { Routes } from '@angular/router';
import { ownerGuard } from './guards/owner.guard';
import { buyerGuard } from './guards/buyer.guard';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { noAuthGuard } from './guards/no-auth.guard';
import { ProductListPageComponent } from './pages/product-list-page/product-list-page.component';
import { ProductDetailPageComponent } from './pages/product-detail-page/product-detail-page.component';
import { ProductManagePageComponent } from './pages/product-manage-page/product-manage-page.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { PageNotFoundComponent } from './pages/not-found-page/not-found-page.component';

/**
 * Application routes with lazy loading and role-based guards
 * All feature components load only when route is activated
 */
export const routes: Routes = [
  {
    // Root path - displays all available products
    path: '',
    component: ProductListPageComponent,
    data: { title: 'All Products' },
  },
  {
    // Public route - displays all available products
    path: 'products',
    component: ProductListPageComponent,
    data: { title: 'All Products' },
  },
  {
    // Public route - displays detailed view of a single product
    path: 'products/:id',
    component: ProductDetailPageComponent,
    data: { title: 'Product Details' },
  },
  {
    // Protected route - only accessible to owners
    // Used for adding new products
    path: 'products/add',
    canActivate: [ownerGuard],
    component: ProductManagePageComponent,
    data: { title: 'Add Product' },
  },
  {
    // Protected route - only accessible to owners
    // Used for editing existing products
    path: 'products/:id/edit',
    canActivate: [ownerGuard],
    component: ProductManagePageComponent,
    data: { title: 'Edit Product' },
  },
  {
    // Protected route - only accessible to buyers
    // Displays user's shopping cart
    path: 'cart',
    component: CartPageComponent,
    data: { title: 'Your Cart' },
  },
  {
    // Login route - allows users to authenticate
    path: 'login',
    component: LoginPageComponent,
    canActivate: [noAuthGuard],
    data: { title: 'Login' },
  },
  {
    // Wildcard route - catches all undefined routes
    // Render Page Not Found component for unknown routes
    path: '**',
    component: PageNotFoundComponent,
    data: { title: 'Page Not Found' },
  },
];
