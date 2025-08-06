import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatToolbarModule,
    FormsModule
  ],
  template: `
    <mat-toolbar color="primary" class="mb-4">
      <mat-toolbar-row>
        <span>Sistema de Gerenciamento de Produtos</span>
        <span class="spacer"></span>
        <button mat-raised-button color="accent" (click)="openProductForm()">
          <mat-icon>+</mat-icon>
          Novo Produto
        </button>
      </mat-toolbar-row>
    </mat-toolbar>

    <div class="container">
      <mat-card class="mb-4">
        <mat-card-content>
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Pesquisar produtos</mat-label>
            <input matInput 
                   [(ngModel)]="searchTerm" 
                   (keyup.enter)="applyFilter()"
                   placeholder="Digite o nome do produto">
            <mat-icon matSuffix></mat-icon>
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="applyFilter()" class="ml-2">
            Pesquisar
          </button>
          <button mat-button (click)="clearFilter()" class="ml-1">
            Limpar
          </button>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-content>
          <div *ngIf="loading" class="loading-container">
            <mat-spinner></mat-spinner>
          </div>

          <div *ngIf="!loading && dataSource.data.length === 0" class="error-container">
            <mat-icon style="font-size: 48px; color: #ccc;">inventory_2</mat-icon>
            <h3>Nenhum produto encontrado</h3>
            <p>Adicione novos produtos ou ajuste sua pesquisa</p>
          </div>

          <div *ngIf="!loading && dataSource.data.length > 0">
            <table mat-table [dataSource]="dataSource" matSort class="mat-elevation-z8 full-width">
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
                <td mat-cell *matCellDef="let product">{{product.id}}</td>
              </ng-container>

              <ng-container matColumnDef="nome">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Nome</th>
                <td mat-cell *matCellDef="let product">{{product.nome}}</td>
              </ng-container>

              <ng-container matColumnDef="preco">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Preço</th>
                <td mat-cell *matCellDef="let product">{{product.preco | currency:'BRL':'symbol':'1.2-2'}}</td>
              </ng-container>

              <ng-container matColumnDef="quantidade">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Quantidade</th>
                <td mat-cell *matCellDef="let product">{{product.quantidade}}</td>
              </ng-container>

              <ng-container matColumnDef="descricao">
                <th mat-header-cell *matHeaderCellDef>Descrição</th>
                <td mat-cell *matCellDef="let product" class="description-cell">{{product.descricao}}</td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Ações</th>
                <td mat-cell *matCellDef="let product">
             <button mat-stroked-button color="primary" (click)="editProduct(product)">
                <mat-icon></mat-icon>Editar
              </button>
              <button mat-flat-button color="warn" (click)="deleteProduct(product)">
                <mat-icon></mat-icon>Excluir
              </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <mat-paginator [length]="totalElements"
                           [pageSize]="pageSize"
                           [pageSizeOptions]="[5, 10, 25, 100]"
                           [pageIndex]="currentPage"
                           (page)="onPageChanged($event)"
                           showFirstLastButtons>
            </mat-paginator>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .spacer {
      flex: 1 1 auto;
    }
    
    .mb-4 {
      margin-bottom: 16px;
    }
    
    .ml-1 {
      margin-left: 8px;
    }
    
    .ml-2 {
      margin-left: 16px;
    }
    
    .search-field {
      width: 300px;
    }
    
    .full-width {
      width: 100%;
    }
    
    .description-cell {
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    table {
      width: 100%;
    }
    
    mat-paginator {
      margin-top: 16px;
    }
  `]
})
export class ProductListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'preco', 'quantidade', 'descricao', 'actions'];
  dataSource = new MatTableDataSource<Product>([]);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  loading = false;
  totalElements = 0;
  pageSize = 10;
  currentPage = 0;
  searchTerm = '';

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    const sortField = this.sort?.active || 'id';
    const sortDirection = this.sort?.direction || 'asc';
    
    this.productService.getProducts(
      this.currentPage, 
      this.pageSize, 
      sortField, 
      sortDirection, 
      this.searchTerm
    ).subscribe({
      next: (response) => {
        this.dataSource.data = response.content;
        this.totalElements = response.totalElements;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
        this.snackBar.open('Erro ao carregar produtos', 'Fechar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  onPageChanged(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProducts();
  }

  onSortChanged(event: Sort): void {
    this.loadProducts();
  }

  applyFilter(): void {
    this.currentPage = 0;
    this.loadProducts();
  }

  clearFilter(): void {
    this.searchTerm = '';
    this.currentPage = 0;
    this.loadProducts();
  }

  openProductForm(product?: Product): void {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '600px',
      data: product ? { ...product } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  editProduct(product: Product): void {
    this.openProductForm(product);
  }

  deleteProduct(product: Product): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja excluir o produto "${product.nome}"?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && product.id) {
        this.productService.deleteProduct(product.id).subscribe({
          next: () => {
            this.snackBar.open('Produto excluído com sucesso!', 'Fechar', { duration: 3000 });
            this.loadProducts();
          },
          error: (error) => {
            console.error('Erro ao excluir produto:', error);
            this.snackBar.open('Erro ao excluir produto', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.sort) {
      this.sort.sortChange.subscribe(() => this.onSortChanged(this.sort));
    }
  }
}