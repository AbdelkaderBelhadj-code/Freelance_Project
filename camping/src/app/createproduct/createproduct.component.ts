import { Component } from '@angular/core';
import { ProductService } from '../services/ProductService.service';
import { Product } from '../model/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-createproduct',
  templateUrl: './createproduct.component.html',
  styleUrls: ['./createproduct.component.css']
})
export class CreateproductComponent{
name: string = '';
description: string = '';
price: number = 0;
photo: string | null = null;

constructor(private productService: ProductService,private router: Router) { }

onFileChange(event: any): void {
  this.photo = event.target.files[0];
}

addProduct(): void {
  if (this.name && this.description && this.price && this.photo) {
    this.productService.addProduct(this.name, this.description, this.price, this.photo).subscribe(
      (response: Product) => {
        console.log('Product added successfully:', response);
        this.router.navigate(['/list']);  // Redirect to product list
      },
      (error) => {
        console.error('Error adding product:', error);
      }
    );
  }

}

}