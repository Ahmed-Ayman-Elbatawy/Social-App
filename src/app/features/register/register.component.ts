import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  msgText = signal('');
  showPass = signal(false);
  showRe = signal(false);

  registerForm = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      username: [''],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
        ],
      ],
      rePassword: ['', Validators.required],
    },
    { validators: this.confirmPassword },
  );

  // registerForm = new FormGroup(
  //   {
  //     name: new FormControl('', [Validators.required, Validators.minLength(3)]),
  //     username: new FormControl(''),
  //     email: new FormControl('', [Validators.required, Validators.email]),
  //     dateOfBirth: new FormControl('', [Validators.required]),
  //     gender: new FormControl('', [Validators.required]),
  //     password: new FormControl('', [
  //       Validators.required,
  //       Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
  //     ]),
  //     rePassword: new FormControl('', [Validators.required]),
  //   },
  //   { updateOn: 'submit' },
  // );

  confirmPassword(group: AbstractControl) {
    let password = group.get('password')?.value;
    let rePassword = group.get('rePassword')?.value;

    if (password !== rePassword) {
      return { mismatch: true };
    } else {
      return null;
    }
  }

  sendRegisterData(): void {
    if (this.registerForm.valid) {
      this.authService.signUp(this.registerForm.value).subscribe({
        next: (res) => {
          console.log(res);
          if (res.success) {
            this.router.navigate(['/login']);
          }
        },
        error: (err) => {
          console.log(err);
          this.msgText.set(err.error.message);
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
