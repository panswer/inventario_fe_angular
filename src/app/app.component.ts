import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { NavbarComponent } from './components/molecules/navbar/navbar.component';
import { ToastContainerComponent } from './components/molecules/toast-container/toast-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ToastContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);

  ngOnInit(): void {
    if (this.authService.isValidToken()) {
      this.authService.loadProfile();
    }
  }

  isAuthenticated(): boolean {
    return this.authService.isValidToken();
  }
}
