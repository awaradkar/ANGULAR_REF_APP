import { Component, OnInit, Input } from '@angular/core';
import * as $ from 'jquery';
import { AlertComponent } from '../alert/alert.component';
import { AlertService } from '../service/alert.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['../app.component.scss']
})
export class MenuComponent implements OnInit {
  @Input() alertComponent:AlertComponent
  public isComm:boolean;
  public isOrg:boolean; public isPack:boolean; public isWhComm:boolean; public isCommPacks:boolean; public isUser:boolean;
  public isChngPwd:boolean;
  public nlyChngPasswdDisplay = false;
  constructor(private alertService:AlertService) { }

  ngOnInit() {
    this.setFlags();
    let loggedInUser:any = JSON.parse(localStorage.getItem('currentUser'));
    if(loggedInUser._isFirstLogin == true){
      this.nlyChngPasswdDisplay = true;
    }
  }

  setFlags() {
    this.alertService.error(null);
    this.alertService.success(null);
    this.isChngPwd = false; this.isOrg = false; this.isComm = false; this.isPack = false; this.isCommPacks = false; this.isUser = false; this.isWhComm = false;
  }

  toggle() {
    $("#wrapper").toggleClass("toggled");
  }

  loggedInUser = JSON.parse(localStorage.getItem('currentUser'))._userName;
  onselect(compName) {
    this.setFlags();
    if (compName === 'comm') this.isComm = true;
    else if(compName==='org') this.isOrg = true;
    else if(compName==='pack') this.isPack = true;
    else if(compName==='whComm') this.isWhComm = true;
    else if(compName==='commPack') this.isCommPacks =true;
    else if(compName==='user') this.isUser =true;
    else if(compName==='chPwd') this.isChngPwd = true;
  }
}
