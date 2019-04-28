import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpHeaders
} from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  constructor() {
    console.log('Inside Auth interceptor')
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    if(req.url.includes('loginUser') || req.url.includes('signup') )
    {
    //   setTimeout(() => {
    //     const authToken = this.authService.getToken();
    //     console.log(authToken);
        const authRequest = req.clone({
    //       headers: req.headers.set('Authorization', 'Bearer ' + authToken)
        });
        return next.handle(authRequest);
    // }, 1000);

    }
    // const authToken = this.authService.getToken();
    const authRequest = req.clone({
      // headers: req.headers.set('Authorization', 'Bearer ' + authToken)
      // headers: req.headers.set('Application')
    });

    console.log('Token: ', localStorage.getItem('token'))
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json'
    });


    const cloneReq = req.clone({headers});
    return next.handle(cloneReq);
  }
}
