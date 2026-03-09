import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';

/**
 * Root component: layout with Header + RouterOutlet + Footer
 * All routed pages render in RouterOutlet
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
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
      let rt = this.route.root;
      while (rt.firstChild) rt = rt.firstChild;
      const data = rt.snapshot.data as { title?: string } | undefined;
      const title = data && data.title ? `Flopkart - ${data.title}` : 'Flopkart';
      this.title.setTitle(title);
    });
  }
}
