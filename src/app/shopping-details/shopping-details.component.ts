import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductsService } from '../service/product.service';
import { ToasterComponent } from '../shared/toaster.component';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../shared/product';
import { messages } from '../app.validationmsgs';


@Component({
  selector: 'app-shopping-details',
  templateUrl: './shopping-details.component.html',
  styleUrls: ['./shopping-details.component.scss']
})
export class ShoppingDetailsComponent implements OnInit {
  public messages = messages;
  public getProductData: Product[] = [];
  public seletedProductId: any;
  public page = 1;
  public pageSize = 4;
  public searchTerms!: string;
  public searchObservalbe!: Observable<String>;
  public reactiveForm!: FormGroup;
  public addNewProduct!: { category: any; description: any; id: number; image: string; price: any; };
  public selectedProductContent: any;
  public isUpdate: boolean = false;
  public likeProduct = false;
  public isselected = 0;
  public collectionSize: any = 20;

  constructor(private _productsService: ProductsService, private _fb: FormBuilder, private _toastr: ToasterComponent,
    private modalService: NgbModal) {

  }

  ngOnInit(): void {
    this.getProductList();
    this.reactiveForm = this._fb.group({
      productDetails: this._fb.group({
        category: ['', Validators.compose([Validators.required])],
        description: ['', Validators.compose([Validators.required])],
        price: ['', Validators.compose([Validators.required, Validators.maxLength(5)])]
      }),

    })

  }

  get getFormControls() {
    return this.reactiveForm.controls;
  }

  get productDetailsControls() {
    let formGroup = this.reactiveForm.get("productDetails") as FormGroup;
    return formGroup.controls;
  }

  onSubmit() {
    if (this.reactiveForm.invalid) {
      return;
    }
    let getdetails = this.getFormControls['productDetails'].value;
    this.addNewProduct = {
      category: getdetails.category,
      description: getdetails.description,
      id: !this.isUpdate ? this.getProductData.length + 1 : this.selectedProductContent.id,
      image: !this.isUpdate ? 'https://via.placeholder.com/300/09f.png/fff' : this.selectedProductContent.image,
      price: getdetails.price,
    }
    if (!this.isUpdate) {
      this.getProductData.unshift(this.addNewProduct);
      this._toastr.successMessage('Product added succesfully')
    } else {
      this._productsService.updateSelectedProduct(this.addNewProduct).
        subscribe({
          next: (data: any) => {
            if (data) {
              this.getProductList()
              this._toastr.successMessage('Product updated succesfully')
            } else {
              this._toastr.errorMessage(messages.wentWrong)
            }
          },
          error: (err) => {
            this._toastr.errorMessage(err);
          },
          complete: () => { }
        })
    }

    this.modalService.dismissAll();
  }

  resetForm() {
    this.reactiveForm.reset();
  }

  getProductList() {
    this._productsService.getProductList(this.page, this.pageSize ).
      subscribe({
        next: (data: any) => {
          if (data) {
            this.getProductData = data.product;
            console.log(this.getProductData);
            
            this.collectionSize = data.size
          } else {
            this._toastr.errorMessage(messages.wentWrong)
          }
        },
        error: (err) => {
          this._toastr.errorMessage(err);
        },
        complete: () => { }
      })
  }

  AddItemToList(content: any) {
    this.modalService.open(content, { centered: true });
    this.isUpdate = false;
    this.reactiveForm.reset();
  }
  removedProduct(product: any) {
    this.seletedProductId = product.id;

    this._productsService.removeSelectedProduct(this.seletedProductId).
      subscribe({
        next: (data: any) => {
          if (data) {
            this._toastr.successMessage('Product removed succesfully')
            this.getProductList();
          } else {
            this._toastr.errorMessage(messages.wentWrong)
          }
        },
        error: (err) => {
          this._toastr.errorMessage(err);
        },
        complete: () => { }
      })
  }

  updateProduct(product: any, content: any) {
    this.isUpdate = true;
    this.selectedProductContent = product;
    console.log(product);
    
    this.modalService.open(content, { centered: true });
    this.getFormControls['productDetails'].patchValue({
      category: product.category,
      description: product.description,
      id: product.id,
      image: product.image,
      price: product.price,
    })
  }

  pageChanged() {
    this.page = this.page;
    this.getProductList()
  }

  trackByIndex(index: any) {
    return index;
  }

}
