import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-users',
  imports: [TableComponent, TableBodyCellDirective, DatePipe, FontAwesomeModule, FormsModule, NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, ButtonComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
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
  editingUserId: string | null = null;
  selectedRole = '';
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

  editRole(user: User) {
    this.editingUserId = user._id;
    this.selectedRole = user.role;
  }

  cancelEdit() {
    this.editingUserId = null;
    this.selectedRole = '';
  }

  saveRole(userId: string) {
    this.userService.updateUserRole(userId, { role: this.selectedRole }).subscribe({
      next: () => {
        this.loadUsers();
        this.editingUserId = null;
        this.selectedRole = '';
      },
      error: () => {
        alert('Error al actualizar el rol');
        this.editingUserId = null;
        this.selectedRole = '';
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
