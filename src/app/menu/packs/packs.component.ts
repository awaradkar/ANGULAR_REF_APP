import { Component, OnInit, Input } from '@angular/core';
import { MenuComponent } from '../menu.component';
import { PackService } from 'src/app/service/pack.service';
import { AlertService } from 'src/app/service/alert.service';
import { NgForm } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { Pack } from 'src/app/models/pack';
import { Observable } from 'rxjs';
import { FormControl } from "@angular/forms";
import { AutoCompleteService } from 'src/app/service/autocomplete.service';

@Component({
  selector: 'app-packs',
  templateUrl: './packs.component.html',
  styleUrls: ['../../app.component.scss'],
  providers: [AutoCompleteService]
})
export class PacksComponent implements OnInit {
  private gridApi;
  @Input() menuComponent: MenuComponent;
  @Input() agriModule: AgGridModule;
  @Input() myControl: FormControl

  model: any = {};
  searhModel: any = {};
  loading = false;
  disableFields = false;
  searchOpen = true;
  editDisabled = false;
  packAutoList = [];

  //grid config
  columnDefs = [
    { headerName: 'Id', field: '_id', sortable: true, filter: true, width: 270, hide:true},
    { headerName: 'Pack Id', field: '_packType', sortable: true, filter: true, width: 270 },
    { headerName: 'Pack Description', field: '_packDescription', sortable: true, filter: true, width: 270 },
    { headerName: 'Pack Deduction', field: '_packDeduction', sortable: true, filter: true, width: 270 },
    { headerName: 'Select', sortable: true, filter: true, width: 270, checkboxSelection: true }
  ];

  rowData: Observable<Array<Pack>>[];

  lastkeydown = 0;
  //calendarOptions: OptionsInput;

  constructor(private packService: PackService,
    private alertService: AlertService,
    private autoCompService: AutoCompleteService) { }

  ngOnInit() {
    this.disableFields = false;
    this.getRecordsOnInit();
  }

  save() {
    this.alertService.success(null);
    this.alertService.error(null);
    let newModel = this.model;
    
    if (newModel._id == null || newModel._id == undefined) {
      this.model._createdBy = JSON.parse(localStorage.getItem('currentUser'))._userName;
      this.packService.create(this.model)
        .subscribe(
          data => {
            let orgObj: any = data;
            this.model = orgObj.data;
            this.disableFields = true;
            this.alertService.success("Record Saved Succesfully");
          },
          error => {
            this.alertService.error(error);
            this.loading = false;
          });
    }
  }

  edit() {
    this.alertService.success(null);
    this.alertService.error(null);
    this.model._modifiedBy = JSON.parse(localStorage.getItem('currentUser'))._userName;
    this.packService.update(this.model)
      .subscribe(
        data => {
          let orgObj: any = data;
          this.model = orgObj.data;
          this.disableFields = true;
          this.alertService.success("Record Edited Succesfully");
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  enableCreate(f: NgForm) {
    this.alertService.success(null);
    this.alertService.error(null);
    this.model = {};
    this.loading = false;
    this.disableFields = false;
    this.editDisabled = false;
    this.searchOpen = false;
    f.resetForm(true);
  }

  getRecordsOnInit() {
    let queryparam = "?";
    if (this.searhModel._packType != null && this.searhModel._packType != "" && this.searhModel._packType != undefined) {
      queryparam = queryparam + "_packType=" + this.searhModel._packType + "&";
    }
    if (this.searhModel._packDescription != null && this.searhModel._packDescription != "" && this.searhModel._packDescription != undefined) {
      queryparam = queryparam + "_packDescription=" + this.searhModel._packDescription + "&";
    }
    if (this.searhModel.startDate != null && this.searhModel.startDate != "" && this.searhModel.startDate != undefined) {
      queryparam = queryparam + "startDate=" + this.setZoneDateFormat(new Date(this.searhModel.startDate)) + "&";
    } 
    if (this.searhModel.endDate != null && this.searhModel.endDate != "" && this.searhModel.endDate != undefined) {
      queryparam = queryparam + "endDate=" + this.setZoneDateFormat(new Date(this.searhModel.endDate));
    } 

    this.packService.getAll(queryparam)
      .subscribe(
        data => {
          let commRecords: any = data;
          this.rowData = commRecords.data.docs;
        },
        error => {
          this.alertService.error(error);
        });

  }

  setZoneDateFormat(date: Date) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let monthStr = month < 10 ? "0" + month : month;
    let day = date.getDate();
    let dayStr = day < 10 ? "0" + day : day;
    let dateStr = year + "-" + monthStr + "-" + dayStr + "T00:00:00.000Z"
    return dateStr;
  }

  createNewForm(f: NgForm) {
    this.alertService.success(null);
    this.alertService.error(null);
    this.model = {};
    this.searhModel = {};
    this.loading = false;
    this.disableFields = false;
    this.searchOpen = false;
    this.editDisabled = false;
    f.resetForm(true);
  }

  viewPacks(f: NgForm) {
    this.alertService.success(null);
    this.alertService.error(null);
    this.model = {};
    this.searhModel = {};
    this.loading = false;
    this.disableFields = false;
    this.searchOpen = true;
    this.getRecordsOnInit();
    f.resetForm(true);
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }
  editRecord() {
    this.alertService.error(null);
    this.alertService.success(null);
    var selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows != null && selectedRows != undefined && selectedRows.length > 0) {
      this.searchOpen = false;
      this.searhModel = {};
      this.loading = false;
      this.disableFields = false;
      this.editDisabled = true;
      this.packService.getById(selectedRows[0]._packType).subscribe(
        data =>{
          let commObj:any = data;
          this.model = commObj.data;
        }
      );
    } else {
      this.alertService.error("Please select a row to continue");
      this.loading = false;
    }
  }
  deleteRecord() {
    this.alertService.error(null);
    this.alertService.success(null);
    var selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows != null && selectedRows != undefined && selectedRows.length > 0) {
      let rec = selectedRows[0];
      this.packService.searchCommodities(rec._packType)
        .subscribe(
          data => {
            let commpackObj:any = data;
            if (commpackObj.data.length == 0) {
              this.packService.delete(rec._id)
                .subscribe(
                  data => {
                    this.disableFields = true;
                    this.alertService.success("Record Deleted Succesfully");
                    this.getRecordsOnInit();
                  },
                  error => {
                    this.alertService.error(error);
                    this.loading = false;
                  });
            } else {
              this.alertService.error("Pack Cannot be deleted since Commodity is already mapped for the same");
              this.loading = false;
            }

          },
          error => {
            this.alertService.error(error);
            this.loading = false;
          });
    } else {
      this.alertService.error("Please select a row to continue");
      this.loading = false;
    }
  }

  onQuickFilterChanged() {
    this.gridApi.setQuickFilter((<HTMLInputElement>document.getElementById("quickFilter")).value);
  }
}
