import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            console.log(currentUser._token);
            const cloned = request.clone({
                headers: request.headers.set("Authorization",'Bearer '+currentUser._token)
            });
            console.log(cloned);
            return next.handle(cloned);
        }else{
            return next.handle(request);
        }
        
    }
}
