import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { ToastComponent } from './shared/toast/toast.component';

/**
 * Root component: layout with Header + RouterOutlet + Footer
 * All routed pages render in RouterOutlet
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly title = inject(Title);

  ngOnInit(): void {
    // Update document title from route data on navigation end
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      let activeRoute = this.route.root;
      while (activeRoute.firstChild) activeRoute = activeRoute.firstChild;
      const routeData = activeRoute.snapshot.data as { title?: string } | undefined;
      const pageTitle = routeData && routeData.title ? `Flopkart - ${routeData.title}` : 'Flopkart';
      this.title.setTitle(pageTitle);
    });
  }
}
