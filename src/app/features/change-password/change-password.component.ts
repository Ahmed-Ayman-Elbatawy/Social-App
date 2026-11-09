import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-change-password',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  msgText = signal('');
  succText = signal('');
  showCurrent = signal(false);
  showNew = signal(false);
  showConfirm = signal(false);
  loading = signal(false);

  changePasswordForm = this.fb.group(
    {
      password: ['', Validators.required],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
        ],
      ],
      confirm: ['', Validators.required],
    },
    { validators: this.confirmPassword },
  );

  confirmPassword(group: AbstractControl) {
    let password = group.get('newPassword')?.value;
    let rePassword = group.get('confirm')?.value;

    if (password !== rePassword) {
      return { mismatch: true };
    } else {
      return null;
    }
  }

  sendChangePasswordData(): void {
    const { password, newPassword } = this.changePasswordForm.getRawValue();
    const data = { password, newPassword };

    if (this.changePasswordForm.valid) {
      this.authService.changePassword(data).subscribe({
        next: (res) => {
          console.log(res);
          this.succText.set('Updated Successfully');
          setTimeout(() => {
            this.authService.logOut();
          }, 1500);
        },
        error: (err) => {
          console.log(err);
          this.msgText.set(err.error.message);
        },
      });
    } else {
      this.changePasswordForm.markAllAsTouched();
    }
  }

  get newValue(): string {
    return this.changePasswordForm.get('newPassword')?.value ?? '';
  }

  hasMinLength = () => this.newValue.length >= 8;
  hasLower = () => /[a-z]/.test(this.newValue);
  hasUpper = () => /[A-Z]/.test(this.newValue);
  hasNumber = () => /[0-9]/.test(this.newValue);
  hasSpecial = () => /[#?!@$%^&*-]/.test(this.newValue);

  strengthScore(): number {
    return [
      this.hasMinLength(),
      this.hasLower(),
      this.hasUpper(),
      this.hasNumber(),
      this.hasSpecial(),
    ].filter(Boolean).length;
  }
}
