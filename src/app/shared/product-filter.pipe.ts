import { Pipe, PipeTransform } from '@angular/core';
import { Product } from './product';

@Pipe({
  name: 'productFilter'
})
export class ProductFilterPipe implements PipeTransform {

  transform(product : Product[], searchTerm : string): any {
    if(!product || !searchTerm){
      return product
    }
    return product.filter((res) => 
    res.category.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
    res.description.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) 
    );
  }

}
