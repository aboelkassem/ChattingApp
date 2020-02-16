import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpErrorResponse, HTTP_INTERCEPTORS, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';


// this file for global error handling for nice error formating
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
        catchError(error => {
            // tslint:disable-next-line:triple-equals
            if (error.status == 401) {  // authorize in loggingIn
                return throwError(error.statusText);
            }
            if (error instanceof HttpErrorResponse) { // Validation Errors
                const applicationError = error.headers.get('Application-Error');    // My custom error exception message
                if (applicationError) {
                    return throwError(applicationError);
                }
                const serverError = error.error;    // build in errors forms errors/validations , object error
                let modalStateError = '';
                // tslint:disable-next-line:triple-equals
                if (serverError.errors && typeof serverError.errors == 'object') {
                    for (const key in serverError.errors) {
                        if (serverError.errors[key]) {
                            modalStateError += serverError.errors[key] + '\n';
                        }
                    }
                }
                return throwError(modalStateError || serverError || 'Server Error');
            }
        })
    );
  }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi : true
};
