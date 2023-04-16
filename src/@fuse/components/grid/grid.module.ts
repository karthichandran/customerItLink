import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { GridComponent } from '@fuse/components/grid/grid.component';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MaskPipe } from './mask.pipe';

@NgModule({
  declarations: [
    GridComponent,
    MaskPipe
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    NgxDatatableModule,
    MatSelectModule,
    MatAutocompleteModule
  ],
  exports: [
    GridComponent,
  ]
})
export class GridModule {
}
