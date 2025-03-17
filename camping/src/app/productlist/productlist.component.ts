import { Component, OnInit } from '@angular/core';
import { Product } from '../model/product';
import { ProductService } from '../services/ProductService.service';
import { AuthService, User } from '../service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  userId: any | null = null;
  userRole: string | null = null;

  constructor(private productService: ProductService, private authService: AuthService) {}

  ngOnInit(): void {
    const currentUser: User | null = this.authService.getCurrentUser();
    if (currentUser) {
      this.userId = currentUser.id;
      this.userRole = currentUser.roles.includes("Organisateur") ? "Organisateur" : "User";
      this.loadProducts();
    }
  }
  loadProducts() {
    this.productService.getProducts(this.userId!).subscribe((data) => {
      this.products = data;
    });
  }

  reserveProduct(productId: number) {
    this.productService.reserveProduct(productId, this.userId!).subscribe((updatedProduct) => {
      // Update the specific product's reservation status
      const index = this.products.findIndex(p => p.id === productId);
      if (index !== -1) {
        this.products[index] = updatedProduct;
      }
    });
  }

  cancelReservation(productId: number) {
    this.productService.cancelReservation(productId, this.userId!).subscribe((updatedProduct) => {
      // Update the specific product's reservation status
      const index = this.products.findIndex(p => p.id === productId);
      if (index !== -1) {
        this.products[index] = updatedProduct;
      }
    });
  }
  deleteProduct(productId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(productId).subscribe(() => {
          this.products = this.products.filter(p => p.id !== productId);
          Swal.fire('Deleted!', 'The product has been removed.', 'success');
        }, error => {
          Swal.fire('Error', 'Failed to delete product.', 'error');
          console.error(error);
        });
      }
    });
  }
}
