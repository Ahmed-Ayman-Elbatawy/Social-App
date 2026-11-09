import { AuthService } from './../../core/auth/services/auth.service';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { email, validate } from '@angular/forms/signals';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);

  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  msgText = signal('');
  showPass = signal(false);

  loginForm = this.fb.group({
    login: ['', Validators.required],
    password: ['', Validators.required],
  });

  // loginForm = new FormGroup({
  //   login: new FormControl('', [Validators.required]),
  //   password: new FormControl('', [Validators.required]),
  // });

  sendLoginData(): void {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      this.authService.signIn(this.loginForm.value).subscribe({
        next: (res) => {
          console.log(res);
          if (res.success) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            this.router.navigate(['/timeline']);
          }
        },
        error: (err) => {
          console.log(err);

          this.msgText.set(err.error.message);
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
