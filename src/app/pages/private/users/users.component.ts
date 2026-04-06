import { Component, OnInit, inject } from '@angular/core';
import { TableComponent } from '../../../components/molecules/table/table.component';
import { TableHeadCol } from '../../../interfaces/components/table';
import { DatePipe, Location, NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { TableBodyCellDirective } from "../../../directives/table-body-cell.directive";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faPen, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from '../../../components/atoms/button/button.component';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../../components/molecules/modal/modal.component';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-users',
  imports: [TableComponent, TableBodyCellDirective, DatePipe, FontAwesomeModule, FormsModule, NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, ButtonComponent, ModalComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  private toastService = inject(ToastService);

  tableField: TableHeadCol[] = [{
    field: 'username',
    text: 'Usuario'
  }, {
    field: 'role',
    text: 'Rol'
  }, {
    field: 'createdAt',
    text: 'Fecha de creación'
  }];

  users: User[] = [];
  roles = ['admin', 'manager', 'cashier', 'user'];
  selectedRole = '';
  showModal = false;
  selectedUser: User | null = null;
  isLoading = false;
  icon = {
    pen: faPen,
    userShield: faUserShield,
    arrowLeft: faArrowLeft,
  };

  constructor(
    private readonly userService: UserService,
    private readonly location: Location,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  goBack() {
    this.location.back();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(res => {
      this.users = res.users.map(item => new User(item));
    });
  }

  openRoleModal(user: User) {
    this.selectedUser = user;
    this.selectedRole = user.role;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedUser = null;
    this.selectedRole = '';
  }

  saveRole() {
    if (!this.selectedUser) return;

    this.isLoading = true;
    this.userService.updateUserRole(this.selectedUser._id, { role: this.selectedRole }).subscribe({
      next: () => {
        this.loadUsers();
        this.closeModal();
        this.isLoading = false;
        this.toastService.success('Rol actualizado correctamente');
      },
      error: () => {
        this.toastService.error('Error al actualizar el rol');
        this.closeModal();
        this.isLoading = false;
      }
    });
  }

  getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      admin: 'Administrador',
      manager: 'Gerente',
      cashier: 'Cajero',
      user: 'Usuario',
    };
    return labels[role] || role;
  }
}
