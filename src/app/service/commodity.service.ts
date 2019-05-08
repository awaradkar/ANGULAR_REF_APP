import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

import { Commodity } from '../models/commodity';

@Injectable()
export class CommodityService {
  
    constructor(private http: HttpClient) { }
    url = "http://localhost:3000/api/commodities/";
    depositUrl = "http://localhost:8080/api/v1/deposit/commDeposit/";

    getAll(query:String) {
        return this.http.get<Commodity[]>(this.url+query);
    }

    getById(id: String) {
        return this.http.get<Commodity>(this.url+ id);
    }

    create(commodity: Commodity) {
        return this.http.post(this.url, commodity)
    }

    update(commodity: Commodity) {
        return this.http.put(this.url, commodity);
    }

    delete(id: any) {
        return this.http.delete(this.url + id);
    }

    searchDeposits(_commId: any) {
        return this.http.get(this.depositUrl + _commId);
      }
}