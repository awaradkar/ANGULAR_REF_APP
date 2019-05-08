import { Component, OnInit, Input } from '@angular/core';
import { MenuComponent } from '../menu.component';
import { AlertService } from 'src/app/service/alert.service';
import { NgForm } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { Observable } from 'rxjs';
import { FormControl } from "@angular/forms";
import { AutoCompleteService } from 'src/app/service/autocomplete.service';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/service/user.service';
import { Organization } from 'src/app/models/organization';
import { OrganizationService } from 'src/app/service/organization.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['../../app.component.scss'],
  providers: [AutoCompleteService]
})
export class UserComponent implements OnInit {
  private gridApi;
  private orgGridApi;
  @Input() menuComponent: MenuComponent;
  @Input() agriModule: AgGridModule;
  @Input() myControl: FormControl;
  model: any = {};
  searhModel: any = {};
  loading = false;
  disableFields = false;
  searchOpen = true;
  editDisabled = false;
  userAutoList = [];
  orgViewOpen = false;
  regexPassword = /^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,}$/;
  //grid config
  columnDefs = [
    { headerName: 'Id', field: '_id', sortable: true, filter: true, width: 216, hide: true },
    { headerName: 'User Id', field: '_userId', sortable: true, filter: true, width: 216 },
    { headerName: 'User Name', field: '_userName', sortable: true, filter: true, width: 216 },
    { headerName: 'User Organization', field: '_userOrg', sortable: true, filter: true, width: 216 },
    { headerName: 'Organization Name', field: '_userOrgName', sortable: true, filter: true, width: 216 },
    { headerName: 'Select', sortable: true, filter: true, width: 216, checkboxSelection: true }
  ];

  rowData: Observable<Array<User>>[];

  //org grid config
  orgColumnDefs = [
    { headerName: 'Org Id', field: '_orgId', sortable: true, filter: true, width: 200 },
    { headerName: 'Org Name', field: '_orgName', sortable: true, filter: true, width: 200 },
    { headerName: 'Org Type', field: '_orgType', sortable: true, filter: true, width: 200 },
    { headerName: 'Select', sortable: true, filter: true, width: 200, checkboxSelection: true }
  ];

  orgRowData: Observable<Array<Organization>>[];
  constructor(private userService: UserService,
    private alertService: AlertService,
    private organizationService: OrganizationService,
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
      if (this.regexPassword.test(this.model._userPassword)) {
        this.userService.getByUserName(this.model._userName).subscribe(
          data => {
            let obj: any = data;
            let user: any = obj.data;
            if (!user._userName) {
              this.userService.create(this.model)
                .subscribe(
                  data => {
                    let orgObj: any = data;
                    this.model = orgObj.data;
                    this.disableFields = true;
                    this.alertService.success("Record Saved Succesfully");
                  },
                  error => {
                    this.alertService.error(error.error.message);
                    this.loading = false;
                  });
            } else {
              this.alertService.error("Username already exists. Please try a different one");
            }
          },
          error => {
            this.alertService.error(error.error.message);
          }
        )
      } else {
        this.alertService.error('Make sure password has atleast One special character, ' +
          ' One upper case character, ' +
          'At least one lower case English letter, \n' +
          'At least one digit, \n' +
          'At least one special character')
      }
    }
  }

  edit() {
    this.alertService.success(null);
    this.alertService.error(null);
    this.model._modifiedBy = JSON.parse(localStorage.getItem('currentUser'))._userName;
    this.userService.update(this.model)
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
    if (this.searhModel._userId != null && this.searhModel._userId != "" && this.searhModel._userId != undefined) {
      queryparam = queryparam + "_userId=" + this.searhModel._userId + "&";
    }
    if (this.searhModel._userName != null && this.searhModel._userName != "" && this.searhModel._userName != undefined) {
      queryparam = queryparam + "_userName=" + this.searhModel._userName + "&";
    }
    if (this.searhModel._userOrg != null && this.searhModel._userOrg != "" && this.searhModel._userOrg != undefined) {
      queryparam = queryparam + "_userOrg=" + this.searhModel._userOrg + "&";
    }
    if (this.searhModel.startDate != null && this.searhModel.startDate != "" && this.searhModel.startDate != undefined) {
      queryparam = queryparam + "startDate=" + this.setZoneDateFormat(new Date(this.searhModel.startDate)) + "&";
    }
    if (this.searhModel.endDate != null && this.searhModel.endDate != "" && this.searhModel.endDate != undefined) {
      queryparam = queryparam + "endDate=" + this.setZoneDateFormat(new Date(this.searhModel.endDate));
    }

    this.userService.getAll(queryparam)
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

  viewUsers(f: NgForm) {
    this.alertService.success(null);
    this.alertService.error(null);
    this.model = {};
    this.searhModel = {};
    this.loading = false;
    this.disableFields = false;
    this.searchOpen = true;
    f.resetForm(true);
    this.getRecordsOnInit();
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

  onOrgGridReady(params) {
    this.orgGridApi = params.api;
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
      this.userService.getById(selectedRows[0]._userId).subscribe(
        data => {
          let userObj: any = data;
          this.model = userObj.data;
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

      this.userService.delete(rec._id)
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
      this.alertService.error("Please select a row to continue");
      this.loading = false;
    }
  }


  onQuickFilterChanged() {
    this.gridApi.setQuickFilter((<HTMLInputElement>document.getElementById("quickFilter")).value);
  }

  onOrgQuickFilterChanged() {
    this.orgGridApi.setQuickFilter((<HTMLInputElement>document.getElementById("orgQuickFilter")).value);
  }
  openOrgGrid() {
    this.orgViewOpen = true;
    this.getOrgs();
  }

  getOrgs() {
    this.alertService.error(null);
    this.alertService.success(null);
    let queryparam = "?";
    this.organizationService.getAll(queryparam)
      .subscribe(
        data => {
          let commRecords: any = data;
          this.orgRowData = commRecords.data.docs;
        },
        error => {
          this.alertService.error(error);
        });
  }

  selectRecord() {
    this.alertService.error(null);
    this.alertService.success(null);
    var selectedRows = this.orgGridApi.getSelectedRows();
    if (selectedRows != null && selectedRows != undefined && selectedRows.length > 0) {
      this.model._userOrg = selectedRows[0]._orgId;
      if ('WAREHOUSE' == selectedRows[0]._orgType) { this.model._userRole = 2; }
      else if ('CLIENT' == selectedRows[0]._orgType) { this.model._userRole = 3; }
      else { this.model._userRole = 1; }
      this.orgViewOpen = false;
    } else {
      this.alertService.error("Please select a row to continue");
      this.loading = false;
    }
  }
}