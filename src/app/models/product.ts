import { FormGroup } from '@angular/forms';

export class productComponent {
  id!: number;
  name!: string;
  price!: number;
  stock!: number;
}

export interface ProductDetail {
  id: number;
  formGroup: FormGroup;
}
