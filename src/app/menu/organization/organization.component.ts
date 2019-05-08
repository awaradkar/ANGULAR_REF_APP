import { Component, OnInit, Input } from '@angular/core';
import { MenuComponent } from '../menu.component';
import { OrganizationService } from 'src/app/service/organization.service';
import { AlertService } from 'src/app/service/alert.service';
import { NgForm } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { Observable } from 'rxjs';
import { FormControl } from "@angular/forms";
import { AutoCompleteService } from 'src/app/service/autocomplete.service';
import { Organization } from 'src/app/models/organization';


@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['../../app.component.scss'],
  providers: [AutoCompleteService]
})
export class OrganizationComponent implements OnInit {
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
  orgAutoList = [];

  //grid config
  columnDefs = [
    { headerName: 'Id', field: '_id', sortable: true, filter: true, width: 180, hide:true},
    { headerName: 'Organization Id', field: '_orgId', sortable: true, filter: true, width: 180 },
    { headerName: 'Organization Name', field: '_orgName', sortable: true, filter: true, width: 180 },
    { headerName: 'Organization Type', field: '_orgType', sortable: true, filter: true, width: 180 },
    { headerName: 'Organization City', field: '_orgCity', sortable: true, filter: true, width: 180 },
    { headerName: 'Organization State', field: '_orgState', sortable: true, filter: true, width: 180 },
    { headerName: 'Select', sortable: true, filter: true, width: 180, checkboxSelection: true }
  ];

  rowData: Observable<Array<Organization>>[];
  lastkeydown = 0;

  constructor(private organizationServive: OrganizationService,
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
    let dateStr = this.model._orgDate;
    let actualDate = null;
    actualDate = Date.parse(dateStr)
    
    if (actualDate) {
      newModel._orgDate = this.setZoneDateFormat(new Date());
      this.model._createdBy = JSON.parse(localStorage.getItem('currentUser'))._userName;
      if (newModel._id == null || newModel._id == undefined) {
        this.organizationServive.create(this.model)
          .subscribe(
            data => {
              let orgObj: any = data;
              this.model = orgObj.data;
              let dateNew =  this.setAppDate(new Date(Date.parse(this.model._orgDate)));
              this.model._orgDate = dateNew;
              this.disableFields = true;
              this.alertService.success("Record Saved Succesfully");
            },
            error => {
              this.alertService.error(error.error.message);
              this.loading = false;
            });
      }
    }else{
      this.alertService.error("Please enter organization date in the form MM/dd/yyyy");
    }
  }

  edit() {
    this.alertService.success(null);
    this.alertService.error(null);
    let dateStr = this.model._orgDate;
    let actualDate = null;
    actualDate = Date.parse(dateStr)
    if(actualDate){
    this.model._modifiedBy = JSON.parse(localStorage.getItem('currentUser'))._userName;
    this.organizationServive.update(this.model)
      .subscribe(
        data => {
          let orgObj: any = data;
          this.model = orgObj.data;
          let dateNew =  this.setAppDate(new Date(Date.parse(this.model._orgDate)));
          this.model._orgDate = dateNew;
          this.disableFields = true;
          this.alertService.success("Record Edited Succesfully");
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
      }else{
        this.alertService.error("Please enter organization date in the form MM/dd/yyyy");
      }
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
    if (this.searhModel._orgId != null && this.searhModel._orgId != "" && this.searhModel._orgId != undefined) {
      queryparam = queryparam + "_orgId=" + this.searhModel._orgId + "&";
    }
    if (this.searhModel._orgName != null && this.searhModel._orgName != "" && this.searhModel._orgName != undefined) {
      queryparam = queryparam + "_orgName=" + this.searhModel._orgName + "&";
    }
    if (this.searhModel._orgType != null && this.searhModel._orgType != "" && this.searhModel._orgType != undefined) {
      queryparam = queryparam + "_orgType=" + this.searhModel._orgType + "&";
    }
    if (this.searhModel._orgCity != null && this.searhModel._orgCity != "" && this.searhModel._orgCity != undefined) {
      queryparam = queryparam + "_orgCity=" + this.searhModel._orgCity + "&";
    }
    if (this.searhModel.startDate != null && this.searhModel.startDate != "" && this.searhModel.startDate != undefined) {
      queryparam = queryparam + "startDate=" + this.setZoneDateFormat(new Date(this.searhModel.startDate)) + "&";
    }
    if (this.searhModel.endDate != null && this.searhModel.endDate != "" && this.searhModel.endDate != undefined) {
      queryparam = queryparam + "endDate=" + this.setZoneDateFormat(new Date(this.searhModel.endDate));
    }
    this.organizationServive.getAll(queryparam)
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

  setAppDate(date: Date){
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let monthStr = month < 10 ? "0" + month : month;
    let day = date.getDate();
    let dayStr = day < 10 ? "0" + day : day;
    let dateStr = monthStr + "/" + dayStr + "/" + year;
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

  viewOrganizations(f: NgForm) {
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
      this.organizationServive.getById(selectedRows[0]._orgId).subscribe(
        data =>{
          let orgObj:any = data;
          this.model = orgObj.data;
          let dateNew =  this.setAppDate(new Date(Date.parse(this.model._orgDate)));
          this.model._orgDate = dateNew;
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
      this.organizationServive.searchDeposits(rec._orgId)
        .subscribe(
          data => {
            let depCount = data;
            if (data == 0) {
              this.organizationServive.delete(rec._id)
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
              this.alertService.error("Organization Cannot be deleted since deposit already exists for the same");
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
