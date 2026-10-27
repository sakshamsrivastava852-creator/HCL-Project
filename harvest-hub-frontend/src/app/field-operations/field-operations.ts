import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FieldOperationService } from '../services/field-operation.service';
import { FieldService } from '../services/field.service';
import { CropPlanService } from '../services/crop-plan.service';
import { NotificationService } from '../services/notification.service';
import { FieldOperation, OperationStatus } from '../models/field-operation.model';
import { Field } from '../models/field.model';
import { CropPlan } from '../models/crop-plan.model';

@Component({
  selector: 'app-field-operations',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './field-operations.html',
  styleUrl: './field-operations.css'
})
export class FieldOperations implements OnInit {
  operations: FieldOperation[] = [];
  fields: Field[] = [];
  cropPlans: CropPlan[] = [];
  filteredOps: FieldOperation[] = [];
  searchTerm = '';
  selectedStatusFilter = 'ALL';
  isLoading = true;

  showAddModal = false;
  showEditModal = false;
  showDeleteModal = false;
  selectedOp: FieldOperation | null = null;

  opForm!: FormGroup;

  operationTypes = [
    'Tillage / Plowing',
    'Sowing / Seeding',
    'Fertilizer Application',
    'Drip / Canal Irrigation',
    'Pest & Disease Control',
    'Weeding & Mulching',
    'Harvesting & Gathering',
    'Soil Treatment'
  ];

  statuses: OperationStatus[] = ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

  constructor(
    private opService: FieldOperationService,
    private fieldService: FieldService,
    private cropPlanService: CropPlanService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadData();
  }

  initForm(op?: FieldOperation): void {
    this.opForm = this.fb.group({
      operationType: [op ? op.operationType : this.operationTypes[0], [Validators.required]],
      operationDate: [op ? op.operationDate : '', [Validators.required]],
      description: [op && op.description ? op.description : ''],
      cost: [op ? op.cost : '', [Validators.required, Validators.min(0)]],
      status: [op ? op.status : 'PLANNED', [Validators.required]],
      fieldId: [op && op.field ? op.field.id : '', [Validators.required]],
      cropPlanId: [op && op.cropPlan ? op.cropPlan.id : '']
    });
  }

  loadData(): void {
    console.log('Fetching fields for operations...');
    this.isLoading = true;
    this.fieldService.getFields().subscribe({
      next: (fields) => {
        this.fields = fields || [];
        this.loadPlansAndOps();
      },
      error: (err) => {
        console.error('Error loading fields for ops:', err);
        this.loadPlansAndOps();
      }
    });
  }

  loadPlansAndOps(): void {
    console.log('Fetching crop plans for operations...');
    this.cropPlanService.getCropPlans().subscribe({
      next: (plans) => {
        this.cropPlans = plans || [];
        this.loadOperations();
      },
      error: (err) => {
        console.error('Error loading plans for ops:', err);
        this.loadOperations();
      }
    });
  }

  loadOperations(): void {
    console.log('Fetching operations from http://localhost:8080/api/field-operations...');
    this.opService.getFieldOperations().subscribe({
      next: (data) => {
        console.log('Field operations fetched successfully:', data);
        this.operations = data || [];
        this.applyFilter();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching operations:', err);
        this.notificationService.error(err.message || 'Failed to load operations');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter(): void {
    let result = [...this.operations];

    if (this.selectedStatusFilter !== 'ALL') {
      result = result.filter(o => o.status === this.selectedStatusFilter);
    }

    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      result = result.filter(o =>
        o.operationType.toLowerCase().includes(term) ||
        (o.description && o.description.toLowerCase().includes(term)) ||
        (o.field && o.field.name.toLowerCase().includes(term)) ||
        (o.cropPlan && o.cropPlan.planName.toLowerCase().includes(term))
      );
    }

    this.filteredOps = result;
  }

  setStatusFilter(status: string): void {
    this.selectedStatusFilter = status;
    this.applyFilter();
    this.cdr.detectChanges();
  }

  cycleStatus(op: FieldOperation, event: Event): void {
    event.stopPropagation();
    if (!op.id) return;

    const sequence: OperationStatus[] = ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    const currentIndex = sequence.indexOf(op.status);
    const nextStatus = sequence[(currentIndex + 1) % sequence.length];

    this.opService.updateStatus(op.id, nextStatus).subscribe({
      next: (updated) => {
        op.status = updated.status;
        this.applyFilter();
        this.notificationService.success(`Operation status updated to "${updated.status}"`);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.notificationService.error(err.message || 'Failed to update operation status');
        this.cdr.detectChanges();
      }
    });
  }

  openAddModal(): void {
    this.initForm();
    if (this.fields.length > 0 && !this.opForm.value.fieldId) {
      this.opForm.patchValue({ fieldId: this.fields[0].id });
    }
    this.showAddModal = true;
    this.cdr.detectChanges();
  }

  openEditModal(op: FieldOperation): void {
    this.selectedOp = op;
    this.initForm(op);
    this.showEditModal = true;
    this.cdr.detectChanges();
  }

  openDeleteModal(op: FieldOperation): void {
    this.selectedOp = op;
    this.showDeleteModal = true;
    this.cdr.detectChanges();
  }

  closeModals(): void {
    this.showAddModal = false;
    this.showEditModal = false;
    this.showDeleteModal = false;
    this.selectedOp = null;
    this.cdr.detectChanges();
  }

  saveOperation(): void {
    if (this.opForm.invalid) {
      this.opForm.markAllAsTouched();
      return;
    }

    const fieldId = Number(this.opForm.value.fieldId);
    const planId = this.opForm.value.cropPlanId ? Number(this.opForm.value.cropPlanId) : null;
    const selectedField = this.fields.find(f => f.id === fieldId);
    const selectedPlan = planId ? this.cropPlans.find(p => p.id === planId) : null;

    const payload: FieldOperation = {
      operationType: this.opForm.value.operationType,
      operationDate: this.opForm.value.operationDate,
      description: this.opForm.value.description ? this.opForm.value.description.trim() : '',
      cost: Number(this.opForm.value.cost),
      status: this.opForm.value.status,
      field: selectedField ? { id: selectedField.id, name: selectedField.name, area: selectedField.area, soilType: selectedField.soilType } : null,
      cropPlan: selectedPlan ? { id: selectedPlan.id, planName: selectedPlan.planName, season: selectedPlan.season, startDate: selectedPlan.startDate, endDate: selectedPlan.endDate, status: selectedPlan.status } : null
    };

    this.opService.createFieldOperation(payload).subscribe({
      next: (created) => {
        this.operations.unshift(created);
        this.applyFilter();
        this.closeModals();
        this.notificationService.success(`Operation "${created.operationType}" logged successfully!`);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.notificationService.error(err.message || 'Failed to create operation');
        this.cdr.detectChanges();
      }
    });
  }

  updateOperation(): void {
    if (!this.selectedOp || !this.selectedOp.id || this.opForm.invalid) {
      this.opForm.markAllAsTouched();
      return;
    }

    const fieldId = Number(this.opForm.value.fieldId);
    const planId = this.opForm.value.cropPlanId ? Number(this.opForm.value.cropPlanId) : null;
    const selectedField = this.fields.find(f => f.id === fieldId);
    const selectedPlan = planId ? this.cropPlans.find(p => p.id === planId) : null;

    const payload: FieldOperation = {
      id: this.selectedOp.id,
      operationType: this.opForm.value.operationType,
      operationDate: this.opForm.value.operationDate,
      description: this.opForm.value.description ? this.opForm.value.description.trim() : '',
      cost: Number(this.opForm.value.cost),
      status: this.opForm.value.status,
      field: selectedField ? { id: selectedField.id, name: selectedField.name, area: selectedField.area, soilType: selectedField.soilType } : null,
      cropPlan: selectedPlan ? { id: selectedPlan.id, planName: selectedPlan.planName, season: selectedPlan.season, startDate: selectedPlan.startDate, endDate: selectedPlan.endDate, status: selectedPlan.status } : null
    };

    this.opService.updateFieldOperation(this.selectedOp.id, payload).subscribe({
      next: (updated) => {
        const index = this.operations.findIndex(o => o.id === updated.id);
        if (index !== -1) {
          this.operations[index] = updated;
          this.applyFilter();
        }
        this.closeModals();
        this.notificationService.success(`Operation updated successfully!`);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.notificationService.error(err.message || 'Failed to update operation');
        this.cdr.detectChanges();
      }
    });
  }

  confirmDelete(): void {
    if (!this.selectedOp || !this.selectedOp.id) return;

    const opId = this.selectedOp.id;
    const opType = this.selectedOp.operationType;

    this.opService.deleteFieldOperation(opId).subscribe({
      next: () => {
        this.operations = this.operations.filter(o => o.id !== opId);
        this.applyFilter();
        this.closeModals();
        this.notificationService.success(`Operation "${opType}" deleted successfully`);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.notificationService.error(err.message || 'Failed to delete operation');
        this.cdr.detectChanges();
      }
    });
  }
}
