import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../service/auth.service';
import { Product } from '../model/product';


@Injectable({
  providedIn: 'root'
})


  
  
export class ProductService {
  private apiUrl = `http://localhost:8080/api/products`; // Assuming you have an environment URL setup

  constructor(private http: HttpClient) { }

  // Add product
  addProduct(name: string, description: string, price: number, photo: string): Observable<Product> {
    const formData: FormData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price.toString());
    formData.append('photo', photo);  // Photo is now a string, not a file
  
    return this.http.post<Product>(`${this.apiUrl}/add`, formData);
  }
  

  getProducts(userId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/all/${userId}`);
  }


  reserveProduct(productId: number, userId: number): Observable<Product> {
    const body = { productId, userId };
    return this.http.post<Product>(`${this.apiUrl}/reserve`, body, {
      headers: { 'Content-Type': 'application/json' } // Ensure JSON format
    });
  }
  
  
  cancelReservation(productId: number, userId: number): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/cancel`, { productId, userId }, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  deleteProduct(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${productId}`);
  }

  
  
}