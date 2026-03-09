import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ErrorService } from '../../services/error.service';
import { ErrorMessageComponent } from '../../shared/error-message/error-message.component';
import { ToastService } from '../../services/toast.service';

/**
 * Login page with form validation
 * Supports DummyJSON users: emilys/emilyspass (buyer) or atuny0/9uQFF12e (owner)
 */
@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, ErrorMessageComponent],
  templateUrl: './login-page.component.html',
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  private readonly authService = inject(AuthService);
  private readonly errorService = inject(ErrorService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  // Reactive form with username and password validation
  protected readonly form = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  // Handle form submission - calls API and navigates on success
  protected onSubmit(): void {
    if (this.form.invalid) return;
    const { username, password } = this.form.getRawValue();
    this.authService.login(username, password).subscribe({
      next: () => {
        this.errorService.clearError();
        this.toastService.success('Welcome back!');
        this.router.navigateByUrl('/products');
      },
      error: (err) => {
        this.errorService.setError(err.message || 'Login failed. Please try again.');
      },
    });
  }
}
