import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';

@Injectable()
export class AutoCompleteService {

    constructor(private http: HttpClient) { }
    url = "http://localhost:3000/api/autoComplete/";

    getCommId(query: String) {
        return this.http.get<any>(this.url + 'commName/' + query).pipe
            (
                debounceTime(500),  // WAIT FOR 500 MILISECONDS ATER EACH KEY STROKE.
                map(
                    (data: any) => {
                        return (
                            data.data.length != 0 ? data.data as any[] : [{ "CommName": "No Record Found" } as any]
                        );
                    }
                ));
    }
}