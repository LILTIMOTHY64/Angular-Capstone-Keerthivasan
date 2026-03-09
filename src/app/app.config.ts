import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  APP_INITIALIZER,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { CartService } from './services/cart.service';

import { routes } from './app.routes';

/**
 * Angular app configuration with dependency injection providers
 * - Global error listeners for unhandled errors
 * - Router with component input binding (route params → component inputs)
 * - HttpClient with fetch API (instead of XMLHttpRequest)
 * - Cart service initialization to restore persisted cart on app startup
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch()),
    // Initialize cart service early to restore persisted cart items
    {
      provide: APP_INITIALIZER,
      useFactory: (cartService: CartService) => {
        return () => {
          cartService.getCartItems();
          return Promise.resolve();
        };
      },
      deps: [CartService],
      multi: true,
    },
  ],
};
