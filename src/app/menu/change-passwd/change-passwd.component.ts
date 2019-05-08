import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService} from '../../service/alert.service';
//import {AuthenticationService} from '../../service/authentication.service';
import { MenuComponent } from '../menu.component';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-change-passwd',
  templateUrl: './change-passwd.component.html',
  styleUrls: ['../../app.component.scss']
})
export class ChangePasswdComponent implements OnInit {
  @Input() menuComponent: MenuComponent;
  model: any = {};
  loading = false;
  returnUrl: string;
  disableFields =false;
  regexPassword =/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,}$/;

  constructor(
      private alertService: AlertService,
      private userService:UserService,
      private route: ActivatedRoute,
      private router: Router,) { }

  ngOnInit() {
    this.model.userName = JSON.parse(localStorage.getItem('currentUser'))._userName;
  }

  change(){
    this.alertService.success(null);
    this.alertService.error(null);
    let oldPasswd = this.model.password;
    let newPasswd = this.model.userPassword;
    this.returnUrl = "/login/menu"

    if(oldPasswd==newPasswd){
      this.alertService.error("Old Password and New Password cannot be same.Please try again");
    }
    else{
      if(this.regexPassword.test(newPasswd)){
              this.userService.chngePasswd({"_userName":this.model.userName, "_oldPasswd":oldPasswd,"_newPasswd":newPasswd}).subscribe(
                data => {
                  let obj:any = data;
                  let user:any = obj.data;
                  localStorage.setItem('currentUser', JSON.stringify(user));
                  this.alertService.success("Password changed successfully.Redirecting to menu");
                  this.router.navigate([this.returnUrl]);
                },
                error=>{
                  this.alertService.error(error.error.message);
                }
              )
            
          }
      else{
        this.alertService.error('Make sure password has atleast One special character, ' +
        ' One upper case character, ' +
        'At least one lower case English letter, \n' +
        'At least one digit, \n' +
        'At least one special character')
      }
    }
  }
}
