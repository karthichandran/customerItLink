import { Component, OnDestroy, OnInit, ViewChildren, QueryList, ElementRef, ViewChild ,ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective, ValidatorFn, AbstractControl, FormControl } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { ClientService } from './client.service';
import { StatesService } from '../shared/services/states.service';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import * as _moment from 'moment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MatSelect } from '@angular/material/select';
import { Subject } from 'rxjs';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None

})
export class ClientComponent implements OnInit, OnDestroy {
  propertyForm: FormGroup;

  clients: any = [];
  rowData: any[] = [];
  customerData: any = [];
  customerColumnDef: any[] = [];
  propertyList: any[] = [];
  unitNoList: any[] = [];
  progress: number;
 isOptedOut:boolean=false;
 
  loadingIndicator: boolean = false;
  
  @ViewChildren(FusePerfectScrollbarDirective)
  fuseScrollbarDirectives: QueryList<FusePerfectScrollbarDirective>;
  
  tabBackgroundColor: string = "#ff4081";
  @ViewChild('shareGrid') sharegridRef: ElementRef;
  @ViewChild('nameField') nameFieldRef: ElementRef;

  //Property Filter
  public propertyFilterCtrl: FormControl = new FormControl();
  @ViewChild('PropertyFilterSelect', { static: true }) PropertyFilterSelect: MatSelect;
  /** Subject that emits when the component has been destroyed. */

  //Property Filter
  public unitNoFilterCtrl: FormControl = new FormControl();
  @ViewChild('UnitNoFilterSelect', { static: true }) UnitNoFilterSelect: MatSelect;
  /** Subject that emits when the component has been destroyed. */

  protected _onDestroy = new Subject<void>();
  public filteredProperty: ReplaySubject<any[]> = new ReplaySubject<any[]>();
  public filteredUnitNo: ReplaySubject<any[]> = new ReplaySubject<any[]>();

  constructor(private _formBuilder: FormBuilder, private statesService: StatesService, private clientService: ClientService, private toastr: ToastrService, private dialog: MatDialog, private deviceService: DeviceDetectorService) {

  }


  ngOnInit(): void {
    // Reactive Form
   
   
    this.propertyForm = this._formBuilder.group({
      declarationDate: [new Date()],
      propertyID: [''],
      unitNo: [''],
      prospectPropertyID:['']
    });
    this.customerColumnDef = [{ 'header': 'Name', 'field': 'name', 'type': 'label' },
    { 'header': 'PAN', 'field': 'pan', 'type': 'label' },
    { 'header': 'Password', 'field': 'incomeTaxPassword', 'type': 'textbox' }
    ];
    this.customerData = [];
    this.getAllProperties();

    //initiate property filter
    //this.filteredProperty.next(this.propertyList.slice());
    this.propertyFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterProperty();
      });

      this.unitNoFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterUnitNo();
      });
  }
  
  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  
  saveCustomer(): void {
    var isOpt=this.isOptedOut;
    var isValid=true;
    if (!isOpt) {
      _.forEach(this.customerData, obj => {
        if (obj.incomeTaxPassword == undefined || obj.incomeTaxPassword == "" || obj.incomeTaxPassword == null)
          isValid = false;
      }
      );
    }

    if(!isValid){
    this.toastr.error(" Please fill the Password or select Opt out option to submit");
  return;
  }
     var vm = this.clients;
     vm.customers=this.customerData;
     vm.isOptedOut=this.isOptedOut;
     vm.asOfDate= moment(this.propertyForm.value.declarationDate).local().format("YYYY-MM-DD");
    this.clientService.saveCustomer(vm).subscribe((res) => {
      this.toastr.success("Thanks for your update. We will do the needful accordingly.");   
      this.clients=[];
      this.customerData=[];
      this.isOptedOut=false;  
      this.propertyForm.reset();
      this.propertyForm.get('declarationDate').setValue(moment().format("YYYY-MM-DD"));
    }, (e) => {
        this.toastr.error(e.error.error);
    });
  }

  isValid(param: any) {
   // return (param != "" && param != null && !isUndefined(param))
    return (param != "" && param != null && param!=undefined)
  }

  getUnits() {
    let propertyId = this.propertyForm.value.propertyID;
    this.clientService.getUnitNo(propertyId).subscribe((response) => {
      this.unitNoList = response;
      this.filteredUnitNo.next(this.unitNoList.slice());
    });
  }

  getCustomers(){
    let unitNo = this.propertyForm.value.unitNo;
     let propertyId = this.propertyForm.value.propertyID;
    this.clientService.getCustomerByUnitNo(propertyId,unitNo).subscribe((response) => {

      this.clients = response;
      this.customerData=response.customers;
    });
  }
 
  getAllProperties() {
    this.clientService.getPropertyList().subscribe((response) => {
      this.propertyList = _.filter(response, o => { return o.isActive == null || o.isActive == true; });
      this.filteredProperty.next(this.propertyList.slice());
    });
  }

  //property Filter functionality
  protected filterProperty() {
    if (!this.propertyList) {
      return;
    }
    // get the search keyword
    let search = this.propertyFilterCtrl.value;
    if (!search) {
      this.filteredProperty.next(this.propertyList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredProperty.next(this.filterProFun(search));
  }

  filterProFun(search) {
    var list = this.propertyList.filter(prop => prop.addressPremises.toLowerCase().indexOf(search) > -1);
    return list;
  }

   protected filterUnitNo() {
    if (!this.unitNoList) {
      return;
    }
    // get the search keyword
    let search = this.unitNoFilterCtrl.value;
    if (!search) {
      this.filteredUnitNo.next(this.unitNoList.slice());
      return;
    } else {
      search = search;
    }
    // filter the banks
    this.filteredUnitNo.next(this.filterUnitFun(search));
  }

  filterUnitFun(search) {
    var list = this.unitNoList.filter(prop => prop.unitNo.indexOf(search) > -1);
    return list;
  }
}
