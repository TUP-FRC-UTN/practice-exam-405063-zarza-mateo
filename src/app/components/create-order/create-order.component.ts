import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { productComponent } from '../../models/product';
import { OrderServiceService } from '../../service/order-service.service';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.css',
})
export class CreateOrderComponent implements OnInit {
  constructor(private service: OrderServiceService) {}

  productosList: productComponent[] = [];
  form: FormGroup = new FormGroup({});

  ngOnInit(): void {
    this.service.getProducts().subscribe((productos: productComponent[]) => {
      this.productosList = productos;
      console.log(productos); // Para verificar los productos traídos
    });

    this.form = new FormGroup({
      nombre: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      email: new FormControl('', [Validators.email, Validators.required]),
      total: new FormControl({ value: 0, disabled: true }),
      productos: new FormArray([], [Validators.min(1), this.duplicateProductValidator()]),
    });
  }

  get productos() {
    return this.form.get('productos') as FormArray;
  }

  onSubmit() {
    throw new Error('Method not implemented.');
  }

  logeo(logueoForm: FormGroup<any>) {
    console.log('logueado puto');
  }

  eliminarProducto(index: number) {
    (this.form.get('productos') as FormArray).removeAt(index);
    this.calcularTotal();
  }

  agregarProducto() {
    const productoForm = new FormGroup({
      selectedProduct: new FormControl('', Validators.required),
      cantidad: new FormControl(1, [Validators.required, Validators.min(1)]),
      precio: new FormControl({ value: '', disabled: true }),
      stock: new FormControl({ value: '', disabled: true }),
    });

    productoForm.get('selectedProduct')?.valueChanges.subscribe((name) => {
      this.productos.updateValueAndValidity();
      const producto = this.productosList.find(
        (producto) => producto.name === name
      );
      if (producto && producto.price && producto.stock) {
        productoForm.get('stock')?.setValue(producto.stock);
        productoForm.get('precio')?.setValue(producto.price);
        this.calcularTotal();
        productoForm.get('cantidad')?.valueChanges.subscribe((cantidad) => {
          this.calcularTotal();
        });
      }
    });

    this.productos.push(productoForm);
  }

  duplicateProductValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const formArray = control as FormArray;
      const selectedProducts = formArray.controls.map(
        (group: AbstractControl) =>
          (group as FormGroup).get('selectedProduct')?.value
      );

      const hasDuplicates = selectedProducts.some(
        (product, index) =>
          product && selectedProducts.indexOf(product) !== index
      );

      return hasDuplicates ? { duplicateProduct: true } : null;
    };
  }

  calcularTotal() {
    this.form.controls['total'].setValue(
      this.productos.controls.reduce((total, producto) => {
        return (
          total +
          producto.get('cantidad')?.value * producto.get('precio')?.value
        );
      }, 0)
    );
  }
}
