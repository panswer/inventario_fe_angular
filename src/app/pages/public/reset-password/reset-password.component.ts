import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { lowerReg, numReg, specialCharReg, upperReg } from '../../../utils/reg';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent {
  emailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  verifyForm = new FormGroup({
    token: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(200),
    ]),
  });

  isLoading = false;
  message = '';
  isSuccess = false;
  currentStep: 1 | 2 = 1;
  email = '';

  constructor(private authService: AuthService, private router: Router) {
    this.verifyForm.addValidators((formGroup) => {
      const errors: Record<string, boolean> = {};
      const passwordValue = formGroup.value.password;

      if (passwordValue && !upperReg.test(passwordValue)) {
        errors['uppercase'] = true;
      }

      if (passwordValue && !lowerReg.test(passwordValue)) {
        errors['lowercase'] = true;
      }

      if (passwordValue && !numReg.test(passwordValue)) {
        errors['num'] = true;
      }

      if (passwordValue && !specialCharReg.test(passwordValue)) {
        errors['specialChar'] = true;
      }

      return errors;
    });
  }

  handleEmailSubmit(e: Event): void {
    e.preventDefault();

    const { email } = this.emailForm.value;

    if (email) {
      this.isLoading = true;
      this.message = '';

      this.authService
        .resetPassword({ email })
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((res) => {
          if (res.message && res.message.includes('No se pudo')) {
            this.message = res.message;
            this.isSuccess = false;
          } else {
            this.email = email;
            this.currentStep = 2;
          }
        });
    }
  }

  handleVerifySubmit(e: Event): void {
    e.preventDefault();

    const { token, password } = this.verifyForm.value;

    if (token && password && this.email) {
      this.isLoading = true;
      this.message = '';

      this.authService
        .resetPasswordVerify({
          email: this.email,
          token,
          password,
        })
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((res) => {
          if (res.code === 1003) {
            this.message = 'Token o correo inválido';
            this.isSuccess = false;
          } else if (res.code === 1004) {
            this.message = 'Error del servidor';
            this.isSuccess = false;
          } else {
            this.message = 'Contraseña actualizada correctamente';
            this.isSuccess = true;
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 3000);
          }
        });
    }
  }
}
