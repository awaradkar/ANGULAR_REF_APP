import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { WareHouseCommodityMap } from '../models/whCommMap';

@Injectable()
export class WarehouseCommService {
    constructor(private http: HttpClient) { }
    url = "http://localhost:3000/api/wareCommMap/";

    getAll(query:String) {
        return this.http.get<WareHouseCommodityMap[]>(this.url+query);
    }

    getById(id: String) {
        return this.http.get<WareHouseCommodityMap>(this.url+ id);
    }

    create(whCommMap: WareHouseCommodityMap) {
        return this.http.post(this.url, whCommMap)
    }

    update(whCommMap: WareHouseCommodityMap) {
        return this.http.put(this.url, whCommMap);
    }

    delete(id: any) {
        return this.http.delete(this.url + id);
    }
}