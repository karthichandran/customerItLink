import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'Mask'
})
export class MaskPipe implements PipeTransform {
  transform(plainCreditCard: string): string {
   
    return plainCreditCard.replace(/./g, '*') ;
  }
}