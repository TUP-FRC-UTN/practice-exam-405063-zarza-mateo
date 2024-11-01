import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { productComponent } from '../../models/product';
import { BrowserModule } from '@angular/platform-browser';
@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.css'
})
export class CreateOrderComponent {
  orderForm!: FormGroup;
  products: productComponent[] = []; // Aquí cargarías los productos de tu API

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
    // Aquí cargarías los productos de tu API
    this.loadProducts();
  }

  createForm() {
    this.orderForm = this.fb.group({
      clientData: this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]]
      }),
      products: this.fb.array([])
    });
  }

  get clientName() {
    return this.orderForm.get('clientData.name');
  }

  get clientEmail() {
    return this.orderForm.get('clientData.email');
  }

  get productsFormArray() {
    return this.orderForm.get('products') as FormArray;
  }

  createProductFormGroup() {
    return this.fb.group({
      productId: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      price: [{value: 0, disabled: true}],
      stock: [{value: 0, disabled: true}]
    });
  }

  addProduct() {
    this.productsFormArray.push(this.createProductFormGroup());
  }

  removeProduct(index: number) {
    this.productsFormArray.removeAt(index);
  }

  getProductControl(index: number, control: string) {
    return this.productsFormArray.at(index).get(control);
  }

  onProductSelect(index: number) {
    const productGroup = this.productsFormArray.at(index);
    const productId = productGroup.get('productId')?.value;
    const selectedProduct = this.products.find(p => p.id === Number(productId));

    if (selectedProduct) {
      productGroup.patchValue({
        price: selectedProduct.price,
        stock: selectedProduct.stock
      });

      // Actualizar validador de cantidad máxima
      productGroup.get('quantity')?.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(selectedProduct.stock)
      ]);
      productGroup.get('quantity')?.updateValueAndValidity();
    }
  }

  async loadProducts() {
    // Aquí harías la llamada a tu API
    // this.products = await this.productService.getProducts();
  }

  onSubmit() {
    if (this.orderForm.valid) {
      console.log(this.orderForm.value);
      // Aquí procesarías el envío del formulario
    }
  }
  
}
