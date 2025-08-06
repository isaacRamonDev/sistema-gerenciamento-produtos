export interface Product {
  id?: number;
  nome: string;
  preco: number;
  descricao: string;
  quantidade: number;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}