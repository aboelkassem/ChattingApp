import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MemberListResolver implements Resolve<User[]> {
  constructor( private userService: UserService, private router: Router, private alertify: AlertifyService) {}

  resolve(): Observable<User[]> {
      return this.userService.getUsers().pipe(
          catchError(error => {
              this.alertify.error('Problem in retrieving data');
              this.router.navigate(['/home']);
              return of(null);
          })
      );
  }
}
