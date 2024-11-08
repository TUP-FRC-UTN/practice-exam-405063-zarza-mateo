import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { productComponent, ProductDetail } from '../../models/product';
import { OrderServiceService } from '../../service/order-service.service';
import { catchError, map, Observable, of } from 'rxjs';

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
  productDetails: ProductDetail[] = [];

  ngOnInit(): void {
    this.service.getProducts().subscribe((productos: productComponent[]) => {
      this.productosList = productos;
      console.log(productos);
    });
    this.form = new FormGroup({
      nombre: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      email: new FormControl(
        '',
        [Validators.email, Validators.required],
        [this.emailOrdersValidator()]
      ),
      total: new FormControl({ value: 0, disabled: true }),
      productos: new FormArray(
        [],
        [
          Validators.min(1),
          this.duplicateProductValidator(),
          this.maxAmountValidator(),
        ]
      ),
    });
  }

  get productos() {
    return this.form.get('productos') as FormArray;
  }

  logeo(logueoForm: FormGroup<any>) {
    console.log('logueado puto');
  }

  eliminarProducto(index: number) {
    this.productos.removeAt(index);
    this.calcularTotal();
    this.productDetails.splice(index, 1);
  }

  agregarProducto() {
    const productoForm = new FormGroup({
      selectedProduct: new FormControl('', Validators.required),
      cantidad: new FormControl(1, [Validators.required, Validators.min(1)]),
      precio: new FormControl({ value: 0, disabled: true }),
      stock: new FormControl({ value: 0, disabled: true }),
    });

    this.setupProductSubscriptions(productoForm);
    this.productos.push(productoForm);
  }

  private setupProductSubscriptions(productoForm: FormGroup) {
    // Subscription para el cambio de producto
    productoForm.get('selectedProduct')?.valueChanges.subscribe((name) => {
      this.productos.updateValueAndValidity();
      const producto = this.productosList.find(
        (producto) => producto.name === name
      );

      if (producto && producto.price && producto.stock) {
        const cantidad = productoForm.get('cantidad')?.value ?? 1;
        productoForm.patchValue(
          {
            stock: producto.stock,
            precio: producto.price * cantidad,
          },
          { emitEvent: false }
        );

        this.calcularTotal();
      }
    });

    // Subscription para el cambio de cantidad
    productoForm.get('cantidad')?.valueChanges.subscribe((cantidad) => {
      const productoName = productoForm.get('selectedProduct')?.value;
      const producto = this.productosList.find((p) => p.name === productoName);

      if (producto && producto.price) {
        productoForm.patchValue(
          {
            precio: producto.price * (cantidad ?? 1),
          },
          { emitEvent: false }
        );

        this.calcularTotal();
      }
    });

    this.productDetails.push({
      id: this.productDetails.length + 1,
      formGroup: productoForm,
    });
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

  maxAmountValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const formArray = control as FormArray;
      const totalProducts = formArray.controls.reduce((sum, producto) => {
        const cantidad = producto.get('cantidad')?.value || 0;
        return sum + cantidad;
      }, 0);

      return totalProducts > 10 ? { maxAmount: totalProducts } : null;
    };
  }

  emailOrdersValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
return this.service.getOrdersByEmail(control.value).pipe(
  map(data => {
    console.log(data);
    return data.length > 3 ? { orderLimit: true } : null;
  }),
)
      /*     return this.service.getOrdersByEmail(email).pipe(
      map(orders => {
        // Obtenemos la fecha actual
        const now = new Date();
        // Fecha hace 24 horas
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        
        // Filtramos las órdenes de las últimas 24 horas
        const recentOrders = orders.filter((order: any) => {
          const orderDate = new Date(order.date);
          return orderDate >= oneDayAgo && orderDate <= now;
        });
 */


    };
  }

  calcularTotal() {
    const total = this.productos.controls.reduce((sum, producto) => {
      const cantidad = producto.get('cantidad')?.value ?? 0;
      const precio = producto.get('precio')?.value ?? 0;
      return sum + cantidad * precio;
    }, 0);

    this.form.get('total')?.setValue(total);
  }

  submit() {
    if (this.form.valid) {
      this.service.postOrder(this.form.value).subscribe((order) => {
        console.log(order);
      });
    }
  }
}
