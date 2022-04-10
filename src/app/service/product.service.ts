import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { productList } from '../mock-data';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private productList = productList;
  constructor() {}

  getProductList(page: number, pageSize: number): Observable<any> {
    let product = productList.slice((page - 1) * pageSize,  (page - 1) * pageSize + pageSize);
    console.log(product);
    
    if (product.length) {
      return of({ product, size: this.productList.length })
    }
    return of(false);
  }

  removeSelectedProduct(productId: number): Observable<boolean> {
    let productIndex = this.productList.findIndex(product => product.id == productId)
    if (productIndex >= 0) {
      this.productList.splice(productIndex, 1)
      return of(true)
    }
    else {
      return of(true)
    }
  }

  updateSelectedProduct(item: any): Observable<boolean> {
    let productItemId = this.productList.findIndex(res => res.id == item.id);
    if (productItemId > -1) {
      this.productList[productItemId] = item;
      return of(true);
    } else {
      return of(false);
    }
  }
}