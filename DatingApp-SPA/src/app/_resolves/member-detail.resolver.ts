import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
// tslint:disable-next-line:max-line-length
// this resolver get the data from route: ActivatedRoute before the link/component will reload or be active, so it solve problem that component loaded before data coming and instead of using (?) operator
export class MemberDetailResolver implements Resolve<User> {
  constructor( private userService: UserService, private router: Router, private alertify: AlertifyService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<User> {
      return this.userService.getUser(route.params['id']).pipe(
          catchError(error => {
              this.alertify.error('Problem in retrieving data');
              this.router.navigate(['/members']);
              return of(null);
          })
      );
  }
}
