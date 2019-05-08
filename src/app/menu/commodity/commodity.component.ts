import { Component, OnInit, Input } from '@angular/core';
import { MenuComponent } from '../menu.component';
import { CommodityService } from 'src/app/service/commodity.service';
import { AlertService } from 'src/app/service/alert.service';
import { NgForm } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { Commodity } from 'src/app/models/commodity';
import { Observable } from 'rxjs';
import { FormControl } from "@angular/forms";
import { AutoCompleteService } from 'src/app/service/autocomplete.service';

@Component({
  selector: 'app-commodity',
  templateUrl: './commodity.component.html',
  styleUrls: ['../../app.component.scss'],
  providers: [AutoCompleteService]
})
export class CommodityComponent implements OnInit {
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
  commAutoList = [];

  //grid config
  columnDefs = [
    { headerName: 'Id', field: '_id', sortable: true, filter: true, width: 270, hide: true },
    { headerName: 'Commodity Id', field: '_commId', sortable: true, filter: true, width: 270 },
    { headerName: 'Commodity Name', field: '_commName', sortable: true, filter: true, width: 270 },
    { headerName: 'Commodity UOM', field: '_unitOfMeasure', sortable: true, filter: true, width: 270 },
    { headerName: 'Select', sortable: true, filter: true, width: 270, checkboxSelection: true }
  ];

  rowData: Observable<Array<Commodity>>[];

  lastkeydown = 0;
  //calendarOptions: OptionsInput;

  constructor(private commodityService: CommodityService,
    private alertService: AlertService,
    private autoCompService: AutoCompleteService) { }

  ngOnInit() {
    this.disableFields = false;
    this.getCommRecordsOnInit();


    //this.calendarOptions = {editable: true,eventLimit: false,header: {left: 'prev,next today',center: 'title',right: 'month,agendaWeek,agendaDay,listMonth'}};
  }

  save() {
    this.alertService.success(null);
    this.alertService.error(null);
    let newModel = this.model;

    if (newModel._id == null || newModel._id == undefined) {
      this.model._createdBy = JSON.parse(localStorage.getItem('currentUser'))._userName;
      this.commodityService.create(this.model)
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
    this.commodityService.update(this.model)
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

  getCommRecordsOnInit() {
    
    let queryparam = "?";
    if (this.searhModel._commId != null && this.searhModel._commId != "" && this.searhModel._commId != undefined) {
      queryparam = queryparam + "_commId=" + this.searhModel._commId + "&";
    }
    if (this.searhModel._commName != null && this.searhModel._commName != "" && this.searhModel._commName != undefined) {
      queryparam = queryparam + "_commName=" + this.searhModel._commName + "&";
    }
    if (this.searhModel.startDate != null && this.searhModel.startDate != "" && this.searhModel.startDate != undefined) {
      queryparam = queryparam + "startDate=" + this.setZoneDateFormat(new Date(this.searhModel.startDate)) + "&";
    }
    if (this.searhModel.endDate != null && this.searhModel.endDate != "" && this.searhModel.endDate != undefined) {
      queryparam = queryparam + "endDate=" + this.setZoneDateFormat(new Date(this.searhModel.endDate));
    }

    this.commodityService.getAll(queryparam)
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

  viewCommodities(f: NgForm) {
    this.alertService.success(null);
    this.alertService.error(null);
    this.model = {};
    this.searhModel = {};
    this.loading = false;
    this.disableFields = false;
    this.searchOpen = true;
    f.resetForm(true);
    this.getCommRecordsOnInit();
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
      this.commodityService.getById(selectedRows[0]._commId).subscribe(
        data => {
          let commObj: any = data;
          this.model = commObj.data;
        },
        error => {
          console.log(error);
          this.alertService.error(error);
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
      this.commodityService.searchDeposits(rec._commId)
        .subscribe(
          data => {
            let depCount = data;
            if (data == 0) {
              this.commodityService.delete(rec._id)
                .subscribe(
                  data => {
                    this.disableFields = true;
                    this.getCommRecordsOnInit();
                    this.alertService.success("Record Deleted Succesfully");
                  },
                  error => {
                    this.alertService.error(error.error.message);
                    this.loading = false;
                  });
            } else {
              this.alertService.error("Commodity Cannot be deleted since deposit already exists for the same");
              this.loading = false;
            }

          },
          error => {
            this.alertService.error(error.error.message);
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

  getCommId($event) {
    //let commIdStr = (<HTMLInputElement>document.getElementById("_commId")).value;
    this.commAutoList = [];

    if ($event.timeStamp - this.lastkeydown > 200) {
      this.autoCompService.getCommId("?_comm=" + this.searhModel._commId).
        subscribe(
          data => {
            this.prepareCommString(data);
          },
          error => {
            this.alertService.error(error);
            this.loading = false;
          });
    }

  }
  prepareCommString(data) {
    for (let index = 0; index < data.length; index++) {
      let element: any = data[index];
      let str = element._commId + "(" + element._commName + ")";
      this.commAutoList.push(str);
    }
  }
}
