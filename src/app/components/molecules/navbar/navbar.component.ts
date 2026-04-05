import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBox,
  faWarehouse,
  faChartBar,
  faUsers,
  faExchangeAlt,
  faShoppingCart,
  faBars,
  faTimes,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../services/auth.service';

interface NavItem {
  label: string;
  route: string;
  icon: typeof faBox;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FontAwesomeModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private authService = inject(AuthService);

  isMobileMenuOpen = signal(false);

  faBox = faBox;
  faWarehouse = faWarehouse;
  faChartBar = faChartBar;
  faUsers = faUsers;
  faExchangeAlt = faExchangeAlt;
  faShoppingCart = faShoppingCart;
  faBars = faBars;
  faTimes = faTimes;
  faSignOutAlt = faSignOutAlt;

  navItems: NavItem[] = [
    { label: 'Productos', route: '/', icon: faBox },
    { label: 'Stock', route: '/stock', icon: faWarehouse },
    { label: 'Ventas', route: '/seller', icon: faShoppingCart },
    { label: 'Reportes', route: '/report', icon: faChartBar },
    { label: 'Usuarios', route: '/users', icon: faUsers },
    { label: 'Almacenes', route: '/warehouses', icon: faWarehouse },
    { label: 'Transferencias', route: '/transfer', icon: faExchangeAlt },
  ];

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
  }
}
