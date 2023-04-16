/** Angular Imports */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ICustomer ,ICustomerVM} from './CustomerDto';
import { CustomerPropertyDto } from './CustomerPropertyDto';
/** rxjs Imports */
import { Observable } from 'rxjs';

/**
 * Accounting service.
 */
@Injectable({
  providedIn: 'root'
})
export class ClientService {

  /**
   * @param {HttpClient} http Http Client to send requests.
   */
  constructor(private http: HttpClient) { }


  /**
   * @param {string} provisioningEntryId Provisioning entry ID of provisioning entry.
   * @returns {Observable<any>} Provisioning entry.
   */

getUnitNo(id:number):Observable<any> {
  return this.http.get(`/customerTaxLogin/${id}`);
}

getCustomerByUnitNo(propertyId:number, id:number): Observable<any> {
    return this.http.get(`/customerTaxLogin/customersByUnit/${propertyId}/${id}`);
  }

saveCustomer(customer: any): Observable<any> {
      return this.http.post('/customerTaxLogin',  customer );
  }
  getPropertyList(): Observable<any> {
    return this.http.get(`/property/dropdown`);
  }

  
  
 
}
