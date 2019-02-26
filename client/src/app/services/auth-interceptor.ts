import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpHeaders
} from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    // if(req.url.includes('/api/user/login'))
    // {
    //   setTimeout(() => {
    //     const authToken = this.authService.getToken();
    //     console.log(authToken);
    //     const authRequest = req.clone({
    //       headers: req.headers.set('Authorization', 'Bearer ' + authToken)
    //     });
    //     return next.handle(authRequest);
    // }, 1000);

    // }
    // const authToken = this.authService.getToken();
    const authRequest = req.clone({
      // headers: req.headers.set('Authorization', 'Bearer ' + authToken)
      // headers: req.headers.set('Application')
    });


    const headers = new HttpHeaders({
      'Authorization': 'JWT 123',
      'Content-Type': 'application/json'
    });


    const cloneReq = req.clone({headers});
    return next.handle(authRequest);
  }
}
