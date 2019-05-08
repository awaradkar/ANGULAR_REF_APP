import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../models/user';

@Injectable()
export class UserService {
    constructor(private http: HttpClient) { }
    url = "http://localhost:3000/api/users/";
    appUrl = "userName/";
    chngUrl = "changePasswd"
    getAll(query:String) {
        return this.http.get<User[]>(this.url+query);
    }

    getById(id: String) {
        return this.http.get<User>(this.url+ id);
    }

    create(user: User) {
        return this.http.post(this.url, user)
    }

    update(user: User) {
        return this.http.put(this.url, user);
    }

    delete(id: any) {
        return this.http.delete(this.url + id);
    }
    getByUserName(id: String) {
        return this.http.get<User>(this.url+ this.appUrl +id);
    }

    chngePasswd(chngPasswd: any){
        return this.http.put(this.url+this.chngUrl, chngPasswd);
    }
}