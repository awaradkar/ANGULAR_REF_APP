import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

import { Pack } from '../models/pack';

@Injectable()
export class PackService {
  
    constructor(private http: HttpClient) { }
    url = "http://localhost:3000/api/packs/";
    commPackUrl = "http://localhost:3000/api/commPacks/commMap/";

    getAll(query:String) {
        return this.http.get<Pack[]>(this.url+query);
    }

    getById(id: String) {
        return this.http.get<Pack>(this.url+ id);
    }

    create(pack: Pack) {
        return this.http.post(this.url, pack)
    }

    update(pack: Pack) {
        return this.http.put(this.url, pack);
    }

    delete(id: any) {
        return this.http.delete(this.url + id);
    }

    searchCommodities(packType: any) {
        return this.http.get(this.commPackUrl + packType);
      }
}