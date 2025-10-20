import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { lowerReg, numReg, specialCharReg, upperReg } from '../../../utils/reg';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(200),
    ]),
  });
  isLoading = false;
  readonly version = environment.version;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.isValidToken()) {
      this.router.navigate(['']);
    }

    this.loginForm.addValidators((formGroup) => {
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

      return errors;
    });
  }

  /**
   * Send form data to back-end
   *
   * @param e - event
   *
   * @returns {Promise<void>}
   */
  handleSubmit(e: Event): void {
    e.preventDefault();

    const { email, password } = this.loginForm.value;

    if (email && password) {
      this.isLoading = true;

      this.authService
        .signIn({ email, password })
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe((res) => {
          if (res.message) {
            alert(res.message);
            return;
          }
          if (res.authorization) {
            this.loginForm.reset();
            this.router.navigate(['']);
          }
        });
    }
  }
}
