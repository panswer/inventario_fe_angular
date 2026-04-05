import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WarehouseService } from '../../../services/warehouse.service';
import { ButtonComponent } from '../../../components/atoms/button/button.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-warehouse-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, FontAwesomeModule],
  templateUrl: './warehouse-form.component.html',
  styleUrl: './warehouse-form.component.css',
})
export class WarehouseFormComponent implements OnInit {
  warehouseForm: FormGroup;
  isEditMode: boolean = false;
  warehouseId: string | null = null;
  pageTitle: string = 'Crear Almacén';
  isLoading: boolean = false;
  faArrowLeft = faArrowLeft;

  constructor(
    private fb: FormBuilder,
    private warehouseService: WarehouseService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.warehouseForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.warehouseId = this.route.snapshot.paramMap.get('warehouseId');
    
    if (this.warehouseId) {
      this.isEditMode = true;
      this.pageTitle = 'Editar Almacén';
      this.loadWarehouse();
    }
  }

  loadWarehouse(): void {
    if (this.warehouseId) {
      this.warehouseService.getWarehouseById(this.warehouseId).subscribe((res) => {
        if (res.warehouse) {
          this.warehouseForm.patchValue({
            name: res.warehouse.name,
            address: res.warehouse.address,
          });
        }
        if (res.message) {
          alert(res.message);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.warehouseForm.invalid) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    this.isLoading = true;
    const formData = this.warehouseForm.value;

    if (this.isEditMode && this.warehouseId) {
      this.warehouseService.updateWarehouse(this.warehouseId, formData).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.warehouse) {
            this.router.navigate(['/warehouses']);
          }
          if (res.message) {
            alert(res.message);
          }
        },
        error: () => {
          this.isLoading = false;
          alert('Error al actualizar el almacén');
        },
      });
    } else {
      this.warehouseService.createWarehouse(formData).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.warehouse) {
            this.router.navigate(['/warehouses']);
          }
          if (res.message) {
            alert(res.message);
          }
        },
        error: () => {
          this.isLoading = false;
          alert('Error al crear el almacén');
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/warehouses']);
  }
}