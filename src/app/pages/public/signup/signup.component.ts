import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { lowerReg, numReg, specialCharReg, upperReg } from '../../../utils/reg';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit {
  signupForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(200),
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
  });
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.isValidToken()) {
      this.router.navigate(['']);
    }

    this.signupForm.addValidators((formGroup) => {
      const errors: Record<string, boolean> = {};

      if (!upperReg.test(formGroup.value.password)) {
        errors['uppercase'] = true;
      }

      if (!lowerReg.test(formGroup.value.password)) {
        errors['lowercase'] = true;
      }

      if (!numReg.test(formGroup.value.password)) {
        errors['num'] = true;
      }

      if (!specialCharReg.test(formGroup.value.password)) {
        errors['specialChar'] = true;
      }

      if (formGroup.value.password !== formGroup.value.confirmPassword) {
        errors['passwordMismatch'] = true;
      }

      return errors;
    });
  }

  handleSubmit(e: Event): void {
    e.preventDefault();

    const { email, password } = this.signupForm.value;

    if (email && password) {
      this.isLoading = true;

      this.authService
        .signUp({ email, password })
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((res) => {
          if (res.message) {
            alert(res.message);
            return;
          }
          this.router.navigate(['/login']);
        });
    }
  }
}
