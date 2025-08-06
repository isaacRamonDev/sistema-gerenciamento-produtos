import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>{{ isEdit ? 'edit' : 'add' }}</mat-icon>
      {{ isEdit ? 'Editar Produto' : 'Novo Produto' }}
    </h2>
    
    <mat-dialog-content>
      <form [formGroup]="productForm" class="product-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nome *</mat-label>
          <input matInput formControlName="nome" placeholder="Digite o nome do produto">
          <mat-error *ngIf="productForm.get('nome')?.hasError('required')">
            Nome é obrigatório
          </mat-error>
          <mat-error *ngIf="productForm.get('nome')?.hasError('minlength')">
            Nome deve ter pelo menos 2 caracteres
          </mat-error>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Preço *</mat-label>
            <input matInput type="number" formControlName="preco" 
                   placeholder="0.00" step="0.01" min="0">
            <span matPrefix>R$ </span>
            <mat-error *ngIf="productForm.get('preco')?.hasError('required')">
              Preço é obrigatório
            </mat-error>
            <mat-error *ngIf="productForm.get('preco')?.hasError('min')">
              Preço deve ser maior que zero
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Quantidade *</mat-label>
            <input matInput type="number" formControlName="quantidade" 
                   placeholder="0" min="0">
            <mat-error *ngIf="productForm.get('quantidade')?.hasError('required')">
              Quantidade é obrigatória
            </mat-error>
            <mat-error *ngIf="productForm.get('quantidade')?.hasError('min')">
              Quantidade deve ser maior ou igual a zero
            </mat-error>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Descrição *</mat-label>
          <textarea matInput formControlName="descricao" rows="4" 
                    placeholder="Digite a descrição do produto"></textarea>
          <mat-error *ngIf="productForm.get('descricao')?.hasError('required')">
            Descrição é obrigatória
          </mat-error>
          <mat-error *ngIf="productForm.get('descricao')?.hasError('minlength')">
            Descrição deve ter pelo menos 10 caracteres
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()" [disabled]="loading">
        Cancelar
      </button>
      <button mat-raised-button color="primary" 
              (click)="onSave()" 
              [disabled]="productForm.invalid || loading">
        <mat-spinner *ngIf="loading" diameter="20" class="inline-spinner"></mat-spinner>
        {{ isEdit ? 'Atualizar' : 'Salvar' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .product-form {
      display: flex;
      flex-direction: column;
      min-width: 500px;
      padding: 16px 0;
    }
    
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    
    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }
    
    .half-width {
      flex: 1;
    }
    
    .inline-spinner {
      margin-right: 8px;
    }
    
    mat-dialog-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    mat-dialog-content {
      max-height: 60vh;
      overflow-y: auto;
    }
  `]
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  loading = false;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ProductFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product
  ) {
    this.isEdit = !!data;
    this.productForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.data) {
      this.productForm.patchValue(this.data);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      preco: [0, [Validators.required, Validators.min(0.01)]],
      quantidade: [0, [Validators.required, Validators.min(0)]],
      descricao: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSave(): void {
    if (this.productForm.valid) {
      this.loading = true;
      const product: Product = this.productForm.value;

      const operation = this.isEdit 
        ? this.productService.updateProduct(this.data.id!, product)
        : this.productService.createProduct(product);

      operation.subscribe({
        next: (result) => {
          const message = this.isEdit 
            ? 'Produto atualizado com sucesso!' 
            : 'Produto criado com sucesso!';
          
          this.snackBar.open(message, 'Fechar', { duration: 3000 });
          this.dialogRef.close(result);
        },
        error: (error) => {
          console.error('Erro ao salvar produto:', error);
          const message = this.isEdit 
            ? 'Erro ao atualizar produto' 
            : 'Erro ao criar produto';
          
          this.snackBar.open(message, 'Fechar', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}