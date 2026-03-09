import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Footer component - copyright and attribution
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer
      class="footer-textured text-center py-10 mt-auto border-t"
      style="border-color: var(--flopkart-border); color: var(--color-text-light); position: relative"
    >
      <div style="position: relative; z-index: 1">
        <p
          class="text-sm font-medium mb-2"
          style="color: var(--color-text)"
          i18n="@@footerCopyright"
        >
          &copy; 2026 Flopkart &mdash; Your trusted online store
        </p>
        <p class="text-xs">
          Powered by
          <a
            href="https://fakestoreapi.com"
            target="_blank"
            rel="noopener noreferrer"
            class="font-semibold underline hover:no-underline transition-all"
            style="color: var(--flopkart-blue)"
            >FakeStoreAPI</a
          >
          &amp; Angular v21
        </p>
      </div>
    </footer>
  `,
  styleUrl: './footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

// Footer component
export class FooterComponent {}
