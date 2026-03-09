import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Bootstrap the Angular application with the root AppComponent and application configuration
// This initializes the Angular application and mounts it to the DOM
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
