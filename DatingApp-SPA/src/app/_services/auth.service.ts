import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.apiUrl + 'auth/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currentUser: User;
  photoUrl = new BehaviorSubject<string>('../../assets/user.png');  // default photo for BehaviorSubject that is observable that when photo update to MainPhoto will update this property
  currentPhotoUrl = this.photoUrl.asObservable(); // we use CurrentPhotoUrl to subscribe, display photo and that is observable mean when photoUrl updated in any component i will update immediately

constructor(private http: HttpClient) { }

  // use this method when want to change the photo to MainPhoto, when login, when app component loaded
  changeMemberPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);  // take a value that will updated instead of DefaultValue(defaultPhotoPath) and change to all subscribers in all components
  }

  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model)
      .pipe(
        map((response: any) => {
          const res = response;
          if (res) {
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));
            this.decodedToken = this.jwtHelper.decodeToken(res.token);
            this.currentUser = res.user;
            this.changeMemberPhoto(this.currentUser.photoUrl);
          }
        })
      );
  }

  register(user: User) {
    return this.http.post(this.baseUrl + 'register', user);
  }

  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  roleMatch(allowedRoles): boolean {
    let isMatch = false;
    const userRoles = this.decodedToken.role as Array<string>;
    allowedRoles.forEach(element => {
      if (userRoles.includes(element)) {
        isMatch = true;
        return;
      }
    });
    return isMatch;
  }

}
