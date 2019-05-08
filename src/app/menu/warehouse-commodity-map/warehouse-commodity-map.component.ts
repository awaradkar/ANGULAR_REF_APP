import { Component, OnInit, Input } from '@angular/core';
import { MenuComponent } from '../menu.component';
import { AlertService } from 'src/app/service/alert.service';
import { NgForm } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { Commodity } from 'src/app/models/commodity';
import { Observable } from 'rxjs';
import { FormControl } from "@angular/forms";
import { AutoCompleteService } from 'src/app/service/autocomplete.service';
import { Organization } from 'src/app/models/organization';
import { OrganizationService } from 'src/app/service/organization.service';
import { WareHouseCommodityMap } from 'src/app/models/whCommMap';
import { WarehouseCommService } from 'src/app/service/whCommMap.servive';
import { CommodityService } from 'src/app/service/commodity.service';
import { error } from 'util';

@Component({
  selector: 'app-warehouse-commodity-map',
  templateUrl: './warehouse-commodity-map.component.html',
  styleUrls: ['../../app.component.scss'],
  providers: [AutoCompleteService]
})
export class WarehouseCommodityMapComponent implements OnInit {
  private gridApi;
  private orgGridApi;
  private commGridApi;
  private whCommGridApi;
  @Input() menuComponent: MenuComponent;
  @Input() agriModule: AgGridModule;
  @Input() myControl: FormControl;
  rowMultiSelection = "multiple";

  model: any = {};
  searhModel: any = {};
  loading = false;
  disableFields = false;
  searchOpen = true;
  editDisabled = false;
  commoditySelected =true;
  openWhCommGrid = false;

  //grid config
  columnDefs = [
    { headerName: 'Id', field: '_id', sortable: true, filter: true, width: 120, hide: true },
    { headerName: 'Warehouse Code', field: '_warehouseCode', sortable: true, filter: true, width: 120 },
    { headerName: 'Warehouse Name', field: '_warehouseName', sortable: true, filter: true, width: 120 },
    { headerName: 'Select', sortable: true, filter: true, width: 120, checkboxSelection: true }
  ];

  rowData: Observable<Array<WareHouseCommodityMap>>[];

  //org grid config
  orgColumnDefs = [
    { headerName: 'Warehouse code', field: '_orgId', sortable: true, filter: true, width: 120 },
    { headerName: 'Warehouse Name', field: '_orgName', sortable: true, filter: true, width: 120 },
    { headerName: 'Select', sortable: true, filter: true, width: 120, checkboxSelection: true}
  ];

  orgRowData: Observable<Array<Organization>>[];

  //comm grid data
  commColumnDefs=[
  { headerName: 'Commodity Id', field: '_commId', sortable: true, filter: true, width: 120 },
  { headerName: 'Commodity Name', field: '_commName', sortable: true, filter: true, width: 120 },
  { headerName: 'Select', sortable: true, filter: true, width: 270, checkboxSelection: true}
];
  commRowData:Observable<Array<Commodity>>[];

  //comm grid data
  commMappedcolumnDefs=[
    { headerName: 'Commodity Id', field: '_commId', sortable: true, filter: true, width: 150 },
    { headerName: 'Commodity Name', field: '_commName', sortable: true, filter: true, width: 150 },
  ];
commMappedRowData:Observable<Array<Commodity>>[];


  constructor(private warehouseCommService: WarehouseCommService,
    private alertService: AlertService,
    private organizationService: OrganizationService,
    private commodityService:CommodityService){}

  ngOnInit() {
    this.disableFields = false;
     this.getRecordsOnInit();
  }
  
  save() {
    this.alertService.success(null);
    this.alertService.error(null);

    var orgSelectedRows = this.orgGridApi.getSelectedRows();
    var commSelectedRows = this.commGridApi.getSelectedRows();

    if (orgSelectedRows.length != 0) {
      if (commSelectedRows.length != 0) {
        this.model._warehouseCode = orgSelectedRows[0]._orgId;

        var commArr = [];
        for (let index = 0; index < commSelectedRows.length; index++) {
          const element = commSelectedRows[index];
          commArr.push(element._commId);
        }
        this.model._commId = commArr;
          if (this.model._id == null || this.model._id == undefined) {
            this.model._createdBy = JSON.parse(localStorage.getItem('currentUser'))._userName;
            this.warehouseCommService.create(this.model)
              .subscribe(
                data => {
                  this.orgRowData = orgSelectedRows;
                  this.commRowData = commSelectedRows;
                  this.commGridApi.setColumnDefs(this.commColumnDefs);
                  this.commGridApi.setRowData(this.commRowData);
                  this.disableFields = true;
                  this.alertService.success("Record Saved Succesfully");
                },
                error => {
                  this.alertService.error(error);
                  this.loading = false;
                });
          }
 
      } else {
        this.alertService.error("Please select a Warehouse");
        this.loading = false;
      }
    }
    else {
      this.alertService.error("Please select atleast one commodity");
    }

  }

  edit() {
    this.alertService.success(null);
    this.alertService.error(null);

    var commSelectedRows = this.commGridApi.getSelectedRows();

    this.model._modifiedBy = JSON.parse(localStorage.getItem('currentUser'))._userName;

    if (commSelectedRows.length != 0) {
      
    var commArr = [];
    for (let index = 0; index < commSelectedRows.length; index++) {
      const element = commSelectedRows[index];
      commArr.push(element._commId);
    }
    this.model._commId = commArr;
    this.warehouseCommService.update(this.model)
      .subscribe(
        data => {
          this.commRowData = commSelectedRows;
          this.disableFields = true;
          this.alertService.success("Record Edited Succesfully");
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
      }else{
        this.alertService.error("Please select atleast one commodity");
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
    this.organizationService.getAll("").subscribe(
      data => {
        let orgRecords: any = data;
        this.orgRowData = orgRecords.data.docs;
        this.commodityService.getAll("").subscribe(
          data => {
            let commRecords: any = data;
            this.commRowData = commRecords.data.docs;
            this.commGridApi.setColumnDefs(this.commColumnDefs);
            this.commGridApi.setRowData(this.commRowData);
          },
          error => {
            this.alertService.error(error);
          });
      },
      error => {
        this.alertService.error(error);
      });
    f.resetForm(true);
  }

  getRecordsOnInit() {
    this.openWhCommGrid = false;
    let queryparam = "";
    if (this.searhModel._warehouseCode != null && this.searhModel._warehouseCode != "" && this.searhModel._warehouseCode != undefined) {
      queryparam = queryparam + "?_warehouseCode=" + this.searhModel._warehouseCode;
    }

    this.warehouseCommService.getAll(queryparam)
      .subscribe(
        data => {
          let commRecords: any = data;
          this.rowData = commRecords.data.docs;
        },
        error => {
          this.alertService.error(error);
        });
  }

  createNewForm(f: NgForm) {
    this.openWhCommGrid = true;
    this.alertService.success(null);
    this.alertService.error(null);
    this.model = {};
    this.searhModel = {};
    this.loading = false;
    this.disableFields = false;
    this.searchOpen = false;
    this.editDisabled = false;
    this.organizationService.getAll("").subscribe(
      data => {
        let orgRecords: any = data;
        this.orgRowData = orgRecords.data.docs;
        this.commodityService.getAll("").subscribe(
          data => {
            let commRecords: any = data;
            this.commRowData = commRecords.data.docs;
            this.commGridApi.setColumnDefs(this.commColumnDefs);
            this.commGridApi.setRowData(this.commRowData);
          },
          error => {
            this.alertService.error(error);
          });
      },
      error => {
        this.alertService.error(error);
      });
    
    f.resetForm(true);
  }

  viewMappingRecords(f: NgForm) {
    this.openWhCommGrid = false;
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

  onCommGridReady(params){
    this.commGridApi = params.api;
  }

  onCommMappedGridGridReady(params){
    this.whCommGridApi = params.api;
  }

  editRecord() {
    this.orgRowData = [];
    this.commRowData = [];
    this.alertService.error(null);
    this.alertService.success(null);
    var selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows != null && selectedRows != undefined && selectedRows.length > 0) {
      this.searchOpen = false;
      this.searhModel = {};
      this.loading = false;
      this.disableFields = false;
      this.editDisabled = true;
      let commDtls = [];
      this.warehouseCommService.getById(selectedRows[0]._warehouseCode).subscribe(
        data => {
          let userObj: any = data;
          this.model = userObj.data.wareComm;
          var obj:any = {}; obj._orgId = this.model._warehouseCode; obj._orgName = this.model._warehouseName;
          var objList:any =[];
          objList.push(obj);
          this.orgRowData = objList;

          commDtls = userObj.data.commodityDtls;

          this.commodityService.getAll("").subscribe(
            data => {
              let commRecords: any = data;
              this.commRowData = commRecords.data.docs;
              this.commGridApi.setColumnDefs(this.commColumnDefs);
              this.commGridApi.setRowData(this.commRowData);
               
              
              this.commGridApi.forEachNode(function (node) {
                console.log(node);
                console.log(node.data._commId);
                for (let index = 0; index < commDtls.length; index++) {
                  const commElement = commDtls[index];
                  if (node.data._commId === commElement._commId) {
                    node.setSelected(true);
                  }
                
                }
              });
            
              
            }
          )
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

      this.warehouseCommService.delete(rec._id)
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

  onOrgQuickFilterChanged(){
    this.orgGridApi.setQuickFilter((<HTMLInputElement>document.getElementById("orgQuickFilter")).value);
  }

  onCommQuickFilterChanged(){
    this.commGridApi.setQuickFilter((<HTMLInputElement>document.getElementById("commQuickFilter")).value);
  }

  onCommMapQuickFilterChanged(){
    this.whCommGridApi.setQuickFilter((<HTMLInputElement>document.getElementById("commWhquickFilter")).value);
  }

  onRowSelected(){
    this.openWhCommGrid = true;
    var selectedRows = this.gridApi.getSelectedRows();
    
      this.warehouseCommService.getById(selectedRows[0]._warehouseCode).subscribe(
        data => {
          let userObj: any = data;
          let commDtls:any = userObj.data.commodityDtls;
          this.commMappedRowData = commDtls;
        },
        error => {
          console.log(error);
          this.alertService.error(error);
        }
      );
   
  }
}
