import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
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
import { Subscription } from 'rxjs';

interface NavItem {
  label: string;
  route: string;
  icon: typeof faBox;
  allowedRoles?: string[];
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FontAwesomeModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private subscription = new Subscription();

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
    { label: 'Productos', route: '/', icon: faBox, allowedRoles: ['admin', 'manager', 'cashier'] },
    { label: 'Stock', route: '/stock', icon: faWarehouse, allowedRoles: ['admin', 'manager'] },
    { label: 'Ventas', route: '/seller/create', icon: faShoppingCart, allowedRoles: ['admin', 'manager', 'cashier'] },
    { label: 'Reportes', route: '/report', icon: faChartBar, allowedRoles: ['admin', 'manager'] },
    { label: 'Usuarios', route: '/users', icon: faUsers, allowedRoles: ['admin'] },
    { label: 'Almacenes', route: '/warehouses', icon: faWarehouse, allowedRoles: ['admin', 'manager'] },
    { label: 'Transferencias', route: '/transfer', icon: faExchangeAlt, allowedRoles: ['admin', 'manager'] },
  ];

  filteredNavItems: NavItem[] = [];

  ngOnInit(): void {
    this.subscription = this.authService.currentUser.subscribe(() => {
      this.filterNavItems();
    });
    this.filterNavItems();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private filterNavItems(): void {
    const userRole = this.authService.getUserRole();
    if (!userRole) {
      this.filteredNavItems = [];
      return;
    }
    this.filteredNavItems = this.navItems.filter(item => {
      if (!item.allowedRoles) return true;
      return item.allowedRoles.includes(userRole);
    });
  }

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
