import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService} from '../service/alert.service';
import {AuthenticationService} from '../service/authentication.service';


@Component({
    selector: 'app-menu',
    templateUrl: 'login.component.html',
    styleUrls: ['../app.component.scss']
    
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService) { }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    login() {
        this.loading = true;
        this.returnUrl = "/menu"
        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(
                data => {
                    let user: any = data.data;
                    if (user._userRole == 1) {
                        this.router.navigate([this.returnUrl]);
                        this.loading = false;
                    }else{
                        this.alertService.error("Not authorised to login");
                        this.loading = false;
                    }
                },
                error => {
                    this.alertService.error(error.error.message);
                    this.loading = false;
                });
    }
}