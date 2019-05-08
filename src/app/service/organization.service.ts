import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

import { Organization } from '../models/organization';

@Injectable()
export class OrganizationService {
  
    constructor(private http: HttpClient) { }
    url = "http://localhost:3000/api/organizations/";
    depositUrl = "http://localhost:8080/api/v1/deposit/orgDeposit/";

    getAll(query:String) {
        return this.http.get<Organization[]>(this.url+query);
    }

    getById(id: String) {
        return this.http.get<Organization>(this.url+ id);
    }

    create(organization: Organization) {
        return this.http.post(this.url, organization)
    }

    update(organization: Organization) {
        return this.http.put(this.url, organization);
    }

    delete(id: any) {
        return this.http.delete(this.url + id);
    }

    searchDeposits(_orgId: any) {
        return this.http.get(this.depositUrl + _orgId);
      }
}